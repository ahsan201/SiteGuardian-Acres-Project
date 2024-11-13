// admin Key
export const adminKey = "acres007";
// signup/login ui
export const body = document.querySelector("body");
export const signupForm = document.getElementById("signupForm");
export const loginForm = document.getElementById("loginForm");
export const signupFormContainer = document.querySelector(".signup-form");
export const loginFormContainer = document.querySelector(".login-form");
export const createAccountBTN = document.getElementById("createAccountBTN");
export const switchViewSignup = document.querySelector(
  ".signup-form .link-text"
);
export const switchViewLogin = document.querySelector(".login-form .link-text");

// nav bar

// signup/loging display change

export function signupLoginVisibility(loginVisibility) {
  if (loginVisibility) {
    loginFormContainer.style.display = "block";
    signupFormContainer.style.display = "none";
  } else {
    signupFormContainer.style.display = "block";
    loginFormContainer.style.display = "none";
  }
}
