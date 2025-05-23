import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { File, Folder, ProjectStructure } from "@/lib/mockData";

interface WorkspaceContextType {
  files: ProjectStructure;
  currentFile: File | null;
  setCurrentFile: (file: File) => void;
  consoleOutput: string[];
  addConsoleOutput: (message: string, type?: "log" | "error" | "warn") => void;
  clearConsole: () => void;
  showErrorPopup: boolean;
  setShowErrorPopup: (show: boolean) => void;
  createFile: (path: string, content: string) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  createFolder: (path: string) => void;
  deleteFolder: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<ProjectStructure>({
    id: "root",
    name: "project",
    type: "folder",
    children: [
      {
        id: "src",
        name: "src",
        type: "folder",
        children: [
          {
            id: "main-js",
            name: "main.js",
            type: "file",
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
            language: "javascript",
          },
          {
            id: "utils-js",
            name: "utils.js",
            type: "file",
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
            language: "javascript",
          },
          {
            id: "api-js",
            name: "api.js",
            type: "file",
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
            language: "javascript",
          },
        ],
      },
      {
        id: "components",
        name: "components",
        type: "folder",
        children: [],
      },
      {
        id: "styles",
        name: "styles",
        type: "folder",
        children: [],
      },
      {
        id: "readme",
        name: "README.md",
        type: "file",
        content: "# Project\n\nThis is a sample project.",
        language: "markdown",
      },
      {
        id: "package-json",
        name: "package.json",
        type: "file",
        content: `{
  "name": "sample-project",
  "version": "1.0.0",
  "main": "src/main.js",
  "dependencies": {
    "express": "^4.17.1"
  }
}`,
        language: "json",
      },
    ],
  });

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);

  // Initialize with main.js as the current file
  useEffect(() => {
    const mainFile = findFileById(files, "main-js");
    if (mainFile) {
      setCurrentFile(mainFile as File);
    }
  }, []);

  const findFileById = (structure: Folder | File, id: string): File | null => {
    if (structure.id === id && structure.type === "file") {
      return structure as File;
    }
    
    if (structure.type === "folder") {
      for (const child of structure.children) {
        const found = findFileById(child, id);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  };

  const addConsoleOutput = (message: string, type: "log" | "error" | "warn" = "log") => {
    const prefix = type === "error" ? "> Error: " : type === "warn" ? "> Warning: " : "> ";
    setConsoleOutput(prev => [...prev, `${prefix}${message}`]);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const createFile = (path: string, content: string) => {
    // Implementation for creating a new file
    // This is a placeholder for the actual implementation
  };

  const updateFile = (id: string, content: string) => {
    // Update file content by id
    setFiles(prevFiles => {
      // Deep clone the files structure
      const newFiles = JSON.parse(JSON.stringify(prevFiles));
      
      // Find and update the file
      const updateFileInStructure = (item: Folder | File) => {
        if (item.id === id && item.type === "file") {
          (item as File).content = content;
          return true;
        }
        
        if (item.type === "folder") {
          for (const child of item.children) {
            if (updateFileInStructure(child)) {
              return true;
            }
          }
        }
        
        return false;
      };
      
      updateFileInStructure(newFiles);
      return newFiles;
    });
  };

  const deleteFile = (id: string) => {
    // Implementation for deleting a file
    // This is a placeholder for the actual implementation
  };

  const createFolder = (path: string) => {
    // Implementation for creating a new folder
    // This is a placeholder for the actual implementation
  };

  const deleteFolder = (id: string) => {
    // Implementation for deleting a folder
    // This is a placeholder for the actual implementation
  };

  return (
    <WorkspaceContext.Provider
      value={{
        files,
        currentFile,
        setCurrentFile,
        consoleOutput,
        addConsoleOutput,
        clearConsole,
        showErrorPopup,
        setShowErrorPopup,
        createFile,
        updateFile,
        deleteFile,
        createFolder,
        deleteFolder,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
