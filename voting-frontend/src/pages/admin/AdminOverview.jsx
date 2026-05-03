import { useState, useEffect } from 'react';
import { Users, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminOverview = () => {
  const [votersCount, setVotersCount] = useState(0);
  const [electionsCount, setElectionsCount] = useState(0);

  useEffect(() => {
    fetchVoters();
    fetchElections();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/voters');
      if (response.ok) {
        const data = await response.json();
        setVotersCount(data ? data.length : 0);
      }
    } catch (error) {
      console.error("Failed to fetch voters", error);
    }
  };

  const fetchElections = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/elections');
      if (response.ok) {
        const data = await response.json();
        setElectionsCount(data ? data.length : 0);
      }
    } catch (error) {
      console.error("Failed to fetch elections", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }} 
      className="space-y-6"
    >
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">System Dashboard Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time metrics and system health monitor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stat Card 1: Total Voters */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-indigo-500/50 transition-colors">
          <div>
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Total Registered Voters</h3>
            <p className="text-4xl font-extrabold text-white">{votersCount}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Secure DB Active</p>
            </div>
          </div>
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
            <Users size={32} className="text-indigo-400" />
          </div>
        </div>

        {/* Stat Card 2: Elections */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-fuchsia-500/50 transition-colors">
          <div>
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Scheduled Elections</h3>
            <p className="text-4xl font-extrabold text-white">{electionsCount}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
              <p className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest">Monitoring Live</p>
            </div>
          </div>
          <div className="w-16 h-16 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center border border-fuchsia-500/20">
            <Clock size={32} className="text-fuchsia-400" />
          </div>
        </div>

        {/* Stat Card 3: System Health */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-emerald-500/50 transition-colors">
          <div>
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">System Status</h3>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">OPTIMAL</p>
            <div className="flex items-center gap-2 mt-3 bg-emerald-500/10 w-fit px-2 py-1 rounded-md border border-emerald-500/20">
              <ShieldCheck size={12} className="text-emerald-400" />
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">AES-256 Active</p>
            </div>
          </div>
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck size={32} className="text-emerald-400" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminOverview;