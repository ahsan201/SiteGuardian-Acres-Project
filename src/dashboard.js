// dashboard.js

export function dashboard(element, firstName = "User") {
  element.innerHTML = `
    <div class="container main">
      <h1>Welcome, <span class="user-name">${firstName}.</span></h1>
      <div class="subtitle-light">
        Select filters to get devices from specific location.
      </div>
    </div>
  `;
}
