import cron from 'node-cron';
import { MyService } from '../services/MyService';
let isRunning = false;

const myService = new MyService();

export async function doJob() {
    if (isRunning) {
        console.log('Job already running, skipping...');
        return { success: false, message: 'Job already running' };
    }

    isRunning = true;
    const startTime = new Date();
    console.log(`[${startTime.toISOString()}] Starting job...`);

    try {
        const result = await myService.helloWorld();
        console.log('Completed job');
        return { success: true, message: 'Job completed', result };
    } catch (error) {
        const endTime = new Date();
        console.error(`[${endTime.toISOString()}] Job failed:`, error);
        return { 
            success: false, 
            message: 'Job failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
            details: {
                error: error instanceof Error ? error.stack : 'Unknown error',
                duration: `${endTime.getTime() - startTime.getTime()}ms`
            }
        };
    } finally {
        isRunning = false;
    }
}

export function initJob() {
    // Run every 20s
    cron.schedule('*/20 * * * * *', async () => {
        console.log('Running job...');
        const result = await doJob();
        console.log('Completed job');
    });
} 