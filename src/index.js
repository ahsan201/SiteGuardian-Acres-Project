import { signupLogin } from "./signupLogin.js";
import { dashboard } from "./dashboard.js";
import { setupNavbarListeners } from "./navbarListeners.js";
import { renderNavbar } from "./navBar.js";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { monitorAlarmUpdates } from "./alarmHandler.js";

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

// Global variable to hold logged-in user's type
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
  const contentContainer = document.getElementById("content-container");
  if (contentContainer) {
    dashboard(contentContainer, userData);
    setupNavbarListeners(userData);
  } else {
    console.error("Content container not found; cannot render dashboard.");
  }
}

// Function to handle signup form submission
async function handleSignup(event) {
  event.preventDefault();
  const signupForm = event.target;
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
}

// Function to handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  const loginForm = event.target;
  const email = loginForm["loginEmail"].value.trim();
  const password = loginForm["loginPassword"].value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userData = await getUserData(user.uid);

    if (userData) {
      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer) {
        renderNavbar(navbarContainer);
      } else {
        console.error("Navbar container not found.");
      }
      loadDashboard(userData);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert(`Login failed: ${error.message}`);
  }
}

// Handle Auth State Changes
onAuthStateChanged(auth, (user) => {
  const navbarContainer = document.getElementById("navbar-container");
  const contentContainer = document.getElementById("content-container");

  if (user) {
    if (navbarContainer) {
      renderNavbar(navbarContainer);
    } else {
      console.error("Navbar container not found.");
    }
    getUserData(user.uid).then((userData) => {
      if (userData) {
        loadDashboard(userData);
      }
    });
  } else {
    if (navbarContainer) {
      navbarContainer.innerHTML = "";
    }
    if (contentContainer) {
      const { signupForm, loginForm } = signupLogin(contentContainer);

      // Add form submission event listeners if forms exist
      if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
      } else {
        console.error("Signup form not found in the DOM.");
      }

      if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
      } else {
        console.error("Login form not found in the DOM.");
      }
    } else {
      console.error("Content container not found for login/signup rendering.");
    }
  }
});

// Logout Handling
document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("logoutBTN")) {
    signOut(auth)
      .then(() => {
        const navbarContainer = document.getElementById("navbar-container");
        if (navbarContainer) {
          navbarContainer.innerHTML = "";
        }
        const contentContainer = document.getElementById("content-container");
        if (contentContainer) {
          const { signupForm, loginForm } = signupLogin(contentContainer);

          if (signupForm) {
            signupForm.addEventListener("submit", handleSignup);
          }

          if (loginForm) {
            loginForm.addEventListener("submit", handleLogin);
          }
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }
});

// Start monitoring alarms
monitorAlarmUpdates();
