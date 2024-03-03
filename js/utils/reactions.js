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
    // Optionally, update the UI to reflect the new reaction count
  } catch (error) {
    console.error("Error toggling reaction:", error);
  }
}

export function attachToggleListener(postId) {
  const chooseReactionIcon = document.querySelector("#choose-reaction");
  const availableReactions = document.querySelector("#available-reactions");

  if (chooseReactionIcon && availableReactions) {
    chooseReactionIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      availableReactions.classList.toggle("opacity-0");
      availableReactions.classList.toggle("bottom-14");
      availableReactions.classList.toggle("bottom-16");
    });
  }

  document
    .querySelectorAll("#available-reactions .reaction")
    .forEach((icon) => {
      icon.addEventListener("click", function () {
        const reactionSymbol = this.textContent.trim();

        togglePostReaction(postId, reactionSymbol);

        availableReactions.classList.remove("opacity-100");
        availableReactions.classList.remove("bottom-16");
        availableReactions.classList.add("opacity-0");
        availableReactions.classList.add("bottom-14");
      });
    });

  document.addEventListener("click", function (event) {
    if (
      !chooseReactionIcon.contains(event.target) &&
      !availableReactions.contains(event.target)
    ) {
      availableReactions.classList.remove("opacity-100");
      availableReactions.classList.remove("bottom-16");
      availableReactions.classList.add("opacity-0");
      availableReactions.classList.add("bottom-14");
    }
  });
}
