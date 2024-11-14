// navbarListeners.js

import { dashboard } from "./dashboard.js";
import { assignUser } from "./assignUser.js";
import { body } from "./ui.js";

export function setupNavbarListeners(userData) {
  const navItems = document.querySelectorAll(".nav-menu li");
  const deviceListNavItem = navItems[0]; // Assuming it's the first <li>
  const assignUsersNavItem = navItems[1]; // Assuming it's the second <li>

  if (deviceListNavItem) {
    deviceListNavItem.addEventListener("click", () => {
      console.log("Device List clicked");
      dashboard(body, userData.fullName.split(" ")[0]); // Redirect to dashboard
      setupNavbarListeners(userData); // Reapply listeners after dashboard renders
    });
  } else {
    console.log("Device List nav item not found");
  }

  if (assignUsersNavItem) {
    assignUsersNavItem.addEventListener("click", () => {
      console.log("Assign Users clicked");
      assignUser(body, userData.userType); // Load the assignUser view based on userType
      setupNavbarListeners(userData); // Reapply listeners after assignUser renders
    });
  } else {
    console.log("Assign Users nav item not found");
  }
}
