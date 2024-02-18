// import { displayUserProfile } from "./profile-data";

const accessToken = localStorage.getItem("accessToken");
const API_KEY = "4e529365-1137-49dd-b777-84c28348625f";

async function fetchPosts() {
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
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Posts:", data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

fetchPosts();

async function fetchCountData() {
  const userProfileString = localStorage.getItem("userProfile");
  if (!accessToken || !userProfileString) {
    console.log("No access token found or user profile missing. Please login.");
    window.location.href = "/sign-in";
    return;
  }

  try {
    const userProfile = JSON.parse(userProfileString);
    const username = userProfile.name;

    const response = await fetch(
      `https://v2.api.noroff.dev/social/profiles/${username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const profileData = await response.json();
    localStorage.setItem("userProfile", JSON.stringify(profileData.data));
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
}

fetchCountData();

document.addEventListener("DOMContentLoaded", function () {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));

  const profileAvatarElement = document.getElementById("profile-avatar");

  if (profileAvatarElement && userProfile.avatar) {
    profileAvatarElement.src = userProfile.avatar.url;
    profileAvatarElement.alt = userProfile.avatar.alt || "User avatar";
  }
});
