import { useState } from 'react';
import { X, Lock, Mail, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      login(email, name);
      toast.success(`Welcome, ${name}! 🎬`, { theme: "dark" });
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111] border border-red-900/50 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="text-[#ff0033] h-5 w-5" />
            Sign In to Continue
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <UserCircle className="h-4 w-4" /> Full Name
            </label>
            <input 
              required 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors" 
              placeholder="e.g. Ashish Kumar" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Address
            </label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4" /> Secure Password
            </label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="w-full bg-[#ff0033] hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-transform hover:scale-105 shadow-lg shadow-red-900/20 cursor-pointer mt-2">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}

