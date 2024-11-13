export function navBar(element) {
  element.innerHTML = `
  <nav class="drop-shadow1">
      <div class="nav-logo">
        <img src="./asset/siteguardian logo.png" alt="siteguardian logo" />
        <div>SiteGuardian</div>
      </div>
      <div class="nav-menu">
        <ul>
          <li class="active">Device List</li>
          <li>Assign Users</li>
          <li>
            <img src="./asset/Avatar.png" alt="profile Avatar" />
            <div class="logoutBTN">Log Out</div>
          </li>
        </ul>
      </div>
    </nav>
    `;
}
