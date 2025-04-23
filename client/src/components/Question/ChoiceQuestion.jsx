import React, { useState } from "react";
import "./question.css";

export default function ChoiceQuestion({ question, type }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const options = type === 'multiple_choice'
    ? question?.options
    : type === "true_false"
      ? ["True", "False"]
      : [];

  const handleSelect = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
  };

  return (
    <div className="question-card">
      <h3>{question.question}</h3>
      <div className="options">
        {options.map((option) => <QuestionOption
          key={option}
          option={option}
          selected={selected}
          isCorrect={answered && option === question.answer}
          isWrong={answered && selected === option && selected !== question.answer}
          handleSelect={handleSelect}
        />
        )}
      </div>
      {
        answered && (
          <p className="feedback">
            Correct answer: <strong>{question.answer}</strong>
          </p>
        )
      }
    </div >
  );
}

const QuestionOption = ({ option, selected, isCorrect, isWrong, handleSelect }) => {
  const className = `
      ${selected === option ? "selected" : ""}
      ${isCorrect ? "correct" : ""}
      ${isWrong ? "wrong" : ""}
    `;

  return <button
    key={option}
    className={className}
    onClick={() => handleSelect(option)}
  >
    {option}{" "}
    {isCorrect ? "✅" : isWrong ? "❌" : ""}
  </button>;
}