import { API_BASE, API_KEY, API_POSTS } from "../constants.js";
import { displaySuccess } from "./toasts.js";

const accessToken = localStorage.getItem("accessToken");

// This function formats the date to show how long ago it was posted
export function timeSince(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval + " year" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " month" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " day" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hour" + (interval > 1 ? "s" : "");
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minute" + (interval > 1 ? "s" : "");
  }
  return "Just now";
}

export function copyProfileUrlToClipboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const profileName = urlParams.get("profile");

  const profileUrl = `${
    window.location.origin
  }/profile/?profile=${encodeURIComponent(profileName)}`;
  navigator.clipboard
    .writeText(profileUrl)
    .then(() => {
      displaySuccess("Profile URL copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy profile URL.", err);
    });
}

export function copyPostUrlToClipboard(id) {
  const postUrl = `${window.location.origin}/post/?id=${encodeURIComponent(
    id
  )}`;
  navigator.clipboard
    .writeText(postUrl)
    .then(() => {
      displaySuccess("Post URL copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy post URL.", err);
    });
}

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

export async function togglePostReaction(postId) {
  const symbol = "🎉";

  try {
    const response = await fetch(
      `${API_BASE}${API_POSTS}/${postId}/react/${encodeURIComponent(symbol)}`,
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
  } catch (error) {
    console.error("Error toggling reaction:", error);
  }
}
