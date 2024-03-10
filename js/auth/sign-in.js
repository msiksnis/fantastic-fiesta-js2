import { API_BASE, API_KEY, API_PROFILES } from "../constants.js";
import { displayError } from "../utils/toasts.js";
import { togglePasswordVisibility } from "./toggle-password.js";

export async function login(email, password) {
  const loginUrl = `${API_BASE}/auth/login`;

  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const { data } = await response.json();

    console.log("Login successful", data);

    localStorage.setItem("accessToken", data.accessToken);

    const [followersData, followingData, profileData] = await Promise.all([
      fetchFollowers(data.name),
      fetchFollowing(data.name),
      fetchProfileDataWithCounts(data.name),
    ]);

    const userProfile = {
      ...data,
      followers: followersData,
      following: followingData,
      _count: profileData._count,
    };

    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    window.location.href = "/";
  } catch (error) {
    displayError(
      "Something is wrong. Please check your credentials and try again."
    );
  }
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
});

function setupTogglePasswordVisibility(password, toggPasswordVisibility) {
  document.addEventListener("DOMContentLoaded", function () {
    const togglePasswordButton = document.getElementById(
      toggPasswordVisibility
    );
    if (togglePasswordButton) {
      togglePasswordButton.addEventListener("click", function () {
        togglePasswordVisibility(password, toggPasswordVisibility);
      });
    }
  });
}

setupTogglePasswordVisibility("password", "toggPasswordVisibility");

async function fetchFollowers(userName) {
  const url = `${API_BASE}${API_PROFILES}/${userName}/?_followers=true`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch followers");
    }
    const { data } = await response.json();
    return data.followers || [];
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
}

async function fetchFollowing(userName) {
  const url = `${API_BASE}${API_PROFILES}/${userName}/?_following=true`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch following");
    }
    const { data } = await response.json();
    return data.following || [];
  } catch (error) {
    console.error("Error fetching following:", error);
    return [];
  }
}

async function fetchProfileDataWithCounts(userName) {
  try {
    const response = await fetch(
      `${API_BASE}${API_PROFILES}/${userName}?_count=true`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch profile counts");
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile data with counts:", error);
    return null;
  }
}
