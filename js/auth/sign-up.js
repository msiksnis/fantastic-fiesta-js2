import { getStrength } from "./password-strength.js";
import { togglePasswordVisibility } from "./toggle-password.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const password = document.getElementById("password");
  const repeatPassword = document.getElementById("repeatPassword");
  const errorMessage = document.getElementById("error-message");

  document
    .getElementById("togglePasswordVisibility")
    .addEventListener("click", () =>
      togglePasswordVisibility("password", "togglePasswordVisibility")
    );

  document
    .getElementById("toggleRepeatPasswordVisibility")
    .addEventListener("click", () =>
      togglePasswordVisibility(
        "repeatPassword",
        "toggleRepeatPasswordVisibility"
      )
    );

  document.getElementById("repeatPassword").addEventListener("input", () => {
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeatPassword").value;
    const passwordMatchIndicator = document.getElementById(
      "passwordMatchIndicator"
    );

    if (password && repeatPassword && password === repeatPassword) {
      passwordMatchIndicator.classList.remove("hidden");
    } else {
      passwordMatchIndicator.classList.add("hidden");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (password.value !== repeatPassword.value) {
      errorMessage.textContent = "Passwords do not match.";
      errorMessage.classList.remove("hidden");
      return;
    }

    console.log(
      "Email:",
      document.getElementById("email").value,
      "Password:",
      password.value
    );

    // Proceed with form submission, e.g., calling your registration API
    // const email = document.getElementById("email").value;
    // Assume registration function is implemented elsewhere
    // await registerUser(email, password.value);
  });

  password.addEventListener("input", () =>
    updatePasswordStrength(password.value)
  );

  function updatePasswordStrength(password) {
    const strength = getStrength(password);
    const barsDiv = document.getElementById("bars");
    const strengthLabel = document.getElementById("strengthLabel");

    barsDiv.style.width = strength.width;
    barsDiv.style.backgroundColor = strength.color;
    strengthLabel.textContent = strength.text + " password";
  }
});
