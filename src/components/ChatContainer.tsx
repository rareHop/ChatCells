import React, { useEffect, useRef } from 'react';
import { useMessageStore } from '../store/messageStore';
import { ChatMessage } from './ChatMessage';

export const ChatContainer: React.FC = () => {
  const messages = useMessageStore((state) => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col-reverse">
      <div ref={messagesEndRef} />
      {[...messages].reverse().map((message) => (
        <ChatMessage key={message.id} {...message} />
      ))}
    </div>
  );
};
