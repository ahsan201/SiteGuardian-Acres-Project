export function signupLogin(element) {
  element.innerHTML = `
  <div class="bg">
      <div class="container login-box">
        <div class="login-image">
          <img src="./asset/loginImage.jpg" alt="acres kamloops construction site" />
        </div>
        <div class="signup-form" style="display: none;">
          <div class="logo-Title">
            <img src="./asset/siteguardian logo.png" alt="siteguardian logo" />
            <div>
              <h2>Create an account</h2>
              <p>
                Already have an account? <span class="link-text" id="switchToLogin">Log in</span>
              </p>
            </div>
          </div>
          <form action="#" id="signupForm">
            <label for="signupFullNameInput">Full Name</label>
            <input type="text" name="signupFullNameInput" id="signupFullNameInput" required />
            <label for="signupEmail">Email</label>
            <input type="email" name="signupEmail" id="signupEmail" required />
            <label for="signupPassword">Password</label>
            <input type="password" name="signupPassword" id="signupPassword" required />
            <label for="signupReWritePassword">Re-write Password</label>
            <input type="password" name="signupReWritePassword" id="signupReWritePassword" required />
            <label for="signupAdminKey">Admin Key</label>
            <input type="text" name="signupAdminKey" id="signupAdminKey" required />
            <label for="signupUserType">User Type</label>
            <select name="signupUserType" id="signupUserType">
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
            <button id="createAccountBTN">Create Account</button>
          </form>
        </div>
        <div class="login-form">
          <div class="logo-Title">
            <img src="./asset/siteguardian logo.png" alt="siteguardian logo" />
            <div>
              <h2>Login Account</h2>
              <p>Don't have an account? <span class="link-text" id="switchToSignup">Sign-Up</span></p>
            </div>
          </div>
          <form action="#" id="loginForm">
            <label for="email">Email</label>
            <input type="email" name="email" id="loginEmail" required />
            <label for="password">Password</label>
            <input type="password" name="password" id="loginPassword" required />
            <button id="loginBTN">Login</button>
          </form>
        </div>
      </div>
</div>
    `;

  // JavaScript to handle form switching
  const signupFormContainer = document.querySelector(".signup-form");
  const loginFormContainer = document.querySelector(".login-form");
  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");

  // Event listeners for switching forms
  switchToSignup.addEventListener("click", () => {
    loginFormContainer.style.display = "none";
    signupFormContainer.style.display = "block";
  });

  switchToLogin.addEventListener("click", () => {
    signupFormContainer.style.display = "none";
    loginFormContainer.style.display = "block";
  });
}
