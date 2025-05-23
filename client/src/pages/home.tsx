import Header from "@/components/Header";
import FileTree from "@/components/FileTree";
import Editor from "@/components/Editor";
import Console from "@/components/Console";
import AIAssistant from "@/components/AIAssistant";
import ErrorPopup from "@/components/ErrorPopup";
import { useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function Home() {
  const { files } = useWorkspace();
  
  // Initialize resizable panels after component mount
  useEffect(() => {
    const fileTreePanel = document.getElementById('file-tree-panel');
    const aiAssistantPanel = document.getElementById('ai-assistant-panel');
    const fileTreeHandle = fileTreePanel?.querySelector('.resize-handle');
    const aiAssistantHandle = aiAssistantPanel?.querySelector('.resize-handle');
    
    let isResizing = false;
    let currentPanel = null;
    let startX = 0;
    let startWidth = 0;
    
    function startResize(e, panel, handle) {
      isResizing = true;
      currentPanel = panel;
      startX = e.clientX;
      startWidth = parseInt(window.getComputedStyle(panel).width, 10);
      handle.classList.add('active');
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      e.preventDefault();
    }
    
    function resize(e) {
      if (!isResizing) return;
      
      if (currentPanel === fileTreePanel) {
        const width = startWidth + (e.clientX - startX);
        // Set min and max widths
        if (width > 150 && width < 400) {
          currentPanel.style.width = `${width}px`;
        }
      } else if (currentPanel === aiAssistantPanel) {
        const width = startWidth - (e.clientX - startX);
        if (width > 150 && width < 400) {
          currentPanel.style.width = `${width}px`;
        }
      }
    }
    
    function stopResize() {
      isResizing = false;
      if (currentPanel) {
        const handle = currentPanel.querySelector('.resize-handle');
        if (handle) {
          handle.classList.remove('active');
        }
      }
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    }
    
    // Add event listeners
    if (fileTreeHandle) {
      fileTreeHandle.addEventListener('mousedown', e => startResize(e, fileTreePanel, fileTreeHandle));
    }
    
    if (aiAssistantHandle) {
      aiAssistantHandle.addEventListener('mousedown', e => startResize(e, aiAssistantPanel, aiAssistantHandle));
    }
    
    return () => {
      // Cleanup
      if (fileTreeHandle) {
        fileTreeHandle.removeEventListener('mousedown', startResize);
      }
      if (aiAssistantHandle) {
        aiAssistantHandle.removeEventListener('mousedown', startResize);
      }
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, []);
  
  return (
    <div className="dark-transition flex flex-col h-screen overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <FileTree />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Editor />
          <Console />
        </div>
        
        <AIAssistant />
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-6 px-4 flex items-center text-xs">
        <div className="text-gray-600 dark:text-gray-400">JavaScript</div>
        <div className="ml-4 text-gray-600 dark:text-gray-400">Ln 17, Col 29</div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="text-gray-600 dark:text-gray-400">UTF-8</div>
          <div className="text-gray-600 dark:text-gray-400">Spaces: 2</div>
        </div>
      </div>
      
      <ErrorPopup />
    </div>
  );
}
