import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#111] text-white min-h-screen font-sans selection:bg-[#BAAB48]/30">
      
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#111]/90 backdrop-blur-md border-b border-zinc-900 py-4 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-serif font-black tracking-widest uppercase text-white">
              Secure<span className="text-zinc-500">Logix</span>
            </h1>
          </Link>
          <div className="flex gap-4">
            <Link to="/services" className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#BAAB48] py-3 transition-colors hidden sm:block mr-4">
              Our Services
            </Link>
            <Link to="/" className="text-[10px] font-bold border border-white/20 px-6 py-3 uppercase tracking-widest text-[#BAAB48] hover:bg-white hover:text-black transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="relative pt-40 pb-32 px-6 text-center border-b border-[#222]">
        <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Corporate Intelligence</h3>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white mb-6">About SecureLogix</h1>
        <p className="text-[#A9A9A9] max-w-3xl mx-auto text-lg leading-relaxed">
          Pioneering the intersection of elite logistical security, precision vaulting, and private operational transport since our inception. We deliver uncompromising absolute peace of mind.
        </p>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto py-24 px-6 space-y-32">
        
        {/* The Mission */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">The Mission</h3>
            <h2 className="text-4xl font-bold uppercase tracking-tighter text-white mb-6">Global Scale. <br/> Micro Precision.</h2>
            <p className="text-[#A9A9A9] text-base leading-relaxed mb-6">
              SecureLogix provides the luxury goods industry, high-net worth individuals, and international banks with a global team of experts. Our professionals are drawn from the apex of supply chain management, elite security task forces, and highly specialized customs houses.
            </p>
            <p className="text-[#A9A9A9] text-base leading-relaxed">
              We do not rely on third-party frameworks. We own and operate our infrastructure securely, enabling absolute opacity for our clients and tax-friendly routing through the world's most vital Free Trade Zones.
            </p>
          </div>
          <div className="aspect-square bg-[#070707] border border-[#222] relative overflow-hidden flex items-center justify-center p-12">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#BAAB48]/10 to-transparent"></div>
            <div className="border border-[#333] w-full h-full relative z-10 flex items-center justify-center">
               <h1 className="text-4xl text-[#333] font-serif uppercase tracking-widest">Trust</h1>
            </div>
          </div>
        </section>

        {/* Our History / Global Network */}
        <section className="border-t border-[#222] pt-32 grid md:grid-cols-3 gap-12">
           <div className="md:col-span-1">
             <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">A History of Excellence</h3>
             <h2 className="text-3xl font-bold uppercase tracking-tighter text-white mb-6">Decades of Proven Security</h2>
           </div>
           <div className="md:col-span-2 space-y-8">
             <p className="text-[#A9A9A9] text-lg leading-relaxed">
               What started as a boutique private guarding firm has organically evolved into an international powerhouse. Expanding from physical guarding and specialized jet escorts into advanced Digital Asset cold storage architectures.
             </p>
             <p className="text-[#A9A9A9] text-lg leading-relaxed">
               Today, our global network spans across North America, Europe, Asia, Africa, and Oceania. We serve the most prestigious auction houses, coordinate massive travelling museum exhibitions, and silently transport sovereign assets with a flawless track record.
             </p>
             <div className="pt-8">
                <Link to="/login" className="inline-block px-10 py-5 bg-[#BAAB48] text-[#111] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors cursor-pointer">
                  Join Our Roster
                </Link>
             </div>
           </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="bg-[#070707] py-12 border-t border-[#333]">
        <div className="max-w-[1600px] mx-auto px-6 text-center flex flex-col items-center">
           <h1 className="text-xl md:text-2xl font-serif font-black tracking-widest uppercase text-white mb-10">
              Secure<span className="text-[#A9A9A9]">Logix</span>
            </h1>
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#666]">
            © {new Date().getFullYear()} SECURELOGIX. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

    </div>
  );
}
