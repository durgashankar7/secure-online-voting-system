import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm mb-4 w-fit"
    >
      <ArrowLeft size={16} /> Go Back
    </button>
  );
};

export default BackButton;