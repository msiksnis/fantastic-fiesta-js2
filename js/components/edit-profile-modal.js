import { API_BASE, API_KEY, API_PROFILES } from "../constants.js";
import { displayError } from "../utils/toasts.js";

const accessToken = localStorage.getItem("accessToken");
const userName = JSON.parse(localStorage.getItem("userProfile")).name;

document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/edit-profile-modal.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("beforeend", data);
      initializeEditProfileModal();
    });
});

function initializeEditProfileModal() {
  document
    .getElementById("edit-user-button")
    .addEventListener("click", openModal);
  document.getElementById("close-modal").addEventListener("click", closeModal);
  window.addEventListener("click", outsideClickCloseModal);
  document
    .getElementById("edit-profile-form")
    .addEventListener("submit", submitProfileForm);
}

function openModal() {
  const modal = document.getElementById("edit-profile-modal");
  modal.classList.remove("hidden");
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  populateModalFields(userProfile);
}

function closeModal() {
  document.getElementById("edit-profile-modal").classList.add("hidden");
}

function outsideClickCloseModal(event) {
  const modal = document.getElementById("edit-profile-modal");
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
}

function populateModalFields(userProfile) {
  if (userProfile.banner && userProfile.banner.url) {
    document.getElementById("edit-banner-url").value = userProfile.banner.url;
    document.getElementById("edit-banner-alt").value =
      userProfile.banner.alt || "";
  }
  if (userProfile.avatar && userProfile.avatar.url) {
    document.getElementById("edit-avatar-url").value = userProfile.avatar.url;
    document.getElementById("edit-avatar-alt").value =
      userProfile.avatar.alt || "";
  }
  document.getElementById("edit-name").value = userProfile.name;
  document.getElementById("edit-bio").value = userProfile.bio || "";
}

async function submitProfileForm(e) {
  e.preventDefault();
  const bannerUrl = document.getElementById("edit-banner-url").value;
  const bannerAlt = document.getElementById("edit-banner-alt").value;
  const avatarUrl = document.getElementById("edit-avatar-url").value;
  const avatarAlt = document.getElementById("edit-avatar-alt").value;
  const name = document.getElementById("edit-name").value;
  const bio = document.getElementById("edit-bio").value;

  try {
    const response = await fetch(`${API_BASE}${API_PROFILES}/${userName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({
        banner: { url: bannerUrl, alt: bannerAlt },
        avatar: { url: avatarUrl, alt: avatarAlt },
        name,
        bio,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    const updatedProfile = await response.json();
    console.log("Profile updated successfully", updatedProfile);
    // Update local storage with new profile data
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile.data));
    // Close modal
    closeModal();
    window.location.reload();
    refreshProfileDataOnPage(updatedProfile.data);
  } catch (error) {
    console.error("Error updating profile:", error);
    displayError("Failed to update profile. Please try again.");
  }
}
