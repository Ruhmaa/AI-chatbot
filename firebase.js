import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 1. Import the Auth tool

const firebaseConfig = {
  apiKey: "AIzaSyA4hycc7HTizA69DyVhWgO1PTaEMSrEyKw",
  authDomain: "ai-chatbot-7bd87.firebaseapp.com",
  projectId: "ai-chatbot-7bd87",
  storageBucket: "ai-chatbot-7bd87.firebasestorage.app",
  messagingSenderId: "941935322250",
  appId: "1:941935322250:web:8608c3372b0e8857c3f973",
  measurementId: "G-B6WN7E54VS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Export the Auth service so SignUp.js can use it
export const auth = getAuth(app);