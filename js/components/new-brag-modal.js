import { API_BASE, API_POSTS, API_KEY } from "../constants.js";

const accessToken = localStorage.getItem("accessToken");

document.addEventListener("DOMContentLoaded", function () {
  loadModal();
});

async function loadModal() {
  try {
    const modalHTML = await fetch("../../components/new-brag-modal.html").then(
      (response) => response.text()
    );
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    initializeNewBragModal();
  } catch (error) {
    console.error("Error loading modal:", error);
    // Optionally, handle this error in the UI.
  }
}

function initializeNewBragModal() {
  document
    .getElementById("open-new-brag-modal")
    .addEventListener("click", () => showModal(true));
  document
    .getElementById("close-modal")
    .addEventListener("click", () => showModal(false));
  window.addEventListener("click", (event) => {
    if (event.target.id === "new-brag-modal") showModal(false);
  });
  document
    .getElementById("new-brag-form")
    .addEventListener("submit", submitNewBragForm);
}

function showModal(show) {
  document.getElementById("new-brag-modal").classList.toggle("hidden", !show);
}

async function submitNewBragForm(e) {
  e.preventDefault();
  const title = document.getElementById("new-brag-title").value;
  const body = document.getElementById("new-brag-body").value;
  const tags = document
    .getElementById("new-brag-tags")
    .value.split(",")
    .map((tag) => tag.trim());
  const mediaUrl = document.getElementById("new-brag-media-url").value;
  const mediaAlt = document.getElementById("new-brag-media-alt").value;

  const postData = {
    title,
    body,
    tags,
    media: { url: mediaUrl, alt: mediaAlt },
  };

  try {
    const response = await fetch(API_BASE + API_POSTS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to post a new brag: ${
          errorData.message || JSON.stringify(errorData)
        }`
      );
    }

    const result = await response.json();
    console.log("New Brag Posted: ", result);
    document.getElementById("new-brag-modal").classList.add("hidden");
    // Optionally, refresh or update the UI here instead of reloading the page
    // window.location.reload();
  } catch (error) {
    console.error("Error posting new brag: ", error);
    // Show error message to user
  }
}
