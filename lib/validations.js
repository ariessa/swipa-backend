const { interests } = require("./constants");

function isValidName(name) {
    // Name must be at least 3 letters up to 255 letters
    // Name must be letters only
    const regex = /^[a-zA-Z]{3,255}$/;

    // Test if the name matches the pattern
    if (!regex.test(name)) {
        throw new Error("Invalid name entered!");
    }

    return true;
}

function isValidGender(gender) {
    // Gender must be either 'f' or 'm'
    const regex = /^[fm]$/;

    // Test if the gender matches the pattern
    if (!regex.test(gender)) {
        throw new Error("Invalid gender entered!");
    }

    return true;
}

function isValidLocation(location) {
    // Location must be at least 3 letters up to 255 letters
    const regex = /^.{3,255}$/;

    // Test if the location matches the pattern
    if (!regex.test(location)) {
        throw new Error("Invalid location entered!");
    }

    return true;
}

function isValidUniversity(university) {
    // University must be at least 2 letters up to 255 letters
    const regex = /^.{2,255}$/;

    // Test if the university matches the pattern
    if (!regex.test(university)) {
        throw new Error("Invalid university entered!");
    }

    return true;
}

function isValidInterests(interest) {
    for (let i = 0; i < interest.length; i++) {
        if (!interests.includes(interest[i])) {
            throw new Error("Invalid interest entered!");
        }
    }

    if (interest.length < 3) {
        throw new Error(`Not enough interests entered! Current number of interest(s) is ${interest.length} but 3 unique interests are needed.`);
    }

    if (interest.length > 3) {
        throw new Error(`Too many interests entered! Current number of interest(s) is ${interest.length} but only 3 unique interests are needed.`);
    }

    return true;
}

module.exports = {
    isValidName,
    isValidGender,
    isValidLocation,
    isValidUniversity,
    isValidInterests
};
