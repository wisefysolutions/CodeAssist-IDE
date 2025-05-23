import { useWorkspace } from "@/hooks/useWorkspace";
import { Trash2, ChevronDown } from "lucide-react";

export default function Console() {
  const { consoleOutput, clearConsole } = useWorkspace();
  
  const getMessageClass = (message: string) => {
    if (message.startsWith("> Error:")) return "text-red-600 dark:text-red-400";
    if (message.startsWith("> Warning:")) return "text-yellow-600 dark:text-yellow-400";
    if (message.startsWith("at ")) return "pl-2 text-red-600 dark:text-red-400";
    if (message.startsWith("{")) return "pl-2";
    return "text-green-600 dark:text-green-400";
  };
  
  return (
    <div className="h-40 border-t border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-sm">Console</h3>
        <div className="ml-auto flex space-x-2">
          <button 
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
            title="Clear Console"
            onClick={clearConsole}
          >
            <Trash2 size={14} />
          </button>
          <button 
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
            title="Toggle Console"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 font-mono text-sm bg-gray-50 dark:bg-gray-900">
        {consoleOutput.length === 0 ? (
          <div className="text-gray-500 italic">Console is empty</div>
        ) : (
          consoleOutput.map((output, index) => (
            <div key={index} className={`mb-1 ${getMessageClass(output)}`}>
              {output}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
