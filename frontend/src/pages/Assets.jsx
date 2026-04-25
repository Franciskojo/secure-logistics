import { useEffect, useState } from 'react';
import api from '../services/api';

const INITIAL_FORM = {
  name: '',
  type: 'gold',
  description: '',
  value: '',
  currency: 'USD',
  client: '',
  securityLevel: 'high',
  locationNote: '',
};

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [clients, setClients] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const openModal = async () => {
    setError('');
    setSuccess('');
    setForm(INITIAL_FORM);
    setShowModal(true);
    try {
      const res = await api.get('/clients?limit=200');
      setClients(res.data.data || []);
    } catch {
      setClients([]);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/assets', {
        ...form,
        value: Number(form.value),
      });
      setSuccess('Asset registered successfully.');
      fetchAssets(page);
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to register asset. Please check your inputs.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Asset Registry</h2>
          <p className="text-zinc-500 text-sm mt-1">Inventory management for high-value physical commodities.</p>
        </div>
        <button
          onClick={openModal}
          className="bg-[#BAAB48] text-black px-8 py-3 font-bold uppercase tracking-widest text-[11px] hover:bg-[#d4c452] transition-all"
        >
          + Register New Asset
        </button>
      </div>

      {/* Table */}
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
            {assets.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-zinc-600 text-sm uppercase tracking-widest">
                  No assets registered.
                </td>
              </tr>
            )}
            {assets.map((asset) => (
              <tr key={asset._id} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-10 bg-[#BAAB48]"></div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">{asset.name}</span>
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">
                        Security Level: {asset.securityLevel}
                      </span>
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-8 py-3 bg-transparent border border-[#333] text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white hover:border-white transition-all disabled:opacity-30"
        >
          Previous Dossier
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
          Tier {pagination.page || 1} // Total Tiers {pagination.pages || 1}
        </span>
        <button
          disabled={page === pagination.pages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-8 py-3 bg-transparent border border-[#333] text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white hover:border-white transition-all disabled:opacity-30"
        >
          Next Dossier
        </button>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-[#111] border border-[#2a2a2a] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#222]">
              <div>
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">Register New Asset</h3>
                <p className="text-zinc-600 text-[11px] mt-1 uppercase tracking-widest">
                  High-value commodity intake form
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-zinc-600 hover:text-white text-xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Asset Name */}
              <FormField label="Asset Name *">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Blue Diamond Set"
                  className={inputClass}
                />
              </FormField>

              {/* Type + Security Level */}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Classification *">
                  <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                    <option value="gold">Gold</option>
                    <option value="diamond">Diamond</option>
                    <option value="art">Art</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>
                <FormField label="Security Level">
                  <select name="securityLevel" value={form.securityLevel} onChange={handleChange} className={inputClass}>
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </FormField>
              </div>

              {/* Value + Currency */}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Valuation *">
                  <input
                    name="value"
                    type="number"
                    min="0"
                    value={form.value}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 500000"
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Currency">
                  <select name="currency" value={form.currency} onChange={handleChange} className={inputClass}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="GHS">GHS</option>
                  </select>
                </FormField>
              </div>

              {/* Client */}
              <FormField label="Consignor (Client) *">
                <select
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">— Select Client —</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.companyName} ({c.email})
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Description */}
              <FormField label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detailed description of the asset..."
                  className={`${inputClass} resize-none`}
                />
              </FormField>

              {/* Location Note */}
              <FormField label="Location Note">
                <input
                  name="locationNote"
                  value={form.locationNote}
                  onChange={handleChange}
                  placeholder="e.g. Vault B, Section 3"
                  className={inputClass}
                />
              </FormField>

              {/* Feedback */}
              {error && (
                <p className="text-red-400 text-[11px] uppercase tracking-widest border border-red-400/30 bg-red-400/5 px-4 py-3">
                  ⚠ {error}
                </p>
              )}
              {success && (
                <p className="text-[#BAAB48] text-[11px] uppercase tracking-widest border border-[#BAAB48]/30 bg-[#BAAB48]/5 px-4 py-3">
                  ✓ {success}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 border border-[#333] text-zinc-500 font-bold uppercase tracking-widest text-[11px] hover:text-white hover:border-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#BAAB48] text-black font-bold uppercase tracking-widest text-[11px] hover:bg-[#d4c452] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  'w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white text-sm px-4 py-3 focus:outline-none focus:border-[#BAAB48] transition-colors placeholder-zinc-700';

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</label>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    stored: { label: 'In Depository', style: 'border-[#BAAB48]/40 text-[#BAAB48] bg-[#BAAB48]/5' },
    in_transit: { label: 'In Transit', style: 'border-blue-500/40 text-blue-400 bg-blue-500/5' },
    vaulted: { label: 'Secured in Vault', style: 'border-purple-500/40 text-purple-400 bg-purple-500/5' },
    delivered: { label: 'Final Delivery', style: 'border-green-500/40 text-green-400 bg-green-500/5' },
  };
  const config = configs[status] || configs.stored;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.style}`}>
      {config.label}
    </span>
  );
}