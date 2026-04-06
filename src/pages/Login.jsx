import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, Shield, ArrowRight } from 'lucide-react';
import loginBg from '../assets/login_bg.png';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* <img
          src={loginBg}
          alt="Background"
          className="w-full h-full object-cover opacity-[0.03] scale-110"
        /> */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-100/50"></div>
      </div>

      {/* Floating Decorative Blur */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 p-8 transition-all duration-500">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 mb-4 group hover:scale-110 transition-transform duration-500">
              <Shield className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-black text-slate-900 uppercase mb-1 flex items-center justify-center gap-[10px]">
              <span>Sherla</span>
              <span>Properties</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Command Center Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-300 placeholder:text-slate-300"
                    placeholder="admin@antigravity.io"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-end mb-2 px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Password</label>
                  {/* <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-slate-900 transition-colors">Forgot?</button> */}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-300 placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="flex items-center py-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-5 h-5 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-primary peer-checked:border-primary transition-all shadow-sm flex items-center justify-center">
                  <CheckSquare size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Remember Session</span>
              </label>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="size-fit mx-auto bg-primary text-white py-4 px-10 rounded-2xl text-xs font-black uppercase  shadow-xl shadow-primary/20 active:translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Login <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* <p className="mt-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            Authorized Personnel Only
          </p> */}
        </div>

        {/* Global Details */}
        <div className="mt-8 flex justify-center items-center gap-6 opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Globe size={12} /> NODE-GLOBAL
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Shield size={12} /> SECURE GATEWAY
          </span>
        </div>
      </div>
    </div>
  );
}

function CheckSquare({ size, className, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
