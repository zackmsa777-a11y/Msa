const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export async function getChats() {
  const response = await fetch(`${API_BASE_URL}/chats`);
  if (!response.ok) throw new Error('Failed to fetch chats');
  return response.json();
}

export async function createChat(title: string) {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to create chat');
  return response.json();
}

export async function deleteChat(chatId: string) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete chat');
  return response.json();
}

export async function getMessages(chatId: string) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`);
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}

export async function sendMessage(chatId: string, message: string, apiKey: string) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, apiKey }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }
  return response.json();
}
