import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "my-vetri-tamilnadu",
  appId: "1:1083496844721:web:90165a1b7798871c6e8190",
  storageBucket: "my-vetri-tamilnadu.firebasestorage.app",
  apiKey: "AIzaSyB-JBWPOS41K0auf5FfNhL6x-TU3As1Qng",
  authDomain: "my-vetri-tamilnadu.firebaseapp.com",
  messagingSenderId: "1083496844721",
  measurementId: "G-1CDL67GM5H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
