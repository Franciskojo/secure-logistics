import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <div className="bg-[#111] border-b border-[#222] p-6 flex justify-between items-center h-24">
      <div className="flex items-center gap-10">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BAAB48]">System Secure</span>
         </div>
         <div className="hidden md:flex gap-6">
            <div className="h-10 w-[1px] bg-[#222]"></div>
            <div className="flex flex-col justify-center">
               <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Session Protocol</p>
               <p className="text-xs font-mono text-zinc-400">0X-{Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
         </div>
      </div>

      <button
        onClick={logout}
        className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 transition-colors border border-[#333] px-6 py-2 hover:border-red-500/30"
      >
        Terminate Session
      </button>
    </div>
  );
}