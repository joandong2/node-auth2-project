const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./users-model");
const restrict = require("../middleware/restrict");
const jwtDecode = require("jwt-decode");

const router = express.Router();

router.post("/api/register", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findBy({ username }).first();

        if (user) {
            return res.status(409).json({
                message: "Username is already taken",
            });
        }

        const newUser = await Users.add({
            username,
            // hash the password with a time complexity of "14"
            password: await bcrypt.hash(password, 14),
        });

        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
});

router.post("/api/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findBy({ username }).first();

        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }

        // hash the password again and see if it matches what we have in the database
        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }

        console.log(user);

        const payload = {
            userId: user.id,
            username: user.username,
            department: user.department,
        };

        // send the token back as a cookie so the client automatically stores it
        res.cookie("token", jwt.sign(payload, process.env.JWT_SECRET));

        res.json({
            message: `Welcome ${user.username}!`,
        });
    } catch (err) {
        next(err);
    }
});

router.get("/api/users", restrict(), async (req, res, next) => {
    try {
        //console.log(jwtDecode(req.cookies.token).department);
        res.json(
            await Users.findByDept(jwtDecode(req.cookies.token).department)
        );
    } catch (err) {
        next(err);
    }
});

module.exports = router;
