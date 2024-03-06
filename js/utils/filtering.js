import {
  fetchFollowingPosts,
  fetchAllPosts,
  fetchPopularPosts,
} from "./fetchers.js";
import { displayPosts } from "../homepage.js";

export function initializeTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", async function () {
      setActiveTab(tab);
      await handleTabSwitch(tab.textContent.trim());
    });
  });

  setActiveTab(tabs[0]);
  handleTabSwitch(tabs[0].textContent.trim());
}

async function handleTabSwitch(tabName) {
  switch (tabName) {
    case "Latest":
      const latestPosts = await fetchAllPosts();
      displayPosts(latestPosts);
      break;
    case "Following":
      const followingPosts = await fetchFollowingPosts();
      displayPosts(followingPosts);
      break;
    case "Popular":
      const popularPosts = await fetchPopularPosts();
      displayPosts(popularPosts);
      break;
    default:
      console.log("Unknown tab");
  }
}

function setActiveTab(selectedTab) {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab) => {
    tab.classList.remove("bg-accent-yellow/60", "border-black", "shadow-sm");
    tab.classList.add("opacity-60", "border-transparent");
  });

  selectedTab.classList.add("bg-accent-yellow/60", "border-black", "shadow-sm");
  selectedTab.classList.remove("opacity-60", "border-transparent");
}

document.addEventListener("DOMContentLoaded", function () {
  initializeTabs();
});
