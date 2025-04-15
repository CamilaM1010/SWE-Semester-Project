import React, { useState } from 'react';

const QuizGenerator = () => {
  const [noteIds, setNoteIds] = useState('');
  const [quizType, setQuizType] = useState('multiple_choice');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // to include session cookie
        body: JSON.stringify({
          note_ids: noteIds.split(',').map(id => id.trim()),
          quiz_type: quizType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      setQuestions(data.questions);
    } catch (err) {
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>🧠 AI Quiz Generator</h2>

      <div style={{ marginBottom: 15 }}>
        <label>Note IDs (comma-separated):</label>
        <input
          type="text"
          value={noteIds}
          onChange={e => setNoteIds(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
          placeholder="e.g. 662ac50ba123456789abcde1,662ac50ba123456789abcde2"
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Quiz Type:</label>
        <select
          value={quizType}
          onChange={e => setQuizType(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="true_false">True / False</option>
          <option value="flashcards">Flashcards</option>
        </select>
      </div>

      <button onClick={handleGenerate} disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>

      {error && (
        <div style={{ marginTop: 20, color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        {questions.length > 0 && <h3>📝 Generated Questions</h3>}
        {questions.map((q, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            {quizType === 'multiple_choice' && (
              <div>
                <strong>Q{index + 1}: {q.question}</strong>
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
                <em>Answer: {q.answer}</em>
              </div>
            )}

            {quizType === 'true_false' && (
              <div>
                <strong>Q{index + 1}: {q.question}</strong>
                <br />
                <em>Answer: {q.answer}</em>
              </div>
            )}

            {quizType === 'flashcards' && (
              <div>
                <strong>{q.term}</strong>: {q.definition}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizGenerator;
