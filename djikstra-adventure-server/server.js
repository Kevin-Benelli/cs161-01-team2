const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const port = 5000 || process.env.PORT;
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

  // // Add username and password to the database
  db.query(
    "INSERT INTO users (username, password) VALUES (?,?)",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          message: "Account creation failed",
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

app.post("/post_login", async (req, res) => {
  const { username, password } = req.body;

  console.log("POST REQUEST RECEIVED: /post_login");
  console.log("Express received: ", { username }, { password });

  // validate username and passwords match with db records
  db.query(
    "SELECT username, password FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (result.length < 1) {
        // console.log("SERVER: yooo result was <= 1");
        res.send({
          message: "Incorrect username/password",
          error: true,
        });
      } else {
        console.log(err);
        // console.log("SERVER: yoooo we found a match");
        res.send({
          message: "Login Successful",
          error: false,
        });
      }
    }
  );
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
