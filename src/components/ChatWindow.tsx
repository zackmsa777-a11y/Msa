import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Message } from '../lib/supabase';
import { MessageDisplay } from './MessageDisplay';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatWindow({ messages, onSendMessage, isLoading }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🐛</div>
              <h2 className="text-2xl font-bold text-red-500 mb-2">WormGPT</h2>
              <p className="text-gray-400">Start a conversation...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageDisplay key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-800/50 text-gray-100 border border-gray-700/50 rounded-lg px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-red-900/30 bg-black/40 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask WormGPT anything..."
              disabled={isLoading}
              className="flex-1 bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-700/50 focus:ring-1 focus:ring-red-700/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-red-900/50 hover:bg-red-800/60 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-700/50 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
