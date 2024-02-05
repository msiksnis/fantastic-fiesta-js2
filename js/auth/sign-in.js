import { togglePasswordVisibility } from "./toggle-password.js";

const BASE_URL = "https://v2.api.noroff.dev";

// Function to handle login
async function login(email, password) {
  // Define the endpoint URL
  const loginUrl = `${BASE_URL}/auth/login`;

  try {
    // Perform the POST request
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

    // Check if the response is OK (status code 200)
    if (!response.ok) {
      throw new Error("Login failed");
    }

    // Parse the JSON response
    const data = await response.json();

    // Here you can handle the response, e.g., save the accessToken, navigate the user to another page, etc.
    console.log("Login successful", data);

    // Save the accessToken in localStorage or another secure place
    localStorage.setItem("accessToken", data.data.accessToken);

    // Redirect to /index.html after successful login
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Error during login:", error);
    // Handle login error (e.g., show a message to the user)
  }
}

// Example usage of the login function
// Assuming you have a form and you are calling this function on form submit
document.querySelector("form").addEventListener("submit", (event) => {
  // Prevent form from submitting normally
  event.preventDefault();

  // Get the email and password from the form inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Call the login function
  login(email, password);
});

document.addEventListener("DOMContentLoaded", function () {
  const togglePasswordButton = document.getElementById("togglePassword");
  togglePasswordButton.addEventListener("click", togglePasswordVisibility);
});
