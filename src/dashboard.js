import { db, auth } from "./index.js";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { handleDeviceRowClick } from "./deviceInfo.js";

export async function dashboard(element, userData) {
  const isAdmin = userData.userType === "admin";
  const firstName = userData.fullName.split(" ")[0];
  const managerDocID = auth.currentUser.uid; // Use the logged-in user's UID

  // Display a welcome message and a table for device data based on user role
  element.innerHTML = `
    <div class="tableContainer main">
      <h1>Welcome, <span class="user-name">${firstName}</span>.</h1>
      <div class="subtitle-light">
        ${
          isAdmin
            ? "All device data is listed below."
            : "Devices assigned to you are listed below."
        }
      </div>
      <table id="deviceTable">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Name</th>
            ${isAdmin ? "<th>Manager</th>" : ""}
            <th>Location</th>
            <th>Status</th>
            <th>Last Activity</th>
          </tr>
        </thead>
        <tbody id="deviceTableBody">
          <!-- Device rows will be populated here -->
        </tbody>
      </table>
    </div>
  `;

  // Load device data for admin or manager
  if (isAdmin) {
    listenToDeviceUpdatesForAdmin(element);
  } else {
    if (!managerDocID) {
      console.error("Manager Document ID is undefined. Cannot query devices.");
      return;
    }
    listenToDeviceUpdatesForManager(element, managerDocID);
  }
}

// Function to listen for real-time updates in the device collection (Admin view)
function listenToDeviceUpdatesForAdmin(element) {
  const devicesRef = collection(db, "device");

  onSnapshot(devicesRef, (snapshot) => {
    updateDeviceTable(element, snapshot.docs, true);
  });
}

// Function to listen for real-time updates for the manager's devices
function listenToDeviceUpdatesForManager(element, managerDocID) {
  const devicesRef = collection(db, "device");
  const managerQuery = query(
    devicesRef,
    where("managerID", "==", managerDocID) // Use the manager's UID
  );

  onSnapshot(managerQuery, (snapshot) => {
    updateDeviceTable(element, snapshot.docs, false);
  });
}

// Function to update the table with the device data
function updateDeviceTable(element, deviceDocs, isAdmin) {
  const deviceTableBody = element.querySelector("#deviceTableBody");

  // Create an array to store and sort device data
  const devices = deviceDocs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Sort devices: active first, then inactive
  devices.sort((a, b) => b.activeStatus - a.activeStatus);

  // Generate HTML for sorted device rows
  const deviceRowsHTML = devices
    .map((deviceData) => {
      const deviceID = deviceData.id;
      const workerName = deviceData.workerName || "N/A";
      const managerName = deviceData.managerName || "N/A";
      const location = deviceData.location || "Unknown";
      const status = deviceData.activeStatus ? "Active" : "Inactive";
      const lastActivity = deviceData.alarmHistory?.length
        ? deviceData.alarmHistory.slice(-1)[0].split("_")[1]
        : "No Activity";

      return `
        <tr data-id="${deviceID}" ${
        !deviceData.activeStatus ? 'style="color: var(--cf-Gray);"' : ""
      }>
          <td>${deviceID}</td>
          <td>${workerName}</td>
          ${isAdmin ? `<td>${managerName}</td>` : ""}
          <td>${location}</td>
          <td ${
            deviceData.activeStatus ? 'id="deviceActive"' : ""
          }><span>${status}</span></td>
          <td>${lastActivity}</td>
        </tr>
      `;
    })
    .join("");

  // Update the table body with the sorted device rows
  deviceTableBody.innerHTML = deviceRowsHTML;

  // Add click event listener to each row
  deviceTableBody.querySelectorAll("tr").forEach((row, index) => {
    row.addEventListener("click", () => {
      const deviceData = devices[index];
      handleDeviceRowClick({
        deviceID: deviceData.id,
        workerName: deviceData.workerName,
        phoneNumber: deviceData.phoneNumber,
        activeStatus: deviceData.activeStatus,
        managerName: deviceData.managerName,
        location: deviceData.location,
        alarmHistory: deviceData.alarmHistory,
      });
    });
  });
}
