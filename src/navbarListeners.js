// navbarListeners.js

import { dashboard } from "./dashboard.js";
import { assignUser } from "./assignUser.js";
import { body } from "./ui.js";

export function setupNavbarListeners(userData) {
  const deviceListNavItem = document.querySelector(".device-list");
  const assignUsersNavItem = document.querySelector(".assign-users");

  if (deviceListNavItem) {
    deviceListNavItem.addEventListener("click", () => {
      dashboard(document.getElementById("content-container"), userData);
    });
  }

  if (assignUsersNavItem) {
    assignUsersNavItem.addEventListener("click", () => {
      assignUser(
        document.getElementById("content-container"),
        userData.userType
      );
    });
  }
}
