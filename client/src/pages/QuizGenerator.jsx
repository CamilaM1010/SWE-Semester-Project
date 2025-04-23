import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import api from '../utils/api';

import Quiz from "../components/Question/QuestionsContainer";

const QUIZ_TYPES = ["multiple_choice", "true_false", "flashcards"];

const LOADING_MESSAGES = [
  "🦖 Roaring up some quiz questions…",
  "🦴 Digging through the fossil files…",
  "🌋 Summoning the ancient quiz volcano…",
  "🦕 Tracking down dino-sized trivia…",
  "🪨 Carving questions into stone tablets…"
];

const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}
const QuizGenerator = () => {
  const location = useLocation();
  const { selectedNote } = location.state;

  const [quizType, setQuizType] = useState(getRandomItem(QUIZ_TYPES));
  const [quiz, setQuiz] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.generateQuiz([selectedNote?._id], quizType);

      setQuiz({ type: quizType, questions: data.questions });
    } catch (err) {
      setError(err.message);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: "4em 1em", display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2>{`🧠 AI Quiz — ${selectedNote.title}`}</h2>

      {error && (
        <div style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading
        ? <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          minHeight: "100px",
          fontSize: "18px",
          color: "#1E40AF",
          fontWeight: 700,
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #ddd",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            display: "inline-block",
            animation: "bounce 1s infinite alternate"
          }}>
            {getRandomItem(LOADING_MESSAGES)}
          </div>
          <style>
            {`
                  @keyframes bounce {
                    from { transform: translateY(0px); }
                    to { transform: translateY(-10px); }
                  }
                `}
          </style>
        </div>
        : <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Quiz quiz={quiz} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
            <label style={{ width: "100%" }}>
              Quiz Type:
              <select
                value={quizType}
                onChange={e => setQuizType(e.target.value)}
                style={{ width: "100%", marginTop: 5, padding: 12, borderRadius: 6, border: "1px solid #ddd", cursor: "pointer" }}
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
                <option value="flashcards">Flashcards</option>
              </select>
            </label>
            <button onClick={handleGenerate} disabled={loading} style={{
              backgroundColor: "#FA4616",
              color: "white",
              border: "none",
              borderRadius: "50px",
              padding: "14px 30px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 6px #2c3e50",
              display: "flex",
              alignItems: "center",
              transition: "transform 0.2s, background-color 0.2s"
            }}>
              🦴 Hatch a New Quiz
            </button>
          </div>
        </div>}
    </div>
  );
};

export default QuizGenerator;