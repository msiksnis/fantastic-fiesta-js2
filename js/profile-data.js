export function getUserProfile() {
  const userProfileStr = localStorage.getItem("userProfile");
  return userProfileStr ? JSON.parse(userProfileStr) : null;
}

export function setUserProfile(userProfile) {
  const userProfileStr = JSON.stringify(userProfile);
  localStorage.setItem("userProfile", userProfileStr);
}

export function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userProfile");
}

export function displayUserProfile(context = document) {
  const userProfile = getUserProfile();
  if (!userProfile) return;

  const profileNameElement = context.querySelector("#profile-name");
  const profileEmailElement = context.querySelector("#profile-email");
  const profileBioElement = context.querySelector("#profile-bio");
  const profileAvatarElement = context.querySelector("#profile-avatar");
  const profileMobileAvatarElement = context.querySelector(
    "#mobile-profile-avatar"
  );
  const profileBannerElement = context.querySelector("#profile-banner");
  const profileFollowersElement = context.querySelector("#profile-followers");
  const profileFollowingElement = context.querySelector("#profile-following");

  if (profileNameElement) profileNameElement.textContent = userProfile.name;

  if (profileEmailElement) profileEmailElement.textContent = userProfile.email;

  if (profileBioElement) profileBioElement.textContent = userProfile.bio;

  if (profileAvatarElement && userProfile.avatar) {
    profileAvatarElement.src = userProfile.avatar.url;
    profileAvatarElement.alt = userProfile.avatar.alt || "User avatar";
  }

  if (profileMobileAvatarElement && userProfile.avatar) {
    profileMobileAvatarElement.src = userProfile.avatar.url;
    profileMobileAvatarElement.alt = userProfile.avatar.alt || "User avatar";
  }

  if (profileBannerElement && userProfile.banner) {
    profileBannerElement.src = userProfile.banner.url;
    profileBannerElement.alt = userProfile.banner.alt || "User banner";
  }

  if (profileFollowersElement) {
    profileFollowersElement.textContent = userProfile._count.followers;
  }

  if (profileFollowingElement) {
    profileFollowingElement.textContent = userProfile._count.following;
  }
}
