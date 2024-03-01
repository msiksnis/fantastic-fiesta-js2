import { displaySuccess } from "./toasts.js";

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
  const postUrl = `${window.location.origin}/social/posts/${encodeURIComponent(
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
