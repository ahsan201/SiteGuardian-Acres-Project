import { db } from "./index.js";
import { collection, onSnapshot } from "firebase/firestore";

export function monitorAlarmUpdates() {
  const devicesRef = collection(db, "device");

  // Listen for real-time updates to the devices collection
  onSnapshot(devicesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        const deviceData = change.doc.data();
        const deviceID = change.doc.id;

        // Check if a new alarm has been added to alarmHistory
        const alarmHistory = deviceData.alarmHistory || [];
        const latestAlarm = alarmHistory[alarmHistory.length - 1];
        if (latestAlarm) {
          const [iconAndName, timestamp] = latestAlarm.split("_");
          const [svgImageName, alarmName] = iconAndName.split(">");

          // Show the active alarm alert
          showActiveAlarm({
            deviceID,
            workerName: deviceData.workerName || "N/A",
            phoneNumber: deviceData.phoneNumber || "N/A",
            activeStatus: deviceData.activeStatus ? "Active" : "Inactive",
            managerName: deviceData.managerName || "N/A",
            location: deviceData.location || "Unknown",
            svgImageName,
            alarmName,
          });
        }
      }
    });
  });
}

// Function to display the active alarm container
function showActiveAlarm(data) {
  // Create or select the container for the active alarm
  let activeAlarmContainer = document.querySelector(
    ".activeAlarmDeviceInfoOutterContainer"
  );

  if (!activeAlarmContainer) {
    // Create the container if it doesn't exist
    activeAlarmContainer = document.createElement("div");
    activeAlarmContainer.classList.add("activeAlarmDeviceInfoOutterContainer");
    document.body.appendChild(activeAlarmContainer);
  }

  // Populate the active alarm information
  activeAlarmContainer.innerHTML = `
      <div class="deviceInfoContainer">
        <img src="./asset/big_${data.svgImageName}.svg" alt="${data.alarmName} icon" />
        <h1>${data.alarmName}</h1>
        <label for="deviceId">Device ID</label>
        <h2 name="deviceId" id="deviceId">#${data.deviceID}</h2>
        <div class="deviceIdFlex">
          <div>
            <label for="assignedWorker">Assigned Worker</label>
            <h3 name="assignedWorker" id="assignedWorker">${data.workerName}</h3>
            <label for="phoneNumber">Phone Number</label>
            <h3 name="phoneNumber" id="phoneNumber">+${data.phoneNumber}</h3>
            <label for="status">Status</label>
            <div name="status" id="status" style="color: black">${data.activeStatus}</div>
          </div>
          <div>
            <label for="manager">Manager</label>
            <div name="manager" id="manager" style="color: black">${data.managerName}</div>
            <label for="location">Location</label>
            <div name="location" id="location" style="color: black">${data.location}</div>
          </div>
        </div>
      </div>
    `;

  // Display the container
  activeAlarmContainer.style.display = "grid";

  // Close the container when clicked
  activeAlarmContainer.addEventListener("click", (event) => {
    if (event.target === activeAlarmContainer) {
      activeAlarmContainer.style.display = "none";
    }
  });
}
