import React from "react";
import styles from "./Question.module.css";

const Questions = ({ index, question, onHandleUserAnswer }) => {

  return (
    <div key={index} className={styles.page}>
      <h2 className={styles.header}>
        {`Question ${index + 1}: ${question.question}`}
      </h2>
      <div className={styles.center_buttons}>
        <button
          className={`${styles.answers}  ${styles.focus}`}
          onClick={() =>
            onHandleUserAnswer(question.answer1, question.correctAnswer)
          }
        >
          {question.answer1}
        </button>

        <button
          className={`${styles.answers}  ${styles.focus}`}
          onClick={() =>
            onHandleUserAnswer(question.answer2, question.correctAnswer)
          }
        >
          {question.answer2}
        </button>

        <button
          className={`${styles.answers}  ${styles.focus}`}
          onClick={() =>
            onHandleUserAnswer(question.answer3, question.correctAnswer)
          }
        >
          {question.answer3}
        </button>

        <button
          className={`${styles.answers}  ${styles.focus}`}
          onClick={() =>
            onHandleUserAnswer(question.answer4, question.correctAnswer)
          }
        >
          {question.answer4}
        </button>
      </div>
    </div>
  );
};

export default Questions;
