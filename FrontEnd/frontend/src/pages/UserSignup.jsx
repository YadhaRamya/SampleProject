import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  FaUserPlus, FaUser, FaLock, FaEnvelope, 
  FaChevronLeft, FaEye, FaEyeSlash 
} from "react-icons/fa";

function UserSignup() {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (form.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    
    try {
      await API.post("/users/signup", form);
      navigate("/user-login");
    } catch (error) {
      console.error("Signup failed", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4 shadow-lg shadow-amber-500/20">
            <FaUserPlus className="text-slate-900 text-3xl" />
          </div>
          <h2 className="text-white text-3xl font-black tracking-tight">Join LuxeMart</h2>
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mt-2 font-bold">Create your executive account</p>
        </div>

        <div className="p-10 space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="John Doe" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium"
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="name@company.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium"
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Field with Eye Icon */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Secure Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium"
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

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium"
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-4">
            <button 
              onClick={submit}
              className="w-full bg-slate-900 text-amber-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
            >
              Create Account
            </button>

            <button 
              onClick={() => navigate("/user-login")}
              className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-amber-600 transition-colors"
            >
              <FaChevronLeft className="text-[8px]" /> Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;