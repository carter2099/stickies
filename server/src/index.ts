import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { AppError } from './types/errors';
import { initJob } from './jobs/job';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Start background jobs
initJob();

// Sticky Notes API
app.get('/api/sticky-notes', async (_req: Request, res: Response) => {
    try {
        const notes = await db.getAllStickyNotes();
        res.json(notes);
    } catch (error) {
        console.error('Error fetching sticky notes:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch sticky notes' 
        });
    }
});

app.post('/api/sticky-notes', async (req: Request, res: Response) => {
    try {
        const { content, color, position_x, position_y } = req.body;
        
        if (!content || !color || position_x === undefined || position_y === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }
        
        const newNote = await db.createStickyNote({
            content,
            color,
            position_x,
            position_y
        });
        
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error creating sticky note:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create sticky note' 
        });
    }
});

app.patch('/api/sticky-notes/:id/position', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { position_x, position_y } = req.body;
        
        if (position_x === undefined || position_y === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing position coordinates' 
            });
        }
        
        const updatedNote = await db.updateStickyNotePosition(id, position_x, position_y);
        
        if (!updatedNote) {
            return res.status(404).json({ 
                success: false, 
                message: 'Sticky note not found' 
            });
        }
        
        res.json(updatedNote);
    } catch (error) {
        console.error('Error updating sticky note position:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update sticky note position' 
        });
    }
});

// Update sticky note z-index
app.patch('/api/sticky-notes/:id/z-index', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { z_index } = req.body;
        
        if (z_index === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing z_index value' 
            });
        }
        
        // Update the z-index in the database
        const result = await db.updateStickyNoteZIndex(id, z_index);
        
        if (!result) {
            return res.status(404).json({ 
                success: false, 
                message: 'Sticky note not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Z-index updated successfully' 
        });
    } catch (error) {
        console.error('Error updating sticky note z-index:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update sticky note z-index' 
        });
    }
});

// POST
app.post('/api/myPost', async (_req: Request, res: Response) => {
    try {
        const result = { success: true, message: "Post successful" };
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Post failed' 
        });
    }
});

// GET
app.get('/api/myGet', async (_req: Request, res: Response) => {
    try {
        res.json({ message: "Hello World!" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred' 
        });
    }
});

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