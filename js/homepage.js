const accessToken = localStorage.getItem("accessToken");
const API_KEY = "4e529365-1137-49dd-b777-84c28348625f";

async function fetchProfiles() {
  if (!accessToken) {
    console.log("No access token found. Please login.");
    window.location.href = "/sign-in";
  }

  try {
    const response = await fetch("https://v2.api.noroff.dev/social/profiles", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profiles: ${response.statusText}`);
    }

    const data = await response.json();
  } catch (error) {
    console.error("Error fetching profiles:", error);
  }
}

fetchProfiles();

function displayUserProfile() {
  const userProfileStr = localStorage.getItem("userProfile");
  if (userProfileStr) {
    const userProfile = JSON.parse(userProfileStr);
    const profileName = document.getElementById("profile-name");
    const profileImage = document.getElementById("profile-picture");

    if (profileName) {
      profileName.textContent = userProfile.name;
    }

    if (profileImage && userProfile.avatar && userProfile.avatar.url) {
      profileImage.src = userProfile.avatar.url;
      profileImage.alt = userProfile.avatar.alt;
    }
  }
}

displayUserProfile();
