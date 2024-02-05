async function fetchAndLogPosts() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.log("No access token found. Please login.");
    return;
  }

  try {
    const response = await fetch("https://api.noroff.dev/api/v1/social/posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // API key here
        // "X-Noroff-API-Key": "api-key-here",
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

fetchAndLogPosts();
