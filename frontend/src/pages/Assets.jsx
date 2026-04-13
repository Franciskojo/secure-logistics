import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAssets(page);
  }, [page]);

  const fetchAssets = async (pageNum) => {
    try {
      const res = await api.get(`/assets?page=${pageNum}&limit=10`);
      setAssets(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Asset Registry</h2>
          <p className="text-zinc-500 text-sm mt-1">Inventory management for high-value physical commodities.</p>
        </div>
        <button className="bg-white/5 border border-[#333] text-zinc-400 px-8 py-3 font-bold uppercase tracking-widest text-[11px] hover:text-white hover:border-white transition-all cursor-not-allowed">
          Register New Asset
        </button>
      </div>

      <div className="bg-[#111] border border-[#222] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1a1a1a] text-[#BAAB48] text-[10px] uppercase tracking-[0.2em] border-b border-[#222]">
              <th className="p-6">Asset Name</th>
              <th>Classification</th>
              <th>Valuation</th>
              <th>Operational Status</th>
              <th>Consignor</th>
              <th>Vault Ref</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#222]">
            {assets.map(asset => (
              <tr key={asset._id} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-10 bg-[#BAAB48]"></div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">{asset.name}</span>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Security Level: {asset.securityLevel}</span>
                      </div>
                   </div>
                </td>

                <td className="capitalize text-zinc-400 text-sm">{asset.type}</td>

                <td className="text-white font-mono text-sm font-bold">
                  {asset.value.toLocaleString()} {asset.currency}
                </td>

                <td>
                  <StatusBadge status={asset.status} />
                </td>

                <td className="text-zinc-400 text-sm font-medium">
                  {asset.client?.companyName || 'Private Client'}
                </td>

                <td className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  {asset.trackingCode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
          className="px-8 py-3 bg-transparent border border-[#333] text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white hover:border-white transition-all disabled:opacity-30"
        >
          Previous Dossier
        </button>

        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
          Tier {pagination.page || 1} // Total Tiers {pagination.pages || 1}
        </span>

        <button
          disabled={page === pagination.pages}
          onClick={() => setPage(prev => prev + 1)}
          className="px-8 py-3 bg-transparent border border-[#333] text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white hover:border-white transition-all disabled:opacity-30"
        >
          Next Dossier
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    stored: { label: 'In Depository', style: 'border-[#BAAB48]/40 text-[#BAAB48] bg-[#BAAB48]/5' },
    in_transit: { label: 'In Transit', style: 'border-blue-500/40 text-blue-400 bg-blue-500/5' },
    vaulted: { label: 'Secured in Vault', style: 'border-purple-500/40 text-purple-400 bg-purple-500/5' },
    delivered: { label: 'Final Delivery', style: 'border-green-500/40 text-green-400 bg-green-500/5' }
  };

  const config = configs[status] || configs.stored;

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.style}`}>
      {config.label}
    </span>
  );
}