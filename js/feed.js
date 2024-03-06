import { initializeTabs } from "./utils/filtering.js";
import { timeSince } from "./utils/helper-functions.js";

document.addEventListener("DOMContentLoaded", function () {
  initializeTabs();
});

export function displayPosts(posts) {
  const bragsContainer = document.getElementById("brags-container");
  const template = document.getElementById("post-template").content;

  bragsContainer.innerHTML = ""; // Clear previous posts

  posts.forEach((post) => {
    const clone = document.importNode(template, true);

    // Set dynamic values
    clone.querySelector(".author-avatar").src =
      post.author && post.author.avatar
        ? post.author.avatar.url
        : "defaultAvatarUrlHere";
    clone.querySelector(".author-name").textContent = post.author.name;
    clone.querySelector(".post-title").textContent = post.title;
    clone.querySelector(".post-tags").textContent = post.tags.join(", ");
    clone.querySelector(".post-body").textContent = post.body;

    const mediaElement = clone.querySelector(".post-media");
    if (post.media && post.media.url) {
      mediaElement.src = post.media.url;
      mediaElement.style.display = "";
    } else {
      mediaElement.remove(); // Remove if no media
    }

    // Optionally, handle reactions and other dynamic elements similarly

    bragsContainer.appendChild(clone);
  });
}

// export function displayPosts(posts) {
//   const bragsContainer = document.getElementById("brags-container");
//   const templateDiv = document.getElementById("brag-template");

//   if (!templateDiv) {
//     console.error("Template div not found");
//     return;
//   }

//   // Clear existing posts
//   bragsContainer.innerHTML = "";

//   posts.forEach((post) => {
//     const clone = templateDiv.cloneNode(true); // Deep clone the template
//     clone.id = ""; // Remove ID to avoid duplicate IDs
//     clone.style.display = ""; // Make sure the clone is visible

//     // Update clone with post information
//     clone.querySelector("#brag-author-avatar").src = post.author.avatar.url;
//     clone.querySelector("#brag-author-avatar").alt =
//       post.author.name + "'s Avatar";
//     clone.querySelector("#brag-author-name").textContent = post.author.name;
//     clone.querySelector("#brag-title").textContent = post.title;
//     clone.querySelector("#brag-body").textContent = post.body;

//     bragsContainer.appendChild(clone); // Append clone to container
//   });
// }
