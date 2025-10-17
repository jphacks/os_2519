// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYYDg_aby8QY54zPFmxSZFv6NRhlnywY0",
  authDomain: "sukima-knowledge.firebaseapp.com",
  projectId: "sukima-knowledge",
  storageBucket: "sukima-knowledge.firebasestorage.app",
  messagingSenderId: "467334940423",
  appId: "1:467334940423:web:1b539cc28629dc687b67a2",
  measurementId: "G-QTQN5YDH77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);