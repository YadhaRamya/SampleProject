import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaEnvelope, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

function UserLogin() {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Added for eye icon
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/users/login", form);
      
      // Store essential data for the User Dashboard
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "USER");
      
      // Storing the name from the response so the Dashboard can display it
      // Note: Assuming your API returns user name as res.data.user.name or res.data.name
      const nameToStore = res.data.user?.name || res.data.name || "Executive User";
      localStorage.setItem("userName", nameToStore);
      
      navigate("/products");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4 shadow-lg shadow-amber-500/20">
            <FaUserCircle className="text-slate-900 text-3xl" />
          </div>
          <h2 className="text-white text-3xl font-black tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mt-2 font-bold">Secure User Access</p>
        </div>

        {/* Form Section */}
        <div className="p-10 space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="name@company.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-medium text-slate-700"
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input with Eye Icon */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Secret Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-medium text-slate-700"
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-4">
            <button 
              onClick={login}
              className="w-full bg-slate-900 text-amber-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-200"
            >
              Authorize Login <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 py-2">
              <span className="h-px w-8 bg-slate-200"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New to Luxemart?</span>
              <span className="h-px w-8 bg-slate-200"></span>
            </div>

            <button 
              onClick={() => navigate("/signup")}
              className="w-full bg-white text-slate-900 border-2 border-slate-100 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
            >
              Create Account
            </button>

            {/* New Home Button */}
            <button 
              onClick={() => navigate("/")}
              className="w-full bg-white text-slate-900 border-2 border-slate-100 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
            >
              Return to Home Page
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-6 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Protected by Industry Standard Encryption
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
