// import { displayError } from "../utils/toasts.js";
// import { API_BASE, API_POSTS } from "../constants.js";

// const accessToken = localStorage.getItem("accessToken");

// let currentPostIdToView = null;

// async function fetchPostById(id) {
//   if (!id) return;
//   try {
//     const response = await fetch(`${API_BASE}${API_POSTS}/${id}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "X-Noroff-API-Key": API_KEY,
//       },
//     });
//     if (!response.ok) {
//       throw new Error("Failed to fetch post");
//     }
//     const { data } = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Failed to fetch post:", error);
//     displayError("Failed to fetch post. Please try again.");
//     return null;
//   }
// }

// export function setupViewPostListeners() {
//   document
//     .getElementById("close-view-post-modal")
//     .addEventListener("click", () => {
//       document.getElementById("view-post-modal").classList.add("hidden");
//     });
// }

// export async function openViewPostModalWithPostId(id) {
//   try {
//     const postData = await fetchPostById(id);
//     openViewPostModalWithPostId(postData);
//   } catch (error) {
//     console.error("Error fetching post data:", error);
//     displayError("Failed to fetch post. Please try again.");
//   }
// }

// export function openViewPostModalWithPostData(postData) {
//   currentPostIdToView = postData.id;

//   // Set avatar and name if available
//   document.getElementById("view-post-author-avatar").src =
//     postData.author.avatar || "path/to/default/avatar.png";
//   document.getElementById("view-post-author-avatar").alt =
//     postData.author.name + "'s Avatar";
//   document.getElementById("view-post-author-name").textContent =
//     postData.author.name;

//   document.getElementById("view-post-title").textContent = postData.title;
//   document.getElementById("view-post-date").textContent = new Date(
//     postData.createdAt
//   ).toLocaleDateString(); // Format date as needed
//   document.getElementById("view-post-body").textContent = postData.body;
//   document.getElementById("view-post-tags").textContent =
//     postData.tags.join(", ");

//   if (postData.media && postData.media.url) {
//     const mediaElement = document.getElementById("view-post-media");
//     mediaElement.src = postData.media.url;
//     mediaElement.alt = postData.media.alt;
//     mediaElement.classList.remove("hidden");
//   }

//   document.getElementById("view-post-modal").classList.remove("hidden");
// }
