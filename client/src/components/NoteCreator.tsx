import React, { useState, useRef } from 'react';
import { CreateStickyNoteDto, COLORS } from '../models/StickyNote';
import './NoteCreator.css';

interface NoteCreatorProps {
    onAddNote: (note: CreateStickyNoteDto) => Promise<void>;
}

export const NoteCreator: React.FC<NoteCreatorProps> = ({ onAddNote }) => {
    const [content, setContent] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const handleColorChange = (newColor: string) => {
        setColor(newColor);
    };
    
    const handleSubmit = async () => {
        if (!content.trim()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await onAddNote({ content, color });
            setContent('');
            setIsExpanded(false);
        } catch (error) {
            console.error('Failed to add note:', error);
            alert('Failed to add note. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }, 100);
    };
    
    return (
        <div className={`note-creator-container ${isExpanded ? 'expanded' : ''}`}>
            <div 
                className="note-creator" 
                style={{ backgroundColor: color }}
                onClick={!isExpanded ? handleExpand : undefined}
            >
                {!isExpanded ? (
                    <div className="note-creator-placeholder">
                        <span>+</span>
                    </div>
                ) : (
                    <>
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note here..."
                            disabled={isSubmitting}
                            className="note-creator-textarea"
                        />
                        
                        <div className="note-creator-toolbar">
                            <div className="color-picker">
                                {COLORS.map((c) => (
                                    <div
                                        key={c}
                                        className={`color-option ${c === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => handleColorChange(c)}
                                    />
                                ))}
                            </div>
                            
                            <div className="note-creator-actions">
                                <button 
                                    className="action-button cancel"
                                    onClick={() => setIsExpanded(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="action-button add"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !content.trim()}
                                >
                                    {isSubmitting ? '...' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}; 