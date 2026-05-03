import { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Trophy, Users, MapPin } from 'lucide-react';
// NAYE IMPORTS (Antenna)
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ResultsPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [resultsData, setResultsData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Page load hote hi Elections ki list laana (Sirf Ongoing aur Completed)
  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/elections');
      if (response.ok) {
        const data = await response.json();
        const validElections = data.filter(e => e.status === 'ONGOING' || e.status === 'COMPLETED');
        setElections(validElections);
        // Default pehle election ko select kar lo
        if (validElections.length > 0) {
          setSelectedElection(validElections[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch elections", error);
    }
  };

  // 2. Jab bhi chunav change ho, uske results fetch karna
  useEffect(() => {
    if (selectedElection) {
      fetchResults();
    }
  }, [selectedElection]);

  // -------------------------------------------------------------
  // THE MAGIC: WEBSOCKET LISTENER (Auto-Refresh)
  // -------------------------------------------------------------
  useEffect(() => {
    let stompClient = null;

    if (selectedElection && selectedElection.status === 'ONGOING') {
      // Spring Boot se connection banao
      const socket = new SockJS('http://localhost:8080/ws-election');
      stompClient = Stomp.over(() => socket);
      
      // Console me faaltu logs band karne ke liye
      stompClient.debug = () => {}; 

      stompClient.connect({}, () => {
        console.log('Connected to Live Election Channel!');
        
        // "/topic/results" ko sunte raho
        stompClient.subscribe('/topic/results', (message) => {
          // Expected Message format: "UPDATE_College_Class Representative_CSE"
          const expectedMessage = `UPDATE_${selectedElection.electionLevel}_${selectedElection.electionType}_${selectedElection.region}`;
          
          // Agar humara wala chunav update hua hai, toh graph refresh kar do!
          if (message.body === expectedMessage) {
            console.log("⚡ Naya Vote Aaya! Auto-refreshing graph...");
            fetchResults(); 
          }
        });
      });
    }

    // Jab user page chhod de ya chunav badal le, connection kaat do
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [selectedElection]);
  // -------------------------------------------------------------

  const fetchResults = async () => {
    setIsRefreshing(true);
    try {
      // NAYA MAGIC: Yahan pehle lambe parameters bhej rahe the, ab strictly ID se candidate aur unke votes mangwa rahe hain
      const response = await fetch(`http://localhost:8080/api/candidates/election/${selectedElection.electionId}`);
      if (response.ok) {
        const data = await response.json();
        // Descending order me sort karna (Sabse zyada vote wala upar)
        const sortedData = data.sort((a, b) => b.votes - a.votes);
        setResultsData(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch results", error);
    }
    // Chota sa delay taaki refresh animation dikhe
    setTimeout(() => setIsRefreshing(false), 500); 
  };

  const handleElectionChange = (e) => {
    const electionId = parseInt(e.target.value);
    const selected = elections.find(el => el.electionId === electionId);
    setSelectedElection(selected);
  };

  // Graph Calculations
  const totalVotesCast = resultsData.reduce((sum, candidate) => sum + candidate.votes, 0);
  const maxVotes = Math.max(...resultsData.map(c => c.votes), 1); // Zero se bachne ke liye fallback 1

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* HEADER & CONTROLS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-lg text-indigo-700">
            <BarChart3 size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide">Live Election Desk</h2>
            <p className="text-slate-500 text-sm font-medium">Real-time analytical counting engine</p>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <select 
            className="flex-1 md:w-64 px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700"
            value={selectedElection?.electionId || ''}
            onChange={handleElectionChange}
          >
            {elections.map(el => (
              // NAYA BONUS FIX: Dropdown me ab Title aur Batch dikhega taaki confusion na ho
              <option key={el.electionId} value={el.electionId}>
                {el.electionTitle} ({el.batch || el.region})
              </option>
            ))}
          </select>
          <button 
            onClick={fetchResults} 
            disabled={isRefreshing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* DASHBOARD AREA */}
      {selectedElection && (
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-indigo-900 overflow-hidden relative">
          
          {/* Live Pulsing Dot if Ongoing */}
          {selectedElection.status === 'ONGOING' && (
            <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest">LIVE</span>
            </div>
          )}

          {/* Dashboard Header Info */}
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
            <div>
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block ${selectedElection.status === 'ONGOING' ? 'bg-red-500' : 'bg-green-500'}`}>
                {selectedElection.status === 'ONGOING' ? 'LIVE COUNTING' : 'FINAL RESULTS'}
              </span>
              <h3 className="text-xl font-bold pr-16">{selectedElection.electionTitle}</h3>
              <p className="text-indigo-200 text-sm flex items-center gap-1 mt-1"><MapPin size={14}/> {selectedElection.region} ({selectedElection.electionLevel})</p>
            </div>
            <div className="text-right mt-6">
              <p className="text-indigo-200 text-xs uppercase font-bold tracking-wider">Total Votes Cast</p>
              <p className="text-4xl font-extrabold font-mono">{totalVotesCast}</p>
            </div>
          </div>

          {/* TV Style Graph Area */}
          <div className="p-8">
            {resultsData.length > 0 ? (
              <div className="space-y-8">
                {resultsData.map((candidate, index) => {
                  // Percentage calculate karna
                  const percentage = totalVotesCast === 0 ? 0 : ((candidate.votes / totalVotesCast) * 100).toFixed(1);
                  // Bar ki width maxVotes ke hisab se set hogi taaki graph lamba dikhe
                  const barWidth = maxVotes === 0 ? 0 : (candidate.votes / maxVotes) * 100;
                  
                  // Top candidate (Winner/Leading) ko alag color dena
                  const isLeader = index === 0 && candidate.votes > 0;

                  return (
                    <div key={candidate.candidateId || candidate.id} className="relative">
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2">
                          {isLeader && <Trophy size={18} className="text-orange-500" />}
                          <h4 className={`text-lg font-bold ${isLeader ? 'text-orange-600' : 'text-slate-700'}`}>
                            {candidate.name}
                          </h4>
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {candidate.department}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-slate-800">{candidate.votes}</span>
                          <span className="text-sm font-bold text-slate-500 ml-1">({percentage}%)</span>
                        </div>
                      </div>
                      
                      {/* The Animated Graph Bar */}
                      <div className="w-full h-6 bg-slate-100 rounded-r-full overflow-hidden flex">
                        <div 
                          style={{ width: `${barWidth}%` }} 
                          className={`h-full rounded-r-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 ${
                            isLeader ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-indigo-400 to-indigo-600'
                          }`}
                        >
                          {/* Inner shine effect */}
                          <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-slate-300 mb-4" />
                <h4 className="text-xl font-bold text-slate-600">No Data Available</h4>
                <p className="text-slate-400">Waiting for candidates or votes to be registered.</p>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ResultsPage;