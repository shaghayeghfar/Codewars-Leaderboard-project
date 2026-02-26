import { getSortedUsers } from "./leaderboardLogic.mjs";

const userInput = document.getElementById("user-input");
const fetchBtn = document.getElementById("fetch-btn");
const languageSelect = document.getElementById("language-select");
const leaderboardBody = document.getElementById("leaderboard-body");
const errorMessage = document.getElementById("error-message");

let allUserData = [];

// DELETE ERROEMESSAGE
userInput.addEventListener("input", () => {
  errorMessage.textContent = "";
  errorMessage.style.display = "none";
});

// Fetch on Enter key
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchBtn.click();
  }
});

// FETCH BUTTON

fetchBtn.addEventListener("click", async () => {
  const usernames = userInput.value
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");

  if (usernames.length === 0) {
    errorMessage.textContent = "Please enter at least one username.";
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.textContent = "";
  errorMessage.style.display = "none";
  leaderboardBody.innerHTML = "";
  allUserData = [];

  const fetchedUsers = [];
  const invalidUsers = [];

  for (const username of usernames) {
    try {
      const response = await fetch(
        `https://www.codewars.com/api/v1/users/${username}`,
      );

      if (response.status === 404) {
        invalidUsers.push(username);
        continue; // skip to next username
      }

      if (!response.ok) {
        errorMessage.textContent = `API error for ${username}.`;
        errorMessage.style.display = "block";
        continue;
      }

      const data = await response.json();
      fetchedUsers.push(data);
    } catch (error) {
      console.error(`Network error for ${username}:`, error);
      invalidUsers.push(username + " (network issue)");
      continue;
    }
  }
  if (invalidUsers.length > 0) {
    errorMessage.textContent = `These users were not found: ${invalidUsers.join(", ")}`;
    errorMessage.style.display = "block";
  }

  if (fetchedUsers.length === 0) return;

  allUserData = fetchedUsers;

  populateDropdown(allUserData);
  renderLeaderboard(allUserData, languageSelect.value);
});

// DROPDOWN CHANGE

languageSelect.addEventListener("change", () => {
  if (allUserData.length === 0) return;
  renderLeaderboard(allUserData, languageSelect.value);
});

// POPULATE DROPDOWN

function populateDropdown(users) {
  const languageSet = new Set();

  users.forEach((user) => {
    Object.keys(user.ranks.languages || {}).forEach((lang) => {
      languageSet.add(lang);
    });
  });

  languageSelect.innerHTML = "";

  const overallOption = document.createElement("option");
  overallOption.value = "overall";
  overallOption.textContent = "Overall";
  languageSelect.appendChild(overallOption);

  Array.from(languageSet)
    .sort()
    .forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = lang;
      languageSelect.appendChild(option);
    });
}

// RENDER LEADERBOARD

function renderLeaderboard(users, selectedLanguage) {
  leaderboardBody.innerHTML = "";

  const filteredUsers = getSortedUsers(users, selectedLanguage);

  if (filteredUsers.length === 0) return;

  const topScore =
    selectedLanguage === "overall"
      ? filteredUsers[0].ranks.overall?.score
      : filteredUsers[0].ranks.languages[selectedLanguage]?.score;

  filteredUsers.forEach((user) => {
    const row = document.createElement("tr");

    const usernameCell = document.createElement("td");
    usernameCell.textContent = user.username;

    const clanCell = document.createElement("td");
    clanCell.textContent = user.clan || "-";

    const scoreCell = document.createElement("td");
    const score =
      selectedLanguage === "overall"
        ? user.ranks.overall?.score || 0
        : user.ranks.languages[selectedLanguage]?.score || 0;

    scoreCell.textContent = score;

    row.appendChild(usernameCell);
    row.appendChild(clanCell);
    row.appendChild(scoreCell);

    if (score === topScore) {
      row.classList.add("top-scorer");
    }

    leaderboardBody.appendChild(row);
  });
}
