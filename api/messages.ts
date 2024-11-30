import type { VercelRequest, VercelResponse } from '@vercel/node';

const messages = new Set();
const clients = new Set();

export const config = {
  runtime: 'edge',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const client = {
      id: Date.now(),
      send: (data: string) => {
        res.write(`data: ${data}\n\n`);
      }
    };
    
    clients.add(client);
    
    // Send existing messages
    messages.forEach(msg => {
      client.send(JSON.stringify(msg));
    });
    
    req.on('close', () => {
      clients.delete(client);
    });
    
  } else if (req.method === 'POST') {
    const message = await req.json();
    messages.add(message);
    
    // Broadcast to all clients
    clients.forEach(client => {
      client.send(JSON.stringify(message));
    });
    
    res.json({ success: true });
  }
}