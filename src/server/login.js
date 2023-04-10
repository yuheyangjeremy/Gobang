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

    // login here
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
                        res.send({ validity: false, text: "Invalid username or password." });
                    } else {
                        //successfully login
                        if (result.admin) {
                            res.set('Content-Type', 'application/json');
                            temp_string = "Welcome administrator " + result.username + "!";
                            data = { validity: true, isAdmin: true, username: result.username, text: temp_string };
                            res.json(data);
                        }
                        else {
                            res.set('Content-Type', 'application/json');
                            temp_string = "Welcome " + result.username + "!";
                            result.text = temp_string;
                            data = { validity: true, isAdmin: false, username: result.username, text: temp_string };
                            res.json(data);
                        }
                    }
                }
            })

    })

    //sign up here
    router.post('/sign_up', (req, res) => {
        username = req.body['username'];
        password = req.body['password'];

        User.findOne({ username: username })
            .exec((err, result) => {
                console.log(err);
                console.log(result);

                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.send(err);
                }
                if (result != null){
                    res.set('Content-Type', 'application/json');
                    res.send({ validity: false, text: "User already exists, please change your username!" });
                }else{
                    User.create({ username: username, pwd: password, admin: false }, (err, result) => {
                        console.log(err);
                        console.log(result);
        
                        if (err) {
                            res.set('Content-Type', 'text/plain');
                            res.send(err);
                        }else{
                            res.set('Content-Type', 'application/json');
                            temp_string = "Welcome " + result.username + "!";
                            result.text = temp_string;
                            data = { validity: true, isAdmin: false, username: result.username, text: temp_string };
                            res.json(data);
                        }
                    })
                }
            })
    })
})

module.exports = router;