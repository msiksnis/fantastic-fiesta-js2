// Function to determine the strength of a password
export function getStrength(password) {
  let score = 0;
  if (password.length > 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const strength = {
    0: { width: "0%", color: "red", text: "Weak" },
    1: { width: "20%", color: "red", text: "Weak" },
    2: { width: "40%", color: "orange", text: "Fair" },
    3: { width: "60%", color: "yellow", text: "Good" },
    4: { width: "80%", color: "green", text: "Strong" },
    5: { width: "100%", color: "green", text: "Very Strong" },
  };

  return strength[score];
}

// To update the UI based on the password strength
export function updatePasswordStrength(password) {
  const strength = getStrength(password);
  const barsDiv = document.getElementById("bars");
  const strengthLabel = document.getElementById("strengthLabel");

  barsDiv.style.width = strength.width;
  barsDiv.style.backgroundColor = strength.color;
  strengthLabel.textContent = strength.text + " password";
}
