// homepage.js

import {
  copyPostUrlToClipboard,
  timeSince,
} from "../js/utils/helper-functions.js";

import { togglePostReaction } from "./utils/reactions.js";
import { initializeTabs } from "./utils/filtering.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));

  const profileAvatarElement = document.getElementById("profile-avatar");

  if (profileAvatarElement && userProfile.avatar) {
    profileAvatarElement.src = userProfile.avatar.url;
    profileAvatarElement.alt = userProfile.avatar.alt || "User avatar";
  }

  initializeTabs();

  document
    .getElementById("brags-container")
    .addEventListener("click", async function (event) {
      if (event.target.classList.contains("celebrate-button")) {
        event.preventDefault();

        // Correctly retrieve postId from the dataset of the clicked button
        const postId = event.target.dataset.postId;
        const symbol = "🎉"; // The emoji or symbol you want to use for the reaction

        try {
          // Call the function to toggle reaction and handle the response
          const data = await togglePostReaction(postId, symbol, accessToken);
          console.log("Reaction toggled successfully:", data);
          // Optionally trigger confetti or update UI based on 'data.reactions'
        } catch (error) {
          console.error("Error toggling reaction:", error);
          // Handle any errors, such as showing an error message
        }
      }
    });
});

export function displayPosts(posts) {
  const bragsContainer = document.getElementById("brags-container");
  const bragTemplate = document.getElementById("brag-template").content;

  bragsContainer.innerHTML = "";

  posts.forEach((post) => {
    const bragClone = document.importNode(bragTemplate, true);

    const authorAvatar = bragClone.querySelector("#brag-author-avatar");
    const authorName = bragClone.querySelector("#brag-author-name");
    const authorContainer = bragClone.querySelector("#brag-author");
    const shareIcon = bragClone.querySelector(".brag-share");
    if (shareIcon) {
      shareIcon.dataset.postId = post.id;
      shareIcon.addEventListener("click", function (event) {
        const postId = event.currentTarget.dataset.postId;
        copyPostUrlToClipboard(postId);
      });
    }

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
    bragClone.querySelector("#brag-reactions").textContent =
      post._count.reactions;
    bragClone.querySelector("#brag-comments").textContent =
      post._count.comments;
    bragClone.querySelector("#brag-date").textContent = timeSince(
      new Date(post.created)
    );
    const formattedTags =
      post.tags.length > 1
        ? post.tags
            .map((tag) => `#${tag.replace(/\s+/g, "").toLowerCase()}`)
            .join(" ")
        : "";
    bragClone.querySelector("#brag-tags").textContent = formattedTags;

    if (post.media && post.media.url) {
      const bragMedia = bragClone.querySelector("#brag-media");
      bragMedia.src = post.media.url;
      bragMedia.alt = "Brag media";
      bragMedia.style.display = "block";
    }

    // To view the single post with a query parameter
    const viewPostLink = bragClone.querySelector("#view-single-post");
    viewPostLink.href = `/post/?id=${post.id}`;

    const celebrateButton = bragClone.querySelector(".celebrate-button");
    celebrateButton.dataset.postId = post.id.toString();

    bragsContainer.appendChild(bragClone);
  });
}
