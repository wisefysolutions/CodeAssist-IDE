import { useTheme } from "@/hooks/useTheme";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Play, 
  Moon, 
  Sun, 
  User 
} from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { addConsoleOutput, setShowErrorPopup, clearConsole } = useWorkspace();

  const handleRun = () => {
    clearConsole();
    addConsoleOutput("Application started");
    addConsoleOutput("{users: Array(3), status: \"success\", version: \"1.0.0\"}");
    
    // Simulate an error for demo purposes
    setTimeout(() => {
      addConsoleOutput("API key is not valid (placeholder error for demo)", "error");
      addConsoleOutput("at fetchData (api.js:24:15)", "error");
      addConsoleOutput("at main (main.js:17:29)", "error");
      setShowErrorPopup(true);
    }, 500);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-14 flex items-center px-4 shadow-sm z-10">
      <div className="flex items-center">
        <div className="flex items-center space-x-2 mr-6">
          <Code className="text-primary dark:text-accent" size={20} />
          <h1 className="font-semibold text-lg">CodeAssist IDE</h1>
        </div>
        
        <div className="flex space-x-2 text-sm">
          <button className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">File</button>
          <button className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Edit</button>
          <button className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">View</button>
          <button className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Run</button>
          <button className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Help</button>
        </div>
      </div>
      
      <div className="ml-auto flex items-center space-x-4">
        <Button 
          variant="default" 
          size="sm" 
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          onClick={handleRun}
        >
          <Play size={16} />
          Run
        </Button>
        
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
