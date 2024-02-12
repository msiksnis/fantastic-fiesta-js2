const accessToken = localStorage.getItem("accessToken");
const API_KEY = "4e529365-1137-49dd-b777-84c28348625f";

async function fetchAndLogPosts() {
  if (!accessToken) {
    console.log("No access token found. Please login.");
    window.location.href = "/sign-in";
  }

  try {
    const response = await fetch("https://v2.api.noroff.dev/social/profiles", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts = await response.json();
    console.log(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// fetchAndLogPosts();
