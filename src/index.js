import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCijYSPyR0v0cnj-PAGeqL8KQrQhQpkFKk",
  authDomain: "siteguardian-c569e.firebaseapp.com",
  projectId: "siteguardian-c569e",
  storageBucket: "siteguardian-c569e.firebasestorage.app",
  messagingSenderId: "867446321673",
  appId: "1:867446321673:web:74d12bf44e02db4f2b3ed8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("hello world");
