export function displayError(message = "Oops... Something went wrong.") {
  const errorToast = document.getElementById("error-toast");
  errorToast.textContent = message;
  errorToast.classList.remove("translate-y-24", "opacity-0");
  errorToast.classList.add("translate-y-0", "opacity-100");
  setTimeout(() => {
    errorToast.classList.remove("translate-y-0", "opacity-100");
    errorToast.classList.add("translate-y-24", "opacity-0");
  }, 3000);
}

export function displaySuccess(message) {
  const successToast = document.getElementById("success-toast");
  if (successToast) {
    successToast.textContent = message;
    successToast.classList.remove("-translate-y-20", "opacity-0");
    successToast.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
      successToast.classList.remove("translate-y-0", "opacity-100");
      successToast.classList.add("-translate-y-20", "opacity-0");
    }, 3000);
  }
}
