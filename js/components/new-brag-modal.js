const accessToken = localStorage.getItem("accessToken");
const API_KEY = "4e529365-1137-49dd-b777-84c28348625f";

document.addEventListener("DOMContentLoaded", function () {
  // Assuming your modal HTML is located at "../../components/new-brag-modal.html"
  fetch("../../components/new-brag-modal.html")
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("beforeend", data);
      initializeNewBragModal();
    });
});

function initializeNewBragModal() {
  const openModalButton = document.getElementById("open-new-brag-modal");
  const closeModalButton = document.getElementById("close-modal");
  const modal = document.getElementById("new-brag-modal");

  if (openModalButton) {
    openModalButton.addEventListener("click", function () {
      modal.classList.remove("hidden");
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", function () {
      modal.classList.add("hidden");
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  const form = document.getElementById("new-brag-form");
  if (form) {
    form.addEventListener("submit", submitNewBragForm);
  }
}

async function submitNewBragForm(e) {
  e.preventDefault();

  const mediaUrl = document.getElementById("new-brag-media-url").value;
  const mediaAlt = document.getElementById("new-brag-media-alt").value;
  const title = document.getElementById("new-brag-title").value;
  const body = document.getElementById("new-brag-body").value;
  const tagsInput = document.getElementById("new-brag-tags").value;

  const tags = tagsInput.split(",").map((tag) => tag.trim()); // Ensure tags are correctly formatted

  const payload = {
    title,
    body,
    tags: tagsInput.split(",").map((tag) => tag.trim()),
    media: { url: mediaUrl, alt: mediaAlt },
  };
  console.log("Payload being sent:", payload);

  try {
    const response = await fetch("https://v2.api.noroff.dev/social/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({
        title,
        // body,
        // tags,
        // media: {
        //   url: mediaUrl,
        //   alt: mediaAlt,
        // },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error details:", errorData);
      throw new Error(
        `Failed to post a new brag: ${
          errorData.message || JSON.stringify(errorData)
        }`
      );
    }

    const result = await response.json();
    console.log("New Brag Posted: ", result);
    document.getElementById("new-brag-modal").classList.add("hidden");
    // Optionally, refresh or update the UI here instead of reloading the page
    // window.location.reload();
  } catch (error) {
    console.error("Error posting new brag: ", error);
    // Show error message to user
  }
}
