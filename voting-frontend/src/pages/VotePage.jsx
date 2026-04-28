import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // NAYA: useLocation add kiya
import { ShieldCheck, User, AlertCircle, CheckCircle2, MapPin, Building, Flag, Clock, GraduationCap, CalendarDays } from 'lucide-react';

const VotePage = () => {
  const [electionLevel, setElectionLevel] = useState('');
  const [electionType, setElectionType] = useState('');
  const [region, setRegion] = useState('');
  const [university, setUniversity] = useState('');
  const [batch, setBatch] = useState('');
  
  const [votingPhase, setVotingPhase] = useState(1); 
  const [isBeta, setIsBeta] = useState(false); 

  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [hasVoted, setHasVoted] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); // NAYA: Pichle page ka data padhne ke liye
  const enrollmentNumber = localStorage.getItem("enrollment");

  // NAYA: Jab page load ho, check karo kya data aaya hai
  useEffect(() => {
    if (location.state && location.state.prefillData) {
      const { electionId, level, type, region, university, batch } = location.state.prefillData;
      
      // States set karo
      setElectionLevel(level);
      setElectionType(type);
      setRegion(region);
      setUniversity(university);
      setBatch(batch);
      
      // Beta check
      if (level === 'Panchayat' || level === 'State') {
        setIsBeta(true);
      } else {
        setIsBeta(false);
        // NAYA: Ab hum 5 lambe parameters ki jagah strictly ID bhej rahe hain
        fetchCandidatesDirect(electionId);
      }
      
      // Seedha Phase 2 par bhej do (Form Skip!)
      setVotingPhase(2);
      
      // State clear kar do taaki refresh pe dubara na aaye
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);

  // NAYA: Ek naya function jo directly ID receive karega
  const fetchCandidatesDirect = async (elId) => {
    setIsLoading(true);
    try {
      // NAYA MAGIC: Naya API endpoint jo sirf us election ID ke candidates layega
      const url = `http://localhost:8080/api/candidates/election/${elId}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to the election server.', type: 'error' });
    }
    setIsLoading(false);
  };

  const handleSelectionSubmit = (e) => {
    e.preventDefault();
    if (electionLevel === 'Panchayat' || electionLevel === 'State') {
      setIsBeta(true);
    } else {
      setIsBeta(false);
      fetchCandidatesDirect(electionLevel, electionType, region, university, batch); 
    }
    setVotingPhase(2);
  };

  const castVote = async (candidateId, candidateName) => {
    if(!window.confirm(`OFFICIAL PROMPT: Are you sure you want to cast your vote for ${candidateName} for the position of ${electionType} in ${region}?`)) return;

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(`http://localhost:8080/api/vote?enrollmentNumber=${enrollmentNumber}&candidateId=${candidateId}`, { method: 'POST' });
      const data = await response.text();

      if (response.ok) {
        setHasVoted(true);
        setMessage({ text: 'Success! Your vote has been securely encrypted and recorded.', type: 'success' });
        setTimeout(() => navigate('/results'), 3000); 
      } else {
        if (data.toLowerCase().includes("already cast")) {
          setHasVoted(true);
          setMessage({ text: 'Alert: Our database indicates you have already exercised your voting right.', type: 'error' });
        } else {
          setMessage({ text: data || 'Failed to process vote.', type: 'error' });
        }
      }
    } catch (error) {
      setMessage({ text: 'Secure connection to server lost.', type: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-indigo-900 uppercase tracking-wide flex items-center gap-2">
          <ShieldCheck size={32} className="text-orange-500" />
          Secure E-Ballot System
        </h2>
        <p className="text-slate-600 mt-2 font-medium">Please select your designated election category to view the ballot.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-8 flex items-center gap-3 font-bold border-l-4 shadow-sm ${message.type === 'success' ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          {message.text}
        </div>
      )}

      {hasVoted ? (
        <div className="bg-white p-10 rounded-xl shadow-md text-center border-t-4 border-indigo-900">
           <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
           <h3 className="text-2xl font-bold text-slate-800">Voting Complete</h3>
           <p className="text-slate-500 mt-2">Redirecting to live results...</p>
        </div>
      ) : (
        <>
          {votingPhase === 1 && (
            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Step 1: Locate Your Election</h3>
              
              <form onSubmit={handleSelectionSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Building size={16} className="text-indigo-600"/> Administrative Level
                  </label>
                  <select 
                    className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-900 outline-none bg-slate-50"
                    value={electionLevel}
                    onChange={(e) => setElectionLevel(e.target.value)}
                    required
                  >
                    <option value="">-- Select Level --</option>
                    <option value="College">University / College Level (Active)</option>
                    <option value="Panchayat">Gram Panchayat Level (Beta)</option>
                    <option value="State">State Legislative Assembly (Beta)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Flag size={16} className="text-indigo-600"/> Position / Election Type
                  </label>
                  <select 
                    className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-900 outline-none bg-slate-50"
                    value={electionType}
                    onChange={(e) => setElectionType(e.target.value)}
                    required
                    disabled={!electionLevel}
                  >
                    <option value="">-- Select Position --</option>
                    {electionLevel === 'College' && <><option value="Class Representative">Class Representative</option><option value="President">Student Council President</option></>}
                    {electionLevel === 'Panchayat' && <><option value="Mukhiya">Mukhiya</option><option value="Sarpanch">Sarpanch</option><option value="Ward Sadasya">Ward Sadasya</option></>}
                    {electionLevel === 'State' && <><option value="MLA">Member of Legislative Assembly (MLA)</option></>}
                  </select>
                </div>

                {electionLevel === 'College' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                        <GraduationCap size={14} className="text-indigo-600"/> College / University
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Arka Jain University"
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-900 outline-none bg-white uppercase text-sm"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value.toUpperCase())}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                        <CalendarDays size={14} className="text-indigo-600"/> Batch Year
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 2022-2026"
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-900 outline-none bg-white uppercase text-sm"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value.toUpperCase())}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-600"/> Constituency / Region (Dept/Ward)
                  </label>
                  <input 
                    type="text" 
                    placeholder={electionLevel === 'College' ? "e.g. CSE" : "e.g. Ward No. 5, Bokaro"}
                    className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-900 outline-none bg-slate-50 uppercase"
                    value={region}
                    onChange={(e) => setRegion(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded transition-colors shadow-md">
                  Retrieve Official Ballot
                </button>
              </form>
            </div>
          )}

          {votingPhase === 2 && (
            <div>
              <div className="flex justify-between items-center mb-6 bg-slate-100 p-4 rounded-lg border border-slate-200 shadow-sm">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Election</p>
                  <h3 className="text-lg font-bold text-indigo-900">{electionLevel} • {electionType} • {region}</h3>
                  {electionLevel === 'College' && (
                     <p className="text-sm font-semibold text-slate-600 mt-1">{university} | Batch: {batch}</p>
                  )}
                </div>
                {/* NAYA: Agar data peeche se aaya tha, toh "Change Election" wala button hide ya alag behaviour de sakte hain, par abhi simple rakhte hain */}
                <button onClick={() => setVotingPhase(1)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 underline bg-white px-3 py-1 rounded border border-indigo-200">
                  Change Election
                </button>
              </div>

              {isBeta ? (
                <div className="bg-orange-50 border border-orange-200 p-12 rounded-xl text-center shadow-inner">
                  <Clock size={56} className="mx-auto text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold text-orange-900 mb-2">Section Not Active (Beta Phase)</h3>
                  <p className="text-orange-700 font-medium max-w-lg mx-auto">
                    The infrastructure for <span className="font-bold">{electionLevel}</span> level elections is currently under development. Kindly wait for future updates.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {candidates.length > 0 ? candidates.map(candidate => (
                    <div key={candidate.candidateId} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
                      <div className="bg-indigo-50 p-6 flex flex-col items-center justify-center border-b border-slate-100 relative">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
                          <User size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{candidate.name}</h3>
                        {candidate.universityName && (
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{candidate.universityName} • {candidate.batch}</p>
                        )}
                        <span className="inline-block bg-orange-100 text-orange-800 text-xs font-extrabold px-3 py-1 rounded-full mt-3 uppercase tracking-wide">
                          Party/Dept: {candidate.department}
                        </span>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-slate-600 text-sm italic mb-6 flex-1 border-l-4 border-indigo-200 pl-3">"{candidate.manifesto}"</p>
                        <button onClick={() => castVote(candidate.candidateId, candidate.name)} disabled={isLoading} className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded transition-colors shadow-md flex justify-center items-center gap-2 disabled:opacity-50">
                          <ShieldCheck size={18} /> Cast Secure Vote
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-12 text-slate-500 font-medium">
                      {isLoading ? 'Loading approved candidates...' : 'No candidates registered for this specific region/batch/election.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VotePage;