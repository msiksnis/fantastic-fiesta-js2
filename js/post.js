// /js/post.js
import { API_BASE, API_POSTS, API_KEY } from "./constants.js";

const accessToken = localStorage.getItem("accessToken");

document.addEventListener("DOMContentLoaded", () => {
  let queryParams = new URLSearchParams(window.location.search);
  let id = queryParams.get("id");
  if (id) {
    fetchAndDisplayPost(id);
  }
});

async function fetchAndDisplayPost(id) {
  const API_URL = `${API_BASE}${API_POSTS}/${id}`;
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    const postData = await response.json();
    displayPost(postData);
  } catch (error) {
    console.error("Error fetching post:", error);
  }
}

function displayPost(postData) {
  const container = document.getElementById("single-post-container");
  const template = document
    .getElementById("single-post-template")
    .content.cloneNode(true);

  // Update the placeholders with actual post data
  template.querySelector("#single-post-title").textContent =
    postData.data.title;
  // Populate other details similarly, e.g., body, comments, etc.

  // Clear previous content (if any) and append the new post details
  container.innerHTML = ""; // Clear the container if you expect only one post to be displayed at a time
  container.appendChild(template);
}
