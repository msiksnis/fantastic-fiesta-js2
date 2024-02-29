import {
  API_BASE,
  API_FOLLOWING_FOLLOWERS,
  API_PROFILES,
} from "./constants.js";
import { confirmDeletePost } from "./components/delete-post.js";
import { openEditModalWithPostData } from "./components/edit-post.js";
import {
  copyProfileUrlToClipboard,
  timeSince,
} from "./utils/helper-functions.js";
import {
  fetchConfirmationModal,
  fetchEditPostModal,
} from "./utils/fetchModals.js";
import { displayError, displaySuccess } from "./utils/toasts.js";

const BASE_PROFILE_URL = `${API_BASE}${API_PROFILES}/`;

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
    fetchProfileDataWithFollowingAndFollowersData(userName);
  }

  const shareButton = document.getElementById("share-profile-button");
  if (shareButton) {
    shareButton.addEventListener("click", copyProfileUrlToClipboard);
  }

  toggleEditFollowButtons(profileName);

  const followButton = document.getElementById("follow-button");

  if (followButton) {
    followButton.addEventListener("click", async function () {
      const urlParams = new URLSearchParams(window.location.search);
      const profileNameToFollow = urlParams.get("profile");

      let currentUser = JSON.parse(localStorage.getItem("userProfile"));
      if (!currentUser) {
        console.log("No current user found.");
        return;
      }
      if (!currentUser.following) {
        currentUser.following = [];
      }

      const isFollowing = currentUser.following.some(
        (profile) => profile.name === profileNameToFollow
      );

      if (isFollowing) {
        await unfollowProfile(profileNameToFollow);
        followButton.textContent = "Follow";
        displaySuccess(`You have unfollowed ${profileNameToFollow}.`);
      } else {
        await followProfile(profileNameToFollow);
        followButton.textContent = "Unfollow";
        displaySuccess(`Now you are folloving ${profileNameToFollow}!`);
      }
    });
  }
  fetchEditPostModal();
  fetchConfirmationModal();
});

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
    displayError("Could not fetch user posts");
  }
}

function displayUserPosts(posts) {
  const postsContainer = document.getElementById(
    "dynamic-profile-posts-container"
  );
  const postTemplate = document.getElementById("post-template").content;
  const currentUser = JSON.parse(localStorage.getItem("userProfile"));

  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postClone = document.importNode(postTemplate, true);

    const deleteButton = postClone.querySelector("#delete-post");
    if (post.author.name === currentUser.name) {
      deleteButton.classList.remove("hidden");
      deleteButton.addEventListener("click", () => confirmDeletePost(post.id));
    }

    const editButton = postClone.querySelector("#edit-post");
    if (post.author.name === currentUser.name) {
      editButton.classList.remove("hidden");
      editButton.addEventListener("click", () =>
        openEditModalWithPostData(post.id, post)
      );
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
      .join(" ");
    postClone.querySelector("#post-tags").textContent = formattedTags;
    postClone.querySelector("#post-date").textContent = timeSince(post.created);

    postsContainer.appendChild(postClone);
  });
}

function getUserProfileFromLocalStorage() {
  const userProfileStr = localStorage.getItem("userProfile");
  return userProfileStr ? JSON.parse(userProfileStr) : null;
}

function setUserProfileInLocalStorage(userProfile) {
  const userProfileStr = JSON.stringify(userProfile);
  localStorage.setItem("userProfile", userProfileStr);
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

async function fetchProfileDataWithFollowingAndFollowersData(userName) {
  try {
    const followingAndFollowersResposnse = await fetch(
      `${BASE_PROFILE_URL}${userName}${API_FOLLOWING_FOLLOWERS}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );
    if (!followingAndFollowersResposnse.ok)
      throw new Error("Failed to fetch following and followers data");

    const { data: followingAndFollowersData } =
      await followingAndFollowersResposnse.json();

    console.log(
      "Profile with Following and Followers data",
      followingAndFollowersData
    );
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
