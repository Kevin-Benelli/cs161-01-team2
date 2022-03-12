import React from "react";
import { io } from "socket.io-client";
import { useState } from "react";
import Quiz from "./Quiz/Quiz";
import cat_gif from "../images/cs_cat.gif";
import styles from "./SocketClient.module.css";

const ENDPOINT = "http://localhost:5001";
const socket = io(ENDPOINT);

const SocketClient = () => {
  const [userName, setUsername] = useState("");
  const [quizRoom, setQuizRoom] = useState("");
  const [showQuizBox, setShowQuizBox] = useState(false);

  // function emit socket event to join room.
  const joinRoom = () => {
    console.log("joinRoom clicked");

    // GET HASHSET AND CHECK IF Quiz Room Key EXISTS IN Quiz Room Key SET; ELSE ERROR MESSAGE
    if (userName !== "" && quizRoom !== "") {
      socket.emit("join_quiz_room", quizRoom);
      setShowQuizBox(true);
    }
  };

  return (
    <div className="center">
      {/* If quiz box is not displayed show enter quiz room; else show quiz box */}
      {!showQuizBox ? (
        <div className="joinQuizRoom">
          <h1> Join Quiz Room Now! </h1>
          <hr />

          <img src={cat_gif} alt="cat gif" className={styles.image} />

          <input
            // className={"joinQuizInputField"}
            className={styles.input}
            type="text"
            placeholder="Enter Name"
            onChange={(event) => {
              setUsername(event.target.value.toUpperCase());
              console.log(event.target.value.toUpperCase());
            }}
          />
          <input
            // className="joinQuizInputField"
            className={styles.input}
            type="text"
            placeholder="Enter Quiz Room Key"
            onChange={(event) => {
              setQuizRoom(event.target.value.toUpperCase());
              // console.log(event.target.value.toUpperCase());
            }}
            onKeyPress={(event) => {
              // If user types message and presses enter then send the message
              event.key === "Enter" && joinRoom();
            }}
          />

          <button className={styles.joinQuizRoomButton} onClick={joinRoom}>
            Join Room
          </button>
        </div>
      ) : (
        // Call our quiz component and pass in the socket
        // Keep track of the username and quiz room being used so we pass that in as pops
        <Quiz socket={socket} username={userName} quizroom={quizRoom} />
      )}
    </div>
  );
};

export default SocketClient;
