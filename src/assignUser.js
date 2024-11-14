import { db } from "./index.js"; // Import Firestore instance from index.js
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { setupNavbarListeners } from "./navbarListeners.js";

export async function assignUser(element, userType) {
  let deviceOptions = "";
  let managerOptions = "";
  const managerMap = {}; // Map to store manager names and their UIDs

  if (userType === "admin") {
    // Query the `device` collection to get all devices for the dropdown
    const devicesRef = collection(db, "device");
    const devicesSnapshot = await getDocs(devicesRef);

    deviceOptions = devicesSnapshot.docs
      .map((doc) => {
        const deviceId = doc.id;
        return `<option value="${deviceId}">${deviceId}</option>`;
      })
      .join("");

    // Query the `users` collection to get all managers and their UIDs
    const usersRef = collection(db, "users");
    const managerQuery = query(usersRef, where("userType", "==", "manager"));
    const managerSnapshot = await getDocs(managerQuery);

    managerOptions = managerSnapshot.docs
      .map((doc) => {
        const managerName = doc.data().fullName;
        const managerUID = doc.id; // Manager's UID is the document ID
        managerMap[managerName] = managerUID; // Store manager UID by name
        return `<option value="${managerName}">${managerName}</option>`;
      })
      .join("");
  }

  // Define the form content for the admin
  const formContent = `
    <label for="deviceID">Device ID</label>
    <select name="deviceID" id="deviceID" required>
      ${deviceOptions}
    </select>
    <label for="managerName">Manager Name</label>
    <select name="managerName" id="managerName" required>
      ${managerOptions}
    </select>
    <button type="submit" id="assignButton">Assign</button>
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
      <h2>Assign Manager</h2>
      <form id="assignForm">
        ${formContent}
      </form>
    </div>
  `;

  // Add event listener for form submission
  const assignForm = document.getElementById("assignForm");
  assignForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedDeviceId = document.getElementById("deviceID").value;
    const selectedManagerName = document.getElementById("managerName").value;
    const selectedManagerUID = managerMap[selectedManagerName]; // Get UID from the map

    if (selectedDeviceId && selectedManagerName && selectedManagerUID) {
      try {
        const deviceRef = doc(db, "device", selectedDeviceId);
        await updateDoc(deviceRef, {
          managerName: selectedManagerName,
          managerID: selectedManagerUID, // Update managerID with UID
        });
        alert(
          `Manager ${selectedManagerName} assigned successfully to device ${selectedDeviceId}`
        );
      } catch (error) {
        console.error("Error updating manager:", error);
        alert("Failed to assign manager. Please try again.");
      }
    }
  });

  setupNavbarListeners({ fullName: "User", userType });
}
