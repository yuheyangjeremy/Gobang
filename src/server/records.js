const express = require("express");
const router = express.Router();

const cors = require('cors');
router.use(cors());

const { db, User, Game } = require("./db");

db.on("error", console.error.bind(console, "Connection error:"));

db.once("open", function (){
    console.log("Connection is open...");

    router.get('/getRecords/:username', (req, res) => {
        let username = req.params['username'];
        Game.find({ $or: [ { player1: username }, { player2: username } ] }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    })
})

module.exports = router;