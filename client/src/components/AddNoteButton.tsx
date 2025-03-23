import React from 'react';
import '../styles/AddNoteButton.css';

interface AddNoteButtonProps {
  onClick: () => void;
}

export const AddNoteButton: React.FC<AddNoteButtonProps> = ({ onClick }) => {
  return (
    <button className="add-note-button" onClick={onClick}>
      <span className="plus-icon">+</span>
    </button>
  );
}; 