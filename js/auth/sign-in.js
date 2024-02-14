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

    const { data } = await response.json();

    console.log("Login successful", data);

    localStorage.setItem("accessToken", data.accessToken);

    const userProfile = {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      banner: data.banner,
    };
    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    window.location.href = "/";
  } catch (error) {
    displayError("Wrong email or password. Please try again.");
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

function displayError(message = "Oops... Something went wrong.") {
  const errorToast = document.getElementById("error-toast");
  errorToast.textContent = message;
  errorToast.classList.add("active");
  setTimeout(() => {
    errorToast.classList.remove("active");
  }, 3000);
}
