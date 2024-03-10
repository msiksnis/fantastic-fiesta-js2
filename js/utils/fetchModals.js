import { setupDeletePostListeners } from "../components/delete-post.js";
import { setupEditPostListeners } from "../components/edit-post.js";
import { initializeSearch } from "../components/search.js";

export function fetchConfirmationModal() {
  fetch("../../components/confirmation-modal.html")
    .then((response) => response.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      setupDeletePostListeners();
    })
    .catch((error) =>
      console.error("Failed to load the confirmation modal", error)
    );
}

export function fetchEditPostModal() {
  fetch("../components/edit-post-modal.html")
    .then((response) => response.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      setupEditPostListeners();
    })
    .catch((error) =>
      console.error("Failed to load the edit post modal", error)
    );
}

export async function fetchSearchModal() {
  try {
    const response = await fetch("../../components/search-modal.html");
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);
    toggleSearchModal();
    initializeSearch();
  } catch (error) {
    console.error("Failed to load the search modal", error);
  }
}

function toggleSearchModal() {
  const searchIcon = document.getElementById("search-icon");
  const searchModal = document.getElementById("search-modal");
  const closeSearch = document.getElementById("close-search-modal");
  const searchInput = document.getElementById("search-input");

  // Toggles modal when search icon clicked
  if (searchIcon && searchModal) {
    searchIcon.addEventListener("click", () => {
      searchModal.classList.toggle("hidden");
      if (!searchModal.classList.contains("hidden")) {
        searchInput.focus();
      }
    });
  }

  // Closes modal when close button clicked
  if (closeSearch) {
    closeSearch.addEventListener("click", () => {
      searchModal.classList.add("hidden");
    });
  }

  // Closes modal when escape key pressed
  document.addEventListener("keydown", (event) => {
    if (!searchModal.classList.contains("hidden") && event.key === "Escape") {
      searchModal.classList.add("hidden");
    }
  });
}
