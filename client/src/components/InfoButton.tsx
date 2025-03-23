import React, { useState } from 'react';
import '../styles/InfoButton.css';

export const InfoButton: React.FC = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <button 
        className="info-button" 
        onClick={() => setIsInfoOpen(true)}
        title="How to use"
        aria-label="Information"
      />

      {isInfoOpen && (
        <div className="info-overlay" onClick={() => setIsInfoOpen(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <h2>What's this?</h2>
            <ul className="info-instructions">
              <li>Click the <strong>+</strong> button to add new sticky notes</li>
              <li>Click and drag on the board to move around</li>
              <li>Click on a sticky note to select it</li>
              <li>Drag selected sticky notes to reposition them</li>
              <li>Everyone can see your sticky notes!</li>
            </ul>
            <button 
              className="info-close-button"
              onClick={() => setIsInfoOpen(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 