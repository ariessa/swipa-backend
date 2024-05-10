const databasePool = require("./database");
const { isValidName, isValidGender, isValidLocation, isValidUniversity, isValidInterests } = require("./validations");
const { calculate_location, calculate_shared_interest, calculate_university, sanitiseInterests } = require("./utils");

/**
 * Get recommendation for potential matches based on user's profile.
 * Filter matches
 *
 * @param {Array} user_profile - A list of attributes (name, gender, location, university, interests).
 * @returns {Array} A list of at most 10 potential matches.
 */
async function get_recommendations(user_profile) {
    // console.log("usr: ", user_profile);

    let name = user_profile[0];
    let gender = user_profile[1];
    let location = user_profile[2];
    let university = user_profile[3];
    let interest = user_profile[4];

    let potential_matches = [];

    // Validate inputs
    if (isValidName(name) && isValidGender(gender) && isValidLocation(location) && isValidUniversity(university) && isValidInterests(interest)) {
        // Get potential matches from the database
        let query_result = (await databasePool.query(
            `SELECT name, gender, location, university, interests FROM USERS WHERE gender != $1;`,
            [gender]
        )).rows;

        // Score potential match based on shared interests (Multiply by 10 points for every match)
        // Score potential match based on location (Add 10 points on shared university)
        // Score potential match based on university (Add 10 points on shared university)
        for (let i = 0; i < query_result.length; i++) {
            query_result[i].interests = sanitiseInterests(query_result[i].interests);
            let potential_match_interest = query_result[i].interests;
            let potential_match_location = query_result[i].location;
            let potential_match_university = query_result[i].university;
            query_result[i].score = calculate_shared_interest(interest, potential_match_interest) + calculate_location(location, potential_match_location) + calculate_university(university, potential_match_university);
        }

        // Sort potential matches by score in descending order
        query_result.sort((a, b) => b.score - a.score);

        // Get at most 10 potential matches
        if (query_result.length < 10) {
            potential_matches = query_result.slice(0, query_result.length);
        } else {
            potential_matches = query_result.slice(0, 10);
        }
    }

    return potential_matches;
}

module.exports = get_recommendations;
