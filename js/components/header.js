document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;
      setActiveLink();
      logout();
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
