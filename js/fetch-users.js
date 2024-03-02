import { API_KEY, API_BASE, API_PROFILES } from "./constants.js";

const accessToken = localStorage.getItem("accessToken");
const profiles = `${API_BASE}${API_PROFILES}`;

async function fetchUsers() {
  if (!accessToken) {
    console.log("No access token found. Please login.");
    window.location.href = "/sign-in";
  }

  try {
    const response = await fetch(profiles, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

async function displayFriends() {
  const container = document.getElementById("online-friends-container");
  const template = document.getElementById("online-friend-template").content;
  const DEFAULT_AVATAR_URL =
    "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400";

  try {
    const response = await fetchUsers();
    // Filter out users with the default avatar
    const customAvatarUsers = response.data.filter(
      (user) => user.avatar.url !== DEFAULT_AVATAR_URL
    );
    const usersToShow = customAvatarUsers.slice(0, 25);

    usersToShow.forEach((user) => {
      const instance = document.importNode(template, true);
      instance.querySelector("img").src = user.avatar.url;
      instance.querySelector("img").alt = `${user.name}'s avatar`;
      instance.querySelector("#friends-name").textContent = user.name;

      const onlineFriendsAnchor = instance.querySelector("#online-friends");
      onlineFriendsAnchor.href = `/profile/?profile=${encodeURIComponent(
        user.name
      )}`;
      onlineFriendsAnchor.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = this.href;
      });

      container.appendChild(instance);
    });
  } catch (error) {
    console.error("Error populating online friends:", error);
  }
}

displayFriends();
