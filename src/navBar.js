// navBar.js

export function renderNavbar(element) {
  if (!element) {
    console.error("Navbar container not found in the DOM.");
    return;
  }

  element.innerHTML = `
      <nav class="drop-shadow1">
        <div class="nav-logo">
          <img src="./asset/siteguardian logo.png" alt="siteguardian logo" />
          <div>SiteGuardian</div>
        </div>
        <div class="nav-menu">
          <ul>
            <li class="device-list">Device List</li>
            <li class="assign-users">Assign Users</li>
            <li>
              <img src="./asset/Avatar.png" alt="profile Avatar" />
              <div class="logoutBTN">Log Out</div>
            </li>
          </ul>
        </div>
      </nav>
    `;
}
