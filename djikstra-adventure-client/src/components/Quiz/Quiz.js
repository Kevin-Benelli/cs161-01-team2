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

  const [showQuizBox, setShowQuizBox] = useState(false);
  const [lobbyUsers, setLobbyUsers] = useState((prevUsers) => [
    prevUsers,
    ...lobbyUsernames,
  ]);

  useEffect(() => {
    // Update current use on init load
    console.log("lobby users take in: ", lobbyUsernames);
    setLobbyUsers(() => [lobbyUsernames]);
  }, []);

  // function emit socket event to join room.
  const startGame = async () => {
    // Emit socket event to all users within specific quiz room to start game
    console.log("startGame clicked");

    setShowQuizBox(true);
    const start = true;
    const start_game_data = {
      start: start,
      quizroom: quizroom,
    };
    await socket.emit("send_start_game", start_game_data);
  };

  const refreshUsers = async () => {
    console.log("refreshUsers Clicked!", [quizroom, username]);
    // Send username to all other users within lobby room (need up update when users disconnect)
    const user_data = {
      quizroom: quizroom,
      username: username,
    };
    await socket.emit("send_users", user_data); // async await for socket receive
    // setLobbyUsers((prevUsers) => [username, ...prevUsers]);
  };

  // Listens to whenever there is a change in socket server
  useEffect(() => {
    // receive socket await and update users within lobby
    console.log("CLIENT: IN socket update Use Effect");
    socket.on("receive_users", (username) => {
      console.log("IN UPDATE USERS USE EFFECT:", username);
      setLobbyUsers((prevUsers) => [username, ...prevUsers]);
    });

    // receive socket await signal for all parties within lobby after a users clicks start game
    socket.on("receive_start_game", (data) => {
      console.log("IN START GAME USE EFFECT:", data);
      setShowQuizBox(true);
    });
  }, [socket]);

  return (
    <React.Fragment>
      <div className="quiz-room-window">
        <div className="quiz-room-header-title">
          <h1 className={styles.header}> Quiz Room Lobby for {quizroom} </h1>
          {/* {socket.emit("join_quiz_lobby")} */}
          {!showQuizBox && (
            <>
              <h1>
                Users In Lobby:
                {lobbyUsers.map((user) => {
                  return <ul> User: {user}</ul>;
                })}
              </h1>
              <button onClick={startGame}>Start Game!</button>
              <button onClick={refreshUsers}>Refresh Users</button>
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

export default Quiz;
