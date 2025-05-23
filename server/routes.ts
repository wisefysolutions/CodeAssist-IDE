import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create the HTTP server
  const httpServer = createServer(app);
  
  // Create a WebSocket server
  const wss = new WebSocketServer({ server: httpServer });
  
  // WebSocket connection handler
  wss.on('connection', (ws: any) => {
    console.log('Client connected');
    
    // Handle messages from clients
    ws.on('message', async (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === 'run_code') {
          // Simulate code execution
          const results = [
            { type: 'log', message: 'Application started' },
            { type: 'log', message: '{users: Array(3), status: "success", version: "1.0.0"}' },
            { type: 'error', message: 'API key is not valid (placeholder error for demo)' },
            { type: 'error', message: 'at fetchData (api.js:24:15)' },
            { type: 'error', message: 'at main (main.js:17:29)' }
          ];
          
          // Send back results with a small delay between messages
          for (const result of results) {
            await new Promise(resolve => setTimeout(resolve, 200));
            ws.send(JSON.stringify({ type: 'console', data: result }));
          }
          
          // Send error explanation after a delay
          setTimeout(() => {
            ws.send(JSON.stringify({ 
              type: 'error_explanation', 
              data: {
                error: "API key is not valid",
                location: "at fetchData (api.js:24:15)",
                explanation: "The API is expecting a valid API key, but it received either an empty string, null, or the placeholder text 'YOUR_API_KEY'.",
                solutions: [
                  "Replace the placeholder API key with your actual API key",
                  "If testing locally, implement a bypass for development mode",
                  "Check that the API key is being properly loaded from your environment variables"
                ]
              }
            }));
          }, 500);
        }
        
        // AI Assistant message handling
        else if (data.type === 'ai_message') {
          // Simulate AI response
          setTimeout(() => {
            let responseContent = "";
            let hasCode = false;
            let code = "";
            
            if (data.assistantType === "chatgpt") {
              if (data.message.toLowerCase().includes("error") || data.message.toLowerCase().includes("api key")) {
                responseContent = "To fix the API key validation error, you should replace the placeholder key with a real API key or set up environment variables to manage your keys securely.";
                hasCode = true;
                code = `// Use environment variables for API keys
const apiKey = process.env.API_KEY || 'fallback-key';

// Or load from a configuration file
import config from './config.js';
const apiKey = config.apiKey;`;
              } else {
                responseContent = "I'll help you with that! Let me know if you need any specific assistance with your code.";
              }
            } else {
              responseContent = "From an architectural perspective, I'd recommend separating your API key handling into a dedicated configuration module that can be easily tested and maintained.";
            }
            
            ws.send(JSON.stringify({
              type: 'ai_response',
              data: {
                role: "assistant",
                content: responseContent,
                timestamp: Date.now(),
                hasCode,
                code,
                codeLanguage: "javascript",
                assistantType: data.assistantType
              }
            }));
          }, 1000);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message' }));
      }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
  
  // API Routes
  
  // Files API
  app.get('/api/files', async (req, res) => {
    try {
      const files = await storage.getAllFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });
  
  app.post('/api/files', async (req, res) => {
    try {
      const file = await storage.createFile(req.body);
      res.status(201).json(file);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create file' });
    }
  });
  
  app.get('/api/files/:id', async (req, res) => {
    try {
      const file = await storage.getFile(parseInt(req.params.id));
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch file' });
    }
  });
  
  app.put('/api/files/:id', async (req, res) => {
    try {
      const file = await storage.updateFile(parseInt(req.params.id), req.body);
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update file' });
    }
  });
  
  app.delete('/api/files/:id', async (req, res) => {
    try {
      await storage.deleteFile(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });
  
  // Folders API
  app.get('/api/folders', async (req, res) => {
    try {
      const folders = await storage.getAllFolders();
      res.json(folders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  });
  
  app.post('/api/folders', async (req, res) => {
    try {
      const folder = await storage.createFolder(req.body);
      res.status(201).json(folder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create folder' });
    }
  });
  
  app.delete('/api/folders/:id', async (req, res) => {
    try {
      await storage.deleteFolder(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete folder' });
    }
  });
  
  // Chat API
  app.get('/api/chat/:type', async (req, res) => {
    try {
      const messages = await storage.getChatHistory(req.params.type);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat history' });
    }
  });
  
  app.post('/api/chat/:type', async (req, res) => {
    try {
      const message = await storage.addChatMessage({
        ...req.body,
        assistantType: req.params.type
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add chat message' });
    }
  });
  
  return httpServer;
}
