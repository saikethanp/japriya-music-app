import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnoC-e4LqR8JDWVTZ9nneUjmZ35yD574A",
  authDomain: "japriya-29871.firebaseapp.com",
  projectId: "japriya-29871",
  storageBucket: "japriya-29871.firebasestorage.app",
  messagingSenderId: "1096849514205",
  appId: "1:1096849514205:web:0a42ea7401e8d434bc8534"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);