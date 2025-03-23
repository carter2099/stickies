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

-- Add z_index column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sticky_notes' AND column_name = 'z_index'
    ) THEN
        ALTER TABLE sticky_notes ADD COLUMN z_index INTEGER;
    END IF;
END $$;

-- Seed z_index values for existing notes based on created_at (newer notes on top)
-- Only update notes where z_index is null for idempotency
UPDATE sticky_notes 
SET z_index = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM sticky_notes
  WHERE z_index IS NULL
) AS subquery
WHERE sticky_notes.id = subquery.id;