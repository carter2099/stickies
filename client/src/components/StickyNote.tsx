import React, { useState, useRef } from 'react';
import { config } from '../config';
import '../styles/StickyNote.css';

interface StickyNoteProps {
  id: number;
  content: string;
  color: string;
  position_x: number;
  position_y: number;
  onPositionUpdate: (id: number, x: number, y: number) => void;
}

export const StickyNote: React.FC<StickyNoteProps> = ({ 
  id, 
  content, 
  color, 
  position_x, 
  position_y,
  onPositionUpdate 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: position_x, y: position_y });
  const noteRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    initialPos.current = { x: position.x, y: position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    const newX = initialPos.current.x + dx;
    const newY = initialPos.current.y + dy;
    
    setPosition({ x: newX, y: newY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartPos.current.x;
    const dy = touch.clientY - dragStartPos.current.y;
    
    const newX = initialPos.current.x + dx;
    const newY = initialPos.current.y + dy;
    
    setPosition({ x: newX, y: newY });
    
    // Prevent scrolling while dragging
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onPositionUpdate(id, position.x, position.y);
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

  return (
    <div
      ref={noteRef}
      className={`sticky-note ${color} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="sticky-note-content">
        {content}
      </div>
    </div>
  );
}; 