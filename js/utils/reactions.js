// utils/reactions.js

import { API_BASE, API_KEY, API_POSTS } from "../constants.js";

const accessToken = localStorage.getItem("accessToken");

/**
 * Triggers a confetti animation on the screen.
 */
export function triggerConfetti() {
  console.log("Triggering confetti!");
  confetti({
    particleCount: 150,
    spread: 70,
    startVelocity: 90,
    decay: 0.9,
    shapes: ["square", "circle", "triangle", "line", "heart", "star"],
    origin: { y: 1 },
  });
}

/**
 * Toggles a reaction for a post. If the authenticated user has already reacted with the provided symbol, the reaction is removed; otherwise, it's added.
 *
 * @param {number} postId - The ID of the post to react to.
 * @param {string} reactionSymbol - The symbol (emoji) of the reaction.
 * @returns {Promise<object>} The response data including the postId, the reaction symbol, and an array of all reactions with reactors on the post.
 * @example
 * ```js
 * // Assuming a post with ID 123 exists and you want to react with a "thumbs up" emoji
 * togglePostReaction(123, '👍').then(response => {
 *   console.log(response);
 *   // Expected response: { postId: 123, symbol: '👍', reactions: [...]}
 * });
 * ```
 */
export async function togglePostReaction(postId, reactionSymbol) {
  const encodedSymbol = encodeURIComponent(reactionSymbol);

  try {
    const response = await fetch(
      `${API_BASE}${API_POSTS}/${postId}/react/${encodedSymbol}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle reaction");
    }

    triggerConfetti();
    const data = await response.json();

    console.log("Reaction toggled successfully!");
    return data;
  } catch (error) {
    console.error("Error toggling reaction:", error);
  }
}

/**
 * Updates the UI to reflect the addition or removal of a reaction to a post.
 *
 * @param {number} postId - The ID of the post being reacted to.
 * @param {string} reactionSymbol - The symbol (emoji) of the reaction.
 * @param {boolean} isOptimistic - Indicates whether the UI update is optimistic (before server confirmation).
 */
export function updateReactionUI(postId, reactionSymbol, isOptimistic = true) {
  const reactionsContainer = document.querySelector(`#reactions-container`);

  if (!reactionsContainer) {
    console.error(`Reactions container not found for post ID: ${postId}`);
    return;
  }

  let reactionElement = reactionsContainer.querySelector(
    `.reaction[data-symbol="${reactionSymbol}"]`
  );

  if (!reactionElement && isOptimistic) {
    reactionElement = document.createElement("div");
    reactionElement.className =
      "reaction bg-gray-100 px-2 py-0.5 rounded-2xl flex justify-center items-center cursor-pointer";
    reactionElement.dataset.symbol = reactionSymbol;
    reactionElement.innerHTML = `${reactionSymbol} <span class="count flex ml-2 text-xs/6">1</span>`;
    reactionsContainer.prepend(reactionElement);
  } else if (reactionElement) {
    // Updates the count if the reaction exists
    const reactionCountElement = reactionElement.querySelector(".count");
    const currentCount = parseInt(reactionCountElement.textContent, 10);
    reactionCountElement.textContent = isOptimistic
      ? currentCount + 1
      : Math.max(0, currentCount - 1);
  }
}

/**
 * Attaches a click listener to the reactions container to handle reaction selection from the available reactions panel.
 *
 * @param {number} postId - The ID of the post for which to attach the reaction toggle listener.
 */
export function attachToggleListener(postId) {
  const chooseReactionIcon = document.querySelector(".choose-reaction");
  const availableReactions = document.querySelector("#available-reactions");
  const reactionsContainer = document.querySelector("#reactions-container");

  if (chooseReactionIcon && availableReactions) {
    chooseReactionIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      console.log("Toggling reaction panel visibility");
      availableReactions.classList.toggle("opacity-0");
      availableReactions.classList.toggle("bottom-10");
      availableReactions.classList.toggle("bottom-12");
    });
  }

  availableReactions.querySelectorAll(".reaction").forEach((icon) => {
    icon.addEventListener("click", function () {
      const reactionSymbol = this.textContent.trim();

      // Call the function to toggle the reaction on the server
      togglePostReaction(postId, reactionSymbol)
        .then(() => {
          // If the reaction toggle is successful, update the UI
          updateReactionUI(reactionsContainer, reactionSymbol);
          triggerConfetti();
        })
        .catch((error) => {
          console.error("Error toggling reaction:", error);
        });

      // Close the reaction panel after selecting a reaction
      availableReactions.classList.add("opacity-0");
      availableReactions.classList.add("bottom-10");
      availableReactions.classList.remove("opacity-100");
      availableReactions.classList.remove("bottom-12");
    });
  });

  // Close the reaction panel when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !chooseReactionIcon.contains(event.target) &&
      !availableReactions.contains(event.target)
    ) {
      availableReactions.classList.add("opacity-0");
      availableReactions.classList.add("bottom-10");
      availableReactions.classList.remove("opacity-100");
      availableReactions.classList.remove("bottom-12");
    }
  });
}

/**
 * Handles clicks on existing reaction icons, toggling the reaction on the post and updating the UI accordingly.
 *
 * @param {number} postId - The ID of the post for which to handle reaction clicks.
 */
export function handleExistingReactionClick(postId) {
  const reactionsContainer = document.querySelector(`#reactions-container`);
  if (!reactionsContainer) {
    console.error(`Reactions container not found for post ID: ${postId}`);
    return;
  }

  reactionsContainer.addEventListener("click", function (event) {
    const reactionElement = event.target.closest(".reaction");
    if (!reactionElement) return;

    // This regex is to match emojis
    const emojiMatch = reactionElement.textContent.match(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u
    );
    const reactionSymbol = emojiMatch ? emojiMatch[0] : null;

    togglePostReaction(postId, reactionSymbol)
      .then(() => {
        updateReactionUI(
          postId,
          reactionSymbol,
          !reactionElement.classList.contains("reacted")
        );
      })
      .catch((error) => {
        console.error("Error toggling reaction:", error);
      });
  });
}
