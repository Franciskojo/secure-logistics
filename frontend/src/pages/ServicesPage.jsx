import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const servicesList = [
  { 
    id: 'diamonds',
    title: "Diamonds & Jewellery", 
    subtitle: "Absolute Secure Delivery",
    desc: "We provide the diamonds and jewellery industry with unparalleled secure transport, third-party logistics, customs brokerage, and highly secure storage facilities globally. Protect your highest value commodities across borders without friction.",
    video: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68eed8029cb2ef395f314b_diamonds2-transcode.mp4",
    poster: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68eed8029cb2ef395f314b_diamonds2-poster-00001.jpg"
  },
  { 
    id: 'metals',
    title: "Precious Metals", 
    subtitle: "Heavy Asset Protection",
    desc: "Offering full door-to-door, highly secure transport of precious metals, coins, and bullion. We operate state-of-the-art precious metal vaulting facilities globally, trusted by central banks and institutional investors.",
    video: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68eee6029cb277125f318a_metals2-transcode.mp4",
    poster: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68eee6029cb277125f318a_metals2-poster-00001.jpg"
  },
  { 
    id: 'art',
    title: "Fine Art Global", 
    subtitle: "Priceless Heritage Logistics",
    desc: "A boutique approach to fine art logistics. We coordinate museum travelling exhibitions, prestigious gallery transfers, and provide white-glove private collection transport with active climate control monitoring.",
    video: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/618a922ad08b29131be39e27_New fine art-transcode.mp4",
    poster: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/618a922ad08b29131be39e27_New fine art-poster-00001.jpg"
  },
  { 
    id: 'vaults',
    title: "Vaulting Facilities", 
    subtitle: "Global Ultra-Vault Network",
    desc: "Our exclusive global vaulting network grants clients uncompromising security. Strategically situated within Free Trade Zones worldwide, enabling tax-friendly transit, secure viewing rooms, and unyielding confidentiality.",
    video: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68ef03029cb26f945f31a7_vault2-transcode.mp4",
    poster: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68ef03029cb26f945f31a7_vault2-poster-00001.jpg"
  },
  { 
    id: 'special',
    title: "Special Operations", 
    subtitle: "Strategic Armed Escorts",
    desc: "From heavily armed tactical guarding escorts to complex logistical challenges involving the movement of extremely high-value assets securely over heavily regulated borders and conflict zones. We handle the impossible.",
    video: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68ee525d863286538e69e0_spec-transcode.mp4",
    poster: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68ee525d863286538e69e0_spec-poster-00001.jpg"
  },
  { 
    id: 'tech',
    title: "Technology Services", 
    subtitle: "Precision Tracking Systems",
    desc: "Integrating state-of-the-art IoT asset tracking and digital twin technology. We don't just ship your assets; we monitor live environmental data, shock parameters, and GPS feeds globally 24/7.",
    video: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68ef0e45243048f0c46d12_tech2-transcode.mp4",
    poster: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d68ef0e45243048f0c46d12_tech2-poster-00001.jpg"
  },
  { 
    id: 'digital',
    title: "Digital Asset Services", 
    subtitle: "Institutional Cold Storage",
    desc: "Next-generation institutional cold storage. Bridging the physical and digital, we secure cryptographic private keys and highly specialized ledger infrastructure inside physical deep-storage military-grade bunkers.",
    video: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/6183c6e43697fccab01abebe_digital asset home page video-transcode.mp4",
    poster: "https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/6183c6e43697fccab01abebe_digital asset home page video-poster-00001.jpg"
  }
];

export default function ServicesPage() {
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
          <Link to="/" className="text-[10px] font-bold border border-white/20 px-6 py-3 uppercase tracking-widest text-[#BAAB48] hover:bg-white hover:text-black transition-colors">
            Return Home
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="relative pt-40 pb-20 px-6 text-center border-b border-[#222]">
        <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Divisions</h3>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white mb-6">Our Capabilities</h1>
        <p className="text-[#A9A9A9] max-w-2xl mx-auto text-lg leading-relaxed">
          Comprehensive logistics and secure vaulting provisions customized exclusively for high-net-worth 
          individuals, global banks, and institutional trade networks.
        </p>
      </div>

      {/* Services Alternating Layout */}
      <main className="max-w-[1600px] mx-auto pb-32">
        {servicesList.map((service, index) => {
          const isEven = index % 2 !== 0;

          return (
            <div 
              key={service.id} 
              id={service.id}
              className={`flex flex-col lg:flex-row items-center border-b border-[#222] ${isEven ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Media Block */}
              <div className="w-full lg:w-1/2 relative aspect-video lg:aspect-auto lg:h-[600px]">
                <video 
                   autoPlay 
                   loop 
                   muted 
                   playsInline 
                   className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80"
                   poster={service.poster}
                 >
                   <source src={service.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] lg:from-transparent to-transparent via-[#111]/30"></div>
              </div>

              {/* Text Block */}
              <div className="w-full lg:w-1/2 p-10 lg:p-24 flex flex-col justify-center">
                <span className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.3em] mb-6">
                  {String(index + 1).padStart(2, '0')} // {service.subtitle}
                </span>
                <h2 className="text-4xl lg:text-6xl font-bold uppercase tracking-tighter text-white mb-8 leading-[0.9]">
                  {service.title}
                </h2>
                <p className="text-[#A9A9A9] text-lg lg:text-xl font-light leading-relaxed mb-10">
                  {service.desc}
                </p>

                <div className="pt-2">
                  <Link to="/login" className="inline-block px-10 py-5 border border-white/20 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#BAAB48] hover:border-[#BAAB48] hover:text-[#111] transition-all cursor-pointer">
                    Initiate Request
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
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
