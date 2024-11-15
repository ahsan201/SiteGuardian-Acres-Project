// dashboard.js

export function dashboard(element, userData) {
  element.innerHTML = `
    <div class="container main">
      <h1>Welcome, <span class="user-name">${
        userData.fullName.split(" ")[0]
      }.</span></h1>
      <div class="subtitle-light">
        Select filters to get devices from specific location.
      </div>
    </div>
  `;
}
