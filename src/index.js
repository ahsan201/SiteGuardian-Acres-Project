import { signupLogin } from "./signupLogin.js";
import { navBar } from "./navBar.js";
import {
  body,
  signupForm,
  createAccountBTN,
  signupLoginVisibility,
  switchViewLogin,
  switchViewSignup,
  signupFormContainer,
  loginFormContainer,
} from "./ui.js"; // Import only necessary constants
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Configuring Firebase Start ------------------------------------
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
// Configuring Firebase End ------------------------------------

// signup/login visibility toggle starts ----------------------------
// Set initial form visibility (show signup or login by default)
signupLoginVisibility(true); // Set to false to show signup form initially, true to show login

// Event listener for switching to the signup view
switchViewSignup.addEventListener("click", () => {
  signupLoginVisibility(true);
});

// Event listener for switching to the login view
switchViewLogin.addEventListener("click", () => {
  signupLoginVisibility(false);
});
// signup/login visibility toggle ends ----------------------------

// Sign up users section starts --------------------------------------------
createAccountBTN.addEventListener("click", async (e) => {
  e.preventDefault();

  // Dynamically retrieve form values on each click
  const signupEmail = signupForm["signupEmail"].value.trim();
  const signupFullName = signupForm["signupFullNameInput"].value.trim();
  const signupPassword = signupForm["signupPassword"].value.trim();
  const signupReWritePassword =
    signupForm["signupReWritePassword"].value.trim();
  const signupUserType = signupForm["signupUserType"].value.trim();

  // Basic validation
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
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signupEmail,
      signupPassword
    );
    const user = userCredential.user;

    // Save additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: signupFullName,
      email: signupEmail,
      userType: signupUserType,
    });

    alert("Account created successfully!");
    signupForm.reset();
  } catch (error) {
    console.error("Error signing up:", error);
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered. Please use a different email.");
    } else {
      alert(`Sign-up failed: ${error.message}`);
    }
  }
});
// Sign up users section ends --------------------------------------------

// Function to retrieve user data by UID starts -------------------------
async function getUserData(uid) {
  const userDocRef = doc(db, "users", uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      console.log("User data:", userDoc.data());
      return userDoc.data(); // Return the user data
    } else {
      console.log("No such document found for the UID.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
// Function to retrieve user data by UID ends -------------------------

// Logged-in user state handling starts ---------------------------------------------
onAuthStateChanged(auth, (user) => {
  console.log("user logged in");
  if (user) {
    navBar(body);

    // Fetch and log user data
    getUserData(user.uid).then((userData) => {
      if (userData) {
        console.log("Retrieved user data:", userData);
        // Use user data (e.g., display in nav bar or main UI)
      }
    });
  } else {
    console.log("No user is logged in.");
    signupLoginVisibility(true); // Show login/signup forms when no user is logged in
  }
});
// Logged-in user state handling ends ---------------------------------------------

// log Out handle Starts ---------------------------------------------
document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("logoutBTN")) {
    handleLogout();
  }
});
function handleLogout() {
  signOut(auth)
    .then(() => {
      signupLogin(body);
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
}

// log Out handle ends ---------------------------------------------
