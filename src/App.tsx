import { useState, useEffect } from 'react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatWindow } from './components/ChatWindow';
import { Chat, Message } from './lib/supabase';
import * as api from './lib/api';

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState(
    () => import.meta.env.VITE_OPENROUTER_API_KEY || ''
  );

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId);
    }
  }, [currentChatId]);

  const loadChats = async () => {
    try {
      const data = await api.getChats();
      setChats(data);
      if (data.length > 0 && !currentChatId) {
        setCurrentChatId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const data = await api.getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await api.createChat('New Chat');
      setChats([newChat, ...chats]);
      setCurrentChatId(newChat.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await api.deleteChat(chatId);
      const updatedChats = chats.filter((c) => c.id !== chatId);
      setChats(updatedChats);

      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id);
        } else {
          setCurrentChatId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentChatId || !apiKey) {
      alert('Please ensure you have an API key configured and a chat selected.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.sendMessage(currentChatId, message, apiKey);
      setMessages([...messages, response.userMessage, response.assistantMessage]);

      const updatedChats = chats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, updated_at: new Date().toISOString() }
          : chat
      );
      setChats(updatedChats.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      {currentChatId ? (
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="text-center">
            <div className="text-6xl mb-4">🐛</div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">WormGPT</h2>
            <p className="text-gray-400 mb-6">Create a new chat to get started</p>
            <button
              onClick={handleNewChat}
              className="bg-red-900/50 hover:bg-red-800/60 text-white px-6 py-3 rounded-lg transition-colors border border-red-700/50"
            >
              Start New Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
