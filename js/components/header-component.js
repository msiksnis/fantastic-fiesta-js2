import { displayUserProfile, logoutUser } from "../profile-data.js";

document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/header-component.html")
    .then((response) => response.text())
    .then((data) => {
      const headerContainer = document.getElementById("header-container");
      headerContainer.innerHTML = data;
      displayUserProfile(headerContainer);
      setActiveLink();
      addProfileToggle();
      logout();
    });
});

function setActiveLink() {
  const icons = document.querySelectorAll(".active-icon");
  icons.forEach((icon) => {
    const parentLink = icon.parentElement;
    if (parentLink && parentLink.href === window.location.href) {
      icon.classList.remove("hidden");
    } else {
      icon.classList.add("hidden");
    }
  });
}
function addProfileToggle() {
  const profileContainer = document.getElementById("profile-container");
  const logoutText = document.getElementById("log-out-text");

  profileContainer.addEventListener("click", () => {
    profileContainer.classList.toggle("w-32");
    profileContainer.classList.toggle("w-8");
    logoutText.classList.toggle("group-hover:flex");
  });

  logoutText.addEventListener("click", () => {
    logoutUser();
    window.location.href = "/";
  });
}

function logout() {
  const logoutText = document.querySelector(".log-out-text");

  logoutText.addEventListener("click", () => {
    logoutUser();
    window.location.href = "/";
  });
}
