const accessToken = localStorage.getItem("accessToken");
const API_KEY = "4e529365-1137-49dd-b777-84c28348625f";

async function fetchUserProfile(userName) {
  const API_URL = `https://v2.api.noroff.dev/social/profiles/${userName}`;
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const { data } = await response.json();
    console.log("Profile data:", data);

    document.getElementById("dynamic-profile-name").textContent = data.name;
    // document.getElementById("dynamic-profile-email").textContent = data.email;
    document.getElementById("dynamic-profile-bio").textContent = data.bio;
    document.getElementById("dynamic-profile-avatar").src = data.avatar.url;
    document.getElementById("dynamic-profile-avatar").alt = data.avatar.alt;
    document.getElementById("dynamic-profile-cover").src = data.banner.url;
    document.getElementById("dynamic-profile-cover").alt = data.banner.alt;
    document.getElementById("dynamic-profile-followers").textContent =
      data._count.followers;
    document.getElementById("dynamic-profile-following").textContent =
      data._count.following;
    document.getElementById("dynamic-profile-posts").textContent =
      data._count.posts;

    await fetchUserPosts(userName);
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
}

async function fetchUserPosts(userName) {
  const postsAPIURL = `https://v2.api.noroff.dev/social/profiles/${userName}/posts`;
  try {
    const response = await fetch(postsAPIURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }

    const { data } = await response.json();
    console.log("User posts data:", data);
    displayUserPosts(data);
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
}

function displayUserPosts(posts) {
  const postsContainer = document.getElementById(
    "dynamic-profile-posts-container"
  );
  const postTemplate = document.getElementById("post-template").content;

  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postClone = document.importNode(postTemplate, true);

    postClone.querySelector("#post-title").textContent = post.title;
    postClone.querySelector("#post-body").textContent = post.body;

    const postMedia = postClone.querySelector("#post-media");
    if (post.media && post.media.url) {
      postMedia.src = post.media.url;
      postMedia.alt = post.media.alt || "Post image";
      postMedia.style.display = "block";
    } else {
      postMedia.remove();
    }

    postClone.querySelector("#post-tags").textContent = post.tags.join(", ");
    postClone.querySelector("#post-date").textContent = new Date(
      post.created
    ).toLocaleDateString();

    postsContainer.appendChild(postClone);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const profileName = urlParams.get("profile");

  if (profileName) {
    fetchUserProfile(profileName);
  }
});
