import { useState, useEffect } from 'react';
import { config } from '../config';

export function HelloWorld() {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await fetch(`${config.API_URL}/api/myGet`);
                const data = await response.json();
                setMessage(data.message);
            } catch (err) {
                setError('Failed to fetch message');
                console.error('Error:', err);
            }
        };

        fetchMessage();
    }, []);

    if (error) {
        return <div className="error">{error}</div>;
    }

    return <h1>{message}</h1>;
} 