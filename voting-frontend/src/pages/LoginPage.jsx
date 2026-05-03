import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ShieldCheck, CheckCircle2, Lock, Fingerprint, Activity } from 'lucide-react';
import BackButton from '../components/BackButton';
import { motion } from 'framer-motion';
import PortalLayout from '../components/PortalLayout';

const LoginPage = ({ setAuth }) => {
  const [step, setStep] = useState(1);
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch(`http://localhost:8080/api/auth/request-otp?enrollmentNumber=${enrollmentNumber}`, { method: 'POST' });
      const data = await response.text();
      if (response.ok) {
        setMessage({ text: 'Secure OTP dispatched to registered college email.', type: 'success' });
        setStep(2);
      } else {
        setMessage({ text: data || 'Identity verification failed.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Server connection failed. System offline.', type: 'error' });
    }
    setIsLoading(false);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch(`http://localhost:8080/api/auth/verify-otp?enrollmentNumber=${enrollmentNumber}&otp=${otp}`, { method: 'POST' });
      const data = await response.text();
      if (response.ok) {
        // Asli Magic: LocalStorage me user data save kar diya
        localStorage.setItem("voterAuth", "true");
        localStorage.setItem("enrollment", enrollmentNumber);
        setAuth(true);
        navigate('/home'); // Login hote hi Home par bhej do
      } else {
        setMessage({ text: data || 'Invalid authentication token.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Verification server unreachable.', type: 'error' });
    }
    setIsLoading(false);
  };

 return (
    <PortalLayout>
      
      {/* TOP BAR WITH LIVE STATUS */}
      <div className="absolute top-6 right-8 z-50 hidden md:flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Server Node</span>
          <span className="text-xs text-indigo-300 font-bold">IND-EAST-01 (Active)</span>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 flex items-center justify-center relative">
          <div className="absolute w-full h-full border border-indigo-400 rounded-full animate-ping opacity-40"></div>
          <Activity size={16} className="text-indigo-400" />
        </div>
      </div>

      {/* BACK BUTTON */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton />
      </div>

      {/* ========================================= */}
      {/* MAIN CONTENT WRAPPER */}
      {/* ========================================= */}
      <div className="flex flex-col lg:flex-row flex-1 w-full items-center justify-center relative z-10">
        
        {/* LEFT COLUMN: BRANDING */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase text-shadow">System Online & Secure</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 leading-tight mb-6 drop-shadow-lg">
              The Future of <br/> Democratic Voting.
            </h1>
            <p className="text-slate-300 text-lg mb-10 max-w-md leading-relaxed font-medium">
              Experience the next generation of election technology. Fully encrypted, transparent, and built for a billion voices.
            </p>

            {/* Feature Badges (Teeno wapas laga diye hain) */}
            <div className="space-y-4">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 max-w-sm backdrop-blur-md shadow-xl">
                <div className="p-3 bg-indigo-500/30 rounded-xl text-indigo-300 shadow-inner"><Lock size={24} /></div>
                <div>
                  <h3 className="text-white font-bold text-sm">End-to-End Encryption</h3>
                  <p className="text-indigo-200/70 text-xs font-semibold">256-bit AES military-grade security</p>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 max-w-sm backdrop-blur-md shadow-xl ml-8">
                <div className="p-3 bg-fuchsia-500/30 rounded-xl text-fuchsia-300 shadow-inner"><Fingerprint size={24} /></div>
                <div>
                  <h3 className="text-white font-bold text-sm">Biometric & OTP Verification</h3>
                  <p className="text-fuchsia-200/70 text-xs font-semibold">Multi-factor identity validation</p>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 max-w-sm backdrop-blur-md shadow-xl">
                <div className="p-3 bg-emerald-500/30 rounded-xl text-emerald-300 shadow-inner"><Activity size={24} /></div>
                <div>
                  <h3 className="text-white font-bold text-sm">Real-time Auditing</h3>
                  <p className="text-emerald-200/70 text-xs font-semibold">Live tracking and transparent counting</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: LOGIN CARD */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="p-10 rounded-3xl shadow-[0_20px_50px_0_rgba(0,0,0,0.7)] w-full max-w-md border border-white/20 bg-black/40 backdrop-blur-2xl relative"
          >
            <div className="text-center mb-10 relative z-10">
              <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-white/30">
                <Landmark size={32} />
              </div>
              <h1 className="text-2xl font-extrabold text-white uppercase tracking-wider drop-shadow-md">Election Portal</h1>
              <p className="text-indigo-300 mt-2 font-bold text-xs tracking-widest uppercase">Voter Authentication</p>
            </div>

            {/* Error ya Success Message (Agar OTP galat ho ya send ho jaye) */}
            {message.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-bold border backdrop-blur-md ${message.type === 'success' ? 'bg-green-500/20 border-green-400/50 text-green-300' : 'bg-red-500/20 border-red-400/50 text-red-300'}`}>
                {message.text}
              </div>
            )}

            {/* STEP 1: Enrollment ID Form */}
            {step === 1 && (
               <form onSubmit={requestOtp} className="space-y-6 relative z-10">
                 <div>
                   <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">Enrollment ID</label>
                   <input 
                     type="text" 
                     placeholder="E.G. AJU22001" 
                     className="w-full px-5 py-4 rounded-xl border border-white/20 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all uppercase bg-black/50 text-white placeholder-white/30 font-semibold tracking-wider shadow-inner backdrop-blur-md"
                     value={enrollmentNumber}
                     onChange={(e) => setEnrollmentNumber(e.target.value.toUpperCase())}
                     required
                   />
                 </div>
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   type="submit" 
                   disabled={isLoading} 
                   className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-400/50"
                 >
                   <ShieldCheck size={22} />
                   {isLoading ? 'Authenticating...' : 'Verify Identity'}
                 </motion.button>
               </form>
            )}

            {/* STEP 2: OTP Verification Form */}
            {step === 2 && (
               <form onSubmit={verifyOtp} className="space-y-6 relative z-10">
                 <div>
                   <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">Security OTP</label>
                   <input 
                     type="text" 
                     maxLength="6"
                     placeholder="******" 
                     className="w-full px-5 py-4 rounded-xl border border-white/20 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-center tracking-[1em] font-bold text-2xl bg-black/50 text-white placeholder-white/20 shadow-inner backdrop-blur-md"
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     required
                   />
                 </div>
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   type="submit" 
                   disabled={isLoading} 
                   className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] tracking-wide border border-emerald-400/50 flex items-center justify-center gap-2"
                 >
                   <CheckCircle2 size={22} />
                   {isLoading ? 'Validating...' : 'Confirm Access'}
                 </motion.button>
                 <button type="button" onClick={() => setStep(1)} className="w-full text-slate-400 text-sm font-bold hover:text-white transition-colors mt-4">
                   Cancel & Return
                 </button>
               </form>
            )}

          </motion.div>
          
          <div className="mt-10 text-center z-10">
            <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase bg-black/30 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              Encrypted by National Informatics • Server Time: Live
            </p>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
};

export default LoginPage;
