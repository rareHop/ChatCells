import { io } from 'socket.io-client';
import { useMessageStore } from '../store/messageStore';

class WebSocketService {
  private socket: any = null;

  connect() {
    try {
      const socketUrl = import.meta.env.PROD 
        ? window.location.origin 
        : 'http://localhost:3000';
      
      this.socket = io(socketUrl, {
        path: '/api/socket',
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('message', (message: any) => {
        useMessageStore.getState().addMessage(message);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      this.socket.on('error', (error: any) => {
        console.error('WebSocket error:', error);
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  sendMessage(message: any) {
    if (this.socket?.connected) {
      this.socket.emit('message', message);
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

export const webSocketService = new WebSocketService();