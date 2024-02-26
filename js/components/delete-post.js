import { API_BASE, API_POSTS, API_KEY } from "../constants.js";

const accessToken = localStorage.getItem("accessToken");

let currentPostIdToDelete = null;

export function setupDeletePostListeners() {
  document.getElementById("cancel-delete").addEventListener("click", () => {
    document.getElementById("confirm-delete-modal").classList.add("hidden");
  });

  document.getElementById("confirm-delete").addEventListener("click", () => {
    deletePost(currentPostIdToDelete);
  });
}

export function confirmDeletePost(id) {
  currentPostIdToDelete = id;
  document.getElementById("confirm-delete-modal").classList.remove("hidden");
}

async function deletePost(id) {
  if (!id) return;
  try {
    const response = await fetch(`${API_BASE}${API_POSTS}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) throw new Error("Failed to delete post");

    console.log("Post deleted successfully");
    document.getElementById("confirm-delete-modal").classList.add("hidden");
    // Refresh or manually remove the post element from the DOM
  } catch (error) {
    console.error("Error deleting post:", error);
    // Show an error message to the user if needed
  }
}
