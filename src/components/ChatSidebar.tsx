import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Chat } from '../lib/supabase';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <div className="w-64 bg-black border-r border-red-900/30 flex flex-col h-screen">
      <div className="p-4 border-b border-red-900/30">
        <h1 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
          <span className="text-3xl">🐛</span>
          WormGPT
        </h1>
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-800/40 text-white px-4 py-2.5 rounded-lg transition-colors border border-red-700/50"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center justify-between p-3 mb-1 rounded-lg cursor-pointer transition-all ${
              currentChatId === chat.id
                ? 'bg-red-900/40 border border-red-700/50'
                : 'hover:bg-gray-900/50 border border-transparent'
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MessageSquare className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-gray-200 truncate">{chat.title}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/50 rounded transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-red-900/30">
        <div className="text-xs text-gray-500">
          <p className="mb-1">Made with 💀 by</p>
          <p className="text-red-400">t.me/xsocietyforums</p>
        </div>
      </div>
    </div>
  );
}
