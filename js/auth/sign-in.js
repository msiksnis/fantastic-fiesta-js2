import { togglePasswordVisibility } from "./toggle-password.js";

const BASE_URL = "https://v2.api.noroff.dev";

export async function login(email, password) {
  const loginUrl = `${BASE_URL}/auth/login`;

  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    console.log("Login successful", data);

    localStorage.setItem("accessToken", data.data.accessToken);

    window.location.href = "/index.html";
  } catch (error) {
    console.error("Error during login:", error);
    // Handle login error (e.g., show a message to the user)
  }
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
});

function setupTogglePasswordVisibility(password, toggPasswordVisibility) {
  document.addEventListener("DOMContentLoaded", function () {
    const togglePasswordButton = document.getElementById(
      toggPasswordVisibility
    );
    if (togglePasswordButton) {
      togglePasswordButton.addEventListener("click", function () {
        togglePasswordVisibility(password, toggPasswordVisibility);
      });
    }
  });
}

setupTogglePasswordVisibility("password", "toggPasswordVisibility");
