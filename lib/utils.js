function calculate_location(user_location, potential_match_location) {
    return user_location == potential_match_location ? 10 : 0;
}

function calculate_shared_interest(user_interests, potential_match_interests) {
    let shared_interest = user_interests.filter(a => potential_match_interests.includes(a));

    return shared_interest.length * 10;
}

function calculate_university(user_university, potential_match_university) {
    return user_university == potential_match_university ? 10 : 0;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sanitiseInterests(interests) {
    // Remove curly braces from string
    return interests.replace(/[{}]/g, "").split(",");
}

module.exports = {
    calculate_location,
    calculate_shared_interest,
    calculate_university,
    getRandomInt,
    sanitiseInterests
};
