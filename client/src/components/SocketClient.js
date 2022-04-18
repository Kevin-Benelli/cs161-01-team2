import React from "react";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import Quiz from "./Quiz/Quiz";
import cat_gif from "../images/cs_cat.gif";
import styles from "./SocketClient.module.css";
import AudioPlayer from "./AudioPlayer.js";

const ENDPOINT = "http://localhost:5001";
const socket = io(ENDPOINT);

const SocketClient = ({ onLogoutHandler }) => {
  const [userName, setUsername] = useState("");
  const [quizRoom, setQuizRoom] = useState("");
  const [showQuizBox, setShowQuizBox] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [lobbyUsers, setLobbyUsers] = useState([]);

  const [lobbyFullErrorMessage, setLobbyFullErrorMessage] = useState("");

  // useEffect(() => {
  //   setIsLoading(true);
  //   const fetchData = async () => {
  //     let response = await fetch("http://localhost:5001/api/v1/quiz");
  //     const data = await response.json();
  //     console.log("here: ", data["questionData"]);

  //     setQuestions(data["questionData"]);
  //   };
  //   fetchData().catch((error) => {
  //     console.log("Error: ", error);
  //   });

  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("in identifer effect", userName, quizRoom);
    }, 500);

    return () => {
      console.log("Debounce CLEANUP");
      clearTimeout(identifier);
    };
  }, [userName, quizRoom]);
  // function emit socket event to join lobby.
  const joinLobby = async () => {
    console.log("joinLobby clicked");

    // GET HASHSET AND CHECK IF Quiz Room Key EXISTS IN Quiz Room Key SET; ELSE ERROR MESSAGE
    if (userName !== "" && quizRoom !== "") {
      socket.emit("join_quiz_lobby", { userName, quizRoom }); // Add time here
      setLobbyUsers((prevUsers) => [userName, ...prevUsers]);
      setShowQuizBox(true);
    }
  };

  const onExitLobbyHandler = async (errorMessage) => {
    console.log("EXIT LOBBY CLIENT socket client", errorMessage);

    setShowQuizBox(false);
    setLobbyFullErrorMessage(errorMessage);
    window.location.reload();
  };

  return (
    <div className={styles.center}>
      {/* If quiz box is not displayed show enter quiz room; else show quiz box */}
      {!showQuizBox ? (
        <div className="joinQuizRoom">
          <h1 className={styles.header}>Join Quiz Lobby Now!</h1>
          <hr />
          <img src={cat_gif} alt="cat gif" className={styles.image} />
          <input
            // className={"joinQuizInputField"}
            className={styles.input}
            type="text"
            placeholder="Enter Name"
            onChange={(event) => {
              setUsername(event.target.value.toUpperCase());
              // console.log(event.target.value.toUpperCase());
            }}
          />
          <input
            // className="joinQuizInputField"
            className={styles.input}
            type="text"
            placeholder="Enter Quiz Lobby Key"
            onChange={(event) => {
              setQuizRoom(event.target.value.toUpperCase());
              // console.log(event.target.value.toUpperCase());
            }}
            onKeyPress={(event) => {
              // If user types message and presses enter then send the message
              event.key === "Enter" && joinLobby();
            }}
          />
          <button className={styles.button} onClick={joinLobby}>
            Join Lobby
          </button>
          <button className={styles.button} onClick={onLogoutHandler}>
            Logout
          </button>
          <h1>{lobbyFullErrorMessage} </h1>
        </div>
      ) : (
        // Call our quiz component and pass in the socket
        // Keep track of the username and quiz room being used so we pass that in as pops

        <>
          <Quiz
            socket={socket}
            username={userName}
            quizroom={quizRoom}
            lobbyUsernames={lobbyUsers}
            exitLobbyHandler={onExitLobbyHandler}
          />
          <AudioPlayer />
        </>
      )}
    </div>
  );
};

export default SocketClient;
