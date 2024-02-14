document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;
      setActiveLink();
      logout();
      displayUserProfile();
      addProfileToggle();
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
    profileContainer.classList.toggle("w-1/3");
    logoutText.classList.toggle("group-hover:flex");

    logoutText.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    });
  });
}

function logout() {
  const logoutTextDesktop = document.getElementById("log-out-text-desktop");

  logoutTextDesktop.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  });
}

function displayUserProfile() {
  const userProfileStr = localStorage.getItem("userProfile");
  if (userProfileStr) {
    const userProfile = JSON.parse(userProfileStr);
    const profileName = document.getElementById("profile-name");
    const profileImage = document.getElementById("profile-image");
    const mobileProfileImage = document.getElementById("mobile-profile-image");

    if (profileName) {
      profileName.textContent = userProfile.name;
    }

    if (profileImage && userProfile.avatar && userProfile.avatar.url) {
      profileImage.src = userProfile.avatar.url;
      profileImage.alt = userProfile.avatar.alt;
    }

    if (mobileProfileImage && userProfile.avatar && userProfile.avatar.url) {
      mobileProfileImage.src = userProfile.avatar.url;
      mobileProfileImage.alt = userProfile.avatar.alt;
    }
  }
}

displayUserProfile();
