import { API_BASE, API_POSTS, API_KEY } from "../constants.js";
import { displayError } from "../utils/toasts.js";

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
  const tagsInput = document.getElementById("new-brag-tags").value;
  const mediaUrl = document.getElementById("new-brag-media-url").value;
  const mediaAlt = document.getElementById("new-brag-media-alt").value;

  const postData = {
    title,
    media: {},
  };

  if (body) postData.body = body;

  if (tagsInput) {
    const tags = tagsInput.split(",").map((tag) => tag.trim());
    if (tags.length > 0) postData.tags = tags;
  }

  if (mediaUrl) postData.media.url = mediaUrl;
  if (mediaAlt) postData.media.alt = mediaAlt;

  // Removes media object if it's empty
  if (Object.keys(postData.media).length === 0) {
    delete postData.media;
  }

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
    window.location.reload();
  } catch (error) {
    console.error("Error posting new brag: ", error);
    displayError("Failed to post new brag. Please try again.");
  }
}
