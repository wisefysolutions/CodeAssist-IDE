import { 
  users, 
  files, 
  folders, 
  chatMessages, 
  type User, 
  type InsertUser, 
  type File, 
  type InsertFile, 
  type Folder, 
  type InsertFolder, 
  type ChatMessage, 
  type InsertChatMessage 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // File operations
  getFile(id: number): Promise<File | undefined>;
  getAllFiles(): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, file: Partial<InsertFile>): Promise<File>;
  deleteFile(id: number): Promise<void>;
  
  // Folder operations
  getFolder(id: number): Promise<Folder | undefined>;
  getAllFolders(): Promise<Folder[]>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  deleteFolder(id: number): Promise<void>;
  
  // Chat operations
  getChatHistory(assistantType: string): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private files: Map<number, File>;
  private folders: Map<number, Folder>;
  private chatMessages: Map<number, ChatMessage>;
  private userId: number;
  private fileId: number;
  private folderId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.folders = new Map();
    this.chatMessages = new Map();
    this.userId = 1;
    this.fileId = 1;
    this.folderId = 1;
    this.messageId = 1;
    
    // Initialize with some example data
    this.initializeExampleData();
  }
  
  private initializeExampleData() {
    // Create a test user
    const user: User = {
      id: this.userId++,
      username: 'testuser',
      password: 'password'
    };
    this.users.set(user.id, user);
    
    // Create some initial folders
    const rootFolder: Folder = {
      id: this.folderId++,
      name: 'project',
      path: '/project',
      userId: user.id,
      parentId: null
    };
    this.folders.set(rootFolder.id, rootFolder);
    
    const srcFolder: Folder = {
      id: this.folderId++,
      name: 'src',
      path: '/project/src',
      userId: user.id,
      parentId: rootFolder.id
    };
    this.folders.set(srcFolder.id, srcFolder);
    
    const componentsFolder: Folder = {
      id: this.folderId++,
      name: 'components',
      path: '/project/src/components',
      userId: user.id,
      parentId: srcFolder.id
    };
    this.folders.set(componentsFolder.id, componentsFolder);
    
    // Create some initial files
    const mainJsFile: File = {
      id: this.fileId++,
      name: 'main.js',
      content: `// Main application entry point
import { initializeApp } from './utils.js';
import { fetchData } from './api.js';

/**
 * Configuration for the application
 * @type {Object}
 */
const config = {
  apiKey: 'YOUR_API_KEY',
  environment: 'development',
  debug: true
};

async function main() {
  try {
    const app = initializeApp(config);
    const data = await fetchData('/users');
    console.log('Application started', data);
  } catch (error) {
    console.error('Failed to start application:', error);
  }
}`,
      language: 'javascript',
      folderId: srcFolder.id,
      userId: user.id,
      path: '/project/src/main.js'
    };
    this.files.set(mainJsFile.id, mainJsFile);
    
    const utilsJsFile: File = {
      id: this.fileId++,
      name: 'utils.js',
      content: `// Utility functions for the application
export function initializeApp(config) {
  console.log('Initializing app with config:', config);
  
  if (!config || !config.apiKey) {
    throw new Error('Invalid configuration: API key is required');
  }
  
  return {
    name: 'MyApp',
    version: '1.0.0',
    config
  };
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US');
}`,
      language: 'javascript',
      folderId: srcFolder.id,
      userId: user.id,
      path: '/project/src/utils.js'
    };
    this.files.set(utilsJsFile.id, utilsJsFile);
    
    const apiJsFile: File = {
      id: this.fileId++,
      name: 'api.js',
      content: `// API interactions
export async function fetchData(endpoint) {
  console.log(\`Fetching data from \${endpoint}\`);
  
  // Validate API key
  const apiKey = sessionStorage.getItem('apiKey') || 'YOUR_API_KEY';
  
  if (apiKey === 'YOUR_API_KEY') {
    throw new Error('API key is not valid (placeholder error for demo)');
  }
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        users: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' },
          { id: 3, name: 'User 3' },
        ],
        status: 'success',
        version: '1.0.0'
      });
    }, 500);
  });
}`,
      language: 'javascript',
      folderId: srcFolder.id,
      userId: user.id,
      path: '/project/src/api.js'
    };
    this.files.set(apiJsFile.id, apiJsFile);
    
    const readmeFile: File = {
      id: this.fileId++,
      name: 'README.md',
      content: '# Project\n\nThis is a sample project.',
      language: 'markdown',
      folderId: rootFolder.id,
      userId: user.id,
      path: '/project/README.md'
    };
    this.files.set(readmeFile.id, readmeFile);
    
    const packageJsonFile: File = {
      id: this.fileId++,
      name: 'package.json',
      content: `{
  "name": "sample-project",
  "version": "1.0.0",
  "main": "src/main.js",
  "dependencies": {
    "express": "^4.17.1"
  }
}`,
      language: 'json',
      folderId: rootFolder.id,
      userId: user.id,
      path: '/project/package.json'
    };
    this.files.set(packageJsonFile.id, packageJsonFile);
    
    // Add some initial chat messages
    const chatGptWelcome: ChatMessage = {
      id: this.messageId++,
      role: 'system',
      content: 'Hello! I\'m your AI coding assistant. How can I help you with your project today?',
      timestamp: Date.now().toString(),
      hasCode: null,
      code: null,
      codeLanguage: null,
      userId: user.id,
      assistantType: 'chatgpt'
    };
    this.chatMessages.set(chatGptWelcome.id, chatGptWelcome);
    
    const claudeWelcome: ChatMessage = {
      id: this.messageId++,
      role: 'system',
      content: 'Hi there! I\'m Claude, your AI architecture assistant. I can help with code organization, design patterns, and best practices. What are you working on?',
      timestamp: Date.now().toString(),
      hasCode: null,
      code: null,
      codeLanguage: null,
      userId: user.id,
      assistantType: 'claude'
    };
    this.chatMessages.set(claudeWelcome.id, claudeWelcome);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // File operations
  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }
  
  async getAllFiles(): Promise<File[]> {
    return Array.from(this.files.values());
  }
  
  async createFile(file: InsertFile): Promise<File> {
    const id = this.fileId++;
    const newFile: File = { 
      ...file, 
      id,
      folderId: file.folderId ?? null 
    };
    this.files.set(id, newFile);
    return newFile;
  }
  
  async updateFile(id: number, fileUpdate: Partial<InsertFile>): Promise<File> {
    const existingFile = this.files.get(id);
    if (!existingFile) {
      throw new Error(`File with id ${id} not found`);
    }
    
    const updatedFile: File = { ...existingFile, ...fileUpdate };
    this.files.set(id, updatedFile);
    return updatedFile;
  }
  
  async deleteFile(id: number): Promise<void> {
    this.files.delete(id);
  }
  
  // Folder operations
  async getFolder(id: number): Promise<Folder | undefined> {
    return this.folders.get(id);
  }
  
  async getAllFolders(): Promise<Folder[]> {
    return Array.from(this.folders.values());
  }
  
  async createFolder(folder: InsertFolder): Promise<Folder> {
    const id = this.folderId++;
    const newFolder: Folder = { 
      ...folder, 
      id,
      parentId: folder.parentId ?? null 
    };
    this.folders.set(id, newFolder);
    return newFolder;
  }
  
  async deleteFolder(id: number): Promise<void> {
    // First delete all files in the folder
    const filesToDelete = Array.from(this.files.values())
      .filter(file => file.folderId === id);
    
    for (const file of filesToDelete) {
      await this.deleteFile(file.id);
    }
    
    // Then delete all subfolders
    const subFolders = Array.from(this.folders.values())
      .filter(folder => folder.parentId === id);
    
    for (const folder of subFolders) {
      await this.deleteFolder(folder.id);
    }
    
    // Finally delete the folder itself
    this.folders.delete(id);
  }
  
  // Chat operations
  async getChatHistory(assistantType: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.assistantType === assistantType)
      .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
  }
  
  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.messageId++;
    const newMessage: ChatMessage = { 
      ...message, 
      id,
      code: message.code ?? null,
      hasCode: message.hasCode ?? null,
      codeLanguage: message.codeLanguage ?? null
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
