import { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, ShieldCheck, LogOut, Clock, Upload, Users, FileDown, Mail, KeyRound, Link, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; 
import BackButton from '../components/BackButton';
import PortalLayout from '../components/PortalLayout';
import { motion } from 'framer-motion';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("adminAuth") === "true");
  
  const [adminEmail, setAdminEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [adminTab, setAdminTab] = useState('ELECTIONS'); 

  const [selectedElectionForCandidate, setSelectedElectionForCandidate] = useState('');

  // NAYA UPDATE: electionId add kiya gaya hai
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', universityName: '', batch: '', department: '', manifesto: '', electionLevel: '', electionType: '', region: '', electionId: '' });
  
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({ electionTitle: '', electionLevel: '', electionType: '', region: '', universityName: '', batch: '', startDate: '', endDate: '' });

  const [voters, setVoters] = useState([]); 
  const [csvFile, setCsvFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchCandidates();
      fetchElections();
      fetchVoters();
    }
  }, [isAdmin, adminTab]);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/candidates');
      if (response.ok) setCandidates(await response.json() || []);
    } catch (error) { console.error(error); }
  };

  const fetchElections = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/elections');
      if (response.ok) setElections(await response.json() || []);
    } catch (error) { console.error(error); }
  };

  const fetchVoters = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/voters');
      if (response.ok) setVoters(await response.json() || []);
    } catch (error) { console.error(error); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Verifying Admin Records...', { id: 'admin-otp' });
    try {
      const res = await fetch(`http://localhost:8080/api/admin/send-otp?email=${adminEmail}`, { method: 'POST' });
      const data = await res.text();
      if (data.includes("SUCCESS")) {
        setOtpSent(true);
        toast.success("OTP sent to your secure email!", { id: 'admin-otp' });
      } else {
        toast.error("Access Denied: You are not an authorized Admin.", { id: 'admin-otp' });
      }
    } catch (error) { toast.error('Server connection failed.', { id: 'admin-otp' }); }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/admin/verify-otp?email=${adminEmail}&otp=${otp}`, { method: 'POST' });
      const isOk = await res.json();
      if (isOk) {
        localStorage.setItem("adminAuth", "true");
        setIsAdmin(true);
        toast.success("Identity Verified! Welcome to Control Center.");
      } else { toast.error("Invalid OTP! Please check your email and try again."); }
    } catch (error) { toast.error('Server error during verification.'); }
    setIsLoading(false);
  };

  const handleLogout = () => { 
    localStorage.removeItem("adminAuth"); 
    setIsAdmin(false); setOtpSent(false); setOtp('');
    toast('Logged out securely.', { icon: '🔒' });
  };

  const handleAddElection = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/elections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newElection)
      });
      if (response.ok) {
        toast.success('Election Scheduled Successfully!');
        setNewElection({ electionTitle: '', electionLevel: '', electionType: '', region: '', universityName: '', batch: '', startDate: '', endDate: '' });
        fetchElections();
      } else { toast.error('Failed to create election.'); }
    } catch (error) { toast.error('Server error.'); }
    setIsLoading(false);
  };

  const handleDeleteElection = async (id) => {
    if(!window.confirm("Delete this election?")) return;
    await fetch(`http://localhost:8080/api/elections/${id}`, { method: 'DELETE' });
    toast.success('Election Deleted!');
    fetchElections();
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/candidates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCandidate)
      });
      if (response.ok) {
        toast.success('Candidate Registered & Assigned!');
        // NAYA UPDATE: Reset karte waqt electionId ko clear karna
        setNewCandidate({ name: '', universityName: '', batch: '', department: '', manifesto: '', electionLevel: '', electionType: '', region: '', electionId: '' });
        setSelectedElectionForCandidate('');
        fetchCandidates(); 
      }
    } catch (error) { toast.error('Failed to add candidate.'); }
    setIsLoading(false);
  };
  
  const handleRemoveCandidate = async (id) => {
    if(!window.confirm("Delete candidate?")) return;
    await fetch(`http://localhost:8080/api/candidates/${id}`, { method: 'DELETE' });
    toast.success('Candidate Removed!');
    fetchCandidates();
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) { toast.error('Please select a CSV file first.'); return; }
    setIsLoading(true); toast.loading('Uploading Database...', { id: 'csv-upload' });
    const formData = new FormData(); formData.append('file', csvFile);
    try {
      const response = await fetch('http://localhost:8080/api/voters/upload', { method: 'POST', body: formData });
      const data = await response.text();
      if (response.ok) {
        toast.success(data, { id: 'csv-upload' }); setCsvFile(null); fetchVoters(); 
      } else { toast.error(data, { id: 'csv-upload' }); }
    } catch (error) { toast.error('Server connection failed.', { id: 'csv-upload' }); }
    setIsLoading(false);
  };

  const handleDownloadReport = async (election) => {
    toast.loading('Generating Official PDF Report...', { id: 'pdf' });
    try {
      // NAYA MAGIC: Yahan URL ko strictly electionId aur title se replace kar diya
      const response = await fetch(`http://localhost:8080/api/results/download?electionId=${election.electionId}&title=${election.electionTitle}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); 
        a.href = url; 
        
        // NAYA: File ka naam bhi naye title ke hisab se set kar diya
        a.download = `${election.electionTitle}_Results.pdf`; 
        
        document.body.appendChild(a); 
        a.click(); 
        a.remove();
        toast.success('Report Downloaded Successfully!', { id: 'pdf' });
      } else { 
        toast.error('Failed to generate report. Make sure votes exist.', { id: 'pdf' }); 
      }
    } catch (error) { 
      toast.error('Server error while downloading.', { id: 'pdf' }); 
    }
  };

  if (!isAdmin) {
    return (
      <PortalLayout>
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* TOP BAR WITH RED ALERT STATUS */}
        <div className="absolute top-6 right-8 z-50 hidden md:flex items-center gap-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/30 shadow-lg">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Admin Node</span>
            <span className="text-xs text-red-400 font-bold">SECURE (Level-5)</span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-red-500/30 flex items-center justify-center relative">
            <div className="absolute w-full h-full border border-red-500 rounded-full animate-ping opacity-50"></div>
            <Activity size={16} className="text-red-400" />
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="absolute top-6 left-6 z-50">
          <BackButton />
        </div>

        {/* MAIN CONTENT WRAPPER */}
        <div className="flex flex-col flex-1 w-full items-center justify-center p-6 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-10 rounded-3xl shadow-[0_20px_50px_0_rgba(225,29,72,0.2)] w-full max-w-md border border-red-500/20 bg-black/60 backdrop-blur-2xl relative"
          >
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 opacity-[0.03] pointer-events-none">
              <ShieldAlert size={300} />
            </div>

            <div className="text-center mb-10 relative z-10">
              <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-red-600 to-rose-500 text-white rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(225,29,72,0.5)] border border-red-400/50">
                <ShieldAlert size={32} />
              </div>
              <h1 className="text-2xl font-extrabold text-white uppercase tracking-wider drop-shadow-md">Admin Gateway</h1>
              <p className="text-red-400 mt-2 font-bold text-xs tracking-widest uppercase">Authorized Personnel Only</p>
            </div>

            {/* CONDITIONAL FORM: Email Input ya OTP Input */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">Admin Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-red-400/50" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="admin@election.gov" 
                      className="w-full pl-11 pr-5 py-4 rounded-xl border border-white/10 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-black/50 text-white placeholder-white/30 font-semibold tracking-wider shadow-inner backdrop-blur-md"
                      value={adminEmail} 
                      onChange={(e) => setAdminEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 tracking-wide shadow-[0_0_20px_rgba(225,29,72,0.4)] border border-red-500/50 mt-4"
                >
                  {isLoading ? 'Checking Access...' : 'Request Secure OTP'}
                </motion.button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 relative z-10">
                <p className="text-xs text-green-400 bg-green-400/10 py-3 px-4 rounded-lg text-center border border-green-400/20 backdrop-blur-md">
                  OTP sent to: <b className="tracking-wide">{adminEmail}</b>
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">Security OTP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound size={18} className="text-emerald-400/50" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="••••••" 
                      maxLength={6}
                      className="w-full pl-11 pr-5 py-4 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-black/50 text-white placeholder-white/30 font-bold tracking-[0.5em] text-center text-xl shadow-inner backdrop-blur-md"
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-500/50 mt-4"
                >
                  <ShieldCheck size={20} />
                  {isLoading ? 'Verifying...' : 'Verify Identity'}
                </motion.button>
                <button type="button" onClick={() => setOtpSent(false)} className="w-full text-slate-400 text-sm font-bold hover:text-white transition-colors mt-4">
                  Cancel & Use Different Email
                </button>
              </form>
            )}

          </motion.div>
          
          <div className="mt-10 text-center z-10">
            <p className="text-red-400/40 text-[10px] font-bold tracking-[0.2em] uppercase bg-black/30 px-4 py-2 rounded-full border border-red-500/10 backdrop-blur-sm">
              Restricted Zone • Monitored Activity
            </p>
          </div>

        </div>
      </PortalLayout>
    );
  }
};

export default AdminPage;