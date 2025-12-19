// js/review.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const dormId = new URLSearchParams(window.location.search).get("id");
let currentUser = null;

const reviewSection = document.getElementById("review-section");
const loginWarning = document.getElementById("login-warning");
const submitBtn = document.getElementById("submit-review");
const reviewList = document.getElementById("review-list");

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  reviewSection.style.display = user ? "block" : "none";
  loginWarning.style.display = user ? "none" : "block";
});

// ส่งรีวิว หรือ อัปเดตถ้ารีวิวตัวเองมีอยู่แล้ว
submitBtn.onclick = async () => {
  if (!currentUser) return;

  const rating = Number(document.getElementById("rating").value);
  const comment = document.getElementById("comment").value.trim();
  if (!comment) return alert("กรุณาพิมพ์รีวิว");

  const reviewRef = doc(db, "dorm", dormId, "reviews", currentUser.uid);
  await setDoc(reviewRef, {
    uid: currentUser.uid,
    rating,
    comment,
    displayName: currentUser.displayName || currentUser.email,
    createdAt: serverTimestamp()
  });

  document.getElementById("comment").value = "";
  await updateRating();
  loadReviews();
};

// คำนวณค่า rating_avg + rating_count
async function updateRating() {
  const snap = await getDocs(collection(db, "dorm", dormId, "reviews"));
  let total = 0;
  snap.forEach(d => total += d.data().rating);

  await updateDoc(doc(db, "dorm", dormId), {
    rating_avg: snap.size ? (total / snap.size).toFixed(1) : 0,
    rating_count: snap.size
  });
}

// โหลดรีวิวทั้งหมด
export async function loadReviews() {
  const snap = await getDocs(collection(db, "dorm", dormId, "reviews"));
  reviewList.innerHTML = "";

  snap.forEach(docSnap => {
    const r = docSnap.data();
    const div = document.createElement("div");
    div.className = "border rounded p-2 mb-2";

    const header = document.createElement("div");
    header.className = "d-flex justify-content-between align-items-center";

    const userInfo = document.createElement("div");
    userInfo.innerHTML = `<strong>${r.displayName}</strong> ⭐ ${r.rating} 
                          <br><small>${r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ""}</small>`;

    const actions = document.createElement("div");
    if (currentUser && r.uid === currentUser.uid) {
      // ปุ่มแก้ไข
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm btn-warning me-1";
      editBtn.textContent = "แก้ไข";
      editBtn.onclick = () => {
        document.getElementById("rating").value = r.rating;
        document.getElementById("comment").value = r.comment;
      };

      // ปุ่มลบ
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-danger";
      deleteBtn.textContent = "ลบ";
      deleteBtn.onclick = async () => {
        if (confirm("คุณต้องการลบรีวิวนี้หรือไม่?")) {
          await deleteDoc(doc(db, "dorm", dormId, "reviews", currentUser.uid));
          await updateRating();
          loadReviews();
        }
      };

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
    }

    header.appendChild(userInfo);
    header.appendChild(actions);
    div.appendChild(header);

    const commentDiv = document.createElement("p");
    commentDiv.textContent = r.comment;
    div.appendChild(commentDiv);

    reviewList.appendChild(div);
  });
}

// โหลดรีวิวตอนเริ่ม
loadReviews();
