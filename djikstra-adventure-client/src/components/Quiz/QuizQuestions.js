import React from "react";
import { useState, useEffect } from "react";
import styles from "./QuizQuestions.module.css";
import Question from "./Question";

const QuizQuestions = ({ socket, username, quizroom, questions }) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(false);

  // Listens to whenever there is a change in socket server
  useEffect(() => {
    // listen to receive_message event and create call back function to handle message on client
    // grab data from backend (data)
    socket.on("receive_message", (data) => {
      console.log("here:", data);
      setSelectedAnswer(data);
    });
  }, [socket]);

  const handleUserAnswer = async (userAnswer, correctAnswer) => {
    console.log("Answer passed in:", userAnswer);
    console.log("Correct Answer: ", correctAnswer);

    setIsCorrect(userAnswer === correctAnswer);

    if (userAnswer === correctAnswer) {
      setUserScore(userScore + 1);
    }

    const nextQuestion = currentQuestion + 1;
    console.log("nexxxxt: ", nextQuestion, questions.length);
    // If the index is less than the total questions continue displaying
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setDisplayScore(true);
    }
    // setSelectedAnswer(selectedAnswer);

    console.log("Correct Answer? - ", userAnswer === correctAnswer);
    console.log("");
    // messageData provides more details about answer submission
    const messageData = {
      quizroom: quizroom, // stores specific quizroom
      user: username, // maps message to user name
      selectedAnswer: userAnswer === correctAnswer, // sets messsage to message drafted
      iscorrect: isCorrect,
      // gets time stamp by hours and minutes
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes() +
        ":" +
        new Date(Date.now()).getSeconds(),
    };

    // Wait for message to be sent before continuing to move forward so make it asyncronous
    // emits message data object to messaging server
    await socket.emit("send_message", messageData);

    // // When we send a message we store our message in the quiz log
    // setMessageLog((prevMessageLog) => [...prevMessageLog, messageData]);
  };

  return (
    <div>
      <div className="quiz-room-window">
        <div className="quiz-room-header-title">
          <h1 className={styles.header}> Live Quiz Room for {quizroom} </h1>
          <hr />
        </div>

        {console.log("yioooo: ", questions)}
        {displayScore ? (
          <div className="score-section">
            Scored: {userScore} / {questions.length}
          </div>
        ) : (
          <div className={styles.answers}>
            <Question
              index={currentQuestion}
              question={questions[currentQuestion]}
              onHandleUserAnswer={handleUserAnswer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestions;

// Extras
// useEffect(() => {
//   const delay = setTimeout(() => {
//     console.log("in delayyyy");
//     setCurrentQuestion(question);
//   }, 3000);
//   // return () => clearTimeout(delay);
// }, []);

// useEffect(() => {
//   const delay = setTimeout(() => {
//     console.log("in delayyyy");
//     setCurrentQuestion(questionInterval);
//   }, 2000);
//   return () => clearTimeout(delay);
// }, [questionInterval, currentQuestion]);

// let questionInterval = questions.map((question, index) => {
//   return (
//     <Question
//       question={question}
//       index={index}
//       socket={socket}
//       username={username}
//       quizroom={quizroom}
//     />
//   );
// });
