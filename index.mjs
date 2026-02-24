const userInput = document.getElementById("user-input");
const fetchBtn = document.getElementById("fetch-btn");
const languageSelect = document.getElementById("language-select");
const leaderboardBody = document.getElementById("leaderboard-body");
const errorMessage = document.getElementById("error-message");

let currentUsernames = [];

// FETCH BUTTON
fetchBtn.addEventListener("click", async () => {
  const usernames = userInput.value
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");

  if (usernames.length === 0) {
    errorMessage.textContent = "Please enter at least one username.";
    return;
  }

  errorMessage.textContent = "";
  currentUsernames = usernames;

  // Fetch first user to populate dropdown dynamically
  try {
    const response = await fetch(
      `https://www.codewars.com/api/v1/users/${usernames[0]}`,
    );
    if (!response.ok) throw new Error("User not found");

    const data = await response.json();
    populateDropdown(data);

    fetchLeaderboard(currentUsernames, languageSelect.value);
  } catch (err) {
    errorMessage.textContent = `Error fetching data for ${usernames[0]}`;
  }
});

// DROPDOWN CHANGE
languageSelect.addEventListener("change", () => {
  const selectedLanguage = languageSelect.value;
  if (currentUsernames.length === 0) return;
  fetchLeaderboard(currentUsernames, selectedLanguage);
});

// POPULATE DROPDOWN
function populateDropdown(userData) {
  const languages = userData.ranks.languages || {};
  languageSelect.innerHTML = "";
  const overallOption = document.createElement("option");
  overallOption.value = "overall";
  overallOption.textContent = "Overall";
  languageSelect.appendChild(overallOption);

  // Add all languages dynamically
  for (const lang in languages) {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang;
    languageSelect.appendChild(option);
  }
}

//FETCH LEADERBOARD
async function fetchLeaderboard(usernames, selectedLanguage) {
  leaderboardBody.innerHTML = "";

  for (const username of usernames) {
    try {
      const response = await fetch(
        `https://www.codewars.com/api/v1/users/${username}`,
      );
      if (!response.ok) throw new Error("User not found");

      const data = await response.json();
      addUserToTable(data, selectedLanguage);
    } catch (err) {
      errorMessage.textContent = `Error fetching data for ${username}`;
    }
  }
}

// ===== ADD USER TO TABLE =====
function addUserToTable(userData, selectedLanguage) {
  const row = document.createElement("tr");

  const usernameCell = document.createElement("td");
  usernameCell.textContent = userData.username;

  const clanCell = document.createElement("td");
  clanCell.textContent = userData.clan || "-";

  const scoreCell = document.createElement("td");
  if (selectedLanguage === "overall") {
    scoreCell.textContent = userData.ranks.overall?.score || 0;
  } else {
    scoreCell.textContent =
      userData.ranks.languages[selectedLanguage]?.score || 0;
  }

  row.appendChild(usernameCell);
  row.appendChild(clanCell);
  row.appendChild(scoreCell);

  leaderboardBody.appendChild(row);
}
