import { updatePasswordStrength } from "./password-strength.js";
import { togglePasswordVisibility } from "./toggle-password.js";
import { login } from "./sign-in.js";
import { displayError } from "../utils/toasts.js";
import { API_BASE } from "../constants.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const password = document.getElementById("password");
  const repeatPassword = document.getElementById("repeatPassword");
  const errorMessage = document.getElementById("error-message");

  async function registerUser(name, email, password) {
    const registerUrl = `${API_BASE}/auth/register`;

    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("An error occurred during registration.", data.message);
      }

      console.log("Registration successful", data);
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      displayError(
        "Something went wrong. Please check your credentials and try again."
      );
    }
  }

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
    const passwordMatchIndicator = document.getElementById(
      "passwordMatchIndicator"
    );
    if (
      password.value &&
      repeatPassword.value &&
      password.value === repeatPassword.value
    ) {
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

    const name = document.getElementById("name").value;
    await registerUser(
      name,
      document.getElementById("email").value,
      password.value
    );
  });

  password.addEventListener("input", () =>
    updatePasswordStrength(password.value)
  );
});
