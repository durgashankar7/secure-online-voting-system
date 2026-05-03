import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, Clock, Upload, Users, BarChart3, Settings, Info, ShieldCheck, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Session clear kiya
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminEmail"); 
    toast('Logged out securely.', { icon: '🔒' });

    // 2. NINJA TRICK FOR BACK BUTTON:
    // Pehle Dashboard ki history ko mita kar wahan Landing Page ('/') set kar diya
    navigate('/', { replace: true });

    // Aur phir turant Admin Login par bhej diya. 
    // Isse jab aap Login page par back dabayenge, toh wo direct Landing Page par jayega!
    setTimeout(() => {
      navigate('/admin');
    }, 10);
  };

  // Active aur Inactive links ki styling
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-300 selection:bg-indigo-500/30">
      <Toaster position="top-right" reverseOrder={false} />

      {/* FIXED SIDEBAR */}
      <aside className="w-72 bg-slate-900/80 border-r border-slate-800 flex flex-col backdrop-blur-xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
              <ShieldAlert size={24} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white uppercase tracking-wider">Control Center</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Level-5 Access</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2 px-2">Main Menu</p>
          {/* "end" prop isliye taaki /admin-dashboard strictly match ho overview ke liye */}
          <NavLink to="/admin-dashboard" end className={navLinkClass}><BarChart3 size={18}/> Overview</NavLink>
          <NavLink to="/admin-dashboard/elections" className={navLinkClass}><Clock size={18}/> Manage Elections</NavLink>
          <NavLink to="/admin-dashboard/candidates" className={navLinkClass}><Users size={18}/> Candidates</NavLink>
          <NavLink to="/admin-dashboard/voters" className={navLinkClass}><Upload size={18}/> Voter Registry</NavLink>

          <div className="my-6 border-t border-slate-800/50"></div>

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">System Configuration</p>
          <NavLink to="/admin-dashboard/security" className={navLinkClass}><ShieldCheck size={18}/> Security Logs</NavLink>
          <NavLink to="/admin-dashboard/settings" className={navLinkClass}><Settings size={18}/> Settings</NavLink>
          <NavLink to="/admin-dashboard/about" className={navLinkClass}><Info size={18}/> About System</NavLink>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 hover:text-red-400 text-slate-300 px-5 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all duration-300 shadow-md">
            <LogOut size={18} /> Secure Exit
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
         {/* TOP NAVBAR */}
         <header className="bg-slate-900/50 border-b border-slate-800 px-8 py-4 flex justify-between items-center backdrop-blur-md">
            <div>
               <h2 className="text-slate-300 font-bold text-lg">Admin Workspace</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Network Status</span>
                <span className="text-xs text-emerald-400 font-bold">ONLINE & SECURE</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 flex items-center justify-center relative">
                <div className="absolute w-full h-full border border-emerald-500 rounded-full animate-ping opacity-50"></div>
                <Activity size={16} className="text-emerald-400" />
              </div>
            </div>
         </header>

         {/* YAHAN PAR HAR PAGE RENDER HOGA (<Outlet /> ke through) */}
         <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
            <Outlet />
         </main>
      </div>
    </div>
  );
};

export default AdminLayout;