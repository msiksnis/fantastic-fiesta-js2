async function fetchAndLogPosts() {
  const accessToken = localStorage.getItem("accessToken"); // Retrieve the access token from local storage

  if (!accessToken) {
    console.log("No access token found. Please login.");
    return;
  }

  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/social/profiles",
      {
        // Replace with the actual endpoint
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // If your API requires an API key, include it as well
          // "X-Noroff-API-Key": "your-api-key-here", // Replace with your actual API key
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts = await response.json();
    console.log(posts); // Log the posts to the console
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// Execute the function when the script loads
fetchAndLogPosts();
