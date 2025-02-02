// Imports the express library
const express = require("express");
// Creates a new Router instance
const router = express.Router();
// Imports the addUser function from the database file
const { addUser } = require("./store-user.js");
// Tells the router to expect JSON requests
router.use(express.json());

// Handles the post request to the given url
router.post("/", (req, res) => {
    // Attempts to add the given user to the database
    // Returns appropriate HTTP statuses
    if (addUser(req.body)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
})

module.exports = router;