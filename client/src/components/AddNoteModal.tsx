import React, { useState } from 'react';
import '../styles/AddNoteModal.css';

interface AddNoteModalProps {
  onAdd: (content: string, color: string) => void;
  onClose: () => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ onAdd, onClose }) => {
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content, color);
    }
  };

  const colors = [
    { id: 'yellow', name: 'Yellow' },
    { id: 'green', name: 'Green' },
    { id: 'blue', name: 'Blue' },
    { id: 'pink', name: 'Pink' },
    { id: 'purple', name: 'Purple' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Note</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="note-content">Note Content:</label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={4}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Color:</label>
            <div className="color-options">
              {colors.map((c) => (
                <div 
                  key={c.id}
                  className={`color-option ${c.id} ${color === c.id ? 'selected' : ''}`}
                  onClick={() => setColor(c.id)}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-button">
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 