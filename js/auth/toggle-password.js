export function togglePasswordVisibility(passwordInputId, toggleButtonId) {
  const passwordInput = document.getElementById(passwordInputId);
  const toggleButton = document.getElementById(toggleButtonId);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleButton.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggleButton.textContent = "Show";
  }

  passwordInput.focus();
}
