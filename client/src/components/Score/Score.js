import React, { useState, useEffect } from "react";
import styles from "./Score.module.css";
import Axios from "axios";
import Confetti from "react-confetti";
import 'react-ranking-animation/dist/index.css'
import { Chart } from "react-google-charts";

const Score = ({ quizroom, username, userscore, questionlength, gameID }) => {
  const [scoreResponse, setScoreResponse] = useState("");
  const [displayGameStats, setDisplayGameStats] = useState(false);
  const [scoreStats, setScoreStats] = useState([]);
  const [topScores, setTopScores] = useState([]);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    console.log("init value: ", gameID);

    postScore();
  }, []);

  const postScore = (e, action) => {
    let url = "http://localhost:5000/api/v1/post_score";
    try {
      Axios.post(url, {
        quizroom,
        username,
        userscore,
        questionlength,
        gameID,
      })
        .then((response) => {
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
        })
        .catch((error) => {
          console.log("Post Score Error: ", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getScores = (e) => {
    console.log("IN GET SCORES!!!");
    console.log("get scores client: ", gameID);
    console.log(e);
    // const url = `http://localhost:5000/api/v1/get_scores?gameID=${gameID}`;
    const url = "http://localhost:5000/api/v1/get_scores/" + gameID;
    try {
      Axios.get(url)
        .then((response) => {
          console.log("GET SCORE REQUEST: ", response.data);
          console.log("RESPONSE DATA: ", response.data.result);
          setDisplayGameStats(!response.error);
          setScoreStats(() => [...response.data.result]);
        })
        .catch((error) => {
          console.log("Get Request Error: ", error);
          return;
        });
    } catch (error) {
      console.log("getScores Error: ", error);
      setDisplayGameStats(false);
      // setScoreStats(() => [...response.data.result]);
      console.log("GET REQUEST ERROR: ", error);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const options = {
    title: "Leaderboard",
    width: 600,
    height: 400,
    hAxis: { title: "Questions Answered"},
    vAxis: { title: "Users"},
    bar: { groupWidth: "95%" },
    legend: { position: "none" },
    backgroundColor: '#bb91e2'
  };

  useEffect(() => {
    if(scoreStats.length!=0){
      const sortedScores = [];
      const tempSortedScores = scoreStats;
      console.log(tempSortedScores);
      tempSortedScores.sort((a,b) => a.userscore > b.userscore ? -1: 1);
      for(let i=0;i<tempSortedScores.length;i++){
        if(sortedScores.length<3){
          sortedScores.push(tempSortedScores[i]);
        }
      }
      setTopScores(sortedScores);
    }
  },[scoreStats])

  const getLeaderboardData = () => {
    const arrayOfColors = ['red','blue', 'green', 'yellow', 'pink','orange', 'black', 'purple'];
    const data = [  [
      "Username",
      "Score",
      { role: "style" },
      {
        sourceColumn: 0,
        role: "annotation",
        type: "string",
        calc: "stringify",
      },
    ]
  ];

  for(let i = 0; i < scoreStats.length; i++){
      const tempArray = [];
      tempArray.push(scoreStats[i].username);
      tempArray.push(scoreStats[i].userscore);
      tempArray.push(arrayOfColors[i]);
      tempArray.push(null);
      data.push(tempArray);
    }
    return data;
  }

  return (
    <>
      {!displayGameStats ? (
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
      ) : (
        <>
          <Confetti />
          <div className={styles.center_ol}>
            <ol className={styles.ol}>
              {topScores.map((userScore) => {
                return (
                  <li key={userScore.scoreID} className={styles.li}>
                    {userScore.username} {userScore.userscore} /{" "}
                    {userScore.questionlength}
                  </li>
                );
              })}
              <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={getLeaderboardData()}
              options={options}
              />
            </ol>
          </div>
          <button className={styles.button} onClick={refreshPage}>
            Return To Lobby
          </button>
        </>
      )}
    </>
  );
};

export default Score;
