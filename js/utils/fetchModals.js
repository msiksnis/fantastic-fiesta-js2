import { setupDeletePostListeners } from "../components/delete-post.js";
import { setupEditPostListeners } from "../components/edit-post.js";
// import { setupViewPostListeners } from "../components/view-post.js";

export function fetchConfirmationModal() {
  fetch("../../components/confirmation-modal.html")
    .then((response) => response.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      setupDeletePostListeners();
    })
    .catch((error) =>
      console.error("Failed to load the confirmation modal", error)
    );
}

export function fetchEditPostModal() {
  fetch("../components/edit-post-modal.html")
    .then((response) => response.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      setupEditPostListeners();
    })
    .catch((error) =>
      console.error("Failed to load the edit post modal", error)
    );
}

// export function fetchViewPostModal() {
//   fetch("../components/view-post.html")
//     .then((response) => response.text())
//     .then((html) => {
//       document.body.insertAdjacentHTML("beforeend", html);
//       setupViewPostListeners();
//     })
//     .catch((error) =>
//       console.error("Failed to load the view post modal", error)
//     );
// }
