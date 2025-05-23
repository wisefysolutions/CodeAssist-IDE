import { useRef, useEffect, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { File as FileType } from "@/lib/mockData";

interface EditorTabsProps {
  file: FileType | null;
  onClose: (id: string) => void;
}

function EditorTabs({ file, onClose }: EditorTabsProps) {
  if (!file) return null;
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
      <div className="flex">
        <div className="py-2 px-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <FileIcon file={file} size={14} />
          <span className="text-sm">{file.name}</span>
          <button 
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            onClick={() => onClose(file.id)}
          >
            <span className="text-xs">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function FileIcon({ file, size = 16 }: { file: FileType, size?: number }) {
  // Show different icons based on file extension
  const name = file.name.toLowerCase();
  
  if (name.endsWith('.js') || name.endsWith('.jsx')) {
    return <span className="text-primary dark:text-accent text-xs"><i className="fas fa-file-code"></i></span>;
  } else if (name.endsWith('.json')) {
    return <span className="text-blue-400 text-xs"><i className="fas fa-file-code"></i></span>;
  }
  
  return <span className="text-gray-400 text-xs"><i className="fas fa-file"></i></span>;
}

export default function Editor() {
  const { currentFile, updateFile } = useWorkspace();
  const [content, setContent] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (currentFile) {
      setContent(currentFile.content);
    }
  }, [currentFile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (currentFile) {
      updateFile(currentFile.id, newContent);
    }
  };
  
  const closeTab = (id: string) => {
    // This would close the tab in a real implementation
    // For now, we just do nothing since we always show the current file
  };
  
  // Create line numbers for the editor
  const lineCount = content.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <EditorTabs file={currentFile} onClose={closeTab} />
      
      <div className="flex-1 overflow-hidden flex relative">
        <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
          {currentFile ? (
            <div className="flex-1 overflow-auto">
              <div className="font-mono text-sm flex editor-container">
                {/* Line numbers */}
                <div className="line-numbers py-2 px-3 select-none bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                  {lineNumbers.map(num => (
                    <div key={num}>{num}</div>
                  ))}
                </div>
                
                {/* Code content */}
                <textarea
                  ref={textareaRef}
                  className="py-2 px-4 w-full bg-transparent font-mono text-sm resize-none outline-none"
                  value={content}
                  onChange={handleChange}
                  spellCheck={false}
                  style={{ lineHeight: 1.5, minHeight: "100%" }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>No file selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
