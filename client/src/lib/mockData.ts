export interface File {
  id: string;
  name: string;
  type: "file";
  content: string;
  language: string;
}

export interface Folder {
  id: string;
  name: string;
  type: "folder";
  children: (File | Folder)[];
}

export type ProjectStructure = Folder;

export interface MessageData {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  hasCode?: boolean;
  code?: string;
  codeLanguage?: string;
}

export interface AIAssistant {
  id: string;
  name: string;
  icon: string;
  messages: MessageData[];
}

export const assistants: AIAssistant[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "robot",
    messages: [
      {
        role: "system",
        content: "Hello! I'm your AI coding assistant. How can I help you with your project today?",
        timestamp: Date.now(),
      }
    ],
  },
  {
    id: "claude",
    name: "Claude",
    icon: "robot",
    messages: [
      {
        role: "system",
        content: "Hi there! I'm Claude, your AI architecture assistant. I can help with code organization, design patterns, and best practices. What are you working on?",
        timestamp: Date.now(),
      }
    ],
  }
];

export const errorExplanations = {
  "API key is not valid": {
    error: "API key is not valid",
    location: "at fetchData (api.js:24:15)",
    explanation: "The API is expecting a valid API key, but it received either an empty string, null, or the placeholder text 'YOUR_API_KEY'.",
    solutions: [
      "Replace the placeholder API key with your actual API key",
      "If testing locally, implement a bypass for development mode",
      "Check that the API key is being properly loaded from your environment variables"
    ]
  },
  "Cannot read properties of undefined": {
    error: "Cannot read properties of undefined (reading 'length')",
    location: "at processData (utils.js:42:23)",
    explanation: "You're trying to access a property 'length' on a variable that is undefined. This often happens when you expect an array or string but receive undefined instead.",
    solutions: [
      "Add a null check before accessing the property",
      "Provide a default value using the ?? or || operators",
      "Check where the variable is supposed to be initialized"
    ]
  }
};
