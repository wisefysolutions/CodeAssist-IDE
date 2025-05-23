import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Settings, ChevronRight, Paperclip, Send, Bot, User } from "lucide-react";
import { assistants, MessageData } from "@/lib/mockData";

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState<string>("chatgpt");
  const [messages, setMessages] = useState<Record<string, MessageData[]>>({
    chatgpt: [
      {
        role: "system",
        content: "Hello! I'm your AI coding assistant. How can I help you with your project today?",
        timestamp: Date.now(),
      },
      {
        role: "user",
        content: "I'm getting an error in my code. The API key validation isn't working properly.",
        timestamp: Date.now() - 60000,
      },
      {
        role: "assistant",
        content: "I can help with that! Looking at your code, it seems the API key validation might be failing because you're using a placeholder key.",
        timestamp: Date.now() - 30000,
        hasCode: true,
        code: `// In api.js
function validateApiKey(apiKey) {
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    throw new Error('API key is not valid');
  }
  return true;
}`,
        codeLanguage: "javascript",
      },
    ],
    claude: [
      {
        role: "system",
        content: "Hi there! I'm Claude, your AI architecture assistant. I can help with code organization, design patterns, and best practices. What are you working on?",
        timestamp: Date.now(),
      },
    ],
  });
  
  const [inputValue, setInputValue] = useState<string>("");
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newUserMessage: MessageData = {
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };
    
    setMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newUserMessage],
    }));
    
    setInputValue("");
    
    // Simulate AI response
    setTimeout(() => {
      let responseContent = "";
      let hasCode = false;
      let code = "";
      
      if (activeTab === "chatgpt") {
        if (inputValue.toLowerCase().includes("error") || inputValue.toLowerCase().includes("api key")) {
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
      
      const newAIMessage: MessageData = {
        role: "assistant",
        content: responseContent,
        timestamp: Date.now(),
        hasCode,
        code,
        codeLanguage: "javascript",
      };
      
      setMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newAIMessage],
      }));
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div id="ai-assistant-panel" className="relative w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-sm">AI Assistant</h2>
        <div className="flex space-x-2">
          <button 
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded" 
            title="Settings"
          >
            <Settings size={14} />
          </button>
          <button 
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded" 
            title="Collapse Panel"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      
      {/* AI assistant tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {assistants.map(assistant => (
          <button 
            key={assistant.id}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === assistant.id 
                ? "text-primary dark:text-accent border-b-2 border-primary dark:border-accent" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(assistant.id)}
          >
            {assistant.name}
          </button>
        ))}
      </div>
      
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages[activeTab]?.map((message, index) => (
          <div 
            key={index} 
            className={`flex items-start ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role !== "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot size={16} className="text-primary dark:text-accent" />
              </div>
            )}
            
            <div 
              className={`rounded-lg p-3 text-sm max-w-[85%] ${
                message.role === "user" 
                  ? "bg-primary dark:bg-accent/90 text-white" 
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <p>{message.content}</p>
              
              {message.hasCode && (
                <div className="bg-white dark:bg-gray-900 rounded p-2 font-mono text-xs mt-2 overflow-x-auto">
                  {message.code?.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
            
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center ml-2 flex-shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* AI assistant input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <textarea 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-800 focus:outline-none focus:border-primary dark:focus:border-accent resize-none" 
            placeholder="Ask a question or request help..." 
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          ></textarea>
          <div className="absolute right-2 bottom-2 flex space-x-1">
            <button 
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
              title="Upload File"
            >
              <Paperclip size={16} className="text-gray-500" />
            </button>
            <button 
              className="w-7 h-7 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full" 
              title="Send Message"
              onClick={handleSendMessage}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <div>{activeTab === "chatgpt" ? "ChatGPT 4" : "Claude 3"}</div>
          <button className="text-primary dark:text-accent hover:underline">API Settings</button>
        </div>
      </div>
      
      <div className="resize-handle"></div>
    </div>
  );
}
