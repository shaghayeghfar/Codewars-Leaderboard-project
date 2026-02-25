import { getSortedUsers } from "./leaderboardLogic.mjs";

describe("getSortedUsers", () => {
  const users = [
    {
      username: "alice",
      clan: "CodeClan",
      ranks: {
        overall: { score: 100 },
        languages: { python: { score: 50 } },
      },
    },
    {
      username: "bob",
      clan: "CodeClan",
      ranks: {
        overall: { score: 200 },
        languages: { python: { score: 80 } },
      },
    },
    {
      username: "charlie",
      clan: "",
      ranks: {
        overall: { score: 150 },
        languages: { javascript: { score: 60 } },
      },
    },
  ];

  test("sorts users by overall score descending", () => {
    const result = getSortedUsers(users, "overall");
    const usernames = result.map((u) => u.username);
    expect(usernames).toEqual(["bob", "charlie", "alice"]);
  });

  test("filters and sorts users by Python score descending", () => {
    const result = getSortedUsers(users, "python");
    const usernames = result.map((u) => u.username);
    expect(usernames).toEqual(["bob", "alice"]);
  });

  test("filters and sorts users by JavaScript score descending", () => {
    const result = getSortedUsers(users, "javascript");
    const usernames = result.map((u) => u.username);
    expect(usernames).toEqual(["charlie"]);
  });

  test("returns empty array if no users have selected language", () => {
    const result = getSortedUsers(users, "ruby");
    expect(result).toEqual([]);
  });
});
