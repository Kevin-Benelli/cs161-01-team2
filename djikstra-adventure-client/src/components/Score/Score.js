import React, { useState, useEffect } from "react";
import styles from "./Score.module.css";
import { Axios } from "axios";
import { View, Link } from "react-router-dom";

const Score = ({ username, userscore, questionlength }) => {
  //   Axios.defaults.withCredentials = true;

  const [scoreResponse, setScoreResponse] = useState("");
  const [showGameStats, setGameStates] = useState(false);

  const postScore = () => {
    let url = "http://localhost:5000/api/v1/post_score";
    try {
      Axios.post(url, {
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
      Axios.post(url);
    } catch (error) {}
  };
  useEffect(() => {
    postScore();
  }, []);

  return (
    <>
      <span className={styles.score}>
        {username} Scored: {userscore} / {questionlength}
      </span>
      <br />
      <button className={styles.button} onClick={getScores}>
        Game Statistics
      </button>

      <Link to="/" className={styles.button}>
        Return To Lobby
      </Link>
    </>
  );
};

export default Score;
