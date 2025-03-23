import React from 'react';
import { StickyNote as StickyNoteType } from '../models/StickyNote';
import { StickyNote } from './StickyNote';
import './NotesBoard.css';

interface NotesBoardProps {
    notes: StickyNoteType[];
    isLoading: boolean;
}

export const NotesBoard: React.FC<NotesBoardProps> = ({ notes, isLoading }) => {
    if (isLoading) {
        return <div className="loading">Loading notes...</div>;
    }
    
    return (
        <div className="notes-board">
            {notes.length === 0 ? (
                <div className="empty-board">Add your first note!</div>
            ) : (
                notes.map(note => (
                    <StickyNote key={note.id} note={note} />
                ))
            )}
        </div>
    );
}; 