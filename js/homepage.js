const BASE_URL = "https://v2.api.noroff.dev";
const accessToken = localStorage.getItem("accessToken");
const API_KEY = "4e529365-1137-49dd-b777-84c28348625f";

async function fetchPosts() {
  if (!accessToken) {
    console.log("No access token found. Please login.");
    window.location.href = "/sign-in";
  }

  try {
    const response = await fetch(`${BASE_URL}/social/profiles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Posts:", data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

fetchPosts();

document.addEventListener("DOMContentLoaded", function () {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));

  const profileAvatarElement = document.getElementById("profile-avatar");

  if (profileAvatarElement && userProfile.avatar) {
    profileAvatarElement.src = userProfile.avatar.url;
    profileAvatarElement.alt = userProfile.avatar.alt || "User avatar";
  }
});
