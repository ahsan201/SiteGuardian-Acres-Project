import { db, auth } from "./index.js"; // Import Firestore and Auth instances
import {
  getDocs,
  getDoc,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { setupNavbarListeners } from "./navbarListeners.js";

export async function assignUser(element, userType, userData) {
  let deviceOptions = "";
  let locationOptions = "";
  let managerOptions = "";
  const managerMap = {}; // Map to store manager names and their UIDs

  if (userType === "admin") {
    // Admin: Get all devices for the dropdown
    const devicesRef = collection(db, "device");
    const devicesSnapshot = await getDocs(devicesRef);

    deviceOptions = devicesSnapshot.docs
      .map((doc) => `<option value="${doc.id}">${doc.id}</option>`)
      .join("");

    // Query all managers for the dropdown and map their names to UIDs
    const usersRef = collection(db, "users");
    const managerQuery = query(usersRef, where("userType", "==", "manager"));
    const managerSnapshot = await getDocs(managerQuery);

    managerOptions = managerSnapshot.docs
      .map((doc) => {
        const managerName = doc.data().fullName;
        const managerUID = doc.id;
        managerMap[managerName] = managerUID;
        return `<option value="${managerName}">${managerName}</option>`;
      })
      .join("");
  } else if (userType === "manager") {
    // Manager: Query for devices assigned to the logged-in manager
    const loggedInManagerUID = auth.currentUser.uid;
    const devicesRef = collection(db, "device");
    const deviceQuery = query(
      devicesRef,
      where("managerID", "==", loggedInManagerUID)
    );
    const devicesSnapshot = await getDocs(deviceQuery);

    deviceOptions = devicesSnapshot.docs
      .map((doc) => `<option value="${doc.id}">${doc.id}</option>`)
      .join("");
  }

  // Query the locations document to populate the location dropdown (used in manager form)
  const locationDocRef = doc(db, "locations", "uh5aAVS7X0fzdQppqTe6"); // Replace with the actual document ID
  const locationDocSnapshot = await getDoc(locationDocRef);

  if (locationDocSnapshot.exists()) {
    const locationNames = locationDocSnapshot.data().locationName;
    locationOptions = locationNames
      .map((location) => `<option value="${location}">${location}</option>`)
      .join("");
  }

  // Define form content based on userType
  const formContent =
    userType === "admin"
      ? `
        <label for="deviceID">Device ID</label>
        <select name="deviceID" id="deviceID" required>
          ${deviceOptions}
        </select>
        <label for="managerName">Manager Name</label>
        <select name="managerName" id="managerName" required>
          ${managerOptions}
        </select>
        <button type="submit" id="assignButton">Assign</button>
      `
      : `
        <label for="deviceID">Device ID</label>
        <select name="deviceID" id="deviceID" required>
          ${deviceOptions}
        </select>
        <label for="location">Location</label>
        <select name="location" id="location" required>
          ${locationOptions}
        </select>
        <label for="name">Name</label>
        <input type="text" name="name" required />
        <label for="phoneNumber">Phone Number</label>
        <input type="number" name="phoneNumber" required />
        <button type="submit" id="assignButton">Assign</button>
      `;

  // Set the inner HTML for the assignUser view
  element.innerHTML = `
    <div class="container assignUserBox">
      <h2>Assign ${userType === "admin" ? "Manager" : "Device"}</h2>
      <form id="assignForm">
        ${formContent}
      </form>
    </div>
  `;

  // Add event listener for form submission
  const assignForm = document.getElementById("assignForm");
  assignForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (userType === "admin") {
      const selectedDeviceId = document.getElementById("deviceID").value;
      const selectedManagerName = document.getElementById("managerName").value;
      const selectedManagerUID = managerMap[selectedManagerName];

      if (selectedDeviceId && selectedManagerName && selectedManagerUID) {
        try {
          const deviceRef = doc(db, "device", selectedDeviceId);
          await updateDoc(deviceRef, {
            managerName: selectedManagerName,
            managerID: selectedManagerUID,
          });
          alert(
            `Manager ${selectedManagerName} assigned to device ${selectedDeviceId}`
          );
        } catch (error) {
          console.error("Error updating manager:", error);
          alert("Failed to assign manager. Please try again.");
        }
      }
    } else if (userType === "manager") {
      const selectedDeviceId = document.getElementById("deviceID").value;
      const name = assignForm["name"].value.trim();
      const phoneNumber = assignForm["phoneNumber"].value.trim();
      const location = document.getElementById("location").value;

      if (selectedDeviceId && name && phoneNumber && location) {
        try {
          const deviceRef = doc(db, "device", selectedDeviceId);
          await updateDoc(deviceRef, {
            workerName: name,
            phoneNumber: parseInt(phoneNumber, 10),
            location,
          });
          alert(
            `Device ${selectedDeviceId} updated with worker name, phone number, and location.`
          );
        } catch (error) {
          console.error("Error assigning device:", error);
          alert("Failed to assign device. Please try again.");
        }
      }
    }
  });

  setupNavbarListeners(userData);
}
