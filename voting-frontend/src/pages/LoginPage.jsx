import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-lg border-t-8 border-indigo-900 relative overflow-hidden">
        
        {/* Background Watermark/Design */}
        <div className="absolute -top-10 -right-10 text-slate-100 opacity-50 pointer-events-none">
          <Landmark size={200} />
        </div>

        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-16 h-16 bg-indigo-900 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Landmark size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">Central Election Portal</h1>
          <p className="text-slate-500 mt-1 font-semibold text-sm">Secure E-Voting System (SEVS)</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded mb-6 text-sm font-bold border-l-4 ${message.type === 'success' ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={requestOtp} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Voter Enrollment ID</label>
              <input 
                type="text" 
                placeholder="e.g. AJU22001" 
                className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 outline-none transition-all uppercase bg-slate-50 font-medium"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value.toUpperCase())}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded transition-colors shadow-md flex items-center justify-center gap-2">
              <ShieldCheck size={20} />
              {isLoading ? 'Authenticating...' : 'Request Secure OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Authentication Token (OTP)</label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="******" 
                className="w-full px-4 py-3 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-900 outline-none text-center tracking-[1em] font-bold text-xl bg-slate-50"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded transition-colors shadow-md">
              {isLoading ? 'Verifying...' : 'Validate & Enter Portal'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 text-sm font-bold hover:text-indigo-900 mt-2">
              Cancel & Return
            </button>
          </form>
        )}
      </div>
      <p className="text-slate-500 text-xs mt-8 font-semibold">Protected by 256-bit AES Encryption • National Informatics Simulator</p>
    </div>
  );
};

export default LoginPage;
