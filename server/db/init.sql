-- CREATE TABLE etc

-- Create sticky notes table
CREATE TABLE IF NOT EXISTS sticky_notes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    color VARCHAR(20) NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);