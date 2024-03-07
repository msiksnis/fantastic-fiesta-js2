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

    // Event listener for reaction panel button for post
    const reactionPanelBtn = bragClone.querySelector(".choose-reaction");
    const availableReactions = bragClone.querySelector(".available-reactions");

    reactionPanelBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      console.log("Toggling reaction panel visibility");
      availableReactions.classList.toggle("opacity-0");
      availableReactions.classList.toggle("bottom-10");
      availableReactions.classList.toggle("bottom-12");
    });

    const reactionElements = bragClone.querySelectorAll(".reaction");
    reactionElements.forEach((reactionElement) => {
      reactionElement.addEventListener("click", () => {
        // Extracts reaction symbol from the element
        const reactionSymbol = reactionElement.dataset.symbol;
        const postId = post.id; // Extracts the postId  from the element

        // To toggle the reaction for postId and symbol
        togglePostReaction(postId, reactionSymbol).then(() => {
          // TODO: update UI
        });
        // Closes the reaction panel after selecting a reaction
        availableReactions.classList.add("opacity-0");
        availableReactions.classList.add("bottom-10");
        availableReactions.classList.remove("opacity-100");
        availableReactions.classList.remove("bottom-12");
      });
    });

    // Closes the reaction panel when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !reactionPanelBtn.contains(event.target) &&
        !availableReactions.contains(event.target)
      ) {
        availableReactions.classList.add("opacity-0");
        availableReactions.classList.add("bottom-10");
        availableReactions.classList.remove("opacity-100");
        availableReactions.classList.remove("bottom-12");
      }
    });

    bragsContainer.appendChild(bragClone);
  });
}
