const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");

// const bodyParser = requrie("body-parser");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");

const saltRounds = 10;
const port = 5000 || process.env.PORT;
// app.use(express.json());
// app.use(express.urlencoded());

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true, // allows cookies to be enabled
  })
);

// app.use(cookieParser());
// app.use(bodyParser().urlencoded({ extended: true }));
// app.use(
//   session({
//     key: "userId", // name of cookie we are creating
//     secret: "cookieSecret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 60 * 60 * 1,
//     }, // cookie expiration date for when cookie expires
//   })
// );

app.use(express.static(__dirname + "/public"));
// app.get("/", cors(), async (req, res) => {
//   res.send("Yah boi is workin");
// });

app.get("/", cors(), async (req, res) => {
  res.send("Yah boi Server is workin");
});

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "Website",
});

app.post("/post_create_account", (req, res) => {
  const { username, password } = req.body;

  console.log("POST REQUEST RECEIVED: /post_create_account");
  console.log("Express received: ", { username }, { password });

  bcrypt.hash(password, saltRounds, (error, hash) => {
    if (error) {
      console.log(error, hash);
    }

    // Add username and password to the database
    db.query(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            message: "Account creation failed/Username taken",
            error: true,
          });
        } else {
          res.send({
            message: "New account created",
            error: false,
          });
        }
      }
    );
  });
});

app.post("/post_login", async (req, res) => {
  const { username, password } = req.body;

  console.log("POST REQUEST RECEIVED: /post_login");
  console.log("Express received: ", { username }, { password });

  // validate username and passwords match with db records
  db.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (err, result) => {
      console.log("LOGIN RESULT: ", result);
      if (err) {
        console.log(err);
        res.send({ err: err });
      }

      if (result.length > 0) {
        // console.log("SERVER: yoooo we found a match");
        console.log("PASS: ", password, result[0].password);
        bcrypt.compare(password, result[0].password, (error, response) => {
          console.log("RES: ", response);
          if (response) {
            // console.log("SESSION USER: ", req.session);
            // req.session.user = result;

            res.send({
              message: "Login Successful",
              error: false,
            });
          } else {
            console.log("HERE: ", response);
            res.send({
              message: "Incorrect username/password combination.",
              error: true,
            });
          }
        });
      } else {
        res.send({
          message: "User doesn't exist",
          error: true,
        });
      }
    }
  );
});
const MOMENT = require("moment");

app.post("/api/v1/post_score", async (req, res) => {
  console.log("POST REQUEST RECEIVED: /api/v1/post_score");
  // let scoreID = 100;
  const { quizroom, username, userscore, questionlength, gameID } = req.body;
  console.log("Score: ", quizroom, username, userscore, questionlength, gameID);
  let datetime = MOMENT().format("YYYY-MM-DD  HH:mm:ss.000");

  db.query(
    "INSERT INTO scores (room, username, userscore, questionlength, gameID, timestamp) VALUES (?,?,?,?,?,?)",
    [quizroom, username, userscore, questionlength, gameID, datetime],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          message: "Could not post Score",
          error: true,
        });
      } else {
        res.send({
          message: "posted score",
          error: false,
        });
      }
    }
  );
});

app.get("/api/v1/get_scores/:gameID", async (req, res) => {
  const { gameID } = req.params;
  console.log("GET SCORE REQUEST: ", gameID);
  const sql =
    "SELECT room, username, userscore, questionlength FROM Website.scores WHERE gameID = ? ORDER BY userscore DESC";
  db.query(sql, [gameID], (err, result) => {
    if (err) {
      console.log("Get Game Stats Error: ", err);
      res.send({
        message: "Error getting game stats for gameID: " + gameID,
        error: true,
      });
    } else {
      console.log("Game Stat Results: ", result);
      res.send({
        result: result,
        message: "Get game stats success!",
        error: false,
      });
    }
  });
});

app.post("/AccountStats", async (req, res) => {
  let { FK_UserID, Login, day } = req.body;

  console.log("/AccountStats");

  console.log("Express received: ", req.body);

  db.query(
    "INSERT INTO UserLogin (FK_UserID, Login, day) VALUES (?,?,?)",
    [FK_UserID, Login, day],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          message: "User login data failed to save",
          error: true,
        });
      } else {
        res.send({
          message: "User login data saved",
          error: false,
        });
      }
    }
  );
});

// db.connect(function (err) {
//   db.query("SELECT * FROM UserLogin", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

// db.connect(function (err) {
//   db.query("SELECT * FROM User", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

app.listen(port, () => {
  console.log("server is workinnn rn", port);
});

const path = require("path");

// Serve static files from the React frontend app
server.use(express.static(path.join(__dirname, "../client/build")));

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/build/index.html"));
});
