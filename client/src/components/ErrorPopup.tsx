import { useWorkspace } from "@/hooks/useWorkspace";
import { X, AlertCircle } from "lucide-react";
import { errorExplanations } from "@/lib/mockData";

export default function ErrorPopup() {
  const { showErrorPopup, setShowErrorPopup } = useWorkspace();
  
  if (!showErrorPopup) return null;
  
  const errorInfo = errorExplanations["API key is not valid"];
  
  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-sm flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={16} />
          Error Explanation
        </h3>
        <button 
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded" 
          title="Close"
          onClick={() => setShowErrorPopup(false)}
        >
          <X size={14} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="text-sm mb-3">
          <p><span className="font-semibold">Error:</span> {errorInfo.error}</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{errorInfo.location}</p>
        </div>
        
        <div className="text-sm mb-3">
          <p className="font-semibold mb-1">What this means:</p>
          <p>{errorInfo.explanation}</p>
        </div>
        
        <div className="text-sm">
          <p className="font-semibold mb-1">How to fix it:</p>
          <ol className="list-decimal pl-5 space-y-1">
            {errorInfo.solutions.map((solution, index) => (
              <li key={index}>{solution}</li>
            ))}
          </ol>
        </div>
      </div>
      
      <div className="flex border-t border-gray-200 dark:border-gray-700">
        <button className="flex-1 py-2 text-sm text-center hover:bg-gray-100 dark:hover:bg-gray-700 text-primary dark:text-accent">
          Fix Automatically
        </button>
        <button className="flex-1 py-2 text-sm text-center hover:bg-gray-100 dark:hover:bg-gray-700 border-l border-gray-200 dark:border-gray-700">
          Learn More
        </button>
      </div>
    </div>
  );
}
