import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Trash2, LogOut, Clock, Upload, Users, FileDown, Link, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [adminTab, setAdminTab] = useState('ELECTIONS'); 
  const [selectedElectionForCandidate, setSelectedElectionForCandidate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', universityName: '', batch: '', department: '', manifesto: '', electionLevel: '', electionType: '', region: '', electionId: '' });
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({ electionTitle: '', electionLevel: '', electionType: '', region: '', universityName: '', batch: '', startDate: '', endDate: '' });
  const [voters, setVoters] = useState([]); 
  const [csvFile, setCsvFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  // Security & Fetch Check
  useEffect(() => {
    // Agar direct URL hit kiya bina login ke, wapas login pe fenko
    if (localStorage.getItem("adminAuth") !== "true") {
      navigate('/admin');
    } else {
      fetchCandidates();
      fetchElections();
      fetchVoters();
    }
  }, [navigate, adminTab]);

  // Logout Logic Update
  const handleLogout = () => { 
    localStorage.removeItem("adminAuth"); 
    toast('Logged out securely.', { icon: '🔒' });
    navigate('/admin'); // Turant Login page par bhejo
  };

  const fetchCandidates = async () => { /* aapka purana logic */
    try { const response = await fetch('http://localhost:8080/api/candidates'); if (response.ok) setCandidates(await response.json() || []); } catch (error) { console.error(error); }
  };
  const fetchElections = async () => { /* aapka purana logic */
    try { const response = await fetch('http://localhost:8080/api/elections'); if (response.ok) setElections(await response.json() || []); } catch (error) { console.error(error); }
  };
  const fetchVoters = async () => { /* aapka purana logic */
    try { const response = await fetch('http://localhost:8080/api/voters'); if (response.ok) setVoters(await response.json() || []); } catch (error) { console.error(error); }
  };

  const handleAddElection = async (e) => { /* aapka purana logic */ 
    e.preventDefault(); setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/elections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newElection) });
      if (response.ok) { toast.success('Election Scheduled Successfully!'); setNewElection({ electionTitle: '', electionLevel: '', electionType: '', region: '', universityName: '', batch: '', startDate: '', endDate: '' }); fetchElections(); } else { toast.error('Failed to create election.'); }
    } catch (error) { toast.error('Server error.'); }
    setIsLoading(false);
  };
  const handleDeleteElection = async (id) => { /* aapka purana logic */ 
    if(!window.confirm("Delete this election?")) return;
    await fetch(`http://localhost:8080/api/elections/${id}`, { method: 'DELETE' }); toast.success('Election Deleted!'); fetchElections();
  };
  const handleAddCandidate = async (e) => { /* aapka purana logic */ 
    e.preventDefault(); setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/candidates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCandidate) });
      if (response.ok) { toast.success('Candidate Registered & Assigned!'); setNewCandidate({ name: '', universityName: '', batch: '', department: '', manifesto: '', electionLevel: '', electionType: '', region: '', electionId: '' }); setSelectedElectionForCandidate(''); fetchCandidates(); }
    } catch (error) { toast.error('Failed to add candidate.'); }
    setIsLoading(false);
  };
  const handleRemoveCandidate = async (id) => { /* aapka purana logic */ 
    if(!window.confirm("Delete candidate?")) return;
    await fetch(`http://localhost:8080/api/candidates/${id}`, { method: 'DELETE' }); toast.success('Candidate Removed!'); fetchCandidates();
  };
  const handleCSVUpload = async (e) => { /* aapka purana logic */ 
    e.preventDefault(); if (!csvFile) { toast.error('Please select a CSV file first.'); return; }
    setIsLoading(true); toast.loading('Uploading Database...', { id: 'csv-upload' });
    const formData = new FormData(); formData.append('file', csvFile);
    try {
      const response = await fetch('http://localhost:8080/api/voters/upload', { method: 'POST', body: formData }); const data = await response.text();
      if (response.ok) { toast.success(data, { id: 'csv-upload' }); setCsvFile(null); fetchVoters(); } else { toast.error(data, { id: 'csv-upload' }); }
    } catch (error) { toast.error('Server connection failed.', { id: 'csv-upload' }); }
    setIsLoading(false);
  };
  const handleDownloadReport = async (election) => { /* aapka purana logic */ 
    toast.loading('Generating Official PDF Report...', { id: 'pdf' });
    try {
      const response = await fetch(`http://localhost:8080/api/results/download?electionId=${election.electionId}&title=${election.electionTitle}`);
      if (response.ok) { const blob = await response.blob(); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${election.electionTitle}_Results.pdf`; document.body.appendChild(a); a.click(); a.remove(); toast.success('Report Downloaded Successfully!', { id: 'pdf' }); } else { toast.error('Failed to generate report. Make sure votes exist.', { id: 'pdf' }); }
    } catch (error) { toast.error('Server error while downloading.', { id: 'pdf' }); }
  };

  // NAYA DASHBOARD UI JO MAINE PICHLI BAAR DIYA THA WOHI HAI:
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-indigo-500/30">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
            <ShieldAlert size={24} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-widest">Control Center</h1>
            <p className="text-xs text-slate-400 font-medium">Administrator Access Level-5</p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 hover:text-red-400 text-slate-300 px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 shadow-md">
          <LogOut size={16} /> Secure Exit
        </button>
      </header>

      {/* TABS (Navigation Menu) */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex gap-2 overflow-x-auto bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 backdrop-blur-sm w-fit shadow-inner">
          <button onClick={() => setAdminTab('ELECTIONS')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${adminTab === 'ELECTIONS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <Clock size={16}/> 1. Manage Elections
          </button>
          <button onClick={() => setAdminTab('CANDIDATES')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${adminTab === 'CANDIDATES' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <Users size={16}/> 2. Manage Candidates
          </button>
          <button onClick={() => setAdminTab('VOTERS')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${adminTab === 'VOTERS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <Upload size={16}/> 3. Manage Voters
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 min-h-[600px]">
        {/* ========================================== */}
        {/* TAB 1: ELECTIONS */}
        {/* ========================================== */}
        {adminTab === 'ELECTIONS' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-6">
            {/* Left Panel: Form */}
            <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="bg-slate-800/50 p-4 border-b border-slate-800">
                <h2 className="font-bold text-white flex items-center gap-2"><Clock size={18} className="text-indigo-400"/> Schedule Election</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddElection} className="space-y-4">
                  {/* ELECTION TITLE */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Election Title</label>
                    <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-600" placeholder="e.g. CR Elections 2026" value={newElection.electionTitle} onChange={e=>setNewElection({...newElection, electionTitle: e.target.value})} required/>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* ELECTION LEVEL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Level</label>
                      <select 
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                        value={newElection.electionLevel} 
                        onChange={(e) => {
                          const selectedLevel = e.target.value;
                          
                          // Beta version check logic
                          if (selectedLevel === 'Panchayat' || selectedLevel === 'State') {
                            toast('This section is currently in Beta and not active yet!', { 
                              icon: '🚧', 
                              style: { background: '#1e293b', color: '#fbbf24', border: '1px solid #d97706' } 
                            });
                            // Dropdown ko wapas reset kar do taaki select na ho
                            setNewElection({...newElection, electionLevel: ''});
                          } else {
                            // Normal select logic
                            setNewElection({...newElection, electionLevel: selectedLevel, electionType: '', region: '', universityName: '', batch: ''});
                          }
                        }} 
                        required
                      >
                        <option value="">-- Select --</option>
                        <option value="College">College</option>
                        <option value="Panchayat">Panchayat (Beta)</option>
                        <option value="State">State (Beta)</option>
                      </select>
                    </div>
                    
                    {/* ELECTION POSITION / TYPE */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Position</label>
                      <select className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all custom-scrollbar" value={newElection.electionType} onChange={e=>setNewElection({...newElection, electionType: e.target.value})} required disabled={!newElection.electionLevel}>
                        <option value="">-- Select --</option>
                        {newElection.electionLevel === 'College' && (
                          <>
                            <option value="Class Representative (CR)">Class Representative (CR)</option>
                            <option value="Student Council President">Student Council President</option>
                            <option value="Vice President">Vice President</option>
                            <option value="General Secretary">General Secretary</option>
                            <option value="Cultural Secretary">Cultural Secretary</option>
                            <option value="Sports Secretary">Sports Secretary</option>
                            <option value="Treasurer">Treasurer</option>
                          </>
                        )}
                        {newElection.electionLevel === 'Panchayat' && (
                          <>
                            <option value="Mukhiya">Mukhiya</option>
                            <option value="Sarpanch">Sarpanch</option>
                            <option value="Ward Sadasya">Ward Sadasya</option>
                            <option value="Panchayat Samiti">Panchayat Samiti</option>
                            <option value="Zila Parishad">Zila Parishad</option>
                          </>
                        )}
                        {newElection.electionLevel === 'State' && (
                          <>
                            <option value="MLA (Vidhan Sabha)">MLA (Vidhan Sabha)</option>
                            <option value="MP (Lok Sabha)">MP (Lok Sabha)</option>
                            <option value="Mayor">Mayor</option>
                            <option value="Corporator">Corporator</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  
                  {newElection.electionLevel === 'College' ? (
                    <div className="space-y-4">
                      {/* BRANCH / REGION */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Branch (Region)</label>
                        <select className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none custom-scrollbar" value={newElection.region} onChange={e=>setNewElection({...newElection, region: e.target.value})} required>
                          <option value="">-- Select Branch --</option>
                          <option value="ALL DEPARTMENTS">ALL DEPARTMENTS (For President)</option>
                          <option value="CSE (Computer Science)">CSE (Computer Science)</option>
                          <option value="IT (Information Technology)">IT (Information Technology)</option>
                          <option value="ECE (Electronics & Comm.)">ECE (Electronics & Comm.)</option>
                          <option value="EE (Electrical)">EE (Electrical)</option>
                          <option value="ME (Mechanical)">ME (Mechanical)</option>
                          <option value="CE (Civil)">CE (Civil)</option>
                          <option value="BCA">BCA (Computer Applications)</option>
                          <option value="MCA">MCA (Master of Comp. App.)</option>
                          <option value="BBA">BBA (Business Admin)</option>
                          <option value="MBA">MBA (Master of Business Admin)</option>
                          <option value="B.Com">B.Com (Commerce)</option>
                          <option value="B.Sc">B.Sc (Science)</option>
                          <option value="B.A">B.A (Arts)</option>
                          <option value="B.Pharm">B.Pharm (Pharmacy)</option>
                          <option value="D.Pharm">D.Pharm (Pharmacy)</option>
                          <option value="LLB">LLB (Law)</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-indigo-500/5 p-3 border border-indigo-500/20 rounded-xl">
                        {/* UNIVERSITY */}
                        <div>
                          <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">University</label>
                          <select className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs custom-scrollbar" value={newElection.universityName} onChange={e=>setNewElection({...newElection, universityName: e.target.value})} required>
                            <option value="">-- Select Uni --</option>
                            <option value="ARKA JAIN UNIVERSITY">ARKA JAIN UNIVERSITY</option>
                            <option value="NIT JAMSHEDPUR">NIT JAMSHEDPUR</option>
                            <option value="KOLHAN UNIVERSITY">KOLHAN UNIVERSITY</option>
                            <option value="RANCHI UNIVERSITY">RANCHI UNIVERSITY</option>
                            <option value="BIT MESRA">BIT MESRA</option>
                            <option value="IIT PATNA">IIT PATNA</option>
                            <option value="AMITY UNIVERSITY">AMITY UNIVERSITY</option>
                            <option value="KIIT UNIVERSITY">KIIT UNIVERSITY</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>

                        {/* BATCH YEAR */}
                        <div>
                          <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Batch Year</label>
                          <select className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs custom-scrollbar" value={newElection.batch} onChange={e=>setNewElection({...newElection, batch: e.target.value})} required>
                            <option value="">-- Batch --</option>
                            <option value="ALL BATCHES">ALL BATCHES</option>
                            <optgroup label="4-Year Courses (B.Tech, B.Pharm)">
                              <option value="2021-2025">2021-2025</option>
                              <option value="2022-2026">2022-2026</option>
                              <option value="2023-2027">2023-2027</option>
                              <option value="2024-2028">2024-2028</option>
                            </optgroup>
                            <optgroup label="3-Year Courses (BCA, BBA, B.Sc)">
                              <option value="2023-2026">2023-2026</option>
                              <option value="2024-2027">2024-2027</option>
                              <option value="2025-2028">2025-2028</option>
                            </optgroup>
                            <optgroup label="2-Year Courses (MBA, MCA)">
                              <option value="2023-2025">2023-2025</option>
                              <option value="2024-2026">2024-2026</option>
                              <option value="2025-2027">2025-2027</option>
                              <option value="Others">Others</option>
                            </optgroup>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Constituency</label>
                      <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600" placeholder="e.g. WARD NO. 5" value={newElection.region} onChange={e=>setNewElection({...newElection, region: e.target.value.toUpperCase()})} required disabled={!newElection.electionLevel}/>
                    </div>
                  )}

                  {/* PREMIUM DARK CALENDAR DATE PICKERS */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</label>
                      <input 
                        type="datetime-local" 
                        style={{ colorScheme: 'dark' }} // ASLI JADOO: Isse browser ka popup dark ho jayega
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs transition-all cursor-pointer" 
                        value={newElection.startDate} 
                        onChange={e=>setNewElection({...newElection, startDate: e.target.value})} 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">End Time</label>
                      <input 
                        type="datetime-local" 
                        style={{ colorScheme: 'dark' }} // ASLI JADOO: Dark calendar
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs transition-all cursor-pointer" 
                        value={newElection.endDate} 
                        onChange={e=>setNewElection({...newElection, endDate: e.target.value})} 
                        required
                      />
                    </div>
                  </div>
                  
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                    Create Schedule
                  </button>
                </form>
              </div>
            </div>

            {/* Right Panel: Table */}
            <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
              <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex justify-between items-center">
                <h2 className="font-bold text-white flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Master Roster</h2>
                <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">Total: {elections.length}</span>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr><th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold">Election Details</th><th className="p-4 text-center font-semibold">Reports</th><th className="p-4 text-center font-semibold">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {elections.map(e => (
                      <tr key={e.electionId} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-extrabold border ${e.status === 'ONGOING' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : e.status === 'UPCOMING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white text-base">{e.electionTitle}</p>
                          <p className="text-xs text-indigo-400 font-semibold mt-1">{e.electionLevel} • {e.electionType} • {e.region}</p>
                          {e.universityName && <p className="text-[10px] text-slate-500 mt-0.5">{e.universityName} | {e.batch}</p>}
                        </td>
                        <td className="p-4 text-center">
                          {(e.status === 'COMPLETED' || e.status === 'ONGOING') ? (
                            <button onClick={() => handleDownloadReport(e)} className="bg-indigo-500/10 hover:bg-indigo-500/30 border border-indigo-500/20 text-indigo-400 p-2.5 rounded-lg transition-colors mx-auto flex items-center justify-center group" title="Download Official Report">
                              <FileDown size={18} className="group-hover:scale-110 transition-transform" />
                            </button>
                          ) : (<span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 bg-slate-900 px-2 py-1 rounded border border-slate-800">Not Ready</span>)}
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={()=>handleDeleteElection(e.electionId)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-lg transition-colors mx-auto">
                            <Trash2 size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {elections.length === 0 && (
                      <tr><td colSpan="4" className="p-10 text-center text-slate-500">No elections scheduled yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 2: CANDIDATES */}
        {/* ========================================== */}
        {adminTab === 'CANDIDATES' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-6">
            {/* Left Panel: Form */}
            <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
               <div className="bg-slate-800/50 p-4 border-b border-slate-800">
                <h2 className="font-bold text-white flex items-center gap-2"><Users size={18} className="text-fuchsia-400"/> Assign Candidate</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddCandidate} className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Election</label>
                     <select className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none transition-colors"
                       value={selectedElectionForCandidate}
                       onChange={(e) => {
                         const selId = e.target.value; setSelectedElectionForCandidate(selId);
                         const el = elections.find(x => x.electionId == selId);
                         if (el) { 
                           setNewCandidate({ ...newCandidate, electionLevel: el.electionLevel, electionType: el.electionType, region: el.region, universityName: el.universityName || '', batch: el.batch || '', electionId: el.electionId }); 
                         } else { 
                           setNewCandidate({ ...newCandidate, electionLevel: '', electionType: '', region: '', universityName: '', batch: '', electionId: '' }); 
                         }
                       }} required>
                       <option value="" className="text-slate-500">-- Select Election --</option>
                       {elections.filter(e => e.status !== 'COMPLETED').map(e => (<option key={e.electionId} value={e.electionId}>{e.electionTitle} ({e.region})</option>))}
                     </select>
                     {!selectedElectionForCandidate && <p className="text-[10px] text-fuchsia-400 font-bold mt-2">* Required field</p>}
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="Candidate Full Name" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed" value={newCandidate.name} onChange={e=>setNewCandidate({...newCandidate, name:e.target.value})} required disabled={!selectedElectionForCandidate}/>
                    <input type="text" placeholder="Party / Department" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed" value={newCandidate.department} onChange={e=>setNewCandidate({...newCandidate, department:e.target.value})} required disabled={!selectedElectionForCandidate}/>
                    <textarea placeholder="Candidate's Manifesto / Vision" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white h-28 focus:ring-2 focus:ring-fuchsia-500 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed" value={newCandidate.manifesto} onChange={e=>setNewCandidate({...newCandidate, manifesto:e.target.value})} required disabled={!selectedElectionForCandidate}></textarea>
                  </div>
                  <button type="submit" disabled={isLoading || !selectedElectionForCandidate} className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(192,38,211,0.3)]">
                    Register Candidate
                  </button>
                </form>
              </div>
            </div>

            {/* Right Panel: Table */}
            <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
               <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex justify-between items-center">
                <h2 className="font-bold text-white flex items-center gap-2"><Link size={18} className="text-emerald-400"/> Enrolled Candidates</h2>
              </div>
               <div className="overflow-x-auto flex-1">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                     <tr><th className="p-4 font-semibold">Candidate Info</th><th className="p-4 font-semibold">Target Election</th><th className="p-4 font-semibold">Party/Dept</th><th className="p-4 text-center font-semibold">Action</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/50">
                     {candidates.map(c => (
                       <tr key={c.candidateId} className="hover:bg-slate-800/30 transition-colors">
                         <td className="p-4">
                           <p className="font-bold text-white text-base">{c.name}</p>
                           <p className="text-[10px] text-slate-400 max-w-[200px] truncate mt-1 italic" title={c.manifesto}>"{c.manifesto}"</p>
                         </td>
                         <td className="p-4">
                           <span className="font-bold text-fuchsia-400">{c.electionType}</span> <span className="text-slate-400">in {c.region}</span>
                           {c.universityName && <p className="text-[10px] text-slate-500 mt-0.5">{c.universityName} | {c.batch}</p>}
                         </td>
                         <td className="p-4 font-semibold text-slate-300">
                            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{c.department}</span>
                         </td>
                         <td className="p-4 text-center">
                           <button onClick={()=>handleRemoveCandidate(c.candidateId)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-lg transition-colors mx-auto">
                             <Trash2 size={18}/>
                           </button>
                         </td>
                       </tr>
                     ))}
                     {candidates.length === 0 && (
                      <tr><td colSpan="4" className="p-10 text-center text-slate-500">No candidates registered yet.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 3: VOTERS */}
        {/* ========================================== */}
        {adminTab === 'VOTERS' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-6">
            {/* Left Panel: Form */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Upload size={18} className="text-emerald-400"/> Bulk Database Upload</h2>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">Upload CSV file to populate the voter registry. System will automatically encrypt records.</p>
                <form onSubmit={handleCSVUpload} className="space-y-4">
                  <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-emerald-500/50 transition-colors bg-slate-950">
                    <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                    <div className="text-slate-400 text-sm font-medium">
                      {csvFile ? <span className="text-emerald-400">{csvFile.name}</span> : <span>Drag & Drop or <span className="text-emerald-400 underline">Browse</span> CSV</span>}
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    {isLoading ? 'Processing Block...' : 'Upload & Encrypt Data'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Panel: Table */}
            <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[600px]">
               <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
                 <h2 className="font-bold text-white">Voter Registry</h2>
                 <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">Total Active: {voters.length}</span>
               </div>
               <div className="overflow-y-auto flex-1 custom-scrollbar">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-sm z-10 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 shadow-sm">
                     <tr><th className="p-4 font-semibold">Enrollment</th><th className="p-4 font-semibold">Identity</th><th className="p-4 font-semibold">Registered Email</th><th className="p-4 text-center font-semibold">Status</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50">
                     {voters && voters.map((v, index) => (
                         <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                           <td className="p-4 font-bold text-emerald-400 tracking-wider">{v.enrollmentNumber}</td>
                           <td className="p-4 text-white font-medium">{v.name}</td>
                           <td className="p-4 text-slate-400">{v.email}</td>
                           <td className="p-4 text-center">
                             {v.hasVoted 
                               ? <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded uppercase tracking-wider font-extrabold">Voted</span> 
                               : <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-1 rounded uppercase tracking-wider font-extrabold">Pending</span>}
                           </td>
                         </tr>
                     ))}
                     {(!voters || voters.length === 0) && <tr><td colSpan="4" className="p-10 text-center text-slate-500">Registry is empty. Waiting for CSV upload.</td></tr>}
                     </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;