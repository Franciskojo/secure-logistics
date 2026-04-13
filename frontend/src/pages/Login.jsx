import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] font-sans selection:bg-[#BAAB48]/30 px-6">
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <h1 className="text-2xl md:text-3xl font-serif font-black tracking-widest uppercase text-white">
          Secure<span className="text-zinc-500">Logix</span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111] border border-[#222] p-10 md:p-12 shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#BAAB48] to-transparent"></div>

        <div className="text-center mb-10">
          <h3 className="text-[#BAAB48] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Authorized Personnel Only</h3>
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">
            Access Portal
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-2 block">Corporate Identity</label>
            <input
              type="email"
              placeholder="admin@securelogix.com"
              className="w-full bg-[#1c1c1c] border border-[#333] text-white p-4 text-sm outline-none focus:border-[#BAAB48] transition-colors"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-2 block">Security Credential</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#1c1c1c] border border-[#333] text-white p-4 text-sm outline-none focus:border-[#BAAB48] transition-colors"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <button className="w-full bg-[#BAAB48] hover:bg-white text-[#111] p-4 font-bold uppercase tracking-widest text-[11px] transition-all duration-300 mt-4 shadow-[0_10px_20px_rgba(186,171,72,0.1)]">
            Open Secure Session
          </button>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] hover:text-white transition-colors">
            Exit to Public Site
          </a>
        </div>
      </form>
    </div>
  );
}