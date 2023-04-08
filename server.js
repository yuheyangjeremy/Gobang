const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(
  process.env.DBLink
);
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../frontend/build")));
const api_key = process.env.APIKey;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function () {
  console.log("Connection is open...");

  const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    pwd: { type: String, required: true },
    admin: { type: Boolean, required: true },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hist" }],
  });

  const HistorySchema = mongoose.Schema({
    player1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    record: [{ type: Number}],
    startTime: { type: Number},
    elapsedTime: { type: Number},
    Winner: {type: Number}
  });


  const User = mongoose.model("User", UserSchema);
  const Hist = mongoose.model("Hist", HistorySchema);




  // Login - DONE!

  app.post("/login", (req, res) => {
    if (req.body["username"].length < 4 || req.body["username"].length > 20) {
      return res.status(400).json("wrong name length");
    }

    if (req.body["pwd"].length < 4 || req.body["pwd"].length > 20) {
      return res.status(400).json("wrong password length");
    }
    const password = req.body.pwd;
    User.findOne({ username: req.body["username"] }).then((user) => {
      if (user == null) {
        return res.status(404).json({ Usernotfound: "user not found" });
      }
      bcrypt.compare(password, user.pwd).then((isMatch) => {
        if (isMatch) {
          res.cookie('name', req.body["username"]);
          res.cookie('loggined', 'true');
          res.send("login successful");
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });



  // View User Records
  app.get("/history/:username", (req, res) => {
    User.findOne({ username: req.params["username"] }, "-_id history")
      .populate("history", "-_id player1 player2 record startTime elapsedTime Winner")
      .exec()
      .then((his) => {
        res.send(JSON.stringify(his.history));
      });
  });


  //Admin Create User-->DONE
  app.post("/user", (req, res) => {
    const newUser = new User({
      username: req.body["username"],
      pwd: req.body["pwd"],
      admin: false,
    });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.pwd, salt, (err, hash) => {
          if (err) throw err;
          newUser.pwd = hash;
          newUser.save().then(
            (results) => {
              res.status(201).send("Ref: " + results);
            },
            (err) => {
              res.contentType("text/plain");
              res.send(err);
            }
          );
        });
      });
  });

  // Admin Retrieve User Data // search query-->DONE
  app.get("/user", (req, res) => {
    if (req.query["username"] != null) {
      var query = User.find({
        username: req.query["username"]
      });
      query.select("-_id username pwd");
      query.exec().then(
        (results) => {
          res.send(results);
        },
        (err) => {
          res.contentType("text/plain");
          res.send(err);
        }
      )
    } else {
      var query = User.find();
      query.select("-_id username pwd");
      query.exec().then(
        (results) => {
          if (results == null) {
            res
              .status(404)
              .send("Something is wrong.");
          } else {
            res.send(results);
          }
        },
        (err) => {
          res.contentType("text/plain");
          res.send(err);
        }
      )}
  });

  // Admin Update User Data - DONE!
   app.put("/user", (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body["newpassword"], salt, (err, hash) => {
        if (err) throw err;
        req.body["newpassword"] = hash;
        var query = User.findOneAndUpdate(
          { username: req.body["username"]},
          {
            username: req.body["newusername"],
            pwd: req.body["newpassword"],
          }
        );
        query.exec().then(
          (results) => {
            if (results != null) {
              res.contentType("text/plain");
              res.status(200);
              var event = JSON.stringify(results, null, "\t");
              res.send(event);
            } else {
              res.status(404);
              res.send("Opps...")
            }
          },
          (error) => {
            res.contentType("text/plain");
            res.send(error);
          }
        );
      });
    });

    
    
  });

  // Admin delete User-->DONE
  app.delete("/user/:username", (req, res) => {
    var query = User.findOne({ username: req.params["username"] });
    query.exec().then(
      (results) => {
        if (results == null) {
          res.contentType("text/plain");
          res.status(404).send("This user is not existed.\n404 Not Found\n");
        } else {
          User.deleteOne({ _id: results._id }).then(
            function () {
              res.status(204).send("204 No Content");
            },
            (error) => {
              res.contentType("text/plain");
              res.send(error);
            }
          );
        }
      },
      (err) => {
        res.contentType("text/plain");
        res.send(err);
      }
    );
  });

  app.get("/api", (req, res) => {
    res.json({ message: "Hello from sever" });
  });

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build"));
  });
});

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
