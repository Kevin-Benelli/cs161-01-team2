const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// const port = process.env.PORT || 5001; // localhost 5001
const port = 5001; // localhost 5001
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", cors(), async (req, res) => {
  res.send("Yah boi is workin");
});

app.get("/home", cors(), async (req, res) => {
  res.send("This is the data for the home page from Express");
});

app.get("/api/v1/quiz", cors(), async (req, res) => {
  console.log("GET REQUEST RECEIVED");
  res.json({
    questionData: [
      {
        question: "What Data Structure has O(1) Access",
        correctAnswer: "Hashmap",
        answer1: "Hashmap",
        answer2: "Array",
        answer3: "LinkedList",
        answer4: "Stack",
        index: 0,
      },
      {
        question: "What has an O(log(n)) worst case space complexity",
        correctAnswer: "Quicksort",
        answer1: "Mergesort",
        answer2: "Quicksort",
        answer3: "Heapsort",
        answer4: "Radix Sort",
        index: 1,
      },

      {
        question: "What is the insertion time of a AVL Tree",
        correctAnswer: "O(log(n))",
        answer1: "O(1)",
        answer2: "O(n)",
        answer3: "O(log(n))",
        answer4: "O(n^2)",
        index: 2,
      },
    ],
  });
});

// Socket.io is requried for quizing service
const { Server } = require("socket.io");
const http = require("http");

// Instantiate socket server
const server = http.createServer(app);
const totalUserConnectionLimit = 4;

const io = new Server(server, {
  cors: {
    // identify what server is calling our socket.io server (setting to reactJS local dev server)
    // origin: "http://localhost:3000", // grats permission to accept socket communication with this url
    origin: "*", // grats permission to accept socket communication with this url
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200,
  },
});

// { credentials: true, origin: "http://localhost:5001" }

const server_lobby_rooms = {};

// Listen for socket event to be received: listens for event with name "connection"
io.on("connection", (socket) => {
  // listens and passes quiz room id to socket // this is passed through at the client level
  socket.on("join_quiz_lobby", (data) => {
    console.log("SOCKET LOBBY!!!!!", data);
    const userName = data[0];
    const quizRoom = data[1];

    // if room has not met max user limit (4) then allow users to connect
    if (io.engine.clientsCount <= totalUserConnectionLimit) {
      console.log(`User Connected: ${socket.id} / ${userName} / ${quizRoom}`); // should console.log the id of the user
      console.log(`User ID: ${socket.id} joined the quiz room: ${data}`);
      console.log("usrn: ", userName);
      socket.join(quizRoom);

      // console.log("rooooooom: ", room);
      if (server_lobby_rooms[data.quizroom]) {
        // Emits users who join quizRoom in user obj
        socket
          .to(quizRoom)
          // .emit("receive_users", Object.values(server_lobby_users));
          .emit("receive_users", Object.values(server_lobby_rooms[quizRoom]));
        console.log("Joined lobby");
      }
    }
    // If room has reached max user limit then don't allow connection and throw error
    else {
      socket.emit("error", {
        message: "Reached the maximum number of users for this room",
      });
      socket.disconnect();
      console.log(`User ${socket.id} Disconnected Due to Max Limit`);
    }
  });

  socket.on("send_start_game", (data) => {
    console.log("SOCKET - In send_start_game: ", data);
    io.sockets.to(data.quizroom).emit("receive_start_game", data.start);
  });

  // listens and passes quiz room id to socket // this is passed through at the client level
  socket.on("join_quiz_room", (data) => {
    // if room has not met max user limit (4) then allow users to connect
    if (io.engine.clientsCount <= totalUserConnectionLimit) {
      console.log(`User Connected: ${socket.id}`); // should console.log the id of the user
      socket.join(data);
    }
    // If room has reached max user limit then don't allow connection and throw error
    else {
      socket.emit("error", {
        message: "Reached the maximum number of users for this room",
      });
      socket.disconnect();
      console.log(`User ${socket.id} Disconnected Due to Max Limit`);
    }

    console.log(`User ID: ${socket.id} joined the quiz room: ${data}`);
  });

  // listens for message data to be emitted from client side (quiz.js) / creates event send_message
  socket.on("send_users", (data) => {
    const user = {
      userID: socket.id,
      username: data.username,
      quizroom: data.quizroom,
    }; // create user obj

    // dynamicaly append users to dictionary array by quizroom
    if (server_lobby_rooms[data.quizroom]) {
      server_lobby_rooms[data.quizroom].push(user);
    } else {
      server_lobby_rooms[data.quizroom] = [user];
    }

    // Emits users who join quizRoom in user obj
    io.sockets
      .to(data.quizroom)
      .emit("receive_users", Object.values(server_lobby_rooms[data.quizroom]));
  });

  // disconnect from the server at the end / need to add to remove username from lobby when disconnect
  socket.on("disconnect", (e) => {
    console.log("disconnect event", e);
    const username = server_lobby_users[socket.id];
    delete server_lobby_users[socket.id];
    let room_match = "";

    for (const room in server_lobby_rooms) {
      // when user disconnects, remove the user out of of the lobby room
      for (const userIndex in room) {
        if (
          server_lobby_rooms[room][userIndex] &&
          server_lobby_rooms[room][userIndex].userID == socket.id
        ) {
          // if we find a match of the user id who disconnected, then remove the user from the lobby
          server_lobby_rooms[room].splice(userIndex, 1);
          room_match = room;
        }
      }
    }

    if (server_lobby_rooms[room_match]) {
      console.log("User Disconnected", socket.id);
      io.sockets
        .to(room_match)
        .emit("disconnected", server_lobby_rooms[room_match]);
    }
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
