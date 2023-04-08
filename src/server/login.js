const express = require("express");
const router = express.Router();

const cors = require('cors');
router.use(cors());

const { db, User, Game } = require("./db");

db.on("error", console.error.bind(console, "Connection error:"));

db.once("open", function () {
    console.log("Connection is open...");

    router.get('/', (req, res) => {
        res.send('Please login');
    });

    router.post('/login_check', (req, res) => {

        username = req.body['username'];
        password = req.body['password'];

        User.findOne({ username: req.body['username'], pwd: req.body['password'] })
            .exec((err, result) => {
                console.log(err);
                console.log(result);

                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.send(err);
                }
                else {
                    if (result == null) {
                        res.set('Content-Type', 'application/json');
                        res.send({ text: "Invalid username or password." });
                    } else {
                        //successfully login
                        if (result.admin) {
                            res.set('Content-Type', 'application/json');
                            temp_string = "Welcome administrator " + result.username + "!";
                            data = { isAdmin: 1, text: temp_string };
                            res.json(data);
                        }
                        else {
                            res.set('Content-Type', 'application/json');
                            temp_string = "Welcome " + result.username + "!";
                            result.text = temp_string;
                            data = { isAdmin: 0, text: temp_string };
                            res.json(data);
                        }
                    }
                }
            })

    })
})

module.exports = router;