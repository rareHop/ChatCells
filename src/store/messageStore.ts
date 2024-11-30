import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '../types';

interface MessageState {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id'>) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) => {
        const newMessage = {
          ...message,
          id: Date.now().toString(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-messages',
      getStorage: () => localStorage,
    }
  )
);