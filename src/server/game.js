const express = require("express");
const router = express.Router();

const cors = require('cors');
router.use(cors());

// Set up database access parameters.
const { db, User, Game } = require("./db");

// Database connection error.
db.on("error", console.error.bind(console, "Connection error:"));

// Open a connection.
db.once("open", function () {
    console.log("Connection is open...");

    // Check player's status and update it.
    router.put('/down/:gameId', (req, res) => {
        var role = req.body['role'];
        var x = req.body['x'];
        var y = req.body['y'];
        var nextRole = 1;
        if (role == 1) {
            nextRole = 2;
        }
        Game.findOneAndUpdate({ gameId: req.params['gameId'] }, { 
            $addToSet: { record: {role,x,y} },
            $set: { currentPlayer: nextRole }
        }, { new: true }, (err, e) => {
            if(err) console.log(err)
            res.send(e)
        });
    })

    // Add comments via gameid.
    router.put('/addComments/:gameId', (req, res) => {
        var role = parseInt(req.body['role']);
        var x = parseInt(req.body['type']);
        Game.findOneAndUpdate({ gameId: req.params['gameId'] }, { 
            $addToSet: { comments: {role,x} }
        }, { new: true }, (err, e) => {
            if(err) console.log(err)
            res.send(e)
        });
    })

    // Join a game.
    router.post('/join', (req, res) => {
        Game.find().sort({ gameId: -1}).limit(1)
            .exec((err, result) => {
                console.log(err);
                console.log(result);

                let gameId = 0;
                let joinAs = 0;
                if(result[0].player2 == null){
                    joinAs = 2;
                    gameId = result[0].gameId;
                    Game.findOneAndUpdate({ gameId: gameId }, { player2: req.body['username'], Status: 0 }, { new: true }, (err, result) => {
                        console.log(err);
                        console.log(result);
                        res.send(result);
                    })
                }else{
                    joinAs = 1;
                    gameId = result[0].gameId + 1;
                    Game.create({ gameId: gameId, player1: req.body['username'], Status: -1, currentPlayer: 1,comments:[] }, (err, result) => {
                        console.log(err);
                        console.log(result);
                        res.send(result);
                    })
                }
            })
    })

    // Check if it is possible to perform an undo,
    router.put('/checkRegret/:gameId', (req, res) => {
        let role = parseInt(req.body['role']) + 2
        Game.findOneAndUpdate({ gameId: req.params['gameId']}, {
            $set: { Status: role }
        }, {new: true}, (err, e) => {
            if (err) console.log(err)
        })
    })

    // Perform an undo.
    router.put('/regret/:gameId', (req, res) => {
        Game.findOne({ gameId: req.params['gameId'] }, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            let role = parseInt(req.body['role']);
            let tupleArray = result.record;
            if(role == result.currentPlayer){
                // delete last two moves
                if (tupleArray.length >= 2){
                    tupleArray = tupleArray.slice(0, tupleArray.length - 2);
                }
            }else{
                // delete last one move
                if (tupleArray.length >= 1){
                    tupleArray = tupleArray.slice(0, tupleArray.length - 1);
                }
                // change current player
                result.currentPlayer = req.body['role'];
            }
            result.record = tupleArray;
            result.Status = 0;
            result.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfully regret");
                }
            });
        })
    })

    // Reset a game.
    router.put('/reset/:gameId', (req, res) => {
        Game.findOneAndUpdate({ gameId: req.params['gameId'] }, { 
            $set: { Status: 0 }
        },{new: true}, (err, e) => {
            if(err) console.log(err)
            res.send(e)
        });
    })

    // Get the current gameId.
    router.get('/:gameId', (req, res) => {
        Game.findOne({ gameId: req.params['gameId'] }, (err, result) =>{
            if(err){
                console.log(err);
                return;
            }
            res.send(result);
        })
    })

    // Check who is the winner via a gameId.
    router.put('/win/:gameId', (req, res) =>{
        var winner = req.body['winner'];
        Game.findOneAndUpdate({ gameId: req.params['gameId'] }, { 
            $set: { Status: winner, startTime: req.body['startTime'], elapsedTime: req.body['elapsedTime'] }
        },{new: true}, (err, e) => {
            if(err) console.log(err)
            res.send(e)
        });
    })

    // Start a game.
    router.get('/startgame/:gameId', (req, res) => {
        Game.findOne({ gameId: req.params['gameId'] }, (err, result) => {
            res.send(result);
        })
    })

    // End a game.
    router.put('/endgame', (req, res) => {
        // update the game status here if you want
    })

    // TestGame is available via using postman.
    router.get('/testGame', (req, res) => {
        Game.create({ gameId: 2, player1: "user002", player2: "user003", record: []})
    })
})

module.exports = router;