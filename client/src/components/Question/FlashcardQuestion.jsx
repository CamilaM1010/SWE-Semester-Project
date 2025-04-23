import React, { useState } from "react";
import "./question.css";

export default function FlashcardQuestion({ question }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="front">{question.term}</div>
      <div className="back">{question.definition}</div>
    </div>
  );
}
