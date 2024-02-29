// profile-manager.js

import { API_BASE, API_PROFILES, API_KEY } from "./constants.js";
import { fetchUserPosts } from "./post-manager.js";
import { displayError } from "./utils/toasts.js";

const BASE_PROFILE_URL = `${API_BASE}${API_PROFILES}/`;
const accessToken = localStorage.getItem("accessToken");

export async function fetchUserProfile(userName) {
  try {
    const response = await fetch(`${BASE_PROFILE_URL}${userName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const { data } = await response.json();

    document.getElementById("dynamic-profile-name").textContent = data.name;
    document.getElementById("dynamic-profile-bio").textContent = data.bio;
    document.querySelector(".dynamic-profile-avatar").src = data.avatar.url;
    document.querySelector(".dynamic-profile-avatar").alt = data.avatar.alt;
    document.getElementById("dynamic-profile-cover").src = data.banner.url;
    document.getElementById("dynamic-profile-cover").alt = data.banner.alt;
    document.getElementById("dynamic-profile-followers").textContent =
      data._count.followers;
    document.getElementById("dynamic-profile-following").textContent =
      data._count.following;
    document.getElementById("dynamic-profile-posts").textContent =
      data._count.posts;

    await fetchUserPosts(userName);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    displayError("Could not fetch profile data");
  }
}

export async function followProfile(profileName) {
  try {
    const response = await fetch(`${BASE_PROFILE_URL}${profileName}/follow`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) throw new Error("Failed to follow profile");

    let currentUserProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (!currentUserProfile.following) {
      currentUserProfile.following = [];
    }
    currentUserProfile.following.push({ name: profileName });

    localStorage.setItem("userProfile", JSON.stringify(currentUserProfile));

    updateUserProfileInLocalStorage((userProfile) => {
      // Adds the new profile to the following array
      userProfile.following.push({ name: profileName });
      // Increments the following count
      return adjustFollowingCount(userProfile, true);
    });

    document.getElementById("follow-button").textContent = "Unfollow";
    updateFollowingCountUI(true);
    updateFollowersCountUI(true);
  } catch (error) {
    console.error("Error following profile:", error);
    displayError("Something went wrong. Please reload the page and try again.");
  }
}

export async function unfollowProfile(profileName) {
  try {
    const response = await fetch(`${BASE_PROFILE_URL}${profileName}/unfollow`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) throw new Error("Failed to unfollow profile");

    updateFollowingCountUI(false);
    updateFollowersCountUI(false);

    let currentUserProfile = JSON.parse(localStorage.getItem("userProfile"));
    currentUserProfile.following = currentUserProfile.following.filter(
      (profile) => profile.name !== profileName
    );
    localStorage.setItem("userProfile", JSON.stringify(currentUserProfile));

    updateUserProfileInLocalStorage((userProfile) => {
      // Remove the profile from the following array
      userProfile.following = userProfile.following.filter(
        (profile) => profile.name !== profileName
      );
      // Decrement the following count
      return adjustFollowingCount(userProfile, false);
    });

    document.getElementById("follow-button").textContent = "Follow";
  } catch (error) {
    console.error("Error unfollowing profile:", error);
  }
}

export function toggleEditFollowButtons(profileName) {
  const loggedInUser = JSON.parse(localStorage.getItem("userProfile"));
  const editButton = document.getElementById("edit-user-button");
  const followButton = document.getElementById("follow-button");

  if (loggedInUser && loggedInUser.name === profileName) {
    if (editButton) editButton.classList.remove("hidden");
    if (followButton) followButton.classList.add("hidden");
  } else {
    if (editButton) editButton.classList.add("hidden");
    if (followButton) followButton.classList.remove("hidden", "flex");
  }
}

export function checkFollowingStatus(profileNameToCheck) {
  const currentUser = JSON.parse(localStorage.getItem("userProfile"));
  if (!currentUser || !currentUser.following) {
    console.log("No current user data or following list found.");
    return;
  }
  const isFollowing = currentUser.following.some(
    (profile) => profile.name === profileNameToCheck
  );
  const followButton = document.getElementById("follow-button");
  if (followButton) {
    followButton.textContent = isFollowing ? "Unfollow" : "Follow";
  }
}

function updateFollowingCountUI(isFollow) {
  let countElement = document.getElementById("dynamic-profile-following-count");
  if (countElement) {
    let currentCount = parseInt(countElement.textContent) || 0;
    countElement.textContent = isFollow
      ? currentCount + 1
      : Math.max(0, currentCount - 1);
  }
}

function updateFollowersCountUI(isFollowAction) {
  const followersCountElement = document.getElementById(
    "dynamic-profile-followers"
  );
  if (followersCountElement) {
    let currentCount = parseInt(followersCountElement.textContent, 10) || 0;
    followersCountElement.textContent = isFollowAction
      ? currentCount + 1
      : Math.max(0, currentCount - 1);
  }
}

function adjustFollowingCount(userProfile, increment = true) {
  const adjustment = increment ? 1 : -1;
  userProfile._count.following = Math.max(
    0,
    userProfile._count.following + adjustment
  );
  return userProfile;
}

function updateUserProfileInLocalStorage(updateFunction) {
  let userProfile = getUserProfileFromLocalStorage();
  if (userProfile) {
    userProfile = updateFunction(userProfile);
    setUserProfileInLocalStorage(userProfile);
  }
}

function getUserProfileFromLocalStorage() {
  const userProfileStr = localStorage.getItem("userProfile");
  return userProfileStr ? JSON.parse(userProfileStr) : null;
}

function setUserProfileInLocalStorage(userProfile) {
  const userProfileStr = JSON.stringify(userProfile);
  localStorage.setItem("userProfile", userProfileStr);
}
