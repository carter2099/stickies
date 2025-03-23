import React, { useState, useEffect } from 'react';
import { StickyNote, CreateStickyNoteDto } from './models/StickyNote';
import { NotesBoard } from './components/NotesBoard';
import { NoteCreator } from './components/NoteCreator';
import { config } from './config';
import './App.css';

function App() {
    const [notes, setNotes] = useState<StickyNote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/notes`);
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }
            const data = await response.json();
            setNotes(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching notes:', err);
            setError('Failed to load notes. Please refresh the page.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleAddNote = async (noteData: CreateStickyNoteDto) => {
        try {
            const response = await fetch(`${config.API_URL}/api/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(noteData),
            });

            if (!response.ok) {
                throw new Error('Failed to add note');
            }

            const newNote = await response.json();
            setNotes([newNote, ...notes]);
            return Promise.resolve();
        } catch (err) {
            console.error('Error adding note:', err);
            return Promise.reject(err);
        }
    };

    return (
        <div className="whiteboard">
            {error && <div className="error-message">{error}</div>}
            <NotesBoard notes={notes} isLoading={isLoading} />
            <NoteCreator onAddNote={handleAddNote} />
        </div>
    );
}

export default App; 