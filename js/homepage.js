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

    const reactionsHtml = generateReactionsHtml(post.reactions); // Ensure you have reactions data in your post object
    const reactionsDisplay = bragClone.querySelector(".reactions-display");
    if (reactionsDisplay) {
      reactionsDisplay.innerHTML = reactionsHtml;
    }

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

    availableReactions
      .querySelectorAll(".reaction-option")
      .forEach((option) => {
        option.addEventListener("click", async () => {
          const reactionSymbol = option.dataset.symbol;

          const postId = post.id;
          // Checks if this reaction already exists in the DOM
          let existingReactionElement = reactionsDisplay.querySelector(
            `[data-symbol="${reactionSymbol}"]`
          );

          if (!existingReactionElement) {
            // If the reaction doesn't exist, creates a new element for it
            const newReactionElement = document.createElement("span");
            newReactionElement.className =
              "reaction bg-gray-100 px-2 py-0.5 rounded-2xl flex items-center justify-center cursor-pointer";
            newReactionElement.setAttribute("data-symbol", reactionSymbol);
            newReactionElement.setAttribute("data-count", "1");
            newReactionElement.innerHTML = `${reactionSymbol} <span class="reaction-count">1</span>`;
            reactionsDisplay.appendChild(newReactionElement);

            existingReactionElement = newReactionElement;
          } else {
            // If the reaction exists, update its count
            const currentCount = parseInt(
              existingReactionElement.getAttribute("data-count"),
              10
            );
            const newCount = currentCount + 1;
            existingReactionElement.setAttribute(
              "data-count",
              newCount.toString()
            );
            existingReactionElement.querySelector(
              ".reaction-count"
            ).textContent = newCount.toString();
          }

          // When UI is updated, it will attempt to toggle the reaction on the backend
          try {
            await togglePostReaction(postId, reactionSymbol);
          } catch (error) {
            console.error("Error toggling reaction:", error);
          }
        });
      });

    const reactionElements = bragClone.querySelectorAll(".reaction");
    reactionElements.forEach((reactionElement) => {
      reactionElement.addEventListener("click", async () => {
        const reactionSymbol = reactionElement.dataset.symbol;

        const postId = post.id;
        const currentUser = JSON.parse(
          localStorage.getItem("userProfile")
        ).name;
        const reactionIndex = post.reactions.findIndex(
          (r) => r.symbol === reactionSymbol
        );

        let hasReacted = false;
        let currentCount = parseInt(reactionElement.dataset.count, 10) || 0;

        if (reactionIndex !== -1) {
          hasReacted =
            post.reactions[reactionIndex].reactors.includes(currentUser);
        }

        // Checks if the user has already reacted with the same symbol
        const newCount = hasReacted ? currentCount - 1 : currentCount + 1;

        // Optimistic uodate
        reactionElement.dataset.count = newCount;

        if (hasReacted && newCount === 0) {
          reactionElement.style.display = "none"; // Hides the reaction if the count is 0
        } else {
          reactionElement.style.display = ""; // Shows the reaction if the count is greater than 0
        }

        try {
          await togglePostReaction(postId, reactionSymbol);
        } catch (error) {
          console.error("Error toggling reaction:", error);
          // Reverts the optimistic UI update in case of an error
          reactionElement.dataset.count = currentCount;

          reactionElement.style.display = currentCount > 0 ? "" : "none";
        }
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

function generateReactionsHtml(reactions) {
  return reactions
    .map(
      (reaction) => `
    <span class="reaction bg-gray-100 px-2 py-0.5 rounded-2xl flex justify-center items-center cursor-pointer" data-symbol="${reaction.symbol}" data-count="${reaction.count}">
      ${reaction.symbol} <span class="reaction-count flex ml-2 text-xs/6">${reaction.count}</span>
    </span>
  `
    )
    .join("");
}
