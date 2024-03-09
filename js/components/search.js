import { API_BASE, API_KEY, API_POSTS, API_PROFILES } from "../constants.js";

const accessToken = localStorage.getItem("accessToken");
const searchInput = document.querySelector("#search-input");
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
 */
async function fetchSearchResults(query) {
  console.log("Fetching search results for query:", query);
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
    console.log("Posts:", postsData);

    // Fetching profiles
    const profilesResponse = await fetch(
      `${API_BASE}${API_PROFILES}/search?q=${query}`,
      { headers }
    );
    const profilesData = await profilesResponse.json();
    console.log("Profiles:", profilesData);

    displayPostResults(postsData.data);
    displayProfileResults(profilesData.data);
  } catch (error) {
    console.error("Failed to fetch search results:", error);
  }
}

/**
 * Display search results for posts.
 * @param {Array} posts
 */
function displayPostResults(posts) {
  const postList = document.querySelector("#matched-posts");
  postList.innerHTML = "";

  if (posts.length === 0) {
    postList.innerHTML = "<p>No posts found.</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "matched-post-title";
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
    profileList.innerHTML = "<p>No profiles found.</p>";
    return;
  }

  profiles.forEach((profile) => {
    const profileElement = document.createElement("div");
    profileElement.className = "matched-profiles-name";
    profileElement.textContent = profile.name;
    profileList.appendChild(profileElement);
  });

  profileList.classList.remove("hidden");
}

/**
 * Clear search results.
 */
function clearSearchResults() {
  console.log("Clearing search results");
  document.querySelector("#matched-posts").innerHTML = "";
  document.querySelector("#matched-profiles").innerHTML = "";
}

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
      console.log("Debounced function executing");
      func.apply(this, args);
    }, delay);
  };
}
