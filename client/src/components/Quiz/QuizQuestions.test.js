import { render, screen } from "@testing-library/react";
import Question from "./Question";

describe("Quiz Component", () => {
  test("renders Quiz as a text", () => {
    const questionIndex = 1; // index on page will render index + 1
    // Arrange
    render(
      <Question
        index={questionIndex}
        question={["Test Question 2"]}
        onHandleUserAnswer={() => {
          return <>Yo</>;
        }}
      />
    );

    // Act
    // ...

    // Assert
    const questionElement = screen.getByText(`Question ${questionIndex + 1}`, {
      exact: false,
    });
    expect(questionElement).toBeInTheDocument(questionElement);
  });
});
