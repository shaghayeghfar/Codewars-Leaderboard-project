export function getSortedUsers(users, selectedLanguage) {
  const filteredUsers = users.filter((user) => {
    if (selectedLanguage === "overall") {
      return user.ranks.overall?.score;
    }

    return user.ranks.languages?.[selectedLanguage]?.score;
  });

  const sortedUsers = filteredUsers.sort((a, b) => {
    const scoreA =
      selectedLanguage === "overall"
        ? a.ranks.overall?.score || 0
        : a.ranks.languages?.[selectedLanguage]?.score || 0;

    const scoreB =
      selectedLanguage === "overall"
        ? b.ranks.overall?.score || 0
        : b.ranks.languages?.[selectedLanguage]?.score || 0;

    return scoreB - scoreA;
  });

  return sortedUsers;
}
