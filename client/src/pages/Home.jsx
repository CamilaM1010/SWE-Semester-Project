import React from 'react';
import { Link } from 'react-router-dom';
import CornellDemo from '../components/CornellDemo';

const Home = () => {
  return (
    <body>
    <div class="hero">
        <h1>Transform Your Learning with <span>DyNotes</span></h1>
        <p>A digital note-taking application that employs Cornell's methods of taking notes, designed for students of all ages across all disciplines who need a more personalized and engaging method of studying.</p>
        <a href="/register" class="cta-button">Start Taking Better Notes</a>
    </div>

    <div class="cornell-demo">
        <div class="cornell-title">Cornell Note-Taking Method</div>
        <div class="cornell-layout">
            <div class="cornell-cues">
                <h4>Cues/Questions</h4>
                <p>• What is active learning?</p>
                <p>• Benefits of Cornell method?</p>
                <p>• How does DyNotes enhance retention?</p>
            </div>
            <div class="cornell-notes">
                <h4>Notes</h4>
                <p>Cornell note-taking method divides the page into cues, notes, and summary sections. This structure promotes active recall and better organization of information.</p>
                <p>DyNotes enhances this method with digital tools like automatic quiz generation based on your notes and customizable text editing features.</p>
                <p>Studies show that structured note-taking improves retention by up to 30% compared to traditional methods.</p>
            </div>
        </div>
        <div class="cornell-summary">
            <h4>Summary</h4>
            <p>The Cornell method combined with DyNotes' digital features creates an engaging learning experience that promotes active recall and increases information retention.</p>
        </div>
    </div>

    <div class="features">
        <div class="feature">
            <div class="feature-icon">📝</div>
            <h3>Cornell Method</h3>
            <p>Structured note-taking approach with cues, notes, and summary sections that promotes active learning and better organization.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">🧠</div>
            <h3>Automatic Quizzes</h3>
            <p>Generate quizzes automatically from your notes to test your knowledge and reinforce learning through active recall.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">📊</div>
            <h3>Learning Analytics</h3>
            <p>Track your progress and identify areas for improvement with personalized learning analytics and insights.</p>
        </div>
        <div class="feature">
            <div class="feature-icon">🎨</div>
            <h3>Customization</h3>
            <p>Personalize your note-taking experience with customizable templates, colors, and formatting options.</p>
        </div>
    </div>

    <div class="footer">
        <p>&copy; 2025 DyNotes. Transform traditional note-taking into a dynamic, adaptive learning experience.</p>
    </div>
        
    </body>
  );
};

export default Home;