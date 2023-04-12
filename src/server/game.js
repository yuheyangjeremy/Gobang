const express = require("express");
const router = express.Router();

const cors = require('cors');
router.use(cors());

const { db, User, Game } = require("./db");

db.on("error", console.error.bind(console, "Connection error:"));

db.once("open", function () {
    console.log("Connection is open...");

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
                    Game.findOneAndUpdate({ gameId: gameId }, { player2: req.body['username'] }, { new: true }, (err, result) => {
                        console.log(err);
                        console.log(result);
                        res.send(result);
                    })
                }else{
                    joinAs = 1;
                    gameId = result[0].gameId + 1;
                    Game.create({ gameId: gameId, player1: req.body['username'], Status: 0, currentPlayer: 1 }, (err, result) => {
                        console.log(err);
                        console.log(result);
                        res.send(result);
                    })
                }
            })
    })

    router.put('/regret', (req, res) => {
        Game.findOne({ gameId: req.body['gameId']}, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            let tupleArray = result.record;
            if(req.body['role'] == result.currentplayer){
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
                result.currentplayer = req.body['role'];
            }
            result.record = tupleArray;
            result.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfully regret");
                }
            });
        })
    })

    router.get('/:gameId', (req, res) => {
        Game.findOne({ gameId: req.params['gameId'] }, (err, result) =>{
            if(err){
                console.log(err);
                return;
            }
            res.send(result);
        })
    })

    router.put('/win/:gameId', (req, res) =>{
        var winner = req.body['winner'];
        var x = req.body['x'];
        var y = req.body['y'];
        Game.findOneAndUpdate({ gameId: req.params['gameId'] }, { 
            $addToSet: { record: {winner,x,y} },
            $set: { Status: winner }
        }, (err, e) => {
            if(err) console.log(err)
            res.send(e)
        });
    })

    router.get('/startgame/:gameId', (req, res) => {
        Game.findOne({ gameId: req.params['gameId'] }, (err, result) => {
            res.send(result);
        })
    })

    router.put('/endgame', (req, res) => {
        // udpate the game status here if you want
    })

    // you can add a test game here by using postman
    router.get('/testGame', (req, res) => {
        Game.create({ gameId: 2, player1: "user002", player2: "user003", record: []})
    })
})

module.exports = router;