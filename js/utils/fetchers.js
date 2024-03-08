import { API_BASE, API_POSTS, API_KEY, API_PARAMS } from "../constants.js";
import { displayError } from "../utils/toasts.js";

const accessToken = localStorage.getItem("accessToken");

const loader = document.querySelector(".loader");

function toggleLoader(show) {
  loader.style.display = show ? "block" : "none";
}

export async function fetchAllPosts() {
  if (!accessToken) {
    console.log("No access token found. Please login.");
    window.location.href = "/sign-in";
    return;
  }

  toggleLoader(true);
  try {
    const response = await fetch(API_BASE + API_POSTS + API_PARAMS, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    displayError("Could not fetch the posts. Please try again.");
    return null;
  } finally {
    toggleLoader(false);
  }
}

export async function fetchFollowingPosts() {
  const allPosts = await fetchAllPosts();
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const followingNames = userProfile.following.map((user) => user.name);

  const followingPosts = allPosts.filter((post) =>
    followingNames.includes(post.author.name)
  );
  return followingPosts;
}

export async function fetchPopularPosts() {
  const allPosts = await fetchAllPosts();
  const popularPosts = allPosts.sort((a, b) => {
    const aReactions = a._count.reactions + a._count.comments;
    const bReactions = b._count.reactions + b._count.comments;
    return bReactions - aReactions;
  });
  return popularPosts;
}
