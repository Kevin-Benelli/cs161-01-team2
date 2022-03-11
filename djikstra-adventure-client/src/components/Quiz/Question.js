// import React from "react";
// import styles from "./QuizQuestions.module.css";

// const sendMessage = async (userAnswer, correctAnswer) => {
//   // if (answerNumber === 1) {
//   //   setIsCorrect(true);
//   // }
//   // console.log(answerNumber.target.innerHTML);

//   // If user drafts a message then set message for emission
//   // if (userMessage !== "") {
//   console.log("Answer passed in:", userAnswer.answer);
//   console.log("isCorrect:", userAnswer.isCorrect);
//   console.log("Correct Answer: ", correctAnswer);
//   console.log("");

//   // messageData provides more details about answer submission
//   const messageData = {
//     quizroom: quizroom, // stores specific quizroom
//     user: username, // maps message to user name
//     selectedAnswer: userAnswer, // sets messsage to message drafted
//     iscorrect: userAnswer.isCorrect,
//     // gets time stamp by hours and minutes
//     time:
//       new Date(Date.now()).getHours() +
//       ":" +
//       new Date(Date.now()).getMinutes() +
//       ":" +
//       new Date(Date.now()).getSeconds(),
//   };

//   // Wait for message to be sent before continuing to move forward so make it asyncronous
//   // emits message data object to messaging server
//   await socket.emit("send_message", messageData);

//   // When we send a message we store our message in the quiz log
//   setMessageLog((prevMessageLog) => [...prevMessageLog, messageData]);
//   // }
// };

// // Listens to whenever there is a change in socket server
// useEffect(() => {
//   // listen to receive_message event and create call back function to handle message on client
//   // grab data from backend (data)
//   socket.on("receive_message", (data) => {
//     console.log("here:", data);
//     setSelectedAnswer(data);
//   });
// }, [socket]);

// const Question = ({
//   question,
//   answer1,
//   answer2,
//   answer3,
//   answer4,
//   socket,
//   username,
//   quizroom,
// }) => {
//   return (
//     <React.Fragment>
//       <h1> {question}</h1>
//       <button
//         className={styles.answers}
//         onClick={() => sendMessage(questions[1], questions[0].correctAnswer)}
//       >
//         {questions[1].answer}
//       </button>
//       <button
//         className={styles.answers}
//         onClick={() => sendMessage(questions[2], questions[0].correctAnswer)}
//       >
//         {questions[2].answer}
//       </button>
//       <button
//         className={styles.answers}
//         onClick={() => sendMessage(questions[3], questions[0].correctAnswer)}
//       >
//         {questions[3].answer}
//       </button>
//       <button
//         className={styles.answers}
//         onClick={() => sendMessage(questions[4], questions[0].correctAnswer)}
//       >
//         {questions[4].answer}
//       </button>
//     </React.Fragment>
//   );
// };

// export default Question;
