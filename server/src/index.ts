import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { AppError } from './types/errors';
import { initJob } from './jobs/job';
import { stickyNoteService } from './services/StickyNoteService';
import { CreateStickyNoteDto } from './models/StickyNote';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Start background job
initJob();

// Sticky Notes API endpoints
app.get('/api/notes', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const notes = await stickyNoteService.getAllNotes();
        res.json(notes);
    } catch (error) {
        next(error);
    }
});

app.post('/api/notes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const noteData: CreateStickyNoteDto = req.body;
        const newNote = await stickyNoteService.createNote(noteData);
        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message
        });
    } else {
        res.status(500).json({
            message: 'An unexpected error occurred'
        });
    }
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Cleaning up...');
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});