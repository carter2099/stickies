import { db } from '../db';
import { StickyNote, CreateStickyNoteDto } from '../models/StickyNote';

export class StickyNoteService {
    async getAllNotes(): Promise<StickyNote[]> {
        const result = await db.query(
            'SELECT * FROM sticky_notes ORDER BY created_at DESC'
        );
        return result.rows;
    }

    async createNote(noteData: CreateStickyNoteDto): Promise<StickyNote> {
        const { content, color } = noteData;
        
        if (!content || content.trim() === '') {
            throw new Error('Note content cannot be empty');
        }
        
        const result = await db.query(
            'INSERT INTO sticky_notes (content, color) VALUES ($1, $2) RETURNING *',
            [content, color]
        );
        
        return result.rows[0];
    }
}

export const stickyNoteService = new StickyNoteService(); 