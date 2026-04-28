import { useState, useEffect, useRef } from 'react';
import { UserCircle, Mail, IdCard, CheckCircle, Clock, Camera } from 'lucide-react'; // NAYA: Camera icon import kiya

const ProfilePage = () => {
  const [voterDetails, setVoterDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null); // NAYA: State picture hold karne ke liye
  const fileInputRef = useRef(null); // NAYA: Chhupi hui file input file select karne ke liye

  useEffect(() => {
    const enrollmentId = localStorage.getItem("enrollment"); 

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/voters', { cache: 'no-store' });
        if (response.ok) {
          const voters = await response.json();
          const myProfile = voters.find(v => v.enrollmentNumber === enrollmentId);
          console.log("Fresh Voter Data:", myProfile);
          setVoterDetails(myProfile);
          
          // --- PLACEHOLDER: Agar server par picture hai toh load karein ---
          // if (myProfile.profileImageUrl) {
          //   setProfileImage(`http://localhost:8080${myProfile.profileImageUrl}`);
          // }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (enrollmentId) {
        fetchProfile();
    } else {
        setIsLoading(false);
    }
  }, []);

  // NAYA JADU 1: Click par chhupi file input ko trigger karna
  const handleEditPicture = () => {
    fileInputRef.current.click();
  };

  // NAYA JADU 2: File select karne ke baad profile par dikhana
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Picture state mein set hokar turant display ho jayegi
        setProfileImage(reader.result);
        console.log("File Selected:", file.name);
        
        // --- YEHAAN LOGIC JAYEGI SERVER PAR UPLOAD KARNE KI ---
        // For example:
        // const formData = new FormData();
        // formData.append("profileImage", file);
        // formData.append("enrollmentNumber", voterDetails.enrollmentNumber);
        // fetch('http://localhost:8080/api/voters/upload-image', { method: 'POST', body: formData });
        alert("Great ! Your profile picture has been uploaded successfully.");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file (JPG, PNG, etc.).");
    }
  };

  if (isLoading) return <div className="text-center mt-20 font-bold text-indigo-900 animate-pulse">Loading Identity Card...</div>;

  if (!voterDetails) return (
    <div className="bg-white p-8 rounded-xl shadow border border-slate-200 text-center max-w-md mx-auto mt-10">
      <UserCircle size={64} className="mx-auto text-slate-300 mb-4" />
      <h2 className="text-2xl font-bold text-slate-700">Profile Not Found</h2>
      <p className="text-slate-500 mt-2">Profile not found! Please contact to the admin.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-4">
      {/* Cover Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 h-32 relative"></div>
      
      {/* Hidden File Input for uploading pictures */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      <div className="px-8 pb-8 relative">
        
        {/* 🔥 FIX 1: Naya Flex Layout takki naam aur logo overlap na karein 🔥 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative -top-12 z-10">
          
          {/* Logo container with edit button */}
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center shadow-md border-4 border-white overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={80} className="text-indigo-900" />
              )}
            </div>
            
            {/* ✨ FIX 2: Naya Camera Edit Button logo ke corner mein ✨ */}
            <button 
              onClick={handleEditPicture}
              className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border-2 border-slate-200 shadow-md text-slate-600 hover:bg-slate-100 hover:text-indigo-900 transition-colors"
              title="Change Profile Picture"
            >
              <Camera size={18} />
            </button>
          </div>

          {/* Name and Status - Naye Flex Container ke andar */}
          <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0 px-2 sm:px-0">
            <h1 className="text-3xl font-extrabold text-slate-800 uppercase tracking-wide break-words">
              {voterDetails.name}
            </h1>
            
            {/* Dynamic Status Badge */}
            <span className={`mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${voterDetails.hasVoted ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
              {voterDetails.hasVoted ? <CheckCircle size={18} /> : <Clock size={18} />}
              {voterDetails.hasVoted ? 'Successfully Voted' : 'Voting Pending'}
            </span>
          </div>
        </div>

        <div className="mt-12 sm:mt-8 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 transition-colors hover:bg-slate-100">
            <div className="bg-indigo-100 p-3 rounded-full"><IdCard className="text-indigo-700" size={24} /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">University Enrollment Number</p>
              <p className="text-lg font-bold text-slate-800">{voterDetails.enrollmentNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 transition-colors hover:bg-slate-100">
            <div className="bg-indigo-100 p-3 rounded-full"><Mail className="text-indigo-700" size={24} /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Email Address</p>
              <p className="text-lg font-bold text-slate-800">{voterDetails.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;