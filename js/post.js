// /js/post.js
import { API_BASE, API_POSTS, API_KEY, API_PARAMS } from "./constants.js";
import { copyPostUrlToClipboard, timeSince } from "./utils/helper-functions.js";
import {
  attachToggleListener,
  handleExistingReactionClick,
} from "./utils/reactions.js";

const accessToken = localStorage.getItem("accessToken");

document.addEventListener("DOMContentLoaded", () => {
  let queryParams = new URLSearchParams(window.location.search);
  let id = queryParams.get("id");
  if (id) {
    fetchAndDisplayPost(id);
  }
});

async function fetchAndDisplayPost(id) {
  const API_URL = `${API_BASE}${API_POSTS}/${id}/${API_PARAMS}`;
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    const { data } = await response.json();
    console.log("Post fetched successfully:", data);
    displayPost(data);
  } catch (error) {
    console.error("Error fetching post:", error);
  }
}

function displayPost(data) {
  const container = document.getElementById("brag-container");
  const templateScript = document.getElementById("brag-template");

  if (!templateScript) {
    console.error("Main post template not found");
    return;
  }

  const template = document.importNode(templateScript.content, true);

  container.innerHTML = "";

  const authorAvatar = template.getElementById("brag-author-avatar");
  const authorName = template.getElementById("brag-author-name");
  const authorContainer = template.getElementById("brag-author");
  const shareIcon = template.querySelector(".brag-share");
  if (shareIcon) {
    shareIcon.dataset.id = data.id;
    shareIcon.addEventListener("click", function (event) {
      const id = event.currentTarget.dataset.id;
      copyPostUrlToClipboard(id);
    });
  }

  authorAvatar.src = data.author.avatar.url;
  authorAvatar.alt = `${data.author.name}'s avatar`;
  authorName.textContent = data.author.name;

  authorContainer.addEventListener("click", () => {
    window.location.href = `/profile/?profile=${encodeURIComponent(
      data.author.name
    )}`;
  });

  template.getElementById("brag-title").textContent = data.title;
  template.getElementById("brag-body").textContent = data.body;
  template.getElementById("brag-comments").textContent = data._count.comments;
  template.getElementById("brag-date").textContent = timeSince(
    new Date(data.created)
  );

  const formattedTags =
    data.tags.length > 1
      ? data.tags
          .map((tag) => `#${tag.replace(/\s+/g, "").toLowerCase()}`)
          .join(" ")
      : "";
  template.getElementById("brag-tags").textContent = formattedTags;

  if (data.media && data.media.url) {
    const bragMedia = template.querySelector("#brag-media");
    bragMedia.src = data.media.url;
    bragMedia.alt = "Brag media";
    bragMedia.style.display = "block";
  }

  const reactionsContainer = template.querySelector("#reactions-container");
  data.reactions.forEach((reaction) => {
    const reactionEl = document.createElement("div");
    reactionEl.className =
      "reaction cursor-pointer bg-gray-100 px-2 py-0.5 rounded-2xl flex justify-center items-center";
    reactionEl.innerHTML = `${reaction.symbol} <div class="flex ml-2 text-xs/6">${reaction.count}</div>`;
    reactionsContainer.appendChild(reactionEl);
  });

  container.appendChild(template);

  attachToggleListener(data.id);
  handleExistingReactionClick(data.id);
}
