import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { socket } from '../sockets/socket';

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [newShipment, setNewShipment] = useState({
    origin: '',
    destination: '',
    securityLevel: 'high',
    assets: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShipments();

    socket.on('shipmentUpdated', update => {
      setShipments(prev =>
        prev.map(s =>
          s._id === update.id
            ? { ...s, status: update.status, currentLocation: update.location }
            : s
        )
      );
    });

    return () => socket.off('shipmentUpdated');
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await api.get('/shipments');
      setShipments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailableAssets = async () => {
    try {
      const res = await api.get('/assets?status=stored');
      // Adjusting based on how the backend returns assets, assuming res.data.data
      setAvailableAssets(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    if (newShipment.assets.length === 0) return alert('Select at least one asset');
    
    setLoading(true);
    try {
      await api.post('/shipments', newShipment);
      setShowModal(false);
      setNewShipment({ origin: '', destination: '', securityLevel: 'high', assets: [] });
      fetchShipments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  const toggleAssetSelection = (assetId) => {
    setNewShipment(prev => ({
      ...prev,
      assets: prev.assets.includes(assetId)
        ? prev.assets.filter(id => id !== assetId)
        : [...prev.assets, assetId]
    }));
  };

  const handleUpdateStatus = async (shipmentId, newStatus) => {
    if (!window.confirm(`Confirm protocol transition to ${newStatus.toUpperCase()}?`)) return;
    
    setLoading(true);
    try {
      await api.patch(`/shipments/${shipmentId}/status`, { status: newStatus });
      fetchShipments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async (shipmentId) => {
    const newLocation = window.prompt('Enter updated Current Location:');
    if (!newLocation) return;

    setLoading(true);
    try {
      await api.patch(`/shipments/${shipmentId}/location`, { location: newLocation });
      fetchShipments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Logistics Management</h2>
          <p className="text-zinc-500 text-sm mt-1">Global cargo movement and secure transit tracking.</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); fetchAvailableAssets(); }}
          className="bg-[#BAAB48] hover:bg-white text-[#111] px-8 py-3 font-bold uppercase tracking-widest text-[11px] transition-all flex items-center gap-2"
        >
          <span className="text-lg">+</span> Initialize Shipment
        </button>
      </div>

      <div className="bg-[#111] border border-[#222] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1a1a1a] text-[#BAAB48] text-[10px] uppercase tracking-[0.2em] border-b border-[#222]">
              <th className="p-6">Tracking Ref</th>
              <th>Status</th>
              <th>Route (Origin &gt; Dest)</th>
              <th>Current Location</th>
              <th className="text-right pr-6">Protocol Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {shipments.map(s => (
              <tr key={s._id} className="hover:bg-white/5 transition-colors group">
                <td className="p-6 font-mono text-white text-sm">
                   <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span>{s.trackingCode}</span>
                        <Link 
                          to={`/waybill/${s.trackingCode}`} 
                          target="_blank"
                          className="text-[#BAAB48] hover:text-white transition-all p-1"
                          title="View Official Waybill"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </Link>
                      </div>
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Ref 0x{s._id.slice(-6).toUpperCase()}</span>
                   </div>
                </td>
                <td>
                   <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                     s.status === 'in_transit' ? 'border-blue-500/50 text-blue-400 bg-blue-500/5' :
                     s.status === 'arrived' ? 'border-[#BAAB48]/50 text-[#BAAB48] bg-[#BAAB48]/5' :
                     s.status === 'completed' ? 'border-green-500/50 text-green-400 bg-green-500/5' :
                     'border-zinc-700 text-zinc-500 bg-zinc-900/50'
                   }`}>
                     {s.status.replace('_', ' ')}
                   </span>
                </td>
                <td className="text-zinc-600 text-sm font-medium">
                   <span className="text-zinc-700 mr-2">{s.origin}</span>
                   <span className="text-[#BAAB48]">→</span>
                   <span className="text-white ml-2 font-bold">{s.destination}</span>
                </td>
                <td className="text-[#BAAB48] text-sm italic group-hover:text-white transition-colors">
                   <div className="flex items-center gap-3">
                      <span>{s.currentLocation}</span>
                      {s.status !== 'completed' && (
                        <button 
                          onClick={() => handleUpdateLocation(s._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#BAAB48] hover:text-[#111] transition-all rounded"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                      )}
                   </div>
                </td>
                <td className="text-right pr-6">
                   <div className="flex justify-end gap-2">
                      {s.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(s._id, 'in_transit')}
                          className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                        >
                          Dispatch
                        </button>
                      )}
                      {s.status === 'in_transit' && (
                        <button 
                          onClick={() => handleUpdateStatus(s._id, 'arrived')}
                          className="bg-[#BAAB48]/10 border border-[#BAAB48]/30 text-[#BAAB48] px-4 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-[#BAAB48] hover:text-[#111] transition-all"
                        >
                          Mark Arrived
                        </button>
                      )}
                      {s.status === 'arrived' && (
                        <button 
                          onClick={() => handleUpdateStatus(s._id, 'completed')}
                          className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all"
                        >
                          Finalize
                        </button>
                      )}
                      {s.status === 'completed' && (
                         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Protocol Sealed</span>
                      )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#222] max-w-2xl w-full p-10 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white"
            >
              <span className="text-2xl">×</span>
            </button>

            <div className="mb-10 text-center">
               <h3 className="text-[#BAAB48] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Tactical Operations</h3>
               <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Create New Shipment</h2>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2 block">Point of Origin</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Zurich Hub"
                      className="w-full bg-[#1a1a1a] border border-[#333] text-white p-4 text-sm outline-none focus:border-[#BAAB48] transition-colors"
                      value={newShipment.origin}
                      onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2 block">Final Destination</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Accra Vault"
                      className="w-full bg-[#1a1a1a] border border-[#333] text-white p-4 text-sm outline-none focus:border-[#BAAB48] transition-colors"
                      value={newShipment.destination}
                      onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                      required
                    />
                  </div>
               </div>

               <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2 block">Select Assets to Transport</label>
                 <div className="max-h-[200px] overflow-y-auto border border-[#222] bg-[#161616] p-4 divide-y divide-[#222]">
                    {availableAssets.length === 0 ? (
                      <p className="text-zinc-600 text-xs py-4 text-center">No available assets in storage.</p>
                    ) : (
                      availableAssets.map(asset => (
                        <div 
                          key={asset._id} 
                          onClick={() => toggleAssetSelection(asset._id)}
                          className={`flex justify-between items-center py-4 cursor-pointer hover:bg-white/5 px-2 transition-colors ${newShipment.assets.includes(asset._id) ? 'bg-[#BAAB48]/10' : ''}`}
                        >
                           <div>
                              <p className="text-white text-sm font-bold">{asset.name}</p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{asset.type} // {asset.value} {asset.currency}</p>
                           </div>
                           <div className={`w-5 h-5 border flex items-center justify-center ${newShipment.assets.includes(asset._id) ? 'bg-[#BAAB48] border-[#BAAB48]' : 'border-[#333]'}`}>
                              {newShipment.assets.includes(asset._id) && <span className="text-black text-[10px] font-bold">✓</span>}
                           </div>
                        </div>
                      ))
                    )}
                 </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-[#333] text-zinc-500 py-4 font-bold uppercase tracking-widest text-[11px] hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#BAAB48] hover:bg-white text-[#111] py-4 font-bold uppercase tracking-widest text-[11px] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Initializing...' : 'Confirm Shipment'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}