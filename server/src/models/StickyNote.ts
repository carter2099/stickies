export interface StickyNote {
    id: number;
    content: string;
    color: string;
    created_at: Date;
}

export interface CreateStickyNoteDto {
    content: string;
    color: string;
} 