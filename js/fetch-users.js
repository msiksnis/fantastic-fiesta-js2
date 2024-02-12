const profiles = "https://v2.api.noroff.dev/social/profiles";
const accessToken = localStorage.getItem("accessToken");
const API_KEY = "4e529365-1137-49dd-b777-84c28348625f";

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

async function displayOnlineFriends() {
  const container = document.getElementById("online-friends-container");
  const template = document.getElementById("online-friend-template").content;

  try {
    const response = await fetchUsers();
    const users = response.data.slice(0, 15);

    users.forEach((user) => {
      const instance = document.importNode(template, true);
      instance.querySelector("img").src = user.avatar.url;
      instance.querySelector("img").alt = `${user.name}'s avatar`;
      instance.querySelector("#friends-name").textContent = user.name;
      container.appendChild(instance);
    });
  } catch (error) {
    console.error("Error populating online friends:", error);
  }
}

displayOnlineFriends();
