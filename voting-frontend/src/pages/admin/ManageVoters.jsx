import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Clock, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageVoters = () => {
  const [voters, setVoters] = useState([]); 
  const [csvFile, setCsvFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/voters');
      if (response.ok) {
        setVoters(await response.json() || []);
      }
    } catch (error) { 
      console.error(error); 
    }
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) { 
      toast.error('Please select a CSV file first.'); 
      return; 
    }
    
    setIsLoading(true); 
    toast.loading('Encrypting and Uploading Database...', { id: 'csv-upload' });
    
    const formData = new FormData(); 
    formData.append('file', csvFile);
    
    try {
      const response = await fetch('http://localhost:8080/api/voters/upload', { 
        method: 'POST', 
        body: formData 
      });
      const data = await response.text();
      
      if (response.ok) {
        toast.success(data, { id: 'csv-upload' }); 
        setCsvFile(null); 
        fetchVoters(); 
      } else { 
        toast.error(data, { id: 'csv-upload' }); 
      }
    } catch (error) { 
      toast.error('Server connection failed.', { id: 'csv-upload' }); 
    }
    setIsLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid lg:grid-cols-12 gap-6">
      
      {/* LEFT PANEL: CSV UPLOAD FORM */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Upload size={18} className="text-emerald-400"/> Bulk Database Upload
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Upload CSV file to populate the voter registry. The system will automatically encrypt all student records using AES-256.
          </p>
          
          <form onSubmit={handleCSVUpload} className="space-y-4">
            <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-colors bg-slate-950 group cursor-pointer">
              <input 
                type="file" 
                accept=".csv" 
                onChange={e => setCsvFile(e.target.files[0])} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                required 
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <FileText size={32} className={`${csvFile ? 'text-emerald-400' : 'text-slate-600 group-hover:text-emerald-500/50'} transition-colors`} />
                <div className="text-sm font-medium">
                  {csvFile ? (
                    <span className="text-emerald-400 font-bold">{csvFile.name}</span>
                  ) : (
                    <span className="text-slate-400">Drag & Drop or <span className="text-emerald-400 underline">Browse</span> CSV</span>
                  )}
                </div>
                {!csvFile && <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">Only .csv files allowed</p>}
              </div>
            </div>
            
            <button type="submit" disabled={isLoading || !csvFile} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {isLoading ? 'Processing Block...' : 'Upload & Encrypt Data'}
            </button>
          </form>
        </div>

        {/* INFO CARD */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 text-sm">
          <h3 className="font-bold text-slate-300 mb-3 flex items-center gap-2">CSV Format Guidelines</h3>
          <ul className="space-y-2 text-slate-400 text-xs list-disc pl-4">
            <li>File must contain headers: <code className="text-indigo-400 bg-slate-950 px-1 rounded">enrollmentNumber</code>, <code className="text-indigo-400 bg-slate-950 px-1 rounded">name</code>, <code className="text-indigo-400 bg-slate-950 px-1 rounded">email</code></li>
            <li>Enrollment numbers must be unique.</li>
            <li>Duplicate entries will be automatically ignored by the server.</li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL: VOTER REGISTRY TABLE */}
      <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[700px]">
        <div className="bg-slate-800/50 p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-white flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Voter Registry</h2>
          <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full shadow-inner">
            Total Active: {voters.length}
          </span>
        </div>
        
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-md z-10 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 shadow-sm">
              <tr>
                <th className="p-4 font-semibold">Enrollment ID</th>
                <th className="p-4 font-semibold">Student Identity</th>
                <th className="p-4 font-semibold">Registered Email</th>
                <th className="p-4 text-center font-semibold">Voting Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {voters && voters.map((v, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-emerald-400 tracking-wider">
                    {v.enrollmentNumber}
                  </td>
                  <td className="p-4 text-white font-medium">
                    {v.name}
                  </td>
                  <td className="p-4 text-slate-400">
                    {v.email}
                  </td>
                  <td className="p-4 text-center">
                    {v.hasVoted ? (
                      <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-extrabold">
                        <CheckCircle2 size={12} />
                        <span>Voted</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-extrabold">
                        <Clock size={12} />
                        <span>Pending</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {(!voters || voters.length === 0) && (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <FileText size={48} className="mx-auto text-slate-700 mb-4" />
                    <p className="text-slate-500 font-medium text-lg">Registry is completely empty.</p>
                    <p className="text-slate-600 text-sm mt-1">Please upload a CSV file from the left panel to begin.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </motion.div>
  );
};

export default ManageVoters;