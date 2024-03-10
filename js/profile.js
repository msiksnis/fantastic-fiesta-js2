// profile.js

import { copyProfileUrlToClipboard } from "./utils/helper-functions.js";
import {
  fetchConfirmationModal,
  fetchEditPostModal,
} from "./utils/fetchModals.js";
import { displaySuccess } from "./utils/toasts.js";
import {
  checkFollowingStatus,
  fetchUserProfile,
  followProfile,
  toggleEditFollowButtons,
  unfollowProfile,
} from "./profile-manager.js";

const userProfile = JSON.parse(localStorage.getItem("userProfile"));
const userName = userProfile ? userProfile.name : null;

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const profileName = urlParams.get("profile");
  if (profileName) {
    await fetchUserProfile(profileName);
    checkFollowingStatus(profileName);
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
