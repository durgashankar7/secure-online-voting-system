import { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, ShieldCheck, LogOut, Clock, Upload, Users, FileDown, Mail, KeyRound } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; 

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("adminAuth") === "true");
  
  // NAYA: OTP Login States
  const [adminEmail, setAdminEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [adminTab, setAdminTab] = useState('ELECTIONS'); 

  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', universityName: '', batch: '', department: '', manifesto: '', electionLevel: '', electionType: '', region: '' });
  
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

  // ---------------------------------------------------------
  // NAYA OTP LOGIN LOGIC (Backend se connected)
  // ---------------------------------------------------------
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
    } catch (error) {
      toast.error('Server connection failed.', { id: 'admin-otp' });
    }
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
      } else {
        toast.error("Invalid OTP! Please check your email and try again.");
      }
    } catch (error) {
      toast.error('Server error during verification.');
    }
    setIsLoading(false);
  };
  // ---------------------------------------------------------

  const handleLogout = () => { 
    localStorage.removeItem("adminAuth"); 
    setIsAdmin(false);
    setOtpSent(false); // Reset OTP state on logout
    setOtp('');
    toast('Logged out securely.', { icon: '🔒' });
  };

  // --- ELECTION MANAGEMENT ---
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
      } else {
        toast.error('Failed to create election.');
      }
    } catch (error) { toast.error('Server error.'); }
    setIsLoading(false);
  };

  const handleDeleteElection = async (id) => {
    if(!window.confirm("Delete this election?")) return;
    await fetch(`http://localhost:8080/api/elections/${id}`, { method: 'DELETE' });
    toast.success('Election Deleted!');
    fetchElections();
  };

  // --- CANDIDATE MANAGEMENT ---
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/candidates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCandidate)
      });
      if (response.ok) {
        toast.success('Candidate Registered Successfully!');
        setNewCandidate({ name: '', universityName: '', batch: '', department: '', manifesto: '', electionLevel: '', electionType: '', region: '' });
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

  // --- CSV UPLOAD ---
  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) { toast.error('Please select a CSV file first.'); return; }

    setIsLoading(true);
    toast.loading('Uploading Database...', { id: 'csv-upload' });
    
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch('http://localhost:8080/api/voters/upload', { method: 'POST', body: formData });
      const data = await response.text();
      if (response.ok) {
        toast.success(data, { id: 'csv-upload' });
        setCsvFile(null);
        fetchVoters(); 
      } else {
        toast.error(data, { id: 'csv-upload' });
      }
    } catch (error) { toast.error('Server connection failed.', { id: 'csv-upload' }); }
    setIsLoading(false);
  };

  // --- PDF DOWNLOAD FUNCTION ---
  const handleDownloadReport = async (election) => {
    toast.loading('Generating Official PDF Report...', { id: 'pdf' });
    try {
      const response = await fetch(`http://localhost:8080/api/results/download?level=${election.electionLevel}&type=${election.electionType}&region=${election.region}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${election.electionType}_${election.region}_Results.pdf`;
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

  // ---------------------------------------------------------
  // THE NEW OTP GATEWAY UI
  // ---------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md border border-slate-700 text-center shadow-2xl">
          <ShieldAlert size={56} className="text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">Admin Gateway</h1>
          <p className="text-slate-400 text-sm mb-8">Authorized Personnel Only</p>
          
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
                <input type="email" placeholder="Enter Admin Email" className="w-full pl-10 pr-4 py-3 rounded bg-slate-900 border border-slate-600 text-white outline-none focus:border-red-500 transition-colors" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded uppercase flex justify-center items-center gap-2 transition-colors">
                {isLoading ? 'Checking Access...' : 'Request Secure OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-green-400 bg-green-400/10 py-2 rounded">OTP sent to: <b>{adminEmail}</b></p>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 text-slate-500" size={20} />
                <input type="text" placeholder="Enter 6-Digit OTP" className="w-full pl-10 pr-4 py-3 rounded bg-slate-900 border border-slate-600 text-white outline-none focus:border-green-500 text-center tracking-[0.5em] font-bold text-lg" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded uppercase flex justify-center items-center gap-2 transition-colors">
                <ShieldCheck size={18} /> Verify Identity
              </button>
              <button type="button" onClick={() => setOtpSent(false)} className="text-slate-400 text-sm hover:text-white underline mt-2 block w-full">
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ... (Niche ka poora Dashboard wala hissa waisa hi hai jaisa aapne bheja tha)
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3"><ShieldAlert size={28} className="text-red-500" /><h1 className="text-xl font-bold uppercase">Control Center</h1></div>
        <button onClick={handleLogout} className="bg-slate-800 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold flex gap-2"><LogOut size={16} /> Exit</button>
      </header>

      {/* ADMIN TABS */}
      <div className="max-w-7xl mx-auto px-6 mt-6 flex gap-2 overflow-x-auto">
        <button onClick={() => setAdminTab('ELECTIONS')} className={`px-6 py-3 rounded-t-lg font-bold whitespace-nowrap ${adminTab === 'ELECTIONS' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>1. Manage Elections</button>
        <button onClick={() => setAdminTab('CANDIDATES')} className={`px-6 py-3 rounded-t-lg font-bold whitespace-nowrap ${adminTab === 'CANDIDATES' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>2. Manage Candidates</button>
        <button onClick={() => setAdminTab('VOTERS')} className={`px-6 py-3 rounded-t-lg font-bold whitespace-nowrap flex items-center gap-2 ${adminTab === 'VOTERS' ? 'bg-indigo-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><Users size={18}/> 3. Manage Voters</button>
      </div>

      <main className="max-w-7xl mx-auto p-6 bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-slate-200 min-h-[500px]">
        
        {/* -------------------- ELECTION MANAGEMENT TAB -------------------- */}
        {adminTab === 'ELECTIONS' && (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-indigo-600"/> Schedule New Election</h2>
              <form onSubmit={handleAddElection} className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-500">Election Title</label><input type="text" className="w-full p-2 rounded border" placeholder="e.g. CR Elections 2026" value={newElection.electionTitle} onChange={e=>setNewElection({...newElection, electionTitle: e.target.value})} required/></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-xs font-bold text-slate-500">Level</label><select className="w-full p-2 rounded border" value={newElection.electionLevel} onChange={e=>setNewElection({...newElection, electionLevel: e.target.value})} required><option value="">Select</option><option value="College">College</option><option value="Panchayat">Panchayat</option></select></div>
                  <div><label className="block text-xs font-bold text-slate-500">Type</label><select className="w-full p-2 rounded border" value={newElection.electionType} onChange={e=>setNewElection({...newElection, electionType: e.target.value})} required><option value="">Select</option><option value="Class Representative">CR</option><option value="President">President</option><option value="Mukhiya">Mukhiya</option></select></div>
                </div>
                <div><label className="block text-xs font-bold text-slate-500">Region/Dept</label><input type="text" className="w-full p-2 rounded border uppercase" value={newElection.region} onChange={e=>setNewElection({...newElection, region: e.target.value})} required/></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-xs font-bold text-slate-500">Start Date & Time</label><input type="datetime-local" className="w-full p-2 rounded border text-xs" value={newElection.startDate} onChange={e=>setNewElection({...newElection, startDate: e.target.value})} required/></div>
                  <div><label className="block text-xs font-bold text-slate-500">End Date & Time</label><input type="datetime-local" className="w-full p-2 rounded border text-xs" value={newElection.endDate} onChange={e=>setNewElection({...newElection, endDate: e.target.value})} required/></div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-indigo-900 text-white font-bold py-2 rounded mt-4">Create Schedule</button>
              </form>
            </div>

            <div className="lg:col-span-8">
              <h2 className="font-bold text-slate-800 mb-4">Election Master Roster</h2>
              <table className="w-full text-left text-sm border-collapse">
                <thead><tr className="bg-slate-100"><th className="p-3">Status</th><th className="p-3">Title & Details</th><th className="p-3 text-center">Reports</th><th className="p-3">Del</th></tr></thead>
                <tbody>
                  {elections.map(e => (
                    <tr key={e.electionId} className="border-b">
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${e.status === 'ONGOING' ? 'bg-red-100 text-red-700' : e.status === 'UPCOMING' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>{e.status}</span>
                      </td>
                      <td className="p-3"><p className="font-bold text-slate-800">{e.electionTitle}</p><p className="text-xs text-slate-500">{e.electionLevel} • {e.region}</p></td>
                      
                      <td className="p-3 text-center">
                        {(e.status === 'COMPLETED' || e.status === 'ONGOING') ? (
                          <button onClick={() => handleDownloadReport(e)} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded-full transition-colors mx-auto flex items-center justify-center" title="Download Official Report">
                            <FileDown size={18} />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Not Ready</span>
                        )}
                      </td>

                      <td className="p-3"><button onClick={()=>handleDeleteElection(e.electionId)} className="text-red-500"><Trash2 size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- CANDIDATE MANAGEMENT TAB -------------------- */}
        {adminTab === 'CANDIDATES' && (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-4">Register Candidate</h2>
              <form onSubmit={handleAddCandidate} className="space-y-4 text-sm">
                <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" value={newCandidate.name} onChange={e=>setNewCandidate({...newCandidate, name:e.target.value})} required/>
                <select className="w-full p-2 border rounded" value={newCandidate.electionLevel} onChange={e=>setNewCandidate({...newCandidate, electionLevel:e.target.value})} required><option value="">Select Level</option><option value="College">College</option></select>
                <select className="w-full p-2 border rounded" value={newCandidate.electionType} onChange={e=>setNewCandidate({...newCandidate, electionType:e.target.value})} required><option value="">Select Type</option><option value="Class Representative">CR</option><option value="President">President</option></select>
                <input type="text" placeholder="Region (e.g. CSE)" className="w-full p-2 border rounded uppercase" value={newCandidate.region} onChange={e=>setNewCandidate({...newCandidate, region:e.target.value})} required/>
                <input type="text" placeholder="Party / Dept" className="w-full p-2 border rounded" value={newCandidate.department} onChange={e=>setNewCandidate({...newCandidate, department:e.target.value})} required/>
                <textarea placeholder="Manifesto" className="w-full p-2 border rounded" value={newCandidate.manifesto} onChange={e=>setNewCandidate({...newCandidate, manifesto:e.target.value})} required></textarea>
                <button type="submit" disabled={isLoading} className="w-full bg-slate-800 text-white font-bold py-2 rounded mt-2">Add Candidate</button>
              </form>
            </div>
            <div className="lg:col-span-8">
               <h2 className="font-bold text-slate-800 mb-4">Candidate Master Roster</h2>
               <table className="w-full text-left text-sm border-collapse">
                 <thead><tr className="bg-slate-100"><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Party/Dept</th><th className="p-3">Del</th></tr></thead>
                 <tbody>
                   {candidates.map(c => (
                     <tr key={c.candidateId} className="border-b">
                       <td className="p-3 font-bold text-indigo-700">{c.name}</td>
                       <td className="p-3">{c.electionType} ({c.region})</td>
                       <td className="p-3">{c.department}</td>
                       <td className="p-3"><button onClick={()=>handleRemoveCandidate(c.candidateId)} className="text-red-500"><Trash2 size={16}/></button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {/* -------------------- VOTER BULK UPLOAD TAB -------------------- */}
        {adminTab === 'VOTERS' && (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h2 className="font-bold text-indigo-900 mb-4 flex items-center gap-2"><Upload size={18}/> Bulk CSV Upload</h2>
                <p className="text-xs text-indigo-700 mb-4">Upload your college class list here. The system will automatically register them as voters.</p>
                <form onSubmit={handleCSVUpload} className="space-y-4 text-sm">
                  <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200" required />
                  <button type="submit" disabled={isLoading} className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded mt-2 transition-colors flex justify-center items-center gap-2 shadow-md">
                    {isLoading ? 'Processing File...' : 'Start Secure Upload'}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="font-bold text-slate-800">Registered Voter Database</h2>
                 <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">Total: {voters.length}</span>
               </div>
               <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="sticky top-0 bg-slate-100 z-10">
                    <tr className="text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-3 border-b">Enrollment</th>
                        <th className="p-3 border-b">Student Name</th>
                        <th className="p-3 border-b">College Email</th>
                        <th className="p-3 text-center border-b">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {voters && voters.map((v, index) => (
                        <tr key={index} className="border-b last:border-0 bg-white">
                        <td className="p-3 font-bold text-slate-700">{v.enrollmentNumber}</td>
                        <td className="p-3">{v.name}</td>
                        <td className="p-3 text-slate-500">{v.email}</td>
                        <td className="p-3 text-center">
                            {v.hasVoted 
                                ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Voted</span> 
                                : <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">Pending</span>
                            }
                        </td>
                        </tr>
                    ))}
                    {(!voters || voters.length === 0) && <tr><td colSpan="4" className="p-8 text-center text-slate-400">Database is empty. Upload a CSV file to begin.</td></tr>}
                    </tbody>
                </table>
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPage;