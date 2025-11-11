/*
  # WormGPT Chat System Database Schema

  1. New Tables
    - `chats`
      - `id` (uuid, primary key) - Unique identifier for each chat
      - `title` (text) - Chat title/name
      - `created_at` (timestamptz) - When the chat was created
      - `updated_at` (timestamptz) - Last activity timestamp
      
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `chat_id` (uuid, foreign key) - Reference to parent chat
      - `role` (text) - Message role: 'user' or 'assistant'
      - `content` (text) - Message content
      - `created_at` (timestamptz) - When the message was sent
      
  2. Security
    - Enable RLS on both tables (open access for demo, can be restricted later)
    - Add policies for public read/write access
    
  3. Important Notes
    - Messages are linked to chats via foreign key with cascade delete
    - Updated_at timestamp on chats updates automatically
    - System supports multiple concurrent chats with full history
*/

CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);

CREATE OR REPLACE FUNCTION update_chat_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats SET updated_at = now() WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_chat_timestamp_trigger ON messages;
CREATE TRIGGER update_chat_timestamp_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_timestamp();

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to chats"
  ON chats FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to chats"
  ON chats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to chats"
  ON chats FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to chats"
  ON chats FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to messages"
  ON messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to messages"
  ON messages FOR DELETE
  USING (true);