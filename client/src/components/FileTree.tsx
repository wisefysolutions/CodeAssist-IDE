import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { 
  ChevronDown, 
  ChevronRight, 
  FileCode, 
  File as FileIcon,
  FolderOpen, 
  Folder,
  Plus,
  RefreshCw
} from "lucide-react";
import { File, Folder as FolderType } from "@/lib/mockData";

interface FileTreeItemProps {
  item: File | FolderType;
  level?: number;
  expanded?: Record<string, boolean>;
  toggleExpand?: (id: string) => void;
}

function FileTreeItem({ item, level = 0, expanded = {}, toggleExpand }: FileTreeItemProps) {
  const { currentFile, setCurrentFile } = useWorkspace();
  
  const handleClick = () => {
    if (item.type === "folder" && toggleExpand) {
      toggleExpand(item.id);
    } else if (item.type === "file") {
      setCurrentFile(item);
    }
  };
  
  const isActive = currentFile?.id === item.id;
  const isExpanded = item.type === "folder" && expanded[item.id];
  
  // Determine icon based on item type and state
  const getIcon = () => {
    if (item.type === "folder") {
      return isExpanded ? <FolderOpen size={16} className="text-yellow-500" /> : <Folder size={16} className="text-yellow-500" />;
    }
    
    // For files, show different icons based on extension
    const name = item.name.toLowerCase();
    if (name.endsWith('.js') || name.endsWith('.jsx') || name.endsWith('.ts') || name.endsWith('.tsx')) {
      return <FileCode size={16} className="text-primary dark:text-accent" />;
    } else if (name.endsWith('.json')) {
      return <FileCode size={16} className="text-blue-400" />;
    } else if (name.endsWith('.md')) {
      return <FileIcon size={16} className="text-gray-400" />;
    }
    
    return <FileIcon size={16} className="text-gray-400" />;
  };
  
  return (
    <div>
      <div 
        className={`file-tree-item ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {item.type === "folder" && (
          <span className="mr-1.5 text-gray-500">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        {getIcon()}
        <span className="ml-1.5 text-sm truncate">{item.name}</span>
      </div>
      
      {item.type === "folder" && isExpanded && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem 
              key={child.id} 
              item={child} 
              level={level + 1}
              expanded={expanded}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree() {
  const { files } = useWorkspace();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true,
    src: true
  });
  
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  return (
    <div id="file-tree-panel" className="relative w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-sm">Files</h2>
        <div className="flex space-x-2">
          <button 
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded" 
            title="New File"
          >
            <Plus size={14} />
          </button>
          <button 
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded" 
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 py-2">
        <div className="px-2">
          <FileTreeItem 
            item={files} 
            expanded={expanded}
            toggleExpand={toggleExpand}
          />
        </div>
      </div>
      
      <div className="resize-handle"></div>
    </div>
  );
}
