import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Clock, CheckCircle2, MapPin, Building, Flag, CalendarDays, ChevronRight } from 'lucide-react';

const ElectionsPage = () => {
  const [elections, setElections] = useState([]);
  const [activeTab, setActiveTab] = useState('ONGOING'); // Tabs: ONGOING, UPCOMING, COMPLETED
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/elections');
      if (response.ok) {
        const data = await response.json();
        setElections(data);
      }
    } catch (error) {
      console.error("Failed to fetch elections", error);
    }
    setIsLoading(false);
  };

  const filteredElections = elections.filter(e => e.status === activeTab);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // NAYA: Election data ko sath mein le jaane wala function
  const handleEnterVotingRoom = (election) => {
    navigate('/vote', { 
      state: { 
        prefillData: {
          electionId: election.electionId, // NAYA MAGIC YAHAN HAI
          level: election.electionLevel,
          type: election.electionType,
          region: election.region,
          university: election.universityName || '',
          batch: election.batch || ''
        } 
      } 
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8 border-b pb-6">
        <h2 className="text-3xl font-extrabold text-indigo-900 uppercase tracking-wide flex items-center gap-3">
          <Building size={32} className="text-orange-500" />
          Central Election Hub
        </h2>
        <p className="text-slate-600 mt-2 font-medium">Discover active, upcoming, and past elections in your designated constituencies.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('ONGOING')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${activeTab === 'ONGOING' ? 'bg-red-100 text-red-700 border-2 border-red-500' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Radio size={18} className={activeTab === 'ONGOING' ? 'animate-pulse' : ''} /> 
          LIVE & ONGOING
        </button>
        <button 
          onClick={() => setActiveTab('UPCOMING')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${activeTab === 'UPCOMING' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Clock size={18} /> 
          UPCOMING ELECTIONS
        </button>
        <button 
          onClick={() => setActiveTab('COMPLETED')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${activeTab === 'COMPLETED' ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
        >
          <CheckCircle2 size={18} /> 
          PAST RESULTS
        </button>
      </div>

      {/* Elections Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-indigo-900 font-bold animate-pulse">
            Loading secure election data...
          </div>
        ) : filteredElections.length > 0 ? (
          filteredElections.map((election) => (
            <div key={election.electionId} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              
              <div className={`p-4 border-b flex justify-between items-start ${
                activeTab === 'ONGOING' ? 'bg-red-50 border-red-100' : 
                activeTab === 'UPCOMING' ? 'bg-indigo-50 border-indigo-100' : 
                'bg-green-50 border-green-100'
              }`}>
                <div>
                  <span className={`text-xs font-extrabold px-2 py-1 rounded uppercase tracking-wider ${
                    activeTab === 'ONGOING' ? 'bg-red-200 text-red-800' : 
                    activeTab === 'UPCOMING' ? 'bg-indigo-200 text-indigo-800' : 
                    'bg-green-200 text-green-800'
                  }`}>
                    {election.status}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{election.electionTitle}</h3>
                </div>
                {activeTab === 'ONGOING' && <Radio size={24} className="text-red-500 animate-pulse" />}
              </div>

              <div className="p-6 flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase flex items-center gap-1"><Building size={14}/> Level</p>
                    <p className="font-semibold text-slate-800">{election.electionLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase flex items-center gap-1"><Flag size={14}/> Type</p>
                    <p className="font-semibold text-slate-800">{election.electionType}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase flex items-center gap-1 mb-1"><MapPin size={14}/> Region / Constituency</p>
                  <p className="font-bold text-indigo-900">{election.region}</p>
                  {election.universityName && (
                    <p className="text-xs font-semibold text-slate-600 mt-1">{election.universityName} • Batch: {election.batch}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase flex items-center gap-1"><CalendarDays size={14}/> Schedule</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">Starts: {formatDate(election.startDate)}</p>
                  <p className="text-sm font-medium text-slate-700">Ends: {formatDate(election.endDate)}</p>
                </div>
              </div>

              {/* Card Footer (Action Buttons) */}
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                {activeTab === 'ONGOING' && (
                  // NAYA: onClick par naya function laga diya hai
                  <button onClick={() => handleEnterVotingRoom(election)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md">
                    Enter Secure Voting Room <ChevronRight size={18} />
                  </button>
                )}
                {activeTab === 'UPCOMING' && (
                  <button disabled className="w-full bg-slate-300 text-slate-500 font-bold py-3 rounded-lg flex justify-center items-center gap-2 cursor-not-allowed">
                    <Clock size={18} /> Voting Not Started Yet
                  </button>
                )}
                {activeTab === 'COMPLETED' && (
                  <button onClick={() => navigate('/results')} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md">
                    View Final Public Report <ChevronRight size={18} />
                  </button>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No {activeTab} Elections</h3>
            <p className="text-slate-500 mt-2">There are currently no elections listed in this category.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ElectionsPage;