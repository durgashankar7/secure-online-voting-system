import { useNavigate } from 'react-router-dom';
import { Users, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          E-Voting <span className="text-indigo-500">Portal</span>
        </h1>
        <p className="text-slate-400 text-lg">Select your gateway to proceed</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Voter Card */}
        <div 
          onClick={() => navigate('/voter-login')}
          className="bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800/80 cursor-pointer rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20"
        >
          <div className="bg-indigo-500/10 p-4 rounded-full mb-6">
            <Users size={48} className="text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Voter Portal</h2>
          <p className="text-slate-400 text-sm">Login with your Enrollment Number and cast your secure vote.</p>
        </div>

        {/* Admin Card */}
        <div 
          onClick={() => navigate('/admin')}
          className="bg-slate-800 border border-slate-700 hover:border-red-500 hover:bg-slate-800/80 cursor-pointer rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20"
        >
          <div className="bg-red-500/10 p-4 rounded-full mb-6">
            <ShieldCheck size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Center</h2>
          <p className="text-slate-400 text-sm">Authorized personnel only. Manage elections and view live results.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;