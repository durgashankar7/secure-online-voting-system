import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Vote, BarChart3, HelpCircle, LogOut, Landmark, ListChecks, User } from 'lucide-react'; // NAYA: User icon import kiya

const DashboardLayout = ({ children, setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const enrollment = localStorage.getItem("enrollment");

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to exit the secure portal?")) {
      localStorage.removeItem("voterAuth");
      localStorage.removeItem("enrollment");
      setAuth(false);
      navigate('/');
    }
  };

  // Nav items ka array taaki active state manage karna asan ho
  const navItems = [
    { name: 'Home Overview', path: '/home', icon: Home },
    { name: 'My Profile', path: '/profile', icon: User }, // NAYA: Yahan Profile page add kar diya
    { name: 'Elections', path: '/elections', icon: ListChecks },
    { name: 'Cast Vote', path: '/vote', icon: Vote },
    { name: 'Live Results', path: '/results', icon: BarChart3 },
    { name: 'Help & Support', path: '/support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar - Official Look */}
      <header className="bg-indigo-900 text-white border-b-4 border-orange-500 shadow-md z-10 relative">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-900 shadow-inner">
              <Landmark size={28} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide uppercase">Election Commission Portal</h1>
              <p className="text-indigo-200 text-xs font-semibold">Government Secure E-Voting Interface</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-xs text-indigo-200 uppercase tracking-wider font-bold">Logged in as</p>
              <p className="font-bold">{enrollment}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-indigo-800 hover:bg-red-600 border border-indigo-700 hover:border-red-500 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} /> Exit Portal
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-300 shadow-lg hidden md:block z-0">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation Menu</p>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center gap-3 p-3 rounded font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-800 border-l-4 border-indigo-800' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-indigo-700' : 'text-slate-400'} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Ye 'children' prop me wo page aayega jo hum select karenge */}
          {children} 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;