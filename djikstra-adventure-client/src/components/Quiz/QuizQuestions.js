import React from "react";
import { useState, useEffect } from "react";
import styles from "./QuizQuestions.module.css";

const QuizQuestions = ({ socket, username, quizroom, iscorrect = false }) => {
  const [userMessage, setUserMessage] = useState("");
  const [messageLog, setMessageLog] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [questions, setQuestions] = useState([]);

  const sendMessage = async (userAnswer, correctAnswer) => {
    console.log("Answer passed in:", userAnswer);
    console.log("Correct Answer: ", correctAnswer);

    setIsCorrect(userAnswer === correctAnswer);
    console.log("isCorrect:", isCorrect);

    console.log("");

    // messageData provides more details about answer submission
    const messageData = {
      quizroom: quizroom, // stores specific quizroom
      user: username, // maps message to user name
      selectedAnswer: userAnswer, // sets messsage to message drafted
      iscorrect: userAnswer.isCorrect,
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
    await socket.emit("send_message", messageData);

    // When we send a message we store our message in the quiz log
    setMessageLog((prevMessageLog) => [...prevMessageLog, messageData]);
    // }
  };

  // Listens to whenever there is a change in socket server
  useEffect(() => {
    // listen to receive_message event and create call back function to handle message on client
    // grab data from backend (data)
    socket.on("receive_message", (data) => {
      console.log("here:", data);
      setSelectedAnswer(data);
    });
  }, [socket]);

  useEffect(() => {
    fetch("http://localhost:5001/api/v1/quiz")
      .then((data) => {
        return data.json();
      })
      .then((questions) => {
        console.log("API Question Data: ", questions.questionData);
        setQuestions(() => questions["questionData"]);
      })
      .catch((error) => {
        console.log("Error: ", error);
        throw error;
      });
  }, []);

  return (
    <div>
      <div className="quiz-room-window">
        <div className="quiz-room-header-title">
          <h1> Live Quiz Room for {quizroom} </h1>
          <hr />
        </div>
        <div className="quiz-room-footer">
          {/* <input
            className="quiz-room-footer-message-field"
            type="text"
            placeholder="Input Field..."
            onChange={(event) => {
              setUserMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              // If user types message and presses enter then send the message
              event.key === "Enter" && sendMessage();
            }}
          /> */}

          {questions.map((question, index) => {
            return (
              <React.Fragment key={index}>
                <h2> {question.question}</h2>

                <button
                  key={question.answer1}
                  className={styles.answers}
                  onClick={() =>
                    sendMessage(question.answer1, question.correctAnswer)
                  }
                >
                  {question.answer1}
                </button>

                <button
                  className={styles.answers}
                  onClick={() =>
                    sendMessage(question.answer2, question.correctAnswer)
                  }
                >
                  {question.answer2}
                </button>

                <button
                  className={styles.answers}
                  onClick={() =>
                    sendMessage(question.answer3, question.correctAnswer)
                  }
                >
                  {question.answer3}
                </button>

                <button
                  className={styles.answers}
                  onClick={() =>
                    sendMessage(question.answer4, question.correctAnswer)
                  }
                >
                  {question.answer4}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;
