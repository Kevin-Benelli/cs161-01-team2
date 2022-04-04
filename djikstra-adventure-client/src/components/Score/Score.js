import React, { useState, useEffect } from "react";
import styles from "./Score.module.css";
import Axios from "axios";
import { View, Link } from "react-router-dom";

const Score = ({ quizroom, username, userscore, questionlength }) => {
  const [scoreResponse, setScoreResponse] = useState("");
  const [showGameStats, setGameStates] = useState(false);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    postScore();
  }, []);

  const postScore = (e, action) => {
    const timestamp = {
      // gets time stamp by hours and minutes
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes() +
        ":" +
        new Date(Date.now()).getSeconds(),
    };
    let url = "http://localhost:5000/api/v1/post_score";
    try {
      Axios.post(url, {
        quizroom,
        username,
        userscore,
        questionlength,
      }).then((response) => {
        console.log(
          "client response:",
          response.data.message,
          response.data.error
        );
        if (response.data.error) {
          setScoreResponse(response.data.message);
          console.log("RES ERROR: ", response.data.error);
          return <h1> {response.data.message}</h1>;
        } else {
          setScoreResponse(response.data.message);
          console.log("success from client");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getScores = (e) => {
    console.log(e);
    const url = "http://localhost:5000/api/v1/get_scores";
    try {
      Axios.get(url).then((response) => {
        console.log("GET SCORE REQUEST: ", response.data);
      });
    } catch (error) {
      console.log("GET REQUEST ERROR: ", error);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <>
      <span className={styles.score}>
        {username} Scored: {userscore} / {questionlength}
      </span>
      <br />
      <button className={styles.button} onClick={getScores}>
        Game Statistics
      </button>

      <button className={styles.button} onClick={refreshPage}>
        Return To Lobby
      </button>
    </>
  );
};

export default Score;
