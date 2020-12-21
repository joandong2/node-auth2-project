// pre-hashed password for "abc12345"
const hashedPassword =
    "$2a$14$qHqCbXUImiBOgXlFNX47wuA7uFWNGNAZutYLvOeye9eotewGlfYV6";

exports.seed = async function (knex) {
    await knex("users").insert([
        {
            username: "janedoe",
            password: hashedPassword,
            department: "finance",
        },
        {
            username: "johndoe",
            password: hashedPassword,
            department: "marketing",
        },
        {
            username: "jackdoe",
            password: hashedPassword,
            department: "marketing",
        },
    ]);
};
