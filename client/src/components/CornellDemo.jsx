import React from 'react';
//Description of Cornell Note-taking found on homepage
const CornellDemo = () => {
  return (
    <div className="cornell-demo">
      <div className="cornell-title">Cornell Note-Taking Method</div>
      <div className="cornell-layout">
        <div className="cornell-cues">
          <h4>Cues/Questions</h4>
          <p>• What is active learning?</p>
          <p>• Benefits of Cornell method?</p>
          <p>• How does DyNotes enhance retention?</p>
        </div>
        <div className="cornell-notes">
          <h4>Notes</h4>
          <p>Cornell note-taking method divides the page into cues, notes, and summary sections. This structure promotes active recall and better organization of information.</p>
          <p>DyNotes enhances this method with digital tools like automatic quiz generation based on your notes and customizable text editing features.</p>
          <p>Studies show that structured note-taking improves retention by up to 30% compared to traditional methods.</p>
        </div>
      </div>
      <div className="cornell-summary">
        <h4>Summary</h4>
        <p>The Cornell method combined with DyNotes' digital features creates an engaging learning experience that promotes active recall and increases information retention.</p>
      </div>
    </div>
  );
};

export default CornellDemo;