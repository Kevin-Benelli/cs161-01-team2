import React from "react";

import { useState, useEffect, useRef } from "react";
import styles from "./QuizQuestions.module.css";
import Question from "./Question";
import QuizQuestions from "./QuizQuestions";

const Quiz = ({ socket, username, quizroom, questions, lobbyUsernames }) => {
  const [showQuizBox, setShowQuizBox] = useState(false);
  const [lobbyUsers, setLobbyUsers] = useState([]);

  useEffect(() => {
    // Update current user on init load
    refreshUsers();
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
    // setLobbyUsers((prevUsers) => [...prevUsers, username]);
    // Send username to all other users within lobby room (need up update when users disconnect)
    const user_data = {
      quizroom: quizroom,
      username: username,
    };

    await socket.emit("send_users", user_data); // async await for socket receive

    setLobbyUsers((prevUsers) => [...prevUsers, username]);
  };

  // Listens to whenever there is a change in socket server
  useEffect(() => {
    // receive socket await and update users within lobby
    console.log("CLIENT: IN socket update Use Effect");
    socket.on("receive_users", (users) => {
      console.log(
        "IN UPDATE USERS USE EFFECT: /////",
        users,
        "////",
        users[0].username
      );
      // setLobbyUsers((prevUsers) => [...prevUsers, username.username]);
      setLobbyUsers(users);
    });

    // receive socket await signal for all parties within lobby after a users clicks start game
    socket.on("receive_start_game", (data) => {
      console.log("IN START GAME USE EFFECT:", data);
      setShowQuizBox(true);
    });

    socket.on("disconnected", (id) => {
      console.log("IN DISCONNECTED EFFECT");
      setLobbyUsers((prevUsers) => [
        ...prevUsers.filter((prevUser) => prevUser.id !== id),
      ]);
      console.log("User deleted: ", id);
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
                {lobbyUsers.map(({ username, userID }) => {
                  return <li key={userID}> USER: {username}</li>;
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
