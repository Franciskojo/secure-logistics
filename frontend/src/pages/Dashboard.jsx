import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setStats(res.data.data);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Operational Oversight</h2>
        <p className="text-zinc-500 text-sm mt-1">Real-time status of global high-value asset movements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Assets" value={stats.totalAssets} icon="💎" />
        <StatCard title="Vaulted Inventory" value={stats.assetsInVault} icon="🔒" />
        <StatCard title="In Transit" value={stats.assetsInTransit} icon="✈️" />
        <StatCard title="Active Shipments" value={stats.activeShipments} icon="📦" />
      </div>

      {/* Decorative large logo background */}
      <div className="mt-32 opacity-5 flex flex-col items-center pointer-events-none select-none">
         <h1 className="text-[12rem] font-serif font-black tracking-widest uppercase text-white leading-none">
           Secure
         </h1>
         <h1 className="text-[12rem] font-serif font-black tracking-widest uppercase text-zinc-500 leading-none">
           Logix
         </h1>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#111] border border-[#222] p-8 shadow-xl relative overflow-hidden group hover:border-[#BAAB48]/50 transition-all duration-500">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
         <span className="text-4xl">{icon}</span>
      </div>
      <p className="text-[#BAAB48] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{title}</p>
      <h3 className="text-5xl font-black text-white tracking-tighter">{value || 0}</h3>
      <div className="w-10 h-1 bg-[#BAAB48] mt-6 group-hover:w-full transition-all duration-700"></div>
    </div>
  );
}