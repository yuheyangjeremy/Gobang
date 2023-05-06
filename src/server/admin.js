const express = require("express");
const router = express.Router();

const cors = require('cors');
router.use(cors());

// Set up database access parameters.
const { db, User, Game } = require("./db");
const { application } = require("express");

// Connect to the database.
db.on("error", console.error.bind(console, "Connection error:"));

// Open a connection.
db.once("open", function () {
    console.log("Connection is open...");

    // find all users who are not admin
    router.get('/users', (req, res) => {
        User.find({ admin: false })
            .exec((err, result) => {
                console.log(err);
                console.log(result);

                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.send(err);
                }else{
                    res.json(result);
                }
            })
    });

    // delete user
    router.delete('/users/:uid', (req, res) => {
        User.findOneAndDelete({ _id: req.params['uid'] })
            .exec((err, result) =>{
                console.log(err);
                console.log(result);

                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.send(err);
                }else{
                    res.send(result);
                }
            })
    })


})

module.exports = router;