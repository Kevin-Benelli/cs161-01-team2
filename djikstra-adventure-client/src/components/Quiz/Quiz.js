import React from "react";

import { useState, useEffect, useRef } from "react";
import styles from "./QuizQuestions.module.css";
import Question from "./Question";
import QuizQuestions from "./QuizQuestions";

const Quiz = ({ socket, username, quizroom, questions, lobbyUsernames }) => {
  // const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(false);
  const timeLimit = 20;

  const questionsInterval = useRef();
  const [questionData, setQuestionData] = useState(questions);
  const [time, setTimer] = useState(timeLimit);
  const timerInterval = useRef();

  // useEffect(() => {
  //   console.log(socket.id);
  //   socket.on("recieve_username", (username) => {
  //     setLobbyUsernames((prevUsers) => {
  //       return [username, ...prevUsers];
  //     });
  //   });
  // }, []);

  // useEffect(() => {
  //   timerInterval.current = setInterval(() => {
  //     setTimer((prevTime) => prevTime - 1);
  //   }, 1000);

  //   questionsInterval.current = setInterval(() => {
  //     setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  //   }, timeLimit * 1000);
  // }, [questionData]);

  // useEffect(() => {
  //   if (time === 0) setTimer(timeLimit);
  // }, [time]);

  // useEffect(() => {
  //   if (currentQuestion === questionData.length && currentQuestion !== 0) {
  //     clearInterval(questionsInterval.current);
  //     clearInterval(timerInterval.current);
  //     setDisplayScore(true);
  //   }
  // }, [currentQuestion]);

  // // Listens to whenever there is a change in socket server
  // useEffect(() => {
  //   // listen to receive_message event and create call back function to handle message on client
  //   // grab data from backend (data)
  //   socket.on("receive_message", (data) => {
  //     console.log("here:", data);
  //     // setSelectedAnswer(data);
  //   });
  // }, [socket]);

  // const handleUserAnswer = async (userAnswer, correctAnswer) => {
  //   console.log("Question passed in:", questionData[currentQuestion].question);
  //   console.log("Answer passed in:", userAnswer);
  //   console.log("Correct Answer: ", correctAnswer);

  //   setIsCorrect(userAnswer === correctAnswer);

  //   if (userAnswer === correctAnswer) {
  //     setUserScore(userScore + 1);
  //   }

  //   // const nextQuestion = currentQuestion + 1;
  //   // // console.log("nexxxxt: ", nextQuestion, questions.length);
  //   // // If the index is less than the total questions continue displaying
  //   // if (nextQuestion < questions.length) {
  //   //   setCurrentQuestion(nextQuestion);
  //   // } else {
  //   //   setDisplayScore(true);
  //   // }
  //   // setSelectedAnswer(selectedAnswer);

  //   console.log("Correct Answer? - ", userAnswer === correctAnswer);
  //   console.log("");
  //   // messageData provides more details about answer submission
  //   const messageData = {
  //     quizroom: quizroom, // stores specific quizroom
  //     user: username, // maps message to user name
  //     // selectedAnswer: userAnswer === correctAnswer, // sets messsage to message drafted
  //     question: questionData[currentQuestion].question,
  //     answer: questionData[currentQuestion].correctAnswer,
  //     useranswer: userAnswer,
  //     usercorrect: isCorrect,
  //     // gets time stamp by hours and minutes
  //     time:
  //       new Date(Date.now()).getHours() +
  //       ":" +
  //       new Date(Date.now()).getMinutes() +
  //       ":" +
  //       new Date(Date.now()).getSeconds(),
  //   };

  //   // Wait for message to be sent before continuing to move forward so make it asyncronous
  //   // emits message data object to messaging server
  //   await socket.emit("send_message", messageData);

  //   // // When we send a message we store our message in the quiz log
  //   // setMessageLog((prevMessageLog) => [...prevMessageLog, messageData]);
  // };

  const [showQuizBox, setShowQuizBox] = useState(false);
  const [lobbyUsers, setLobbyUsers] = useState([]);

  // Listens to whenever there is a change in socket server
  useEffect(() => {
    // listen to receive_message event and create call back function to handle message on client
    // grab data from backend (data)
    socket.on("recieve_start_game", (data) => {
      console.log("IN START GAME USE EFFECT:", data);
      setShowQuizBox(true);

      // whenever someone emmit a message it sets message log to what ever it was before plus the new message
      // setMessageLog((prevMessageLog) => [...prevMessageLog, data])
    });
  }, [socket]);

  // function emit socket event to join room.
  const startGame = async () => {
    console.log("joinRoom clicked");

    // GET HASHSET AND CHECK IF Quiz Room Key EXISTS IN Quiz Room Key SET; ELSE ERROR MESSAGE
    if (username !== "" && quizroom !== "") {
      // socket.on("send_start_game", { username, quizroom }); // Add time here
      setShowQuizBox(true);
      const start = true;
      await socket.emit("send_start_game", { start, quizroom });
      // socket.emit("join_quiz_room", quizRoom); // Add time here
    }
  };

  return (
    <React.Fragment>
      <div className="quiz-room-window">
        <div className="quiz-room-header-title">
          <h1 className={styles.header}> Quiz Room Lobby for {quizroom} </h1>
          {/* {socket.emit("join_quiz_lobby")} */}
          {!showQuizBox && (
            <>
              <h1>"USERS" {lobbyUsernames}</h1>
              <button onClick={startGame}>Start Game!</button>{" "}
            </>
          )}
          {showQuizBox && (
            <QuizQuestions
              socket={socket}
              username={username}
              quizroom={quizroom}
              questions={questions}
            />
          )}
          <hr />
        </div>
      </div>
    </React.Fragment>
  );
};

// return (
//   <React.Fragment>
//     <h1> Lobby</h1>

//     {/* <QuizQuestions
//       socket={socket}
//       username={username}
//       quizroom={quizroom}
//       questions={questions}
//     /> */}
//   </React.Fragment>
// );
// };

export default Quiz;
