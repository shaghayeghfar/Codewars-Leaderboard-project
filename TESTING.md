TESTING – CODEWARS LEADERBOARD PROJECT

INPUT TO ACCEPT COMMA-SEPARATED USERS
I entered a list of usernames like CodeYourFuture,SallyMcGrath,40thieves and clicked Fetch.
The table populated correctly with the corresponding users.

FETCHING DATA FROM CODEWARS API
Valid usernames return user data from the API.
Invalid usernames display the error message: These users were not found: <username>.

DROPDOWN TO PICK LANGUAGE RANKING
The dropdown shows all languages plus “Overall”.
Selecting a language updates the leaderboard table immediately.

DEFAULT RANKING IS OVERALL
The table shows the Overall ranking by default after fetching users.

TABLE COLUMNS FOR USERNAME, CLAN, SCORE
Columns display correctly for all users and match the selected ranking.

TABLE SORTED HIGHEST → LOWEST SCORE
Users are correctly sorted in descending order of score.
I verified this both manually and with unit tests.

USERS WITHOUT SELECTED LANGUAGE EXCLUDED
Users who do not have a score for the chosen language are not shown in the table.

TOP USER VISUAL HIGHLIGHT
The user with the highest score is highlighted using the top-scorer CSS class.

ACCESSIBILITY SCORE
Lighthouse in Chrome shows 100 for Accessibility.

UNIT TESTS
Unit tests in leaderboard.test.mjs verify the getSortedUsers() function:

Sorts users by overall score descending

Filters and sorts users by language score descending

Excludes users without a score in the selected language

Returns an empty array if no user has the selected language

All tests pass using npm test.

INVALID USER HANDLING
Non-existent usernames show an error message.
Valid users are still displayed if some usernames are invalid.

API / NETWORK ERROR HANDLING
Disabling the internet or API failure shows the message: Network error. Please check your internet.
