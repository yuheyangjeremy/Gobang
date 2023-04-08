const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://stu173:p212727W@cluster0.gbo7pn3.mongodb.net/stu173");

// schemas here
const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    pwd: { type: String, required: true },
    admin: { type: Boolean, required: true },
});

const GameSchema = mongoose.Schema({
    player1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    record: [{type: Number}],
    startTime: {type: Number},
    elapsedTime: {type: Number},
    Status: {type: Number}
});


const User = mongoose.model("User", UserSchema);
const Game = mongoose.model("Game", GameSchema);

const db = mongoose.connection;

module.exports ={ db, User, Game };
