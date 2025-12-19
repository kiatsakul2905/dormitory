// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAps2wCaMxswqOC0DmbJSloPHW_tcLY0A",
  authDomain: "ku-dorm-sakon.firebaseapp.com",
  projectId: "ku-dorm-sakon",
  storageBucket: "ku-dorm-sakon.appspot.com",
  messagingSenderId: "663761464336",
  appId: "1:663761464336:web:9acce34577524cba526e95"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
