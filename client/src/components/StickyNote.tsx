import React, { useState, useRef, useEffect } from 'react';
import { config } from '../config';
import '../styles/StickyNote.css';

interface StickyNoteProps {
  id: number;
  content: string;
  color: string;
  position_x: number;
  position_y: number;
  onPositionUpdate: (id: number, x: number, y: number) => void;
  onNoteMouseDown?: (e: React.MouseEvent) => void;
  onNoteTouchStart?: (e: React.TouchEvent) => void;
}

export const StickyNote: React.FC<StickyNoteProps> = ({ 
  id, 
  content, 
  color, 
  position_x, 
  position_y,
  onPositionUpdate,
  onNoteMouseDown,
  onNoteTouchStart
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: position_x, y: position_y });
  const [rotation] = useState(() => Math.random() * 6 - 3); // Random rotation between -3 and 3 degrees
  const noteRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const wasClickedRef = useRef(false);

  const handleClick = (e: React.MouseEvent) => {
    // Only toggle selection if it's a simple click (not the end of a drag)
    if (!isDragging && wasClickedRef.current) {
      e.stopPropagation();
      setIsSelected(!isSelected);
      wasClickedRef.current = false;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    wasClickedRef.current = true;
    
    if (isSelected) {
      // If note is selected, handle dragging the note
      e.stopPropagation();
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      initialPos.current = { x: position.x, y: position.y };
      
      // Prevent text selection during drag
      e.preventDefault();
    } else if (onNoteMouseDown) {
      // If note is not selected, allow board panning
      onNoteMouseDown(e);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    wasClickedRef.current = true;
    
    if (isSelected) {
      // If note is selected, handle dragging the note
      e.stopPropagation();
      setIsDragging(true);
      const touch = e.touches[0];
      dragStartPos.current = { x: touch.clientX, y: touch.clientY };
      initialPos.current = { x: position.x, y: position.y };
    } else if (onNoteTouchStart) {
      // If note is not selected, allow board panning
      onNoteTouchStart(e);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    const newX = initialPos.current.x + dx;
    const newY = initialPos.current.y + dy;
    
    setPosition({ x: newX, y: newY });
    
    // If we've moved more than a few pixels, it's a drag not a click
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      wasClickedRef.current = false;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartPos.current.x;
    const dy = touch.clientY - dragStartPos.current.y;
    
    const newX = initialPos.current.x + dx;
    const newY = initialPos.current.y + dy;
    
    setPosition({ x: newX, y: newY });
    
    // If we've moved more than a few pixels, it's a drag not a click
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      wasClickedRef.current = false;
    }
    
    // Prevent scrolling while dragging
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onPositionUpdate(id, position.x, position.y);
    }
  };

  // Handle clicks outside the note to deselect it
  const handleOutsideClick = (e: MouseEvent) => {
    if (isSelected && noteRef.current && !noteRef.current.contains(e.target as Node)) {
      setIsSelected(false);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, position]);

  // Add event listener for outside clicks when selected
  React.useEffect(() => {
    if (isSelected) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSelected]);

  return (
    <div
      ref={noteRef}
      className={`sticky-note ${color} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="sticky-note-content">
        {content}
      </div>
      {isSelected && (
        <div className="sticky-note-controls">
          <div className="drag-handle" title="Drag to move">
            ⋮⋮
          </div>
        </div>
      )}
    </div>
  );
}; 