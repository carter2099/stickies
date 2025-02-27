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