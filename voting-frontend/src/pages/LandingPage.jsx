import { useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, Landmark, Activity, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import PortalLayout from '../components/PortalLayout';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    // 2. Yahan se saara background image, overlay aur orbs ka div hata kar sirf <PortalLayout> laga diya hai
    <PortalLayout>
      
      {/* TOP HEADER */}
      <header className="w-full p-6 relative z-10 flex justify-between items-center border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Landmark className="text-indigo-400" size={28} />
          <span className="text-white font-extrabold tracking-widest uppercase text-xl drop-shadow-md">Central Election Commission</span>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Network Live</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        {/* Animated Title */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md mb-6">
            <Globe size={16} className="text-indigo-400" />
            <span className="text-indigo-300 text-xs font-bold tracking-widest uppercase">National Informatics Simulator</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 leading-tight mb-4 drop-shadow-2xl">
            E-Voting <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Portal</span>
          </h1>
          <p className="text-slate-300 text-lg font-medium">Select your highly secure gateway to proceed.</p>
        </motion.div>

        {/* CARDS CONTAINER */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          
          {/* VOTER CARD (Fast Animation) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} // thoda kam door se aayega
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }} // ekdam fast entry
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.97 }} // click karne par mast daba hua feel aayega
            onClick={() => navigate('/voter-login')}
            className="group relative bg-black/40 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 cursor-pointer rounded-3xl p-10 flex flex-col items-center text-center transition-all duration-150 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            
            <div className="bg-indigo-500/20 p-5 rounded-2xl mb-6 border border-indigo-500/30 group-hover:scale-110 transition-transform duration-200">
              <Users size={48} className="text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Voter Portal</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Login with your Enrollment Number, authenticate via OTP, and cast your secure vote.</p>
          </motion.div>

          {/* ADMIN CARD (Fast Animation) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }} // Sirf 0.1s ka difference
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/admin')}
            className="group relative bg-black/40 backdrop-blur-xl border border-white/10 hover:border-red-500/50 cursor-pointer rounded-3xl p-10 flex flex-col items-center text-center transition-all duration-150 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            
            <div className="bg-red-500/20 p-5 rounded-2xl mb-6 border border-red-500/30 group-hover:scale-110 transition-transform duration-200">
              <ShieldCheck size={48} className="text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Admin Center</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Authorized personnel only. Manage elections, candidate databases, and view live results.</p>
          </motion.div>

        </div>
      </main>
      
      {/* FOOTER */}
      <footer className="w-full p-4 text-center relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
        <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">
          Encrypted by National Informatics • Server Time: Live
        </p>
      </footer>
      
    </PortalLayout>
  );
};

export default LandingPage;