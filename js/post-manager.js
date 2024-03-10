import { API_BASE, API_KEY, API_PARAMS, API_PROFILES } from "./constants.js";
import { displayError } from "./utils/toasts.js";
import { confirmDeletePost } from "./components/delete-post.js";
import { openEditModalWithPostData } from "./components/edit-post.js";
import { timeSince } from "./utils/helper-functions.js";

const BASE_PROFILE_URL = `${API_BASE}${API_PROFILES}/`;
const accessToken = localStorage.getItem("accessToken");

const loader = document.querySelector(".loader");

function toggleLoader(show) {
  loader.style.display = show ? "block" : "none";
}

export async function fetchUserPosts(userName) {
  const postsAPIURL = `${BASE_PROFILE_URL}${userName}/posts${API_PARAMS}`;
  toggleLoader(true);
  try {
    const response = await fetch(postsAPIURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }

    const { data } = await response.json();
    displayUserPosts(data);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    displayError("Could not fetch user posts");
  } finally {
    toggleLoader(false);
  }
}

export function displayUserPosts(posts) {
  const postsContainer = document.getElementById(
    "dynamic-profile-posts-container"
  );

  const postTemplate = document.getElementById("post-template").content;
  const currentUser = JSON.parse(localStorage.getItem("userProfile"));

  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postClone = document.importNode(postTemplate, true);

    const deleteButton = postClone.querySelector("#delete-post");
    if (post.author.name === currentUser.name) {
      deleteButton.classList.remove("hidden");
      deleteButton.addEventListener("click", () => confirmDeletePost(post.id));
    }

    const editButton = postClone.querySelector("#edit-post");
    if (post.author.name === currentUser.name) {
      editButton.classList.remove("hidden");
      editButton.addEventListener("click", () =>
        openEditModalWithPostData(post.id, post)
      );
    }

    const postAuthor = postClone.querySelector("#post-author-name");
    if (post.author) {
      postAuthor.textContent = post.author.name;
      postAuthor.href = `profile.html?profile=${post.author.name}`;
    }
    const postAuthorAvatar = postClone.querySelector("#post-author-avatar");
    if (post.author && post.author.avatar && post.author.avatar.url) {
      postAuthorAvatar.src = post.author.avatar.url;
      postAuthorAvatar.alt = post.author.avatar.alt || "Author avatar";
    } else {
      postAuthorAvatar.remove();
    }

    postClone.querySelector("#post-title").textContent = post.title;
    postClone.querySelector("#post-body").textContent = post.body;

    const postMedia = postClone.querySelector("#post-media");
    if (post.media && post.media.url) {
      postMedia.src = post.media.url;
      postMedia.alt = post.media.alt || "Post image";
      postMedia.style.display = "block";
    } else {
      postMedia.remove();
    }

    const formattedTags =
      post.tags.length > 1
        ? post.tags
            .map((tag) => `#${tag.replace(/\s+/g, "").toLowerCase()}`)
            .join(" ")
        : "";

    postClone.querySelector("#post-tags").textContent = formattedTags;
    postClone.querySelector("#post-date").textContent = timeSince(post.created);

    // To view the single post with a query parameter
    const viewPostLink = postClone.querySelector("#view-single-post");
    viewPostLink.href = `/post/?id=${post.id}`;

    postsContainer.appendChild(postClone);
  });

  // Masonry layout for the posts
  imagesLoaded(postsContainer, function () {
    window.masonryInstance = new Masonry(postsContainer, {
      itemSelector: ".grid-item",
      gutter: 20,
    });
  });
}
