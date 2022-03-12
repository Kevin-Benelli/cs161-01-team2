import React from "react";

import QuizQuestions from "./QuizQuestions";

const Quiz = ({ socket, username, quizroom, questions }) => {
  return (
    <React.Fragment>
      <QuizQuestions
        socket={socket}
        username={username}
        quizroom={quizroom}
        questions={questions}
      />
    </React.Fragment>
  );
};

export default Quiz;
