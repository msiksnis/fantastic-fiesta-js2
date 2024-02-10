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

document.addEventListener("DOMContentLoaded", function () {
  fetch("../../components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;
      setActiveLink();
    });
});
