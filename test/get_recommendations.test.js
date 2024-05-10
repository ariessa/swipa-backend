const { Client } = require('pg');
const get_recommendations = require('../lib/get_recommendations');
const { getRandomInt, sanitiseInterests } = require("../lib/utils");
const { names, genders, locations, universities, interests } = require("../lib/constants");

describe("function get_recommendations", () => {
    let client;

    // Valid inputs
    let valid_name = 'alice';
    let valid_gender = 'f';
    let valid_location = 'kuala lumpur';
    let valid_university = 'um';
    let valid_interests = ['art', 'cooking_and_baking', 'fashion_and_style'];

    beforeEach(async () => {
        // Establish connection to PostgreSQL database
        client = new Client({
            host: process.env.POSTGRES_HOST,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            port: process.env.POSTGRES_PORT,
        });
  
        await client.connect();
    
        // Insert 50 user profiles inside database
        for (let i = 0; i < 50; i++) {
            // Randomly pick name
            let name = names[getRandomInt(names.length)].toLowerCase();

            // Randomly pick gender
            let gender = genders[getRandomInt(genders.length)].toLowerCase();

            // Randomly pick location
            let location = locations[getRandomInt(locations.length)].toLowerCase();

            // Randomly pick university
            let university = universities[getRandomInt(universities.length)].toLowerCase();

            // Randomly pick interests
            let interest = [];
            for (let i = 0; i < 3; i++) {
                isInterestUnique = false;
                let random_interest;

                while(!isInterestUnique) {
                    random_interest = interests[getRandomInt(interests.length)].toLowerCase();

                    if (!interest.includes(random_interest)) {
                        isInterestUnique = true;
                    }
                }

                interest.push(random_interest);
            }

            // Insert user profile inside database
            await client.query(
                `INSERT INTO users (name, gender, location, university, interests) VALUES ($1, $2, $3, $4, $5);`,
                [name, gender, location, university, interest]
            );
        }
    });

    afterEach(async () => {
        // Delete all inserted rows from database
        await client.query(
            `TRUNCATE users RESTART IDENTITY CASCADE;`
        );

        // Close the PostgreSQL connection after all tests are done
        await client.end(); 
    });

    test("Returns at most 10 potential matches", async () => {
        // Get a user profile from db
        let user_profile = await client.query(`SELECT * FROM users ORDER BY id ASC LIMIT 1;`);

        let name = user_profile.rows[0].name;
        let gender = user_profile.rows[0].gender;
        let location = user_profile.rows[0].location;
        let university = user_profile.rows[0].university;
        let interest = sanitiseInterests(user_profile.rows[0].interests);

        expect((await get_recommendations([name, gender, location, university, interest])).length).toBeLessThanOrEqual(10);

        // Delete 40 user profiles from db
        await client.query(
            `DELETE FROM users
              WHERE id IN (
             SELECT id
               FROM users
              WHERE gender != $1
              LIMIT 41);`,
            [gender]
        );

        expect((await get_recommendations([name, gender, location, university, interest])).length).toBeLessThanOrEqual(10);
    });

    test("Can pass valid name, gender, location, university, and interests", async () => {
        await expect(get_recommendations([valid_name, valid_gender, valid_location, valid_university, valid_interests])).resolves.not.toThrow();
    });

    test("Cannot pass invalid name", async () => {
        // Invalid names
        let empty_name = '';
        let single_char_name = 'a';
        let double_char_name = 'ab';
        let out_of_bounds_name = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla. Nullam quis risus eget urna mollis ornare vel eu leo. Nulla vitae elit libero, a pharetra augue. Nulla facilisi. Sed posuere consectetur est at lobortis.?";

        await expect(get_recommendations([empty_name, valid_gender, valid_location, valid_university, valid_interests])).rejects.toThrow("Invalid name entered!");
        await expect(get_recommendations([single_char_name, valid_gender, valid_location, valid_university, valid_interests])).rejects.toThrow("Invalid name entered!");
        await expect(get_recommendations([double_char_name, valid_gender, valid_location, valid_university, valid_interests])).rejects.toThrow("Invalid name entered!");
        await expect(get_recommendations([out_of_bounds_name, valid_gender, valid_location, valid_university, valid_interests])).rejects.toThrow("Invalid name entered!");
    });

    test("Cannot pass invalid gender", async () => {
        // Invalid genders
        let invalid_gender = 't';
        let empty_gender = '';
        let double_char_gender = 'ab';

        await expect(get_recommendations([valid_name, invalid_gender, valid_location, valid_university, valid_interests])).rejects.toThrow("Invalid gender entered!");
        await expect(get_recommendations([valid_name, empty_gender, valid_location, valid_university, valid_interests])).rejects.toThrow("Invalid gender entered!");
        await expect(get_recommendations([valid_name, double_char_gender, valid_location, valid_university, valid_interests])).rejects.toThrow("Invalid gender entered!");
    });

    test("Cannot pass invalid location", async () => {
        // Invalid locations
        let empty_location = '';
        let single_char_location = 'a';
        let double_char_location = 'ab';
        let out_of_bounds_location = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla. Nullam quis risus eget urna mollis ornare vel eu leo. Nulla vitae elit libero, a pharetra augue. Nulla facilisi. Sed posuere consectetur est at lobortis.?";

        await expect(get_recommendations([valid_name, valid_gender, empty_location, valid_university, valid_interests])).rejects.toThrow("Invalid location entered!");
        await expect(get_recommendations([valid_name, valid_gender, single_char_location, valid_university, valid_interests])).rejects.toThrow("Invalid location entered!");
        await expect(get_recommendations([valid_name, valid_gender, double_char_location, valid_university, valid_interests])).rejects.toThrow("Invalid location entered!");
        await expect(get_recommendations([valid_name, valid_gender, out_of_bounds_location, valid_university, valid_interests])).rejects.toThrow("Invalid location entered!");
    });

    test("Cannot pass invalid university", async () => {
        // Invalid universities
        let empty_university = '';
        let single_char_university = 'a';
        let out_of_bounds_university = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla. Nullam quis risus eget urna mollis ornare vel eu leo. Nulla vitae elit libero, a pharetra augue. Nulla facilisi. Sed posuere consectetur est at lobortis.?";

        await expect(get_recommendations([valid_name, valid_gender, valid_location, empty_university, valid_interests])).rejects.toThrow("Invalid university entered!");
        await expect(get_recommendations([valid_name, valid_gender, valid_location, single_char_university, valid_interests])).rejects.toThrow("Invalid university entered!");
        await expect(get_recommendations([valid_name, valid_gender, valid_location, out_of_bounds_university, valid_interests])).rejects.toThrow("Invalid university entered!");
    });

    test("Cannot pass invalid interests", async () => {
        // Invalid interests
        let empty_interest = [];
        let single_valid_interest = ['art'];
        let single_invalid_interest = ['artsy'];
        let two_valid_interests = ['art', 'cooking_and_baking'];
        let two_invalid_interests = ['artsy', 'cooking_and_bakingzzz'];
        let three_invalid_interests = ['artsy', 'cooking_and_bakingzzz', 'fashion_and_stylezzz'];
        let four_valid_interests = ['art', 'cooking_and_baking', 'fashion_and_style', 'fitness_and_wellness'];

        await expect(get_recommendations([valid_name, valid_gender, valid_location, valid_university, empty_interest])).rejects.toThrow(`Not enough interests entered! Current number of interest(s) is ${empty_interest.length} but 3 unique interests are needed.`);
        await expect(get_recommendations([valid_name, valid_gender, valid_location, valid_university, single_valid_interest])).rejects.toThrow(`Not enough interests entered! Current number of interest(s) is ${single_valid_interest.length} but 3 unique interests are needed.`);
        await expect(get_recommendations([valid_name, valid_gender, valid_location, valid_university, single_invalid_interest])).rejects.toThrow("Invalid interest entered!");
        await expect(get_recommendations([valid_name, valid_gender, valid_location, valid_university, two_valid_interests])).rejects.toThrow(`Not enough interests entered! Current number of interest(s) is ${two_valid_interests.length} but 3 unique interests are needed.`);
        await expect(get_recommendations([valid_name, valid_gender, valid_location, valid_university, two_invalid_interests])).rejects.toThrow("Invalid interest entered!");
        await expect(get_recommendations([valid_name, valid_gender, valid_location, valid_university, three_invalid_interests])).rejects.toThrow("Invalid interest entered!");
        await expect(get_recommendations([valid_name, valid_gender, valid_location, valid_university, four_valid_interests])).rejects.toThrow(`Too many interests entered! Current number of interest(s) is ${four_valid_interests.length} but only 3 unique interests are needed.`);
    });
});
