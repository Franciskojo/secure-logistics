import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Oversight', path: '/dashboard', icon: '📊' },
    { name: 'Asset Registry', path: '/assets', icon: '💎' },
    { name: 'Secure Vaults', path: '/vaults', icon: '🔒' },
    { name: 'Logistics', path: '/shipments', icon: '📦' },
  ];

  return (
    <div className="w-72 bg-[#111] border-r border-[#222] flex flex-col h-full">
      <div className="p-8 border-b border-[#222]">
        <Link to="/" className="flex flex-col">
          <span className="text-xl font-serif font-black tracking-widest uppercase text-white leading-none">Secure</span>
          <span className="text-xl font-serif font-black tracking-widest uppercase text-zinc-500 leading-none mt-1">Logix</span>
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6 px-4">Command Center</p>
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-4 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
              location.pathname === item.path 
                ? 'bg-[#BAAB48] text-[#111] shadow-[0_5px_15px_rgba(186,171,72,0.2)]' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-8 border-t border-[#222]">
         <div className="bg-[#1a1a1a] p-4 border border-[#333] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#BAAB48] flex items-center justify-center font-bold text-[#111] text-xs">SA</div>
            <div>
               <p className="text-[9px] font-bold uppercase tracking-widest text-[#BAAB48]">Administrator</p>
               <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">admin@securelogix.com</p>
            </div>
         </div>
      </div>
    </div>
  );
}