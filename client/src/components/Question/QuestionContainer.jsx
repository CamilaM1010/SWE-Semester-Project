import React from 'react';
import "./question.css";

import ChoiceQuestion from "./ChoiceQuestion";
import FlashcardQuestion from './FlashcardQuestion';

const QuestionsContainer = ({ quiz }) => {

    if (!quiz)
        return <div className="no-questions">🦖 The quiz has gone extinct… for now.</div>;

    return <div className={`${quiz.type === "flashcards" ? "grid-container" : "flex-container"}`}>
        {quiz.questions.map((question, index) => (
            <React.Fragment key={index}>
                {quiz.type === 'flashcards'
                    ? <FlashcardQuestion question={question} />
                    : <ChoiceQuestion question={question} type={quiz.type} />}
            </React.Fragment>
        ))}
    </div>;
};

export default QuestionsContainer;