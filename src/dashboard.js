export function dashboard(element, fistName) {
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
    <div class="container main">
      <h1>Welcome, <span class="user-name">${fistName}.</span></h1>
      <div class="subtitle-light">
        Select filters to get devices from specific location.
      </div>
    </div>
    `;
}
