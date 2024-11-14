import { db } from "./index.js";
import { getDocs, collection, query, where } from "firebase/firestore";
import { setupNavbarListeners } from "./navbarListeners.js";

export async function assignUser(element, userType) {
  console.log("Assigning user form for userType:", userType); // Debug log for userType

  let managerOptions = "";

  // Only fetch managers if userType is "admin"
  if (userType === "admin") {
    const usersRef = collection(db, "users");
    const managerQuery = query(usersRef, where("userType", "==", "manager"));
    const managerSnapshot = await getDocs(managerQuery);

    managerOptions = managerSnapshot.docs
      .map((doc) => {
        const managerName = doc.data().fullName;
        return `<option value="${managerName}">${managerName}</option>`;
      })
      .join(""); // Join all option elements into a single string
  }

  // Define form content based on userType
  const formContent =
    userType === "admin"
      ? `
      <label for="deviceID">Device ID</label>
      <select name="deviceID" id="deviceID" required>
        <option value="0001">0001</option>
        <option value="0002">0002</option>
        <option value="0003">0003</option>
      </select>
      <label for="managerName">Manager Name</label>
      <select name="managerName" id="managerName" required>
        ${managerOptions} <!-- Populated manager options here -->
      </select>
    `
      : `
      <label for="deviceID">Device ID</label>
      <select name="deviceID" id="deviceID" required>
        <option value="0001">0001</option>
        <option value="0002">0002</option>
        <option value="0003">0003</option>
      </select>
      <label for="location">Location</label>
      <select name="location" id="location" required>
        <option value="aberdeen">Aberdeen</option>
        <option value="uppersahali">Upper Sahali</option>
        <option value="northshore">North Shore</option>
      </select>
      <label for="name">Name</label>
      <input type="text" name="name" required />
      <label for="phoneNumber">Phone Number</label>
      <input type="number" name="phoneNumber" required />
    `;

  // Set the inner HTML for the assignUser view
  element.innerHTML = `
    <nav class="drop-shadow1">
      <div class="nav-logo">
        <img src="./asset/siteguardian logo.png" alt="siteguardian logo" />
        <div>SiteGuardian</div>
      </div>
      <div class="nav-menu">
        <ul>
          <li>Device List</li>
          <li class="active">Assign Users</li>
          <li>
            <img src="./asset/Avatar.png" alt="profile Avatar" />
            <div class="logoutBTN">Log Out</div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container assignUserBox">
      <h2>Assign ${userType === "admin" ? "Manager" : "Device"}</h2>
      <form action="#">
        ${formContent}
        <button>Assign</button>
      </form>
    </div>
  `;

  // Reapply navbar listeners after rendering "Assign Users"
  setupNavbarListeners({ fullName: "User", userType });
}
