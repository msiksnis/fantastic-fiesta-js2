import { displayUserProfile } from "../profile-data.js";

document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/mini-profile-component.html")
    .then((response) => response.text())
    .then((data) => {
      const miniProfileContainer = document.getElementById(
        "mini-profile-container"
      );
      miniProfileContainer.innerHTML = data;

      const profileNameElement =
        miniProfileContainer.querySelector("#profile-name");
      profileNameElement.addEventListener("click", function () {
        navigateToProfile(this.innerText.trim());
      });

      const editProfileButton = miniProfileContainer.querySelector(
        ".edit-profile-button"
      );
      editProfileButton.addEventListener("click", function () {
        const userProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (userProfile && userProfile.name) {
          navigateToProfile(userProfile.name);
        }
      });

      displayUserProfile(miniProfileContainer);
    });
});

function navigateToProfile(profileName) {
  const profileUrl = `/profile/?profile=${encodeURIComponent(profileName)}`;
  window.location.href = profileUrl;
}
