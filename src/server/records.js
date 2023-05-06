const express = require("express");
const router = express.Router();

const cors = require('cors');
router.use(cors());

// Set up database access parameters.
const { db, User, Game } = require("./db");

// Database connection error.
db.on("error", console.error.bind(console, "Connection error:"));

// Open a connection.
db.once("open", function (){
    console.log("Connection is open...");

    // Obtain game status via a username.
    router.get('/getRecords/:username', (req, res) => {
        let username = req.params['username'];
        console.log(username);
        Game.find({ $or: [ { player1: username }, { player2: username } ] }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.send(result);
            }
        });
    })
})

module.exports = router;