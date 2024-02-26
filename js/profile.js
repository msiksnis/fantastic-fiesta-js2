import {
  setupDeletePostListeners,
  confirmDeletePost,
} from "./components/delete-post.js";
import { timeSince } from "./utils/helper-functions.js";

const BASE_PROFILE_URL = "https://v2.api.noroff.dev/social/profiles/";

const accessToken = localStorage.getItem("accessToken");
const API_KEY = "4e529365-1137-49dd-b777-84c28348625f";
const userProfile = JSON.parse(localStorage.getItem("userProfile"));
const userName = userProfile ? userProfile.name : null;

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const profileName = urlParams.get("profile");
  if (profileName) {
    await fetchUserProfile(profileName);
    checkFollowingStatus(profileName);
  }

  if (userName) {
    fetchProfileData(userName);
  }

  const shareButton = document.getElementById("share-profile-button");
  if (shareButton) {
    shareButton.addEventListener("click", copyProfileUrlToClipboard);
  }

  toggleEditFollowButtons(profileName);

  const followButton = document.getElementById("follow-button");
  console.log("Assigning event listener to follow button");

  if (followButton) {
    followButton.addEventListener("click", async function () {
      console.log("Follow button clicked");

      const urlParams = new URLSearchParams(window.location.search);
      const profileNameToFollow = urlParams.get("profile");
      console.log("Profile to follow:", profileNameToFollow);

      let currentUser = JSON.parse(localStorage.getItem("userProfile"));
      if (!currentUser) {
        console.log("No current user found.");
        return;
      }
      if (!currentUser.following) {
        console.log("Initializing following array.");
        currentUser.following = [];
      }

      const isFollowing = currentUser.following.some(
        (profile) => profile.name === profileNameToFollow
      );
      console.log("Is following:", isFollowing);

      if (isFollowing) {
        console.log("Attempting to unfollow...");
        await unfollowProfile(profileNameToFollow);
        followButton.textContent = "Follow";
        displaySuccess(`You have unfollowed ${profileNameToFollow}.`);
        console.log("Unfollowed successfully.");
      } else {
        console.log("Attempting to follow...");
        await followProfile(profileNameToFollow);
        followButton.textContent = "Unfollow";
        displaySuccess(`Now you are folloving ${profileNameToFollow}!`);
        console.log(`Followed ${profileNameToFollow} successfully.`);
      }
    });
  }

  fetchConfirmationModal();
});

function fetchConfirmationModal() {
  fetch("../components/confirmation-modal.html")
    .then((response) => response.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      // Ensure modal elements are in the DOM
      console.log("Modal loaded, setting up listeners...");
      setupDeletePostListeners();
    })
    .catch((error) =>
      console.error("Failed to load the confirmation modal", error)
    );
}

function toggleEditFollowButtons(profileName) {
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

async function fetchUserProfile(userName) {
  const API_URL = `${BASE_PROFILE_URL}${userName}`;
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const { data } = await response.json();
    console.log("Profile data:", data);

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
  }
}

async function fetchUserPosts(userName) {
  const postsAPIURL = `${BASE_PROFILE_URL}${userName}/posts?_author=true`;
  try {
    const response = await fetch(postsAPIURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }

    const { data } = await response.json();
    console.log("User posts data:", data);
    displayUserPosts(data);
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
}

function displayUserPosts(posts) {
  const postsContainer = document.getElementById(
    "dynamic-profile-posts-container"
  );
  const postTemplate = document.getElementById("post-template").content;
  const currentUser = JSON.parse(localStorage.getItem("userProfile"));

  postsContainer.innerHTML = "";

  // setupDeletePostListeners();

  posts.forEach((post) => {
    const postClone = document.importNode(postTemplate, true);

    const deleteButton = postClone.querySelector("#delete-post");
    if (post.author.name === currentUser.name) {
      deleteButton.classList.remove("hidden");
      deleteButton.addEventListener("click", () => confirmDeletePost(post.id));
    }

    const postAuthor = postClone.querySelector("#post-author-name");
    if (post.author) {
      postAuthor.textContent = post.author.name;
      postAuthor.href = `profile.html?profile=${post.author.name}`;
    }
    const postAuthorAvatar = postClone.querySelector("#post-author-avatar");
    if (post.author && post.author.avatar && post.author.avatar.url) {
      postAuthorAvatar.src = post.author.avatar.url;
      postAuthorAvatar.alt = post.author.avatar.alt || "Author avatar";
    } else {
      postAuthorAvatar.remove();
    }

    postClone.querySelector("#post-title").textContent = post.title;
    postClone.querySelector("#post-body").textContent = post.body;

    const postMedia = postClone.querySelector("#post-media");
    if (post.media && post.media.url) {
      postMedia.src = post.media.url;
      postMedia.alt = post.media.alt || "Post image";
      postMedia.style.display = "block";
    } else {
      postMedia.remove();
    }

    const formattedTags = post.tags
      .map((tag) => "#" + tag.replace(/\s+/g, "").toLowerCase())
      .join(", ");
    postClone.querySelector("#post-tags").textContent = formattedTags;
    postClone.querySelector("#post-date").textContent = timeSince(post.created);

    postsContainer.appendChild(postClone);
  });
}

function copyProfileUrlToClipboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const profileName = urlParams.get("profile");

  const profileUrl = `${
    window.location.origin
  }/profile/?profile=${encodeURIComponent(profileName)}`;
  navigator.clipboard
    .writeText(profileUrl)
    .then(() => {
      displaySuccess("Profile URL copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy profile URL.", err);
    });
}

// Utility function to get user profile from local storage
function getUserProfileFromLocalStorage() {
  const userProfileStr = localStorage.getItem("userProfile");
  return userProfileStr ? JSON.parse(userProfileStr) : null;
}

// Utility function to set user profile in local storage
function setUserProfileInLocalStorage(userProfile) {
  const userProfileStr = JSON.stringify(userProfile);
  localStorage.setItem("userProfile", userProfileStr);
}

// Function to increment or decrement the following count
function adjustFollowingCount(userProfile, increment = true) {
  const adjustment = increment ? 1 : -1;
  userProfile._count.following = Math.max(
    0,
    userProfile._count.following + adjustment
  );
  return userProfile;
}

// Function to increment or decrement the followers count
function adjustFollowersCount(userProfile, increment = true) {
  const adjustment = increment ? 1 : -1;
  userProfile._count.followers = Math.max(
    0,
    userProfile._count.followers + adjustment
  );
  return userProfile;
}

// Update local storage user profile
function updateUserProfileInLocalStorage(updateFunction) {
  let userProfile = getUserProfileFromLocalStorage();
  if (userProfile) {
    userProfile = updateFunction(userProfile);
    setUserProfileInLocalStorage(userProfile);
  }
}

async function followProfile(profileName) {
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
      // Add the new profile to the following array
      userProfile.following.push({ name: profileName });
      // Increment the following count
      return adjustFollowingCount(userProfile, true);
    });

    document.getElementById("follow-button").textContent = "Unfollow";
    updateFollowingCountUI(true);
    updateFollowersCountUI(true);
  } catch (error) {
    console.error("Error following profile:", error);
  }
}

async function unfollowProfile(profileName) {
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

async function fetchProfileData(userName) {
  try {
    // Fetch basic profile information
    const profileResponse = await fetch(`${BASE_PROFILE_URL}${userName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });
    if (!profileResponse.ok) throw new Error("Failed to fetch profile data");
    const { data: profileData } = await profileResponse.json();

    // Fetch following information
    const followingResponse = await fetch(
      `${BASE_PROFILE_URL}${userName}?_following=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );
    if (!followingResponse.ok)
      throw new Error("Failed to fetch following data");
    const { data: followingData } = await followingResponse.json();

    // Fetch followers information
    const followersResponse = await fetch(
      `${BASE_PROFILE_URL}${userName}?_followers=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );
    if (!followersResponse.ok)
      throw new Error("Failed to fetch followers data");
    const { data: followersData } = await followersResponse.json();

    // Now you have profileData, followingData, and followersData
    // Here you would typically update the UI with this data
    console.log("Following data", followingData);
    console.log("Followers data", followersData);
  } catch (error) {
    console.error(error.message);
  }
}

function checkFollowingStatus(profileNameToCheck) {
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

function displaySuccess(message) {
  const successToast = document.getElementById("success-toast");
  if (successToast) {
    successToast.textContent = message;
    successToast.classList.remove("-translate-y-20", "opacity-0");
    successToast.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
      successToast.classList.remove("translate-y-0", "opacity-100");
      successToast.classList.add("-translate-y-20", "opacity-0");
    }, 3000);
  }
}
