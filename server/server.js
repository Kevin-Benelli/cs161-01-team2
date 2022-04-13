const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const MOMENT = require("moment");
// app.use(express.json());
// app.use(express.urlencoded());
// const bodyParser = requrie("body-parser");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");

const saltRounds = 10;
const port = 5000 || process.env.PORT;

// { credentials: true, origin: "http://localhost:5001" }
app.use(express.json());
const corsCongif = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true, // allows cookies to be enabled
  optionSuccessStatus: 200,
};

app.use(cors(corsCongif));

app.use((req, res, next) => {
  const corsWhitelist = ["http://localhost:3000"];
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  }

  next();
});

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

// tested
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

// tested
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

// tested
app.post("/api/v1/post_score", cors(), async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");

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

// //tested
// app.get("/api/v1/get_scores/:username", async (req, res) => {
//   res.set("Access-Control-Allow-Origin", "http://localhost:3000");
//   let username = req.params["username"];

//   const query = `SELECT * FROM scores WHERE username = ?`;
//   try {
//     db.query(query, username, (err, result) => {
//       if (result.length == 0) {
//         res.sendStatus(404);
//       } else {
//         console.log(result);
//         let result_accounts = [];
//         for (let i = 0; i < result.length; i++) {
//           result_accounts.push(result[i]);
//         }
//         res.json({
//           status: "success",
//           data: {
//             Account: result_accounts,
//           },
//         });
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(500);
//   }
// });
app.get("/api/v1/get_scores/:gameID", async (req, res) => {
  const { gameID } = req.params;
  console.log("GET SCORE REQUEST: ", gameID);
  const sql =
    "SELECT scoreID, room, username, userscore, questionlength FROM Website.scores WHERE gameID = ? ORDER BY userscore DESC";
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
        result: result, // object of user scores per game
        message: "Get game stats success!",
        error: false,
      });
    }
  });
});

//tested
app.post("/AccountStats", async (req, res) => {
  let { FK_User, Login, day } = req.body;

  console.log("/AccountStats");

  console.log("Express received: ", req.body);

  db.query(
    "INSERT INTO UserLogin (FK_User, Login, day) VALUES (?,?,?)",
    [FK_User, Login, day],
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

//tested
app.post("/GameInfo", async (req, res) => {
  let { GameID, DateOfGame, TitleOfGame, NumberOfPlayers } = req.body;

  console.log("/GameInfo");

  console.log("Express received: ", req.body);

  db.query(
    "INSERT INTO Game(GameID, DateOfGame, TitleOfGame, NumberOfPlayers) VALUES (?,?,?,?)",
    [GameID, DateOfGame, TitleOfGame, NumberOfPlayers],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          message: "Game data failed to save",
          error: true,
        });
      } else {
        res.send({
          message: "Game data saved",
          error: false,
        });
      }
    }
  );
});

// tested
app.post("/PlayerInfo", async (req, res) => {
  let { FK_GameID, FK_Username, Score, Place } = req.body;

  console.log("/PlayerInfo");

  console.log("Express received: ", req.body);

  db.query(
    "INSERT INTO Player(FK_GameID, FK_Username, Score, Place) VALUES (?,?,?,?)",
    [FK_GameID, FK_Username, Score, Place],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          message: "Player data failed to save",
          error: true,
        });
      } else {
        res.send({
          message: "Player data saved",
          error: false,
        });
      }
    }
  );
});

// Returns the users account data, tested
app.get("/users/:username", async (req, res) => {
  let username = req.params["username"];

  const query = `SELECT * FROM users WHERE username = ?`;
  try {
    db.query(query, username, (err, result) => {
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        console.log(result);
        let result_accounts = [];
        for (let i = 0; i < result.length; i++) {
          result_accounts.push(result[i]);
        }
        res.json({
          status: "success",
          data: {
            Account: result_accounts,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Returns the users login data, tested
app.get("/usersLoginData/:FK_User", async (req, res) => {
  let FK_User = req.params["FK_User"];

  const query = `SELECT * FROM UserLogin WHERE FK_User = ?`;
  try {
    db.query(query, FK_User, (err, result) => {
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        console.log(result);
        let result_accounts = [];
        for (let i = 0; i < result.length; i++) {
          result_accounts.push(result[i]);
        }
        res.json({
          status: "success",
          data: {
            AccountLoginData: result_accounts,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Returns the games data, tested
app.get("/GameData/:GameID", async (req, res) => {
  let GameID = req.params["GameID"];

  const query = `SELECT * FROM Game WHERE GameID = ?`;
  try {
    db.query(query, GameID, (err, result) => {
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        console.log(result);
        let game_results = [];
        for (let i = 0; i < result.length; i++) {
          game_results.push(result[i]);
        }
        res.json({
          status: "success",
          data: {
            "Game data": game_results,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Returns the users login data, tested
app.get("/PlayerData/:FK_GameID", async (req, res) => {
  let FK_GameID = req.params["FK_GameID"];

  const query = `SELECT * FROM Player WHERE FK_GameID = ?`;
  try {
    db.query(query, FK_GameID, (err, result) => {
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        console.log(result);
        let result_accounts = [];
        for (let i = 0; i < result.length; i++) {
          result_accounts.push(result[i]);
        }
        res.json({
          status: "success",
          data: {
            PlayerData: result_accounts,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Returns the users account data, tested
app.get("/users", async (req, res) => {
  const query = `SELECT * FROM users`;
  try {
    db.query(query, (err, result) => {
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        console.log(result);
        let result_accounts = [];
        for (let i = 0; i < result.length; i++) {
          result_accounts.push(result[i]);
        }
        res.json({
          status: "success",
          data: {
            Accounts: result_accounts,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/Questions", async (req, res) => {
  let { Category, QuestionInfo } = req.body;

  console.log("/PlayerInfo");

  console.log("Express received: ", req.body);

  db.query(
    "INSERT INTO Questions(Category, QuestionInfo) VALUES (?,?)",
    [Category, QuestionInfo],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          message: "Question data failed to save",
          error: true,
        });
      } else {
        res.send({
          message: "Question data saved",
          error: false,
        });
      }
    }
  );
});

app.get("/Questions/:QuestionID", async (req, res) => {
  let QuestionID = req.params["QuestionID"];

  const query = `SELECT * FROM Questions Where QuestionID = ?`;
  try {
    db.query(query, QuestionID, (err, result) => {
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        console.log(result);
        let result_accounts = [];
        for (let i = 0; i < result.length; i++) {
          result_accounts.push(result[i]);
        }
        res.json({
          status: "success",
          data: {
            Accounts: result_accounts,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log("server is workinnn rn", port);
});
