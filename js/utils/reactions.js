// utils/reactions.js

import { API_BASE, API_KEY, API_POSTS } from "../constants.js";

const accessToken = localStorage.getItem("accessToken");

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

    if (!response.ok) {
      console.error(
        `Failed to toggle reaction: ${response.status} ${response.statusText}`
      );
      return;
    }

    triggerConfetti();

    console.log("Reaction toggled successfully!");
  } catch (error) {
    console.error("Error toggling reaction:", error);
  }
}

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

export function attachToggleListener(postId) {
  const chooseReactionIcon = document.querySelector("#choose-reaction");
  const availableReactions = document.querySelector("#available-reactions");
  const reactionsContainer = document.querySelector("#reactions-container");

  if (chooseReactionIcon && availableReactions) {
    chooseReactionIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      availableReactions.classList.toggle("opacity-0");
      availableReactions.classList.toggle("bottom-14");
      availableReactions.classList.toggle("bottom-16");
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
      availableReactions.classList.add("bottom-14");
      availableReactions.classList.remove("opacity-100");
      availableReactions.classList.remove("bottom-16");
    });
  });

  // Close the reaction panel when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !chooseReactionIcon.contains(event.target) &&
      !availableReactions.contains(event.target)
    ) {
      availableReactions.classList.add("opacity-0");
      availableReactions.classList.add("bottom-14");
      availableReactions.classList.remove("opacity-100");
      availableReactions.classList.remove("bottom-16");
    }
  });
}
