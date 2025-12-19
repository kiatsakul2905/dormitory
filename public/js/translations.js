// js/translations.js
const translations = {
  th: {
    dormList: "รายการหอพัก",
    reviews: "รีวิว",
    map: "แผนที่",
    facebook: "Facebook",
    line: "Line",
    distance: "ระยะทาง",
    km: "กม.",
    loginWarning: "กรุณา <a href=\"login.html\">เข้าสู่ระบบ</a> เพื่อแสดงความคิดเห็น",
    writeReview: "เขียนรีวิว",
    commentPlaceholder: "แสดงความคิดเห็น",
    submitReview: "ส่งรีวิว",
    aboutUs: "เกี่ยวกับเรา",
    aboutText: "ระบบจัดการข้อมูลหอพัก มหาวิทยาลัย สกลนคร",
    contactAdmin: "ติดต่อแอดมิน",
    location: "ที่อยู่",
    address: "มหาวิทยาลัยสกลนคร<br>อำเภอเมือง จังหวัดสกลนคร 47000",
    viewMap: "ดูแผนที่",
    copyright: "&copy; 2025 KU Dormitory. All rights reserved.",
    login: "เข้าสู่ระบบ",
    password: "Password",
    loginBtn: "Login",
    loginGoogle: "Login with Google",
    forgotPassword: "ลืมรหัสผ่าน",
    noAccount: "ยังไม่มีบัญชี?",
    registerLink: "สมัครสมาชิก",
    register: "สมัครสมาชิก",
    emailPlaceholder: "Email (@ku.th เท่านั้น)",
    loginEmailPlaceholder: "Email",
    registerBtn: "สมัครสมาชิก",
    registerGoogle: "Register with Google",
    hasAccount: "มีบัญชีแล้ว?",
    loginLink: "เข้าสู่ระบบ",
    langLabel: "Lang",
    logout: "Logout"
  },
  en: {
    dormList: "Dormitory List",
    reviews: "reviews",
    map: "Map",
    facebook: "Facebook",
    line: "Line",
    distance: "Distance",
    km: "km",
    loginWarning: "Please <a href=\"login.html\">login</a> to comment",
    writeReview: "Write Review",
    commentPlaceholder: "Share your thoughts",
    submitReview: "Submit Review",
    aboutUs: "About Us",
    aboutText: "Dormitory Management System, Kasetsart University Sakon Nakhon Campus",
    contactAdmin: "Contact Admin",
    location: "Location",
    address: "Kasetsart University Sakon Nakhon Campus<br>Mueang District, Sakon Nakhon Province 47000",
    viewMap: "View Map",
    copyright: "&copy; 2025 KU Dormitory. All rights reserved.",
    login: "Login",
    password: "Password",
    loginBtn: "Login",
    loginGoogle: "Login with Google",
    forgotPassword: "Forgot Password",
    noAccount: "Don't have an account?",
    registerLink: "Register",
    register: "Register",
    emailPlaceholder: "Email (@ku.th only)",
    loginEmailPlaceholder: "Email",
    registerBtn: "Register",
    registerGoogle: "Register with Google",
    hasAccount: "Already have an account?",
    loginLink: "Login",
    langLabel: "Lang",
    logout: "Logout"
  }
};

const lang = localStorage.getItem('lang') || 'th';

function translatePage() {
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  // For placeholders
  const placeholders = document.querySelectorAll('[data-placeholder]');
  placeholders.forEach(el => {
    const key = el.getAttribute('data-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
}

window.translatePage = translatePage;

document.addEventListener('DOMContentLoaded', translatePage);