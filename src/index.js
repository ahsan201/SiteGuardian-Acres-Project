import {
  signupForm,
  createAccountBTN,
  adminKey,
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
signupLoginVisibility(false); // Set to true to show signup form initially, false to show login

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
  const signupAdminKey = signupForm["signupAdminKey"].value
    .trim()
    .toLowerCase();
  const signupUserType = signupForm["signupUserType"].value.trim();

  // Basic validation
  if (
    !signupEmail ||
    !signupFullName ||
    !signupPassword ||
    !signupReWritePassword ||
    !signupAdminKey ||
    !signupUserType
  ) {
    alert("All fields are required.");
    return;
  }

  if (signupPassword !== signupReWritePassword) {
    alert("Passwords do not match!");
    return;
  }

  // Validate the admin key
  if (signupAdminKey !== adminKey) {
    alert("Invalid admin key");
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
      adminKey: adminKey,
    });

    alert("Account created successfully!");

    signupForm.reset();
  } catch (error) {
    console.error("Error signing up:", error);
    alert(`Sign-up failed: ${error.message}`);
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
// Loged In user starts ---------------------------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in, fetch their data
    getUserData(user.uid).then((userData) => {
      if (userData) {
        console.log("Retrieved user data:", userData);
      }
    });
  } else {
    // No user is logged in
    console.log("No user is logged in.");
  }
});
// Loged In user ends---------------------------------------------
