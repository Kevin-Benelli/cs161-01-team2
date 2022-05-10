const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 5001; // localhost 5001
// const port = 5001; // localhost 5001
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

// Socket.io is requried for quizing service
const { Server } = require("socket.io");
const http = require("http");

const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 1,
  transports: ["websocket"],
};

// Instantiate socket server
const server = http.createServer(connectionOptions, app);
const totalUserConnectionLimit = 4;

const io = new Server(server, {
  cors: {
    // identify what server is calling our socket.io server (setting to reactJS local dev server)
    // origin: "http://localhost:3000", // grats permission to accept socket communication with this url
    origin: ["http://localhost:3000"], // grats permission to accept socket communication with this url
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200,
    credentials: "include",
  },
});

// { credentials: true, origin: "http://localhost:5001" }

const server_lobby_rooms = {};

// Listen for socket event to be received: listens for event with name "connection"
io.on("connection", (socket) => {
  // listens and passes quiz room id to socket // this is passed through at the client level
  socket.on("join_quiz_lobby", (data) => {
    const { userName, quizRoom } = data;
    let clientsInRoom = 0;

    // Get total number of clients connect to specific socket room
    if (io.sockets.adapter.rooms.has(quizRoom)) {
      console.log(
        "FOUND ROOM",
        io.sockets.adapter.rooms.get(quizRoom).size + 1
      );
      clientsInRoom = io.sockets.adapter.rooms.get(quizRoom).size + 1;
    } else {
      clientsInRoom = 0; // no users have entered room yet
    }

    // If total number of clients is <= 4 then allow user to connect to room, else throw error
    if (clientsInRoom <= totalUserConnectionLimit) {
      console.log(`User Connected: ${socket.id} / ${userName} / ${quizRoom}`); // should console.log the id of the user
      console.log(`User ID: ${socket.id} joined the quiz room: ${data}`);
      console.log("usrn: ", userName);

      socket.join(quizRoom);
      console.log(
        "users ids: ",
        io.sockets.adapter.rooms.get(quizRoom),
        "quiz room: ",
        quizRoom
      );
      if (server_lobby_rooms[data.quizroom]) {
        // Emits users who join quizRoom in user obj
        socket
          .to(quizRoom)
          .emit("receive_users", Object.values(server_lobby_rooms[quizRoom]));
        console.log("Joined lobby");
      }
    }
    // If room has reached max user limit then don't allow connection and throw error
    else {
      socket.emit("error", {
        message: `Reached the maximum number of users for room: ${quizRoom}`,
        error: true,
      });
      socket.disconnect();
      console.log(`User ${socket.id} Disconnected Due to Max Limit`);
    }
  });

  socket.on("send_start_game", (data) => {
    console.log("GET REQUEST RECEIVED");
    const questionData = [
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

      {
        question:
          "Level order Traversal of a rooted Tree can be done by starting from root and performing: ",
        correctAnswer: "Breadth First Search",
        answer1: "Breadth First Search",
        answer2: "Depth First Search",
        answer3: "Root Search",
        answer4: "Deep Search",
        index: 3,
      },

      {
        question:
          "Which of the following is not a stable sorting algorithm in its typical implementation.",
        correctAnswer: "Quick Sort",
        answer1: "Insertion Sort",
        answer2: "Merge Sort",
        answer3: "Quick Sort",
        answer4: "Bubble Sort",
        index: 4,
      },

      {
        question: "What is the best time complexity of bubble sort?",
        correctAnswer: "N",
        answer1: "N^2",
        answer2: "NlogN",
        answer3: "N",
        answer4: "N(logN)^2",
        index: 5,
      },

      {
        question:
          "Which one of the following in place sorting algorithms needs the minimum number of swaps?",
        correctAnswer: "Selection sort",
        answer1: "Quick sort",
        answer2: "Insertion sort",
        answer3: "Selection sort",
        answer4: "Heap sort",
        index: 6,
      },

      {
        question:
          "Which of the following sorting algorithms can be used to sort a random linked list with minimum time complexity?",
        correctAnswer: "Merge sort",
        answer1: "Insertion sort",
        answer2: "Quick sort",
        answer3: "Heap sort",
        answer4: "Merge sort",
        index: 7,
      },

      {
        question:
          "The best data structure to check whether an arithmetic expression has balanced parenthesis is a ",
        correctAnswer: "Stack",
        answer1: "Queue",
        answer2: "Stack",
        answer3: "Tree",
        answer4: "List",
        index: 8,
      },

      {
        question: "A full binary tree with n leaves contains: ",
        correctAnswer: "2n-1 nodes",
        answer1: "n nodes",
        answer2: "log(n) nodes",
        answer3: "2n-1 nodes",
        answer4: "2^n nodes",
        index: 9,
      },

      {
        question:
          "Which of the following traversal outputs the data in sorted order in a BST?",
        correctAnswer: "Inorder",
        answer1: "Preorder",
        answer2: "Inorder",
        answer3: "Postorder",
        answer4: "Level order",
        index: 10,
      },

      {
        question:
          "Which of the following data structure is useful in traversing a given graph by breadth first search?",
        correctAnswer: "Queue",
        answer1: "Stack",
        answer2: "List",
        answer3: "Queue",
        answer4: "None of the above",
        index: 11,
      },

      {
        question:
          "Which data structure is most efficient to find the top 10 largest items out of 1 million items stored in file?",
        correctAnswer: "Min heap",
        answer1: "Min heap",
        answer2: "Max heap",
        answer3: "BST",
        answer4: "Sorted array",
        index: 12,
      },

      {
        question:
          "In a binary max heap containing n numbers, the smallest element can be found in time ",
        correctAnswer: "O(n)",
        answer1: "O(n)",
        answer2: "O(logn)",
        answer3: "O(loglog(n))",
        answer4: "O(1)",
        index: 13,
      },

      {
        question:
          "Which traversal of tree resembles the breadth first search of the graph?",
        correctAnswer: "Level order",
        answer1: "Preorder",
        answer2: "Inorder",
        answer3: "Postorder",
        answer4: "Level order",
        index: 14,
      },

      {
        question:
          "The minimum number of stacks needed to implement a queue is ",
        correctAnswer: "2",
        answer1: "3",
        answer2: "1",
        answer3: "2",
        answer4: "4",
        index: 15,
      },

      {
        question:
          "How many queues are needed to implement a stack. Consider the situation where no other data structure like arrays, linked list is available to you.",
        correctAnswer: "2",
        answer1: "1",
        answer2: "2",
        answer3: "3",
        answer4: "4",
        index: 16,
      },

      {
        question:
          "Which of the following algorithms sort n integers, having the range 0 to (n^2 - 1), in ascending order in O(n) time?",
        correctAnswer: "Radix sort",
        answer1: "Selection sort",
        answer2: "Bubble sort",
        answer3: "Radix sort",
        answer4: "Insertion sort",
        index: 17,
      },

      {
        question:
          "Which of the following algorithm design technique is used in merge sort?",
        correctAnswer: "Divide and Conquer",
        answer1: "Greedy method",
        answer2: "Backtracking",
        answer3: "Dynamic programming",
        answer4: "Divide and Conquer",
        index: 18,
      },

      {
        question: "Selection sort algorithm design technique is an example of ",
        correctAnswer: "Greedy method",
        answer1: "Greedy method",
        answer2: "Divide and Conquer",
        answer3: "Dynamic programming",
        answer4: "Backtracking",
        index: 19,
      },
    ];

    const tenRandomQuestionsObj = {};
    const tenRandomQuestions = [];
    while (Object.keys(tenRandomQuestionsObj).length < 10) {
      let randomQuestionIndex = Math.floor(Math.random() * questionData.length);
      tenRandomQuestionsObj[randomQuestionIndex] =
        questionData[randomQuestionIndex];
    }

    for (const questionIndex in tenRandomQuestionsObj) {
      // console.log("ITTERATION OBJ: ", tenRandomQuestionsObj[questionIndex]);
      tenRandomQuestions.push(tenRandomQuestionsObj[questionIndex]);
    }

    console.log(tenRandomQuestions);

    // res.json({
    //   questionData: tenRandomQuestions,
    // });

    // const questionDataObj = {
    //   questionData: tenRandomQuestions,
    // };

    // console.log("FROM SOCKET SERVER: ", tenRandomQuestions);
    console.log("SOCKET - In send_start_game: ", data);
    const startGameData = {
      start: data.start,
      gameID: uuidv4(),
      questionData: tenRandomQuestions,
    };
    console.log("send_start_game, startGameData: ", startGameData);
    io.sockets.to(data.quizroom).emit("receive_start_game", startGameData);
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
