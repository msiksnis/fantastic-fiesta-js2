import { API_BASE, API_POSTS, API_KEY } from "../constants.js";
import { displayError, displaySuccess } from "../utils/toasts.js";

const accessToken = localStorage.getItem("accessToken");

let currentPostIdToEdit = null;

export function setupEditPostListeners() {
  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-post-modal").classList.add("hidden");
  });

  document
    .getElementById("edit-post-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = document.getElementById("edit-post-title").value;
      const body = document.getElementById("edit-post-body").value;
      const tags = document
        .getElementById("edit-post-tags")
        .value.split(",")
        .map((tag) => tag.trim());
      const mediaUrl = document.getElementById("edit-post-media-url").value;
      const mediaAlt = document.getElementById("edit-post-media-alt").value;

      await updatePost(currentPostIdToEdit, {
        title,
        body,
        tags,
        media: { url: mediaUrl, alt: mediaAlt },
      });
    });
}

export function openEditModalWithPostData(postId, postData) {
  currentPostIdToEdit = postId;
  document.getElementById("edit-post-title").value = postData.title;
  document.getElementById("edit-post-body").value = postData.body;
  document.getElementById("edit-post-tags").value = postData.tags.join(", ");
  document.getElementById("edit-post-media-url").value = postData.media.url;
  document.getElementById("edit-post-media-alt").value = postData.media.alt;

  document.getElementById("edit-post-modal").classList.remove("hidden");
}

async function updatePost(id, postData) {
  if (!id) return;
  try {
    const response = await fetch(`${API_BASE}${API_POSTS}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) throw new Error("Failed to update post");

    console.log("Post updated successfully");
    displaySuccess("Post updated successfully!");
    document.getElementById("edit-post-modal").classList.add("hidden");
    window.location.reload();
  } catch (error) {
    console.error("Error updating post:", error);
    displayError("Failed to update post. Please try again.");
  }
}
