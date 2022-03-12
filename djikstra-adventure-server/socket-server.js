const express = require("express");
const app = express();
const cors = require("cors");

// const port = process.env.PORT || 5001; // localhost 5001
const port = 5001; // localhost 5001
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", cors(), async (req, res) => {
  res.send("Yah boi is workin");
});

app.get("/home", cors(), async (req, res) => {
  res.send("This is the data for the home page from Express");
});

// app.post("/answer", cors(), async (req, res) =>{

// });

app.get("/api/v1/quiz", (req, res) => {
  console.log("GET REQUEST RECIEVED");
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

const io = new Server(server, {
  cors: {
    // identify what server is calling our socket.io server (setting to reactJS local dev server)
    // origin: "http://localhost:3000", // grats permission to accept socket communication with this url
    origin: "*", // grats permission to accept socket communication with this url
    mathods: ["GET", "POST"],
  },
});

// Listen for socket event to be recieved: listens for event with name "connection"
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // should console.log the id of the user

  // listens and passes quiz room id to socket // this is passed through at the client level
  socket.on("join_quiz_room", (data) => {
    socket.join(data);
    console.log(`User ID: ${socket.id} joined the quiz room: ${data}`);
  });

  // listens for message data to be emitted from client side (quiz.js) / creates event send_message
  socket.on("send_message", (data) => {
    // Emits messages you send to all other uses in the quizRoom
    socket.to(data.quizroom).emit("receive_message", data);
    console.log("send_message:", data);
  });

  // disconnect from the server at the end
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}`);
// });

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
