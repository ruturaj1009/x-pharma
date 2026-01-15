'use client';
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Open sidebar
  const handleOpen = () => setSidebarOpen(true);
  
  // Close sidebar (only if not pinned? For now, standard hover behavior: leave -> close)
  const handleClose = () => setSidebarOpen(false);

  // Toggle (for click)
  const handleToggle = () => setSidebarOpen(prev => !prev);

  return (
    <div style={{display:'flex', height:'100vh', overflow:'hidden'}}>
      
      {/* Sidebar: Fixed overlay */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      />

      {/* Main Content: Full width since sidebar is fixed overlay */}
      <div style={{flexGrow:1, display:'flex', flexDirection:'column', height:'100vh', overflowY:'auto', width:'100%'}}>
         <TopHeader 
            onMenuClick={handleToggle} 
            onMenuHover={handleOpen}
         />
         
         <main style={{flexGrow:1, position:'relative'}}>
           {children}
         </main>
      </div>

      {/* Optional: Overlay if we want click-outside to close on mobile, 
          but hover behavior usually implies no blocking overlay needed on desktop.
          For mobile, we might want one.
       */}
      {sidebarOpen && (
        <div 
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:1000,
            display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'block' : 'none'
          }}
          onClick={handleClose}
        ></div>
      )}

    </div>
  );
}
