import React, { useState, useEffect } from 'react';
import { StickyNote } from './StickyNote';
import { AddNoteButton } from './AddNoteButton';
import { AddNoteModal } from './AddNoteModal';
import { config } from '../config';
import '../styles/StickyBoard.css';

interface Note {
  id: number;
  content: string;
  color: string;
  position_x: number;
  position_y: number;
  created_at: string;
}

export const StickyBoard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.API_URL}/api/sticky-notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load sticky notes. Please try again later.');
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (content: string, color: string) => {
    try {
      // Calculate a default position for new notes
      // Center of the screen with a slight random offset
      const position_x = window.innerWidth / 2 - 100 + Math.random() * 50;
      const position_y = window.innerHeight / 2 - 100 + Math.random() * 50;
      
      const response = await fetch(`${config.API_URL}/api/sticky-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          color,
          position_x,
          position_y,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to add note. Please try again.');
      console.error('Error adding note:', err);
    }
  };

  const handlePositionUpdate = async (id: number, x: number, y: number) => {
    try {
      const response = await fetch(`${config.API_URL}/api/sticky-notes/${id}/position`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position_x: x,
          position_y: y,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update note position');
      }
      
      // No need to update state as the position is already updated in the UI
    } catch (err) {
      console.error('Error updating note position:', err);
      // We could show an error toast here, but for now just log it
    }
  };

  return (
    <div className="sticky-board">
      {isLoading ? (
        <div className="loading">Loading notes...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              id={note.id}
              content={note.content}
              color={note.color}
              position_x={note.position_x}
              position_y={note.position_y}
              onPositionUpdate={handlePositionUpdate}
            />
          ))}
        </>
      )}
      
      <AddNoteButton onClick={() => setIsModalOpen(true)} />
      
      {isModalOpen && (
        <AddNoteModal
          onAdd={handleAddNote}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}; 