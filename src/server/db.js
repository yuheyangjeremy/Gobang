const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://stu173:p212727W@cluster0.gbo7pn3.mongodb.net/stu173");

// schemas here
const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    pwd: { type: String, required: true },
    admin: { type: Boolean, required: true }
});

// Table structure of the database.
const GameSchema = mongoose.Schema({
    gameId: { type: Number, unique: true },
    player1: { type: String },
    player2: { type: String },
    record: [{role: Number, x: Number, y: Number}],
    startTime: {type: String},
    elapsedTime: {type: String},
    Status: {type: Number},// -1 not ready; 0 start; 1 player1 win; 2 player2 win; 3 player1 regret; 4 player2 regret
    currentPlayer: {type: Number},
    comments:[{role:Number, x: Number}]
});

// Set up user models of the database.
const User = mongoose.model("User", UserSchema);
const Game = mongoose.model("Game", GameSchema);

// Set up a database connection.
const db = mongoose.connection;

module.exports ={ db, User, Game };
