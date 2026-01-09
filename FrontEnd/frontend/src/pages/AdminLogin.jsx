import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  FaUserShield, FaLock, FaEnvelope, FaArrowRight, 
  FaEye, FaEyeSlash, FaShieldAlt 
} from "react-icons/fa";

function AdminLogin() {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/admin/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "ADMIN");
      navigate("/admin");
    } catch (error) {
      console.error("Admin Login failed", error);
      alert("Access Denied: Invalid Administrative Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      {/* Admin Card */}
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">
        
        {/* Professional Header - Admin Branding */}
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          {/* Subtle Shield Background Pattern */}
          <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
             <FaShieldAlt size={180} className="text-amber-500" />
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 border border-amber-500/30 rounded-2xl mb-4 shadow-xl">
            <FaUserShield className="text-amber-500 text-3xl" />
          </div>
          <h2 className="text-white text-3xl font-black tracking-tight">Admin Portal</h2>
          <p className="text-amber-500 text-[10px] uppercase tracking-[0.3em] mt-2 font-black">Management Authorization Required</p>
        </div>

        {/* Form Section */}
        <div className="p-10 space-y-6">
          
          {/* Admin Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Admin Identifier</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="admin@luxemart.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-medium text-slate-700"
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Admin Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Key</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all font-medium text-slate-700"
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button 
              onClick={login}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-slate-300 active:scale-[0.98]"
            >
              System Login <FaArrowRight className="text-amber-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Safety Warning */}
          <div className="pt-2 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
             <FaShieldAlt className="text-amber-600 mt-0.5 flex-shrink-0" size={14} />
             <p className="text-[9px] text-amber-800 font-bold leading-relaxed uppercase tracking-wider">
               Unauthorized access attempts are logged and monitored via secure IP tracking.
             </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="p-6 text-center border-t border-slate-50">
          <button 
            onClick={() => navigate("/")} 
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;