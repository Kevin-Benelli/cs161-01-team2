import React from "react";
import { useState, useEffect } from "react";
// import ScrollToBottom from "react-scroll-to-bottom";
import styles from "./Quiz.module.css";
import QuizQuestions from "./QuizQuestions";

const Quiz = ({ socket, username, quizroom, iscorrect }) => {
  return (
    <React.Fragment>
      <QuizQuestions
        socket={socket}
        username={username}
        quizroom={quizroom}
        iscorrect={iscorrect}
      />
    </React.Fragment>
  );
};

export default Quiz;
