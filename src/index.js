import { signupLogin } from "./signupLogin.js";
import { dashboard } from "./dashboard.js";
import {
  body,
  signupForm,
  createAccountBTN,
  signupLoginVisibility,
  switchViewLogin,
  switchViewSignup,
  signupFormContainer,
  loginFormContainer,
  loginForm,
} from "./ui.js";
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
const db = getFirestore(app);
const auth = getAuth(app);

// signup/login visibility toggle starts
signupLoginVisibility(true); // Show login by default

switchViewSignup.addEventListener("click", () => {
  signupLoginVisibility(false); // Show signup form
});

switchViewLogin.addEventListener("click", () => {
  signupLoginVisibility(true); // Show login form
});

// Signup Form Submission
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

    signupForm.reset();
  } catch (error) {
    console.error("Error signing up:", error);
    alert(`Sign-up failed: ${error.message}`);
  }
});

// Retrieve User Data by UID
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

// Login Form Submission
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
      console.log("User logged in:", user);
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      alert(`Login failed: ${error.message}`);
    });
});

// Handle Auth State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in");

    getUserData(user.uid).then((userData) => {
      if (userData) {
        console.log("Retrieved user data:", userData.fullName);
        dashboard(body, userData.fullName.split(" ")[0]);
      }
    });
  } else {
    console.log("No user is logged in.");
  }
});

// Logout Handling
document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("logoutBTN")) {
    signOut(auth)
      .then(() => {
        console.log("User logged out.");
        signupLogin(body);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }
});
