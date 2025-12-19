// js/auth.js
import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const togglePass = document.getElementById("togglePass");
  const loginBtn = document.getElementById("loginBtn"); // page form login (if present)
  const navLoginBtn = document.getElementById("navLoginBtn"); // navbar login button
  const registerBtn = document.getElementById("registerBtn");
  const googleBtn = document.getElementById("googleBtn");
  const forgotBtn = document.getElementById("forgotBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userDisplay = document.getElementById("userDisplay");

  // แสดง/ซ่อนรหัสผ่าน
  // แสดง/ซ่อนรหัสผ่าน (แน่ใจว่ามีทั้งปุ่มและ input ก่อน)
  if (togglePass && passwordEl) {
    togglePass.addEventListener("click", () => {
      passwordEl.type = passwordEl.type === "password" ? "text" : "password";
    });
  }

  // Login: ถ้าอยู่บนหน้าที่มีฟอร์ม (มี email/password) ให้ผูก handler สำหรับล็อกอิน
  // ถ้าไม่มีก็ให้พาไปหน้า `login.html` (เก็บ redirect ก่อน)
  // Attach login handlers:
  if (loginBtn && emailEl && passwordEl) {
    // form login button on login page
    loginBtn.addEventListener("click", async () => {
      if (!emailEl.value || !passwordEl.value) return alert("กรุณากรอกข้อมูล");
      try {
        await signInWithEmailAndPassword(auth, emailEl.value, passwordEl.value);
        const redirect = sessionStorage.getItem("redirectUrl") || "index.html";
        sessionStorage.removeItem("redirectUrl");
        location.href = redirect;
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // navbar login button: set redirect, but if it's a normal link let it navigate
  if (navLoginBtn) {
    navLoginBtn.addEventListener("click", (ev) => {
      try { sessionStorage.setItem("redirectUrl", location.href); } catch (e) {}
      // if it's an <a>, allow default navigation; if not, navigate programmatically
      if (navLoginBtn.tagName.toLowerCase() !== 'a') {
        ev.preventDefault();
        location.href = 'login.html';
      }
    });
  }

  // Logout handler (ถ้ามีปุ่ม)
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        try { sessionStorage.removeItem("redirectUrl"); } catch (e) {}
        location.href = "index.html";
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // Update auth UI (query elements each time to handle navbar inserted later)
  function updateAuthUI(user){
    const uEl = document.getElementById('userDisplay');
    const lBtn = document.getElementById('loginBtn');
    const nBtn = document.getElementById('navLoginBtn');
    const loBtn = document.getElementById('logoutBtn');

    if (lBtn) lBtn.style.display = user ? 'none' : 'inline-block';
    if (nBtn) nBtn.style.display = user ? 'none' : 'inline-block';
    if (loBtn) loBtn.style.display = user ? 'inline-block' : 'none';

    if (uEl){
      if (user){
        uEl.innerText = user.displayName || user.email || 'User';
        uEl.style.display = 'inline-block';
      } else {
        uEl.style.display = 'none';
      }
    }
    // Ensure logout button has a click handler (in case it was inserted after initial load)
    try{
      if (loBtn && !loBtn.dataset.logoutBound){
        loBtn.addEventListener('click', async () => {
          try {
            await signOut(auth);
            try { sessionStorage.removeItem('redirectUrl'); } catch(e){}
            location.href = 'index.html';
          } catch(err){ alert(err.message); }
        });
        loBtn.dataset.logoutBound = '1';
      }
    }catch(e){/* ignore */}
  }

  if (typeof onAuthStateChanged === 'function'){
    onAuthStateChanged(auth, (user) => {
      try { updateAuthUI(user); } catch(e){ console.warn('updateAuthUI failed', e); }
    });
  }

  // Try to update UI for current user now (in case navbar already exists)
  try { updateAuthUI(auth.currentUser); } catch(e){}

  // If navbar is inserted later via fetch, watch for it and update once when found
  try{
    const mo = new MutationObserver((mutations, observer) => {
      if (document.getElementById('userDisplay') || document.getElementById('navLoginBtn')){
        updateAuthUI(auth.currentUser);
        observer.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  } catch(e){}

  // Register
  registerBtn?.addEventListener("click", async () => {
    if (!emailEl.value || !passwordEl.value) return alert("กรอกข้อมูลให้ครบ");
    if (!emailEl.value.endsWith("@ku.th")) return alert("กรุณาใช้ KU email เท่านั้น");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, emailEl.value, passwordEl.value);
      // สร้างเอกสารผู้ใช้
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: emailEl.value,
        role: "user"
      });
      alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });

  // Login ด้วย Google
  googleBtn?.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // เช็กว่ามี user ใน Firestore หรือยัง
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user"
        });
      }

      const redirect = sessionStorage.getItem("redirectUrl") || "index.html";
      sessionStorage.removeItem("redirectUrl");
      location.href = redirect;
    } catch (err) {
      alert(err.message);
    }
  });

  // ลืมรหัสผ่าน (แน่ใจว่ามี input อีเมลบนหน้านั้น)
  if (forgotBtn && emailEl) {
    forgotBtn.addEventListener("click", async () => {
      if (!emailEl.value) return alert("กรุณากรอกอีเมล");
      try {
        await sendPasswordResetEmail(auth, emailEl.value);
        alert("ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว");
      } catch (err) {
        alert(err.message);
      }
    });
  }
});
