import { useState, useEffect } from 'react';
import { Clock, Trash2, FileDown, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({ 
    electionTitle: '', electionLevel: '', electionType: '', 
    region: '', universityName: '', batch: '', startDate: '', endDate: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/elections');
      if (response.ok) {
        setElections(await response.json() || []);
      }
    } catch (error) { 
      console.error(error); 
    }
  };

  const handleAddElection = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/elections', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(newElection)
      });
      if (response.ok) {
        toast.success('Election Scheduled Successfully!');
        setNewElection({ electionTitle: '', electionLevel: '', electionType: '', region: '', universityName: '', batch: '', startDate: '', endDate: '' });
        fetchElections();
      } else { 
        toast.error('Failed to create election.'); 
      }
    } catch (error) { 
      toast.error('Server error.'); 
    }
    setIsLoading(false);
  };

  const handleDeleteElection = async (id) => {
    if(!window.confirm("Are you sure you want to delete this election schedule?")) return;
    try {
      await fetch(`http://localhost:8080/api/elections/${id}`, { method: 'DELETE' });
      toast.success('Election Deleted Permanently!');
      fetchElections();
    } catch (error) {
      toast.error('Failed to delete election.');
    }
  };

  const handleDownloadReport = async (election) => {
    toast.loading('Generating Official PDF Report...', { id: 'pdf' });
    try {
      const response = await fetch(`http://localhost:8080/api/results/download?electionId=${election.electionId}&title=${election.electionTitle}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); 
        a.href = url; 
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-6">
      
      {/* LEFT PANEL: ELECTION FORM */}
      <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden h-fit">
        <div className="bg-slate-800/50 p-4 border-b border-slate-800">
          <h2 className="font-bold text-white flex items-center gap-2"><Clock size={18} className="text-indigo-400"/> Schedule Election</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleAddElection} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Election Title</label>
              <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-600" placeholder="e.g. CR Elections 2026" value={newElection.electionTitle} onChange={e=>setNewElection({...newElection, electionTitle: e.target.value})} required/>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Level</label>
                <select 
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  value={newElection.electionLevel} 
                  onChange={(e) => {
                    const selectedLevel = e.target.value;
                    if (selectedLevel === 'Panchayat' || selectedLevel === 'State') {
                      toast('This section is currently in Beta and not active yet!', { icon: '🚧', style: { background: '#1e293b', color: '#fbbf24', border: '1px solid #d97706' } });
                      setNewElection({...newElection, electionLevel: ''});
                    } else {
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
                </select>
              </div>
            </div>
            
            {newElection.electionLevel === 'College' ? (
              <div className="space-y-4">
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
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="BBA">BBA</option>
                    <option value="MBA">MBA</option>
                    <option value="B.Com">B.Com</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.A">B.A</option>
                    <option value="B.Pharm">B.Pharm</option>
                    <option value="LLB">LLB</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-indigo-500/5 p-3 border border-indigo-500/20 rounded-xl">
                  <div>
                    <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">University</label>
                    <select className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs custom-scrollbar" value={newElection.universityName} onChange={e=>setNewElection({...newElection, universityName: e.target.value})} required>
                      <option value="">-- Select Uni --</option>
                      <option value="ARKA JAIN UNIVERSITY">ARKA JAIN UNIVERSITY</option>
                      <option value="NIT JAMSHEDPUR">NIT JAMSHEDPUR</option>
                      <option value="KOLHAN UNIVERSITY">KOLHAN UNIVERSITY</option>
                      <option value="RANCHI UNIVERSITY">RANCHI UNIVERSITY</option>
                      <option value="BIT MESRA">BIT MESRA</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Batch Year</label>
                    <select className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs custom-scrollbar" value={newElection.batch} onChange={e=>setNewElection({...newElection, batch: e.target.value})} required>
                      <option value="">-- Batch --</option>
                      <option value="ALL BATCHES">ALL BATCHES</option>
                      <optgroup label="4-Year Courses">
                        <option value="2021-2025">2021-2025</option>
                        <option value="2022-2026">2022-2026</option>
                        <option value="2023-2027">2023-2027</option>
                        <option value="2024-2028">2024-2028</option>
                      </optgroup>
                      <optgroup label="3-Year Courses">
                        <option value="2023-2026">2023-2026</option>
                        <option value="2024-2027">2024-2027</option>
                        <option value="2025-2028">2025-2028</option>
                      </optgroup>
                      <option value="Others">Others</option>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</label>
                <input type="datetime-local" style={{ colorScheme: 'dark' }} className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs transition-all cursor-pointer" value={newElection.startDate} onChange={e=>setNewElection({...newElection, startDate: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">End Time</label>
                <input type="datetime-local" style={{ colorScheme: 'dark' }} className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs transition-all cursor-pointer" value={newElection.endDate} onChange={e=>setNewElection({...newElection, endDate: e.target.value})} required/>
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              Create Schedule
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL: MASTER ROSTER TABLE */}
      <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[700px]">
        <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-white flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Master Roster</h2>
          <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">Total: {elections.length}</span>
        </div>
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-sm z-10 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Election Details</th>
                <th className="p-4 text-center font-semibold">Reports</th>
                <th className="p-4 text-center font-semibold">Action</th>
              </tr>
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
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 bg-slate-900 px-2 py-1 rounded border border-slate-800">Not Ready</span>
                    )}
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
  );
};

export default ManageElections;