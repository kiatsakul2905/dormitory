import { db } from "./firebase.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// เลือกภาษา จาก localStorage ('th' default)
const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'th';

window.addEventListener("DOMContentLoaded", async () => {
  const dormId = new URLSearchParams(window.location.search).get("id");
  if (!dormId) return;

  const snap = await getDoc(doc(db, "dorm", dormId));
  if (!snap.exists()) return;

  const d = snap.data();

  // helper function เลือกค่าตามภาษา
  const getText = (field) => {
    if (lang === 'en' && d[field + "_en"]) return d[field + "_en"];
    return d[field + "_th"] || "";
  };

  // ข้อมูลพื้นฐาน
  document.getElementById("dorm-name").innerText = getText("name");
  document.getElementById("dorm-location").innerText = getText("location");
  document.getElementById("dorm-position").innerText = getText("position");
  function fmtPrice(min, max){
    const toNum = (v) => v==null || v === '' ? null : Number(v);
    const a = toNum(min), b = toNum(max);
    const fmt = (n) => n == null ? '-' : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (a == null && b == null) return '-';
    if (a != null && b != null){
      if (a === b) return `${fmt(a)} บาท/เทอม`;
      return `${fmt(a)} - ${fmt(b)} บาท/เทอม`;
    }
    return `${fmt(a ?? b)} บาท/เทอม`;
  }

  document.getElementById("dorm-price").innerText = fmtPrice(d.price_min, d.price_max);
  document.getElementById("rating-avg").innerText = d.rating_avg || "0";
  document.getElementById("rating-count").innerText = d.rating_count || "0";

  // Facilities
  const facilitiesDiv = document.getElementById("facilities");
  if (facilitiesDiv && d.facilities) {
    facilitiesDiv.innerHTML = "<h5>สิ่งอำนวยความสะดวก</h5>";
    for (const [key, fac] of Object.entries(d.facilities)) {
      if (fac.available) {
        const name = (lang === 'en' && fac.en) ? fac.en : (fac.th || key);
        const badge = document.createElement("span");
        badge.className = "badge bg-secondary me-2 mb-2";
        badge.textContent = name;
        facilitiesDiv.appendChild(badge);
      }
    }
  }
  const mapLink = document.getElementById("map-link");
  if (d.map_url && mapLink) mapLink.href = d.map_url;

  // Carousel รูปภาพ
  const carousel = document.getElementById("carousel-images");
  if (carousel && Array.isArray(d.images)) {
    carousel.innerHTML = "";
    d.images.forEach((img, i) => {
      const div = document.createElement("div");
      div.className = "carousel-item" + (i === 0 ? " active" : "");

      const im = document.createElement("img");
      im.className = "d-block w-100";
      im.src = img;
      im.alt = getText("name");
      im.style.cursor = "pointer";
      im.addEventListener("click", () => window.open(img, "_blank"));

      div.appendChild(im);
      carousel.appendChild(div);
    });
  }

  // Contact
  if (d.contact) {
    const fb = document.getElementById("contact-facebook");
    const line = document.getElementById("contact-line");
    const phone = document.getElementById("contact-phone");

    if (d.contact.facebook && fb) {
      fb.href = d.contact.facebook;
      fb.style.display = "inline-block";
    }
    if (d.contact.line && line) {
      line.href = d.contact.line;
      line.style.display = "inline-block";
    }
    if (d.contact.phone && phone) {
      document.getElementById("contact-phone-text").innerText = d.contact.phone;
      phone.style.display = "inline-block";
    }
  }

  // ระยะทาง: รองรับทั้ง d.contact.distance และ d.distance และฟอร์แมตให้เป็นเลขหนึ่งตำแหน่ง
  const contactDistanceEl = document.getElementById("contact-distance");
  const rawDist = d.contact?.distance ?? d.distance ?? null;
  if (contactDistanceEl) {
    if (rawDist === null || rawDist === undefined || rawDist === "") {
      contactDistanceEl.innerText = "-";
    } else {
      const n = Number(rawDist);
      if (!Number.isFinite(n)) {
        contactDistanceEl.innerText = String(rawDist);
      } else {
        // ถ้าค่าน้อยกว่า 1 ให้แสดงทศนิยม 1 ตำแหน่ง เช่น 0.5 กม.
        const out = Math.round(n * 10) / 10;
        contactDistanceEl.innerText = out.toString();
      }
    }
  }

  // โหลดรีวิว
  const reviewList = document.getElementById("review-list");
  if (!reviewList) return;

  try {
    const reviewSnap = await getDocs(collection(db, "dorm", dormId, "reviews"));
    reviewList.innerHTML = "";
    reviewSnap.forEach(r => {
      const data = r.data() || {};
      const item = document.createElement("div");
      item.className = "border rounded p-2 mb-2";

      const ratingDiv = document.createElement("div");
      ratingDiv.className = "text-warning";
      ratingDiv.textContent = `⭐ ${data.rating ?? "-"}`;

      const commentDiv = document.createElement("div");
      commentDiv.textContent = data.comment ?? "";

      const userDiv = document.createElement("div");
      userDiv.className = "small text-muted";
      userDiv.textContent = data.user_name ? `by ${data.user_name}` : "";

      const timeDiv = document.createElement("div");
      timeDiv.className = "small text-muted";
      if (data.createdAt?.toDate) {
        timeDiv.textContent = new Date(data.createdAt.toDate()).toLocaleString();
      }

      item.appendChild(ratingDiv);
      item.appendChild(commentDiv);
      item.appendChild(userDiv);
      item.appendChild(timeDiv);

      reviewList.appendChild(item);
    });
  } catch (err) {
    console.error("Failed to load reviews:", err);
  }
});
