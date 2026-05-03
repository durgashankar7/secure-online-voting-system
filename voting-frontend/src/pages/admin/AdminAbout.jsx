import { ShieldCheck, Code, Server, Lock, Cpu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAbout = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto space-y-6">
      
      {/* HEADER HERO SECTION */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-10 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.5)] transform rotate-3 relative z-10">
          <ShieldCheck size={48} />
        </div>
        
        <h2 className="text-4xl font-extrabold text-white mb-2 relative z-10 tracking-tight">E-Voting System Portal</h2>
        <p className="text-indigo-400 font-bold text-sm uppercase tracking-[0.2em] mb-6 relative z-10">Version 2.0.4 (Secure Build)</p>
        
        <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto relative z-10 text-sm">
          A state-of-the-art digital election platform designed for ultimate transparency and security. 
          Built specifically for universities and local governance, ensuring every vote is encrypted, verified, and immutable.
        </p>
      </div>

      {/* TECHNICAL SPECS GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-indigo-500/30 transition-colors">
          <div className="bg-indigo-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
            <Code className="text-indigo-400" size={24} />
          </div>
          <h3 className="text-white font-bold mb-2">Frontend Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Built with React.js, Tailwind CSS for styling, and Framer Motion for fluid transitions. Ensuring a highly responsive SPA experience.</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-fuchsia-500/30 transition-colors">
          <div className="bg-fuchsia-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-fuchsia-500/20">
            <Server className="text-fuchsia-400" size={24} />
          </div>
          <h3 className="text-white font-bold mb-2">Backend Infrastructure</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Powered by Node.js and Express. Highly scalable RESTful API architecture connected to a robust database system.</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-emerald-500/30 transition-colors">
          <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <Lock className="text-emerald-400" size={24} />
          </div>
          <h3 className="text-white font-bold mb-2">Security Standard</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Military-grade 256-bit AES Encryption for voter data. Two-Factor Authentication (2FA) mandatory for all administrative access.</p>
        </div>

      </div>

      {/* LICENSE & FOOTER */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-2 text-slate-400">
          <Globe size={16} className="text-slate-500" />
          <span>Developed for Secure Remote Voting</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Cpu size={16} className="text-slate-500" />
          <span>Core Engine: Active</span>
        </div>
        <div className="text-slate-500 uppercase tracking-widest font-bold">
          &copy; 2026 CEC Systems
        </div>
      </div>

    </motion.div>
  );
};

export default AdminAbout;