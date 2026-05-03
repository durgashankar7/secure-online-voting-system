import React from 'react';

const PortalLayout = ({ children }) => {
  return (
    // Yahan humne ek baar image aur background CSS daal di
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      
      {/* Background Dark Overlay & Tech Grid jo sab page pe chahiye */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40 z-0 pointer-events-none"></div>

      {/* Glowing Orbs (Portal wali feel ke liye) */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-indigo-600/40 rounded-full mix-blend-screen filter blur-[120px] animate-pulse z-0 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-fuchsia-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse z-0 pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Asli Page ka Content (Login, Landing, ya koi aur page) yahan render hoga */}
      <div className="relative z-10 flex flex-col flex-1 w-full">
        {children}
      </div>
      
    </div>
  );
};

export default PortalLayout;