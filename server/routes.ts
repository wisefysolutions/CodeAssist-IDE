import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create the HTTP server
  const httpServer = createServer(app);
  
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
