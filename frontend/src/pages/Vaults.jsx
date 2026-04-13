import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Vaults() {
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    fetchVaults();
  }, []);

  const fetchVaults = async () => {
    try {
      const res = await api.get('/vaults');
      setVaults(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vaults</h2>

      <div className="grid gap-6">
        {vaults.map(vault => (
          <VaultCard key={vault._id} vault={vault} />
        ))}
      </div>
    </div>
  );
}


// ========================
// VAULT CARD
// ========================
function VaultCard({ vault }) {
  const utilization = Math.round(
    (vault.currentLoad / vault.capacity) * 100
  );

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold">{vault.name}</h3>
          <p className="text-gray-500 text-sm">{vault.location}</p>
        </div>

        <SecurityBadge level={vault.securityLevel} />
      </div>

      {/* CAPACITY */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">
          Capacity: {vault.currentLoad} / {vault.capacity}
        </p>

        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="bg-blue-500 h-3 rounded-full"
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>

      {/* ASSETS */}
      <div>
        <h4 className="font-medium mb-2">Assets</h4>

        {vault.assets?.length === 0 ? (
          <p className="text-gray-400 text-sm">No assets</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {vault.assets.map(asset => (
              <li
                key={asset._id}
                className="flex justify-between border-b py-1"
              >
                <span>{asset.name}</span>
                <span className="text-gray-500">
                  {asset.trackingCode}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


// ========================
// SECURITY BADGE
// ========================
function SecurityBadge({ level }) {
  const styles = {
    high: 'bg-yellow-400 text-black',
    ultra: 'bg-red-500 text-white'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${styles[level]}`}>
      {level}
    </span>
  );
}