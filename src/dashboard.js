import { db } from "./index.js";
import { collection, onSnapshot } from "firebase/firestore";

export async function dashboard(element, userData) {
  const isAdmin = userData.userType === "admin";
  const firstName = userData.fullName.split(" ")[0];

  // Display a welcome message and, if admin, a table for device data
  element.innerHTML = `
    <div class="tableContainer main">
      <h1>Welcome, <span class="user-name">${firstName}</span>.</h1>
      <div class="subtitle-light">
        ${
          isAdmin
            ? "All device data is listed below."
            : "No device is assigned to you."
        }
      </div>
      ${
        isAdmin
          ? `<table id="deviceTable">
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Name</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody id="deviceTableBody">
                <!-- Device rows will be populated here -->
              </tbody>
            </table>`
          : ""
      }
    </div>
  `;

  // Load device data if the user is an admin
  if (isAdmin) {
    listenToDeviceUpdates(element);
  }
}

// Function to listen for real-time updates in the device collection
function listenToDeviceUpdates(element) {
  const devicesRef = collection(db, "device");

  onSnapshot(devicesRef, (snapshot) => {
    const deviceTableBody = element.querySelector("#deviceTableBody");

    // Create an array to store and sort device data
    const devices = snapshot.docs.map((doc) => ({
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
        const status = deviceData.activeStatus ? "Active" : "Inactive";
        const lastActivity = deviceData.alarmHistory?.length
          ? deviceData.alarmHistory.slice(-1)[0].split("_")[1]
          : "No Activity";

        return `
        <tr>
          <td>${deviceID}</td>
          <td>${workerName}</td>
          <td>${managerName}</td>
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
  });
}
