import React, { useState, useEffect, useRef } from 'react';
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
  
  // Board panning state
  const [isPanning, setIsPanning] = useState(false);
  const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });
  const startPanPos = useRef({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

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
      // Center of the viewport with a slight random offset
      // Adjust for the current board position
      const position_x = window.innerWidth / 2 - 100 + Math.random() * 50 - boardPosition.x;
      const position_y = window.innerHeight / 2 - 100 + Math.random() * 50 - boardPosition.y;
      
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

  // Board panning handlers
  const handleBoardMouseDown = (e: React.MouseEvent) => {
    // Only start panning if not clicking on a sticky note
    if ((e.target as HTMLElement).closest('.sticky-note')) {
      return;
    }
    
    setIsPanning(true);
    startPanPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleBoardTouchStart = (e: React.TouchEvent) => {
    // Only start panning if not touching a sticky note
    if ((e.target as HTMLElement).closest('.sticky-note')) {
      return;
    }
    
    setIsPanning(true);
    const touch = e.touches[0];
    startPanPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleBoardMouseMove = (e: MouseEvent) => {
    if (!isPanning) return;
    
    const dx = e.clientX - startPanPos.current.x;
    const dy = e.clientY - startPanPos.current.y;
    
    setBoardPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    startPanPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleBoardTouchMove = (e: TouchEvent) => {
    if (!isPanning) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - startPanPos.current.x;
    const dy = touch.clientY - startPanPos.current.y;
    
    setBoardPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    startPanPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleBoardMouseUp = () => {
    setIsPanning(false);
  };

  // Add event listeners for panning
  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleBoardMouseMove);
      window.addEventListener('mouseup', handleBoardMouseUp);
      window.addEventListener('touchmove', handleBoardTouchMove);
      window.addEventListener('touchend', handleBoardMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleBoardMouseMove);
      window.removeEventListener('mouseup', handleBoardMouseUp);
      window.removeEventListener('touchmove', handleBoardTouchMove);
      window.removeEventListener('touchend', handleBoardMouseUp);
    };
  }, [isPanning]);

  // Add zoom functionality with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    // Prevent the default scroll behavior
    e.preventDefault();
    
    // Update board position based on wheel delta
    setBoardPosition(prev => ({
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY
    }));
  };

  return (
    <div 
      ref={boardRef}
      className={`sticky-board ${isPanning ? 'panning' : ''}`}
      style={{
        backgroundPosition: `${boardPosition.x}px ${boardPosition.y}px`
      }}
      onMouseDown={handleBoardMouseDown}
      onTouchStart={handleBoardTouchStart}
      onWheel={handleWheel}
    >
      <div 
        className="board-content"
        style={{
          transform: `translate(${boardPosition.x}px, ${boardPosition.y}px)`
        }}
      >
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
      </div>
      
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