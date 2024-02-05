import { updatePasswordStrength } from "./password-strength.js";
import { togglePasswordVisibility } from "./toggle-password.js";

const BASE_URL = "https://v2.api.noroff.dev";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const password = document.getElementById("password");
  const repeatPassword = document.getElementById("repeatPassword");
  const errorMessage = document.getElementById("error-message");

  // Moved registerUser outside the submit event listener
  async function registerUser(name, email, password) {
    const registerUrl = `${BASE_URL}/auth/register`;

    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "X-Noroff-API-Key": "YOUR_API_KEY" // Uncomment and use your API key if needed
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          // Include other optional fields as necessary
        }),
      });

      const data = await response.json(); // Always parse the JSON first

      if (!response.ok) {
        // Use data.message or any specific field your API uses for error messages
        let errorDetail =
          data.message || "An error occurred during registration.";
        throw new Error(`Error: ${errorDetail}`);
      }

      console.log("Registration successful", data);
      // Handle post-registration logic here, like redirecting to the login page
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

    const name = document.getElementById("name").value; // Get the name from the form
    // Call registerUser with the name, email, and password
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
