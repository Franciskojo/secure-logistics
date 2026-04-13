import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function WaybillPage() {
  const { trackingCode } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaybillData = async () => {
      try {
        const res = await api.get(`/shipments/track/${trackingCode}`);
        setShipment(res.data.data);
      } catch (err) {
        console.error('Failed to fetch waybill:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWaybillData();
  }, [trackingCode]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono uppercase tracking-widest text-zinc-400">
      Generating Secure Waybill...
    </div>
  );

  if (!shipment) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono text-red-500">
      UNAUTHORIZED ACCESS - DOCUMENT NOT FOUND
    </div>
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-10 px-4 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl p-12 relative overflow-hidden print:shadow-none print:max-w-none">
        
        {/* SECURE SEAL WATERMARK (Visual only) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-12 pointer-events-none opacity-[0.03]">
           <h1 className="text-[12rem] font-black uppercase tracking-widest">SECURELOGIX</h1>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-widest uppercase text-black">
              Secure<span className="text-zinc-500">Logix</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mt-2">Global High-Value Logistics Protocol</p>
          </div>
          <div className="text-right">
             <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Waybill / Bill of Lading</h2>
             <p className="text-sm font-mono font-bold mt-1">Ref: {shipment.trackingCode}</p>
             <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* CORE DETAILS */}
        <div className="grid grid-cols-2 gap-12 mb-12">
           <div className="space-y-6">
              <div>
                 <h3 className="text-[11px] font-black uppercase underline tracking-widest mb-2">Consignor / Origin</h3>
                 <p className="font-bold text-lg">{shipment.origin}</p>
                 <p className="text-sm text-zinc-500 leading-relaxed mt-1">
                    SecureLogix Transit Hub<br/>
                    Verified Security Zone Alpha-1
                 </p>
              </div>
              <div>
                 <h3 className="text-[11px] font-black uppercase underline tracking-widest mb-2">Consignee / Destination</h3>
                 <p className="font-bold text-lg">{shipment.destination}</p>
                 <p className="text-sm text-zinc-500 leading-relaxed mt-1">
                    Customer Specified Secure Terminal
                 </p>
              </div>
           </div>

           <div className="bg-zinc-50 p-6 border border-zinc-200">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-[#BAAB48]">Protocol Specifications</h3>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="font-bold text-zinc-500">Service Class:</span>
                    <span className="font-bold uppercase">Express Secure</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="font-bold text-zinc-500">Security Tier:</span>
                    <span className="font-bold uppercase text-[#BAAB48]">{shipment.securityLevel}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="font-bold text-zinc-500">Status:</span>
                    <span className="font-bold uppercase">{shipment.status}</span>
                 </div>
              </div>

              {/* FUNCTIONAL QR CODE */}
              <div className="mt-8 flex flex-col items-center">
                 <div className="p-2 bg-white border border-zinc-200">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/?track=' + shipment.trackingCode)}`} 
                      alt="Shipment QR Code" 
                      className="w-24 h-24"
                    />
                 </div>
                 <p className="text-[8px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Digital Verification Key</p>
              </div>
           </div>
        </div>

        {/* MANIFEST TABLE */}
        <div className="mb-12">
           <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Shipment Manifest (Declared Assets)</h3>
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white text-[10px] uppercase tracking-widest font-bold">
                   <th className="p-3 border-r border-zinc-800">Item Registry ID</th>
                   <th className="p-3 border-r border-zinc-800">Description</th>
                   <th className="p-3 border-r border-zinc-800">Class</th>
                   <th className="p-3 text-right">Declared Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 border-b border-zinc-200">
                 {shipment.assets && shipment.assets.length > 0 ? (
                   shipment.assets.map((asset, idx) => (
                      <tr key={idx} className="text-sm font-medium">
                        <td className="p-4 font-mono text-xs">{asset.trackingCode}</td>
                        <td className="p-4">{asset.name} - {asset.description}</td>
                        <td className="p-4 capitalize">{asset.type}</td>
                        <td className="p-4 text-right font-bold">{asset.value.toLocaleString()} {asset.currency}</td>
                      </tr>
                   ))
                 ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-zinc-400 italic">No detailed manifest data provided for this protocol.</td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* SIGNATURES */}
        <div className="grid grid-cols-2 gap-20 pt-10 border-t border-zinc-200 mt-20">
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 underline">Authorized Dispatcher</p>
              <div className="border-b border-black pb-2 italic text-zinc-400">
                 Digitally Signed: SecureLogix Protocol {shipment._id.slice(-4)}
              </div>
           </div>
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 underline">Receiving Authority</p>
              <div className="border-b border-zinc-300 pb-2 text-zinc-200">
                 ____________________________________
              </div>
           </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-20 text-center">
           <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-300">
              Terms & Conditions Apply // Verified High-Value Secure Transit Protocol // Carrier: SecureLogix Global
           </p>
        </div>

        {/* FLOATING ACTION BUTTON - HIDDEN ON PRINT */}
        <div className="fixed bottom-10 right-10 flex gap-4 print:hidden">
           <Link to="/shipments" className="bg-[#111] text-white px-8 py-4 font-bold uppercase tracking-widest text-[11px] shadow-2xl hover:bg-zinc-800 transition-all flex items-center gap-2">
              Back to Logistics
           </Link>
           <button onClick={handlePrint} className="bg-[#BAAB48] text-[#111] px-8 py-4 font-bold uppercase tracking-widest text-[11px] shadow-2xl hover:bg-white transition-all flex items-center gap-2 font-black">
             Print Official Waybill
           </button>
        </div>

      </div>
    </div>
  );
}
