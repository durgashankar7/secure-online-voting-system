import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SessionTimeout = ({ children }) => {
  const navigate = useNavigate();
  
  // 15 minutes = 900,000 milliseconds
  const TIMEOUT_IN_MS = 15 * 60 * 1000; 

  const logoutUser = useCallback(() => {
    // Dono portals ki auth saaf karo
    const isAdmin = localStorage.getItem("adminAuth") === "true";
    const isVoter = localStorage.getItem("voterAuth") === "true";

    if (isAdmin || isVoter) {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("voterAuth");
      localStorage.removeItem("voterData"); // Agar koi extra data hai toh
      
      toast.error("Session expired due to inactivity. Logging out...", {
        duration: 4000,
        icon: '🔒',
      });

      navigate('/'); // Landing page par bhej do
      window.location.reload(); // State puri tarah clean karne ke liye
    }
  }, [navigate]);

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logoutUser, TIMEOUT_IN_MS);
    };

    // User ki activity track karne ke liye events
    const events = [
      'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'click'
    ];

    // Events ko listen karna shuru karein
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Pehli baar timer chalu karein
    resetTimer();

    // Cleanup: Jab component hat jaye toh events nikal do
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [logoutUser]);

  return <>{children}</>;
};

export default SessionTimeout;