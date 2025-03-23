import React, { useState, useRef, useEffect } from 'react';
import { StickyNote as StickyNoteType } from '../models/StickyNote';
import './StickyNote.css';

interface StickyNoteProps {
    note: StickyNoteType;
}

export const StickyNote: React.FC<StickyNoteProps> = ({ note }) => {
    const date = new Date(note.created_at).toLocaleString();
    const noteRef = useRef<HTMLDivElement>(null);
    
    // Random slight rotation for a more natural look
    const randomRotation = Math.random() * 6 - 3; // -3 to +3 degrees
    
    // State for position
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
    
    // Generate a random position on first render
    useEffect(() => {
        // Get the whiteboard dimensions
        const whiteboard = document.querySelector('.whiteboard');
        if (whiteboard) {
            const whiteboardRect = whiteboard.getBoundingClientRect();
            
            // Set a random position within the whiteboard
            const maxX = Math.max(0, whiteboardRect.width - 300);
            const maxY = Math.max(0, whiteboardRect.height - 300);
            
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            
            setPosition({ x: randomX, y: randomY });
        }
    }, []);
    
    const handleMouseDown = (e: React.MouseEvent) => {
        if (noteRef.current) {
            // Prevent default behavior and text selection
            e.preventDefault();
            
            // Bring the note to the front
            noteRef.current.style.zIndex = '1000';
            
            // Start dragging
            setIsDragging(true);
            
            // Store the initial mouse position
            setInitialMousePos({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            // Calculate the new position
            const newX = e.clientX - initialMousePos.x;
            const newY = e.clientY - initialMousePos.y;
            
            // Update the position
            setPosition({ x: newX, y: newY });
        }
    };
    
    const handleMouseUp = () => {
        if (isDragging) {
            // Stop dragging
            setIsDragging(false);
            
            // Reset z-index
            if (noteRef.current) {
                noteRef.current.style.zIndex = '10';
            }
        }
    };
    
    // Add and remove event listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, initialMousePos]);
    
    // Add touch support
    const handleTouchStart = (e: React.TouchEvent) => {
        if (noteRef.current && e.touches.length === 1) {
            // Prevent default behavior
            e.preventDefault();
            
            // Bring the note to the front
            noteRef.current.style.zIndex = '1000';
            
            // Start dragging
            setIsDragging(true);
            
            // Store the initial touch position
            setInitialMousePos({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        if (isDragging && e.touches.length === 1) {
            // Calculate the new position
            const newX = e.touches[0].clientX - initialMousePos.x;
            const newY = e.touches[0].clientY - initialMousePos.y;
            
            // Update the position
            setPosition({ x: newX, y: newY });
        }
    };
    
    const handleTouchEnd = () => {
        if (isDragging) {
            // Stop dragging
            setIsDragging(false);
            
            // Reset z-index
            if (noteRef.current) {
                noteRef.current.style.zIndex = '10';
            }
        }
    };
    
    // Add and remove touch event listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
        
        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, initialMousePos]);
    
    return (
        <div 
            ref={noteRef}
            className={`sticky-note ${isDragging ? 'dragging' : ''}`}
            style={{ 
                backgroundColor: note.color,
                transform: `rotate(${randomRotation}deg)`,
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className="sticky-note-content">{note.content}</div>
            <div className="sticky-note-date">{date}</div>
            <div className="sticky-note-pin"></div>
        </div>
    );
}; 