import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizGenerator = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [quizType, setQuizType] = useState('multiple_choice');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes/', {
          credentials: 'include'
        });
        const data = await response.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes", err);
        setError('Failed to load notes');
      }
    };
    fetchNotes();
  }, []);

  const handleGenerate = async () => {
    if (selectedNoteIds.length === 0) {
      alert("Please select at least one note.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          note_ids: selectedNoteIds,
          quiz_type: quizType
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate quiz');

      setQuestions(data.questions);

      // Optional: Save quiz to database
      await fetch('/api/quizzes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ questions: data.questions, quiz_type: quizType })
      });

    } catch (err) {
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNote = (noteId, checked) => {
    setSelectedNoteIds(prev =>
      checked ? [...prev, noteId] : prev.filter(id => id !== noteId)
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>🧠 AI Quiz Generator</h2>

      <button onClick={() => navigate('/private')} style={{ marginBottom: 20 }}>
        🔙 Back to My Notes
      </button>

      <div style={{ marginBottom: 20 }}>
        <h4>Select Notes:</h4>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          notes.map(note => (
            <div key={note._id}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectNote(note._id, e.target.checked)}
                />{' '}
                {note.title || 'Untitled Note'}
              </label>
            </div>
          ))
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Quiz Type:</label>
        <select
          value={quizType}
          onChange={e => setQuizType(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="true_false">True / False</option>
          <option value="flashcards">Flashcards</option>
        </select>
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>

      {error && <div style={{ marginTop: 20, color: 'red' }}><strong>Error:</strong> {error}</div>}

      <div style={{ marginTop: 30 }}>
        {questions.length > 0 && <h3>📝 Generated Questions</h3>}
        {questions.map((q, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            {quizType === 'multiple_choice' && (
              <div>
                <strong>Q{index + 1}: {q.question}</strong>
                <ul>
                  {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
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
