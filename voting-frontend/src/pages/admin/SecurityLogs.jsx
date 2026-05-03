import { ShieldAlert, LogIn, Key, Activity, Database, ServerCrash, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const SecurityLogs = () => {
  // Hardcoded logs for visual effect (Future me ye database se aayenge)
  const logs = [
    { id: 1, type: 'ACCESS', title: '[Auth_Success] Admin Level-5 Access Granted', desc: 'IP: 192.168.1.104 • Session ID: #SEC-9982', time: 'Just now', color: 'text-emerald-400', border: 'border-emerald-500/20', icon: LogIn },
    { id: 2, type: 'AUTH', title: '[OTP_Generated] Secure Authentication Requested', desc: 'Triggered for registered admin email.', time: '12 mins ago', color: 'text-blue-400', border: 'border-blue-500/20', icon: Key },
    { id: 3, type: 'DATABASE', title: '[DB_Sync] Voter Registry Encrypted', desc: 'AES-256 encryption applied to 450 new student records.', time: '1 hour ago', color: 'text-fuchsia-400', border: 'border-fuchsia-500/20', icon: Database },
    { id: 4, type: 'SYSTEM', title: '[System_Boot] Master Nodes Synchronized', desc: 'All local and cloud election protocols verified.', time: '5 hours ago', color: 'text-indigo-400', border: 'border-indigo-500/20', icon: Activity },
    { id: 5, type: 'WARNING', title: '[Blocked_Request] Unauthorized Access Attempt', desc: 'IP: 45.33.12.89 blocked permanently. Invalid OTP provided 3 times.', time: '1 day ago', color: 'text-red-400', border: 'border-red-500/30', icon: ServerCrash },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" size={28} />
            System Security & Audit Logs
          </h2>
          <p className="text-sm text-slate-400 mt-2">Real-time monitoring of administrative access and critical system changes.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg flex items-center gap-2 shadow-inner">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Tracking</span>
        </div>
      </div>

      {/* LOGS CONTAINER */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
        
        <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event History</p>
          <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider">Download Logs (CSV)</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
          {logs.map((log) => {
            const IconComponent = log.icon;
            return (
              <div key={log.id} className={`bg-slate-950 p-5 rounded-xl border ${log.border} flex items-start gap-4 hover:bg-slate-900 transition-colors shadow-sm`}>
                <div className={`p-3 rounded-lg bg-slate-900 border border-slate-800 ${log.color} shadow-inner`}>
                  <IconComponent size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`${log.color} font-bold text-sm tracking-wide`}>{log.title}</p>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 shrink-0">
                      {log.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">{log.desc}</p>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-center pt-4">
            <button className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
               Load Older Logs <Activity size={14} />
            </button>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
};

export default SecurityLogs;