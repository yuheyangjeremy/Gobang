const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

// Set up components required for the server. 
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up the database component.
const { db, User, Game } = require("./db");

// Set up the login component.
const login = require("./login");

// Set up the admin component.
const admin = require("./admin");

// Set up the game component.
const game = require("./game");

// Set up the records component.
const records = require("./records")

// Render the app to apply available components.
app.use("/login", login);
app.use("/admin", admin);
app.use("/game", game);
app.use("/records", records);

// on error
db.on("error", console.error.bind(console, "Connection error:"));

// Open a connection.
db.once("open", function () {
    console.log("Connection is open...");
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));

    // create a test user
    app.get('/testUser', (req, res) => {
        User.create({ username: "user001", pwd: "123456", admin: false}, (err, e) => {
            if (err) console.log(err);
            res.send(e);
        });
    })
})

const server = app.listen(3000);