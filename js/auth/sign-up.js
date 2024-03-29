import { updatePasswordStrength } from "./password-strength.js";
import { togglePasswordVisibility } from "./toggle-password.js";
import { login } from "./sign-in.js";

const BASE_URL = "https://v2.api.noroff.dev";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const password = document.getElementById("password");
  const repeatPassword = document.getElementById("repeatPassword");
  const errorMessage = document.getElementById("error-message");

  async function registerUser(name, email, password) {
    const registerUrl = `${BASE_URL}/auth/register`;

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
          // Other optional fields can be added
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorDetail =
          data.message || "An error occurred during registration.";
        throw new Error(`Error: ${errorDetail}`);
      }

      console.log("Registration successful", data);
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      errorMessage.textContent = error.message;
      errorMessage.classList.remove("hidden");
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
