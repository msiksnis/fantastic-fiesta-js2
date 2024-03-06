// homepage.js

import {
  copyPostUrlToClipboard,
  timeSince,
} from "../js/utils/helper-functions.js";

import {
  handleExistingReactionClick,
  togglePostReaction,
  triggerConfetti,
} from "./utils/reactions.js";
import { initializeTabs } from "./utils/filtering.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));

  const profileAvatarElement = document.getElementById("profile-avatar");

  if (profileAvatarElement && userProfile.avatar) {
    profileAvatarElement.src = userProfile.avatar.url;
    profileAvatarElement.alt = userProfile.avatar.alt || "User avatar";
  }

  initializeTabs();
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

    const reactionsDisplay = bragClone.querySelector(".reactions-display");
    reactionsDisplay.innerHTML = generateReactionsHtml(post.reactions);

    bragsContainer.appendChild(bragClone);
  });
  attachToggleListenerForHomepage();
}

function attachToggleListenerForHomepage() {
  document.querySelectorAll(".post").forEach((postElement) => {
    const postId = postElement.getAttribute("data-post-id");
    const reactionPanelBtn = postElement.querySelector(
      ".open-reaction-panel-btn"
    );
    const availableReactions = postElement.querySelector(
      ".available-reactions"
    );

    reactionPanelBtn.addEventListener("click", () => {
      availableReactions.classList.toggle("hidden");
    });

    availableReactions
      .querySelectorAll(".reaction-option")
      .forEach((option) => {
        option.addEventListener("click", async () => {
          const symbol = option.textContent.trim();
          await togglePostReaction(postId, symbol);
          // Optionally: Update UI optimistically here
          availableReactions.classList.add("hidden");
          // Optionally: Refresh reactions display for this post
        });
      });
  });
}

function generateReactionsHtml(reactions) {
  let html = "";
  reactions.forEach((reaction) => {
    html += `
      <div class="reaction cursor-pointer bg-gray-100 px-2 py-0.5 rounded-2xl flex items-center justify-center">
        ${reaction.symbol} <span class="ml-2 text-xs">${reaction.count}</span>
      </div>
    `;
  });
  return html;
}
