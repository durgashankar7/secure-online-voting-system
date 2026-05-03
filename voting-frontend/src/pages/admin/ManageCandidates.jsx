import { useState, useEffect } from 'react';
import { Users, Trash2, Link } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [selectedElectionForCandidate, setSelectedElectionForCandidate] = useState('');
  const [newCandidate, setNewCandidate] = useState({ 
    name: '', universityName: '', batch: '', department: '', 
    manifesto: '', electionLevel: '', electionType: '', region: '', electionId: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
    fetchElections();
  }, []);

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

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/candidates', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(newCandidate)
      });
      if (response.ok) {
        toast.success('Candidate Registered & Assigned Successfully!');
        setNewCandidate({ name: '', universityName: '', batch: '', department: '', manifesto: '', electionLevel: '', electionType: '', region: '', electionId: '' });
        setSelectedElectionForCandidate('');
        fetchCandidates(); 
      } else {
        toast.error('Failed to add candidate.');
      }
    } catch (error) { 
      toast.error('Failed to add candidate.'); 
    }
    setIsLoading(false);
  };
  
  const handleRemoveCandidate = async (id) => {
    if(!window.confirm("Are you sure you want to remove this candidate?")) return;
    try {
      await fetch(`http://localhost:8080/api/candidates/${id}`, { method: 'DELETE' });
      toast.success('Candidate Removed!');
      fetchCandidates();
    } catch (error) {
      toast.error('Failed to remove candidate.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-6">
      
      {/* LEFT PANEL: ASSIGN CANDIDATE FORM */}
      <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden h-fit">
        <div className="bg-slate-800/50 p-4 border-b border-slate-800">
          <h2 className="font-bold text-white flex items-center gap-2"><Users size={18} className="text-fuchsia-400"/> Assign Candidate</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleAddCandidate} className="space-y-4">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Election</label>
              <select 
                className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none transition-colors"
                value={selectedElectionForCandidate}
                onChange={(e) => {
                  const selId = e.target.value; 
                  setSelectedElectionForCandidate(selId);
                  const el = elections.find(x => x.electionId == selId);
                  if (el) { 
                    setNewCandidate({ 
                      ...newCandidate, 
                      electionLevel: el.electionLevel, 
                      electionType: el.electionType, 
                      region: el.region, 
                      universityName: el.universityName || '', 
                      batch: el.batch || '', 
                      electionId: el.electionId 
                    }); 
                  } else { 
                    setNewCandidate({ ...newCandidate, electionLevel: '', electionType: '', region: '', universityName: '', batch: '', electionId: '' }); 
                  }
                }} 
                required
              >
                <option value="" className="text-slate-500">-- Select Election --</option>
                {elections.filter(e => e.status !== 'COMPLETED').map(e => (
                  <option key={e.electionId} value={e.electionId}>{e.electionTitle} ({e.region})</option>
                ))}
              </select>
              {!selectedElectionForCandidate && <p className="text-[10px] text-fuchsia-400 font-bold mt-2">* Required field</p>}
            </div>

            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Candidate Full Name" 
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
                value={newCandidate.name} 
                onChange={e=>setNewCandidate({...newCandidate, name:e.target.value})} 
                required 
                disabled={!selectedElectionForCandidate}
              />
              <input 
                type="text" 
                placeholder="Party / Department" 
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
                value={newCandidate.department} 
                onChange={e=>setNewCandidate({...newCandidate, department:e.target.value})} 
                required 
                disabled={!selectedElectionForCandidate}
              />
              <textarea 
                placeholder="Candidate's Manifesto / Vision" 
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white h-28 focus:ring-2 focus:ring-fuchsia-500 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed" 
                value={newCandidate.manifesto} 
                onChange={e=>setNewCandidate({...newCandidate, manifesto:e.target.value})} 
                required 
                disabled={!selectedElectionForCandidate}
              ></textarea>
            </div>
            
            <button type="submit" disabled={isLoading || !selectedElectionForCandidate} className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(192,38,211,0.3)]">
              Register Candidate
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL: ENROLLED CANDIDATES TABLE */}
      <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
        <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-white flex items-center gap-2"><Link size={18} className="text-emerald-400"/> Enrolled Candidates</h2>
          <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">Total: {candidates.length}</span>
        </div>
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-sm z-10 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Candidate Info</th>
                <th className="p-4 font-semibold">Target Election</th>
                <th className="p-4 font-semibold">Party/Dept</th>
                <th className="p-4 text-center font-semibold">Action</th>
              </tr>
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
  );
};

export default ManageCandidates;