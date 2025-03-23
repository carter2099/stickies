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

export const COLORS = [
    '#ffadad', // light red
    '#ffd6a5', // light orange
    '#fdffb6', // light yellow
    '#caffbf', // light green
    '#9bf6ff', // light blue
    '#a0c4ff', // light indigo
    '#bdb2ff', // light violet
    '#ffc6ff'  // light pink
]; 