import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export interface ScanRecord {
    id: number;
    scan_date: Date;
    scan_type: 'daily' | 'test';
    status: 'completed' | 'failed';
}

export interface StickyNote {
    id: number;
    content: string;
    color: string;
    position_x: number;
    position_y: number;
    created_at: Date;
}

export class Database {
    public readonly pool: Pool;

    constructor() {
        this.pool = pool;
    }

    async query(text: string, params?: any[]) {
        return this.pool.query(text, params);
    }

    // Sticky notes methods
    async getAllStickyNotes(): Promise<StickyNote[]> {
        const result = await this.query('SELECT * FROM sticky_notes ORDER BY created_at DESC');
        return result.rows;
    }

    async createStickyNote(note: Omit<StickyNote, 'id' | 'created_at'>): Promise<StickyNote> {
        const { content, color, position_x, position_y } = note;
        const result = await this.query(
            'INSERT INTO sticky_notes (content, color, position_x, position_y) VALUES ($1, $2, $3, $4) RETURNING *',
            [content, color, position_x, position_y]
        );
        return result.rows[0];
    }

    async updateStickyNotePosition(id: number, position_x: number, position_y: number): Promise<StickyNote | null> {
        const result = await this.query(
            'UPDATE sticky_notes SET position_x = $1, position_y = $2 WHERE id = $3 RETURNING *',
            [position_x, position_y, id]
        );
        return result.rows[0] || null;
    }

    async updateStickyNoteZIndex(id: number, z_index: number): Promise<StickyNote | null> {
        const result = await this.query(
            'UPDATE sticky_notes SET z_index = $1 WHERE id = $2 RETURNING *',
            [z_index, id]
        );
        return result.rows[0] || null;
    }
}

export const db = new Database(); 