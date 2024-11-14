import { signupLogin } from "./signupLogin.js";
import { dashboard } from "./dashboard.js";
import { setupNavbarListeners } from "./navbarListeners.js";
import { body } from "./ui.js";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase Config
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
export const db = getFirestore(app);
export const auth = getAuth(app);

// Global userType variable to hold logged-in user's type
let userType = null;

// Function to retrieve user data by UID
async function getUserData(uid) {
  const userDocRef = doc(db, "users", uid);
  try {
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

// Function to render the dashboard and set up navbar click listeners
function loadDashboard(userData) {
  userType = userData.userType;
  dashboard(body, userData.fullName.split(" ")[0]); // Render dashboard with user's first name
  setupNavbarListeners(userData); // Set up navbar listeners for the dashboard
}

// Function to set up event listeners for signup and login forms
function setupEventListeners() {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  // Signup Form Submission
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const signupEmail = signupForm["signupEmail"].value.trim();
      const signupFullName = signupForm["signupFullNameInput"].value.trim();
      const signupPassword = signupForm["signupPassword"].value.trim();
      const signupReWritePassword =
        signupForm["signupReWritePassword"].value.trim();
      const signupUserType = signupForm["signupUserType"].value.trim();

      if (
        !signupEmail ||
        !signupFullName ||
        !signupPassword ||
        !signupReWritePassword ||
        !signupUserType
      ) {
        alert("All fields are required.");
        return;
      }

      if (signupPassword !== signupReWritePassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          signupEmail,
          signupPassword
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          fullName: signupFullName,
          email: signupEmail,
          userType: signupUserType,
        });

        userType = signupUserType;

        loadDashboard({ fullName: signupFullName, userType: signupUserType });
        signupForm.reset();
      } catch (error) {
        console.error("Error signing up:", error);
        alert(`Sign-up failed: ${error.message}`);
      }
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm["loginEmail"].value.trim();
      const password = loginForm["loginPassword"].value.trim();

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          getUserData(user.uid).then((userData) => {
            if (userData) {
              loadDashboard(userData);
            }
          });
        })
        .catch((error) => {
          console.error("Error logging in:", error);
          alert(`Login failed: ${error.message}`);
        });
    });
  }
}

// Handle Auth State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    getUserData(user.uid).then((userData) => {
      if (userData) {
        loadDashboard(userData);
      }
    });
  } else {
    signupLogin(body);
    setupEventListeners();
  }
});

// Logout Handling
document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("logoutBTN")) {
    signOut(auth)
      .then(() => {
        signupLogin(body);
        setupEventListeners();
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }
});
