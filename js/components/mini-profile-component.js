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
        const profileName = this.innerText.trim();
        const profileUrl = `/profile/?profile=${encodeURIComponent(
          profileName
        )}`;
        window.location.href = profileUrl;
      });

      displayUserProfile(miniProfileContainer);
    });
});
