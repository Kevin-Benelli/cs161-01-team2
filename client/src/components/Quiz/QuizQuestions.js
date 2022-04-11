import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./QuizQuestions.module.css";
import Question from "./Question";
import Score from "../Score/Score";

const QuizQuestions = ({ socket, username, quizroom, questions, gameID }) => {
  // const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(false);
  const timeLimit = 10;

  const [correctAnswer, setCorrectAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");

  const questionsInterval = useRef();
  const [questionData, setQuestionData] = useState(questions);
  const [time, setTimer] = useState(timeLimit);
  const timerInterval = useRef();

  useEffect(() => {
    timerInterval.current = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    questionsInterval.current = setInterval(() => {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }, timeLimit * 1000);
  }, [questionData]);

  useEffect(() => {
    if (time === 0) {
      console.log("TIME ZERO: ", time, userAnswer, correctAnswer);
      if (
        userAnswer !== "" &&
        correctAnswer !== "" &&
        userAnswer === correctAnswer
      ) {
        setUserScore(userScore + 1); // increment score if correct
      }

      setUserAnswer("");
      setCorrectAnswer("");
      setTimer(timeLimit);
      // @TODO: post selected question to db
    }
  }, [time]);

  useEffect(() => {
    if (currentQuestion === questionData.length && currentQuestion !== 0) {
      clearInterval(questionsInterval.current);
      clearInterval(timerInterval.current);
      setDisplayScore(true);
    }
  }, [currentQuestion, questionData.length]);

  // Listens to whenever there is a change in socket server
  useEffect(() => {
    // listen to receive_message event and create call back function to handle message on client
    // grab data from backend (data)
    socket.on("receive_message", (data) => {
      console.log("here:", data);
      // setSelectedAnswer(data);
    });
  }, [socket]);

  const handleUserAnswer = async (userAnswer, correctAnswer) => {
    console.log("Question passed in:", questionData[currentQuestion].question);
    console.log("Answer passed in:", userAnswer);
    console.log("Correct Answer: ", correctAnswer);

    setUserAnswer(userAnswer);
    setCorrectAnswer(correctAnswer);
    setIsCorrect(userAnswer === correctAnswer);

    console.log("Correct Answer? - ", userAnswer === correctAnswer);

    // answerData provides more details about answer submission
    const answerData = {
      quizroom: quizroom, // stores specific quizroom
      user: username, // maps message to user name
      // selectedAnswer: userAnswer === correctAnswer, // sets messsage to message drafted
      question: questionData[currentQuestion].question,
      answer: questionData[currentQuestion].correctAnswer,
      useranswer: userAnswer,
      usercorrect: isCorrect,
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
    await socket.emit("send_answer_data", answerData);
  };

  return (
    <div>
      <div className="quiz-room-window">
        <div className="quiz-room-header-title">
          <h1 className={styles.header}> Live Quiz Room for {quizroom} </h1>
          <hr />
        </div>
        <div className={styles.timer}>{displayScore ? null : time}</div>

        {displayScore ? (
          <Score
            quizroom={quizroom}
            username={username}
            userscore={userScore}
            questionlength={questionData.length}
            gameID={gameID}
          />
        ) : currentQuestion === questionData.length ? null : (
          <div className={styles.answers}>
            <Question
              index={currentQuestion}
              question={questionData[currentQuestion]}
              onHandleUserAnswer={handleUserAnswer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestions;
