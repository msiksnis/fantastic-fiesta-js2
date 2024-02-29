import { timeSince } from "../js/utils/helper-functions.js";
import { displayError } from "./utils/toasts.js";
import { API_BASE, API_POSTS, API_KEY, API_PARAMS } from "./constants.js";
import {
  fetchConfirmationModal,
  // fetchViewPostModal,
} from "./utils/fetchModals.js";
// import { openEditModalWithPostData } from "./components/edit-post.js";
// import { confirmDeletePost } from "./components/delete-post.js";
// import { openViewPostModalWithPostData } from "./components/view-post.js";

const accessToken = localStorage.getItem("accessToken");

document.addEventListener("DOMContentLoaded", function () {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));

  const profileAvatarElement = document.getElementById("profile-avatar");

  if (profileAvatarElement && userProfile.avatar) {
    profileAvatarElement.src = userProfile.avatar.url;
    profileAvatarElement.alt = userProfile.avatar.alt || "User avatar";
  }

  fetchPosts();
  // fetchViewPostModal();
  fetchConfirmationModal();
});

async function fetchPosts() {
  if (!accessToken) {
    console.log("No access token found. Please login.");
    window.location.href = "/sign-in";
    return;
  }

  try {
    const response = await fetch(API_BASE + API_POSTS + API_PARAMS, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const { data } = await response.json();
    displayPosts(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    displayError("Could not fetch the posts. Please try again.");
  }
}

function displayPosts(posts) {
  const bragsContainer = document.getElementById("brags-container");
  const bragTemplate = document.getElementById("brag-template").content;

  bragsContainer.innerHTML = "";

  posts.forEach((post) => {
    const bragClone = document.importNode(bragTemplate, true);

    // const deleteButton = postClone.querySelector("#view-post-delete-button");
    // if (post.author.name === currentUser.name) {
    //   deleteButton.classList.remove("hidden");
    //   deleteButton.addEventListener("click", () => confirmDeletePost(post.id));
    // }

    // const editButton = postClone.querySelector("#view-post-edit-button");
    // if (post.author.name === currentUser.name) {
    //   editButton.classList.remove("hidden");
    //   editButton.addEventListener("click", () =>
    //     openEditModalWithPostData(post.id, post)
    //   );
    // }

    // const viewPost = postClone.querySelector("#view-post");
    // viewPost.addEventListener("click", () =>
    //   openViewPostModalWithPostData(post)
    // );

    const authorAvatar = bragClone.querySelector("#brag-author-avatar");
    const authorName = bragClone.querySelector("#brag-author-name");
    const authorContainer = bragClone.querySelector("#brag-author");

    authorAvatar.src = post.author.avatar.url;
    authorAvatar.alt = `${post.author.name}'s avatar`;
    authorName.textContent = post.author.name;

    authorContainer.addEventListener("click", () => {
      window.location.href = `/profile/?profile=${encodeURIComponent(
        post.author.name
      )}`;
    });

    bragClone.querySelector("#brag-title").textContent = post.title;
    bragClone.querySelector("#brag-body").textContent = post.body;
    bragClone.querySelector("#brag-date").textContent = timeSince(
      new Date(post.created)
    );
    bragClone.querySelector("#brag-tags").textContent = post.tags.join(", ");

    if (post.media && post.media.url) {
      const bragMedia = bragClone.querySelector("#brag-media");
      bragMedia.src = post.media.url;
      bragMedia.alt = "Brag media";
      bragMedia.style.display = "block";
    }

    bragsContainer.appendChild(bragClone);
  });
}
