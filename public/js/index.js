// js/index.js
import { db } from "./firebase.js";
import { collection, getDocs } from 
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const dormList = document.getElementById("dorm-list");
const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'th';

function getTextFromD(d, field) {
  if (!d) return '';
  if (lang === 'en' && d[field + '_en']) return d[field + '_en'];
  return d[field + '_th'] || d[field] || '';
}

function fmtPrice(min, max){
  const toNum = (v) => v==null || v === '' ? null : Number(v);
  const a = toNum(min), b = toNum(max);
  if (a == null && b == null) return '-';
  const fmt = (n) => n == null ? '-' : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (a != null && b != null){
    if (a === b) return `${fmt(a)} บาท/เดือน`;
    return `${fmt(a)} - ${fmt(b)} บาท/เดือน`;
  }
  return `${fmt(a ?? b)} บาท/เดือน`;
}

const loadDorms = async () => {
  const snap = await getDocs(collection(db, "dorm"));
  dormList.innerHTML = "";

  snap.forEach(doc => {
    const d = doc.data();

    const btnText = lang === 'en' ? 'View' : 'ดูรายละเอียด';
    dormList.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img 
            src="${d.images?.[0] || 'https://via.placeholder.com/400'}" 
            class="card-img-top"
            style="height:200px;object-fit:cover"
          >

          <div class="card-body">
            <h5 class="card-title">${getTextFromD(d, 'name')}</h5>

            <p class="card-text small text-muted">
              📍 ${getTextFromD(d, 'location')}<br>
              📌 ${getTextFromD(d, 'position')}<br>
              🚶‍♂️ ${d.distance} กม.
            </p>

            <p class="card-text">
              💰 ${fmtPrice(d.price_min, d.price_max)}
            </p>

            <a href="dorm.html?id=${doc.id}" 
               class="btn btn-primary btn-sm">
              ${btnText}
            </a>
          </div>
        </div>
      </div>
    `;
  });
};

loadDorms();
