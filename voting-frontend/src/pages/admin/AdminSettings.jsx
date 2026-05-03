import { useState, useEffect } from 'react';
import { Settings, User, KeyRound, ShieldAlert, Mail, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const [adminEmail, setAdminEmail] = useState('Loading secure data...');

  useEffect(() => {
    // Page load hote hi LocalStorage se email uthao
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedEmail) {
      setAdminEmail(savedEmail);
    } else {
      setAdminEmail('admin@election.gov'); // Agar kuch na mile toh yeh default dikhega
    }
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Settings className="text-slate-400" size={28} />
            Administrator Configuration
          </h2>
          <p className="text-sm text-slate-400 mt-2">Manage your profile, security preferences, and system alerts.</p>
        </div>
      </div>

      <div className="grid gap-6">
        
        {/* PROFILE SECTION */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex items-center gap-3">
            <User className="text-indigo-400" size={20} />
            <h3 className="font-bold text-white text-lg">Master Profile</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-indigo-500/50 flex items-center justify-center">
                 <ShieldAlert size={36} className="text-indigo-400" />
               </div>
               <div>
                 <p className="text-white font-bold text-xl">System Administrator</p>
                 <p className="text-slate-400 text-sm mt-1">Root Clearance</p>
                 <span className="inline-block mt-2 text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-1 rounded uppercase tracking-widest font-extrabold">Level-5 Access</span>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Email</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                   {/* YAHI HAI WO JADUI INPUT: value me state hai, aur readOnly lagaya hai */}
                   <input 
                     type="email" 
                     value={adminEmail} 
                     readOnly 
                     className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700 text-emerald-400 outline-none cursor-not-allowed font-bold tracking-wide opacity-100 shadow-inner" 
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                 <input type="text" defaultValue="Master Admin" className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors font-medium" />
               </div>
            </div>
          </div>
        </div>

        {/* SECURITY SETTINGS */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex items-center gap-3">
            <KeyRound className="text-emerald-400" size={20} />
            <h3 className="font-bold text-white text-lg">Security & Authentication</h3>
          </div>
          <div className="p-6 space-y-4">
             <label className="flex items-start gap-4 cursor-pointer group bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
               <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 accent-emerald-500 rounded bg-slate-900 border-slate-700 cursor-pointer" />
               <div>
                 <p className="text-white font-bold text-sm">Two-Factor Authentication (OTP)</p>
                 <p className="text-slate-400 text-xs mt-1 leading-relaxed">Require a secure 6-digit OTP sent to the registered email address during every login attempt. <span className="text-emerald-400 font-semibold">(Highly Recommended)</span></p>
               </div>
             </label>

             <label className="flex items-start gap-4 cursor-pointer group bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
               <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 accent-emerald-500 rounded bg-slate-900 border-slate-700 cursor-pointer" />
               <div>
                 <p className="text-white font-bold text-sm">Strict Session Timeout</p>
                 <p className="text-slate-400 text-xs mt-1 leading-relaxed">Automatically terminate session after 15 minutes of inactivity.</p>
               </div>
             </label>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex items-center gap-3">
            <Bell className="text-amber-400" size={20} />
            <h3 className="font-bold text-white text-lg">System Alerts</h3>
          </div>
          <div className="p-6">
             <label className="flex items-center justify-between cursor-pointer group p-2">
               <div>
                 <p className="text-slate-300 font-medium text-sm">Email me when a new election is scheduled</p>
               </div>
               <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-500 rounded bg-slate-900 border-slate-700 cursor-pointer" />
             </label>
             <label className="flex items-center justify-between cursor-pointer group p-2 border-t border-slate-800/50 mt-2 pt-4">
               <div>
                 <p className="text-slate-300 font-medium text-sm">Receive weekly database backup reports</p>
               </div>
               <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-500 rounded bg-slate-900 border-slate-700 cursor-pointer" />
             </label>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            Save Changes
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminSettings;