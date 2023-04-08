const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

const { db, User, Game } = require("./db");

const login = require("./login");
app.use("/login", login);

// on error
db.on("error", console.error.bind(console, "Connection error:"));

db.once("open", function () {
    console.log("Connection is open...");
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));

    // create a test user
    app.get('/testUser', (req, res) => {
        User.create({ username: "admin123", pwd: "123456", admin: true}, (err, e) => {
            if (err) console.log(err);
            res.send(e);
        });
    })
})

const server = app.listen(3000);