export function handleDeviceRowClick(data) {
  // Create or select the container for the device information
  let deviceInfoOutterContainer = document.querySelector(
    ".deviceInfoOutterContainer"
  );

  if (!deviceInfoOutterContainer) {
    // Create the container if it doesn't exist
    deviceInfoOutterContainer = document.createElement("div");
    deviceInfoOutterContainer.classList.add("deviceInfoOutterContainer");
    document.body.appendChild(deviceInfoOutterContainer);
  }

  // Populate the device information into the container
  deviceInfoOutterContainer.innerHTML = `
        <div class="deviceInfoContainer">
          <label for="deviceId">Device ID</label>
          <h2 name="deviceId" id="deviceId">#${data.deviceID}</h2>
          <div class="deviceIdFlex">
            <div>
              <label for="assignedWorker">Assigned Worker</label>
              <h3 name="assignedWorker" id="assignedWorker">${
                data.workerName || "N/A"
              }</h3>
              <label for="phoneNumber">Phone Number</label>
              <h3 name="phoneNumber" id="phoneNumber">${
                data.phoneNumber ? `+${data.phoneNumber}` : "N/A"
              }</h3>
              <label for="status">Status</label>
              <div 
                name="status" 
                id="status" 
                style="font-weight: bold; padding: 0.3rem 0.6rem; border-radius: 3rem; ${
                  data.activeStatus
                    ? "background-color: var(--cf-Success); color: white;"
                    : "background-color: lightgray; color: black;"
                }"
              >
                ${data.activeStatus ? "Active" : "Inactive"}
              </div>
            </div>
            <div>
              <label for="manager">Manager</label>
              <div name="manager" id="manager">${
                data.managerName || "N/A"
              }</div>
              <label for="location">Location</label>
              <div name="location" id="location">${
                data.location || "Unknown"
              }</div>
            </div>
          </div>
          <label for="alarmHistory">Alarm History</label>
          <div name="alarmHistory" id="alarmHistory">
            ${
              data.alarmHistory?.length
                ? data.alarmHistory
                    .map((history) => {
                      const [iconAndName, timestamp] = history.split("_");
                      const [svgImageName, alarmName] = iconAndName.split(">");
                      return `
                        <div id="alarmInfo">
                          <div id="alarmName">
                            <img src="./asset/${svgImageName}.svg" alt="${alarmName} icon" />
                            <div>${alarmName}</div>
                          </div>
                          <div id="alarmTime">${timestamp}</div>
                        </div>
                      `;
                    })
                    .join("")
                : "<div>No Alarm History</div>"
            }
          </div>
        </div>
      `;

  // Add styles to display the container
  deviceInfoOutterContainer.style.display = "grid";

  // Add a click listener to close the container
  deviceInfoOutterContainer.addEventListener("click", (event) => {
    if (event.target === deviceInfoOutterContainer) {
      deviceInfoOutterContainer.style.display = "none";
    }
  });
}
