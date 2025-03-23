import React, { useState } from 'react';
import '../styles/AddNoteModal.css';

interface AddNoteModalProps {
  onAdd: (content: string, color: string) => void;
  onClose: () => void;
}

// Set a maximum character count for sticky notes
const MAX_CHAR_COUNT = 120;

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ onAdd, onClose }) => {
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content, color);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    // Limit the content to the maximum character count
    if (newContent.length <= MAX_CHAR_COUNT) {
      setContent(newContent);
    }
  };

  const colors = [
    { id: 'yellow', name: 'Yellow' },
    { id: 'green', name: 'Green' },
    { id: 'blue', name: 'Blue' },
    { id: 'pink', name: 'Pink' },
    { id: 'purple', name: 'Purple' }
  ];

  const remainingChars = MAX_CHAR_COUNT - content.length;

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
              onChange={handleContentChange}
              placeholder="Write your note here..."
              rows={4}
              required
            />
            <div className="char-counter">
              {remainingChars} characters remaining
            </div>
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
            <button type="submit" className="add-button" disabled={content.trim().length === 0}>
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 