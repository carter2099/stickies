import React, { useState } from 'react';
import { CreateStickyNoteDto, COLORS } from '../models/StickyNote';
import './AddNoteForm.css';

interface AddNoteFormProps {
    onAddNote: (note: CreateStickyNoteDto) => Promise<void>;
}

export const AddNoteForm: React.FC<AddNoteFormProps> = ({ onAddNote }) => {
    const [content, setContent] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) {
            alert('Please enter some content for your note');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await onAddNote({ content, color });
            setContent('');
            // Keep the same color for next note
        } catch (error) {
            console.error('Failed to add note:', error);
            alert('Failed to add note. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form className="add-note-form" onSubmit={handleSubmit}>
            <h2>Add a New Note</h2>
            
            <div className="form-group">
                <label htmlFor="note-content">Note Content:</label>
                <textarea
                    id="note-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note here..."
                    rows={4}
                    required
                    disabled={isSubmitting}
                />
            </div>
            
            <div className="form-group">
                <label>Color:</label>
                <div className="color-picker">
                    {COLORS.map((c) => (
                        <div
                            key={c}
                            className={`color-option ${c === color ? 'selected' : ''}`}
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </div>
            </div>
            
            <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Adding...' : 'Add Note'}
            </button>
        </form>
    );
}; 