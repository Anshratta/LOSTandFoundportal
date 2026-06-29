// =============================================
// Firebase Configuration & Initialization
// Campus Lost & Found Portal
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNpwp0Lr5trWOhS5I-4ceH9cjIony5i74",
    authDomain: "campus-lost-and-found-po-cf3cf.firebaseapp.com",
    projectId: "campus-lost-and-found-po-cf3cf",
    storageBucket: "campus-lost-and-found-po-cf3cf.firebasestorage.app",
    messagingSenderId: "458871641283",
    appId: "1:458871641283:web:a4c3d4653fa5e39a0d3e76",
    measurementId: "G-HCD712ZCMJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
