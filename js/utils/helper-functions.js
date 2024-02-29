import { displaySuccess } from "./toasts.js";

// This function formats the date to show how long ago it was posted
export function timeSince(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
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
