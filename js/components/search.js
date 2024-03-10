import { API_BASE, API_KEY, API_POSTS, API_PROFILES } from "../constants.js";
import { displayError } from "../utils/toasts.js";

const accessToken = localStorage.getItem("accessToken");
const searchForm = document.querySelector("#search-form");

/**
 * Prevent form submission
 */
if (searchForm) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form submission prevented.");
  });
}

/**
 * Fetch search results for posts and profiles.
 * @param {string} query
 * @returns {Promise<void>}
 * @description This function fetches search results for posts and profiles using the provided query.
 */
async function fetchSearchResults(query) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Noroff-API-Key": API_KEY,
  };

  try {
    // Fetching posts
    const postsResponse = await fetch(
      `${API_BASE}${API_POSTS}/search?q=${query}`,
      { headers }
    );
    const postsData = await postsResponse.json();

    // Fetching profiles
    const profilesResponse = await fetch(
      `${API_BASE}${API_PROFILES}/search?q=${query}`,
      { headers }
    );
    const profilesData = await profilesResponse.json();

    displayPostResults(postsData.data);
    displayProfileResults(profilesData.data);
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    displayError("Failed to fetch search results.");
  }
}

/**
 * Display search results for posts.
 * @param {Array} posts
 */
function displayPostResults(posts) {
  const postList = document.querySelector("#matched-posts");
  postList.innerHTML = "";

  const searchResults = document.querySelector("#search-results");
  searchResults.classList.add("pb-4");

  if (posts.length === 0) {
    postList.classList.add("hidden");
    return;
  }
  const headerElement = document.createElement("div");
  headerElement.className =
    "sticky top-0 bg-card py-2 border-t border-b border-gray-200 mb-2 font-bold";
  headerElement.textContent = "Brags";
  postList.appendChild(headerElement);

  posts.forEach((post) => {
    const postElement = document.createElement("a");
    postElement.href = `post/?id=${post.id}`;
    postElement.className =
      "flex flex-col hover:underline underline-offset-2 cursor-pointer";
    postElement.textContent = post.title;
    postList.appendChild(postElement);
  });

  postList.classList.remove("hidden");
}

/**
 * Display search results for profiles.
 * @param {Array} profiles
 */
function displayProfileResults(profiles) {
  const profileList = document.querySelector("#matched-profiles");
  profileList.innerHTML = "";

  if (profiles.length === 0) {
    profileList.classList.add("hidden");
    return;
  }

  // Header Element
  const headerElement = document.createElement("div");
  headerElement.className =
    "sticky top-0 bg-card py-2 border-b border-gray-200 mb-2 font-bold";
  headerElement.textContent = "Profiles";
  profileList.appendChild(headerElement);

  // Profile Container
  profiles.forEach((profile) => {
    const profileContainer = document.createElement("a");
    profileContainer.href = `profile/?profile=${encodeURIComponent(
      profile.name
    )}`;
    profileContainer.className =
      "group flex items-center space-x-4 cursor-pointer mb-1";

    // Profile Image
    const profileImgElement = document.createElement("img");
    profileImgElement.src = profile.avatar.url;
    profileImgElement.alt = `Avatar for ${profile.name}`;
    profileImgElement.className =
      "size-8 rounded-full group-hover:-rotate-12 transition-all duration-300 ease-in-out";

    // Profile Name
    const profileNameElement = document.createElement("span");
    profileNameElement.textContent = profile.name;
    profileNameElement.className =
      "group-hover:underline underline-offset-2 font-medium";

    // Append Image and Name to the Container
    profileContainer.appendChild(profileImgElement);
    profileContainer.appendChild(profileNameElement);

    // Append Container to the List
    profileList.appendChild(profileContainer);
  });

  profileList.classList.remove("hidden");
}

/**
 * Clear search results.
 */
function clearSearchResults() {
  document.querySelector("#matched-posts").innerHTML = "";
  document.querySelector("#matched-profiles").innerHTML = "";
}

/**
 * Initialize search functionality.
 * @returns {void}
 * @description This function initializes the search functionality by adding an event listener to the search input.
 * It debounces the input event to prevent excessive API calls and fetches search results when the query length is greater than 3.
 */
export function initializeSearch() {
  const searchInput = document.querySelector("#search-input");

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(async (event) => {
        const query = event.target.value.trim();
        if (query.length > 3) {
          await fetchSearchResults(query);
        } else {
          clearSearchResults();
        }
      }, 300)
    );
  }
}

/**
 * Debounce the input event to prevent excessive API calls.
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
function debounce(func, delay) {
  let timerId;
  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
