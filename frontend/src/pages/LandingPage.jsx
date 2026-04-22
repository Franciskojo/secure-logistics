import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LiveChat from '../components/chat/LiveChat';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackRef, setTrackRef] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackRef) return;
    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);
    try {
      const res = await api.get(`/shipments/track/${trackRef}`);
      if (res.data && res.data.success) {
        setTrackResult(res.data.data);
      }
    } catch (err) {
      setTrackError(err.response?.data?.message || 'Invalid Tracking Reference');
    } finally {
      setTrackLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess('');
    setContactError('');
    try {
      const res = await api.post('/contacts/submit', contactForm);
      if (res.data && res.data.success) {
        setContactSuccess(res.data.message);
        setContactForm({ firstName: '', lastName: '', email: '', message: '' });
      }
    } catch (err) {
      setContactError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // QR Code / URL Tracking Deep Link
    const params = new URLSearchParams(window.location.search);
    const trackingRef = params.get('track');
    if (trackingRef) {
      setTrackRef(trackingRef);
      // We need to trigger the search. Since handleTrackSubmit takes an e, 
      // we'll abstract the logic or call it manually.
      performAutoTrack(trackingRef);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const performAutoTrack = async (ref) => {
    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);
    try {
      const res = await api.get(`/shipments/track/${ref}`);
      if (res.data && res.data.success) {
        setTrackResult(res.data.data);
      }
    } catch (err) {
      setTrackError(err.response?.data?.message || 'Invalid Tracking Reference');
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div className="bg-[#111] text-white min-h-screen font-sans overflow-x-hidden selection:bg-[#BAAB48]/30">
      {/* Top Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#111] border-b border-zinc-900 py-4' : 'bg-gradient-to-b from-[#111]/90 to-transparent py-8'}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-serif font-black tracking-widest uppercase text-white">
              Secure<span className="text-zinc-500">Logix</span>
            </h1>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden xl:flex items-center space-x-8 text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#A9A9A9]">
            <a href="#services" className="hover:text-[#BAAB48] transition-colors">Services</a>
            <Link to="/about" className="hover:text-[#BAAB48] transition-colors">About Us</Link>
            <a href="#network" className="hover:text-[#BAAB48] transition-colors">Network</a>
            <a href="#contact" className="hover:text-[#BAAB48] transition-colors">Contact Us</a>
            
            {/* Track Shipment Form */}
            <form onSubmit={handleTrackSubmit} className="flex h-10 ml-4 group">
              <input 
                type="text" 
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Enter your shipping reference" 
                className="bg-[#222] border-y border-l border-white/10 text-white px-4 text-xs outline-none w-[220px] font-sans tracking-normal normal-case placeholder:text-[#666] focus:border-[#BAAB48]/50 transition-colors"
                required
              />
              <button 
                type="submit" 
                disabled={trackLoading}
                className="bg-transparent border border-white/20 text-white group-focus-within:border-[#BAAB48]/50 group-focus-within:bg-[#BAAB48] group-focus-within:text-[#111] hover:bg-[#BAAB48] hover:border-[#BAAB48] hover:text-[#111] transition-all px-6 font-bold uppercase tracking-widest text-[10px] disabled:opacity-50"
              >
                {trackLoading ? '...' : 'Track'}
              </button>
            </form>

            <Link to="/login" className="border border-[#777] px-6 py-2.5 hover:border-[#BAAB48] hover:text-[#BAAB48] text-white transition-all flex items-center">Client Portal</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden text-white flex items-center gap-4">
            <Link to="/login" className="text-[10px] font-bold border border-white/20 px-3 py-1.5 uppercase tracking-widest text-[#BAAB48]">Login</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none">
              <svg className="w-8 h-8 text-[#A9A9A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="square" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-[#111] border-b border-[#333] pb-8 pt-4 px-6 shadow-2xl flex flex-col space-y-4">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-white hover:text-[#BAAB48] py-2 border-b border-[#222]">Services</a>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-white hover:text-[#BAAB48] py-2 border-b border-[#222]">About Us</Link>
            <a href="#network" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-white hover:text-[#BAAB48] py-2 border-b border-[#222]">Network</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-white hover:text-[#BAAB48] py-2 border-b border-[#222]">Contact Us</a>
            
            <form onSubmit={handleTrackSubmit} className="flex h-12 w-full mt-4">
              <input 
                type="text" 
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Shipping reference" 
                className="bg-[#222] border border-white/10 text-white px-4 text-sm outline-none flex-grow font-sans tracking-normal normal-case placeholder:text-[#666] focus:border-[#BAAB48]"
                required
              />
              <button 
                type="submit" 
                disabled={trackLoading}
                className="bg-[#BAAB48] hover:bg-white text-[#111] px-6 font-bold uppercase tracking-widest text-[11px] transition-colors duration-300 disabled:opacity-50"
              >
                {trackLoading ? '...' : 'Track'}
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* TRACKING MODAL */}
      {(trackResult || trackError) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#333] max-w-lg w-full p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            <button 
              onClick={() => { setTrackResult(null); setTrackError(''); }}
              className="absolute top-4 right-4 text-[#A9A9A9] hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6">Tracking Information</h3>
            
            {trackError ? (
              <div className="text-red-500 font-bold tracking-widest text-sm bg-red-500/10 border border-red-500/20 p-4">
                {trackError}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-[#A9A9A9] text-xs uppercase tracking-widest mb-1">Status</p>
                  <p className="text-2xl font-black text-[#BAAB48] uppercase tracking-wider">{trackResult?.status?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-[#A9A9A9] text-xs uppercase tracking-widest mb-1">Current Location</p>
                  <p className="text-lg text-white font-medium">{trackResult?.currentLocation}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#333]">
                  <div>
                    <p className="text-[#A9A9A9] text-[10px] uppercase tracking-widest mb-1">Origin</p>
                    <p className="text-sm font-bold text-white">{trackResult?.origin}</p>
                  </div>
                  <div>
                    <p className="text-[#A9A9A9] text-[10px] uppercase tracking-widest mb-1">Destination</p>
                    <p className="text-sm font-bold text-white">{trackResult?.destination}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-screen w-full flex items-center justify-center">
        {/* Exact Hero Video from Malca-Amit site */}
        <div className="absolute inset-0 bg-[#070707] border-b border-zinc-900 overflow-hidden">
           <video 
             autoPlay 
             loop 
             muted 
             playsInline 
             className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80"
             poster="https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d6fc405ee72d91f83b36b6d_HERO AND ABOUT - compressed2-poster-00001.jpg"
           >
             <source src="https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/5d6fc405ee72d91f83b36b6d_HERO AND ABOUT - compressed2-transcode.mp4" type="video/mp4" />
           </video>
           <div className="absolute inset-0 bg-gradient-to-b from-[#111]/60 via-[#111]/30 to-[#111] z-10" />
        </div>

        <div className="relative z-20 text-center px-4 w-full max-w-7xl mt-20">
          {/* Malca-Amit exact text layout: DELIVERING (solid) ABSOLUTE (hollow) PEACE OF MIND (hollow) */}
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-bold uppercase tracking-tighter leading-none mb-6">
             <span className="block text-[#fff] mb-2 font-black tracking-normal">Delivering</span>
             <span className="block text-transparent [-webkit-text-stroke:1px_#ffffff] md:[-webkit-text-stroke:2px_#A9A9A9] mt-2 tracking-normal font-black">Absolute</span>
             <span className="block text-transparent [-webkit-text-stroke:1px_#ffffff] md:[-webkit-text-stroke:2px_#ffffff] mt-2 tracking-normal font-black">Peace of Mind</span>
          </h2>
          
          {/* Scroll Down Indicator */}
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center">
             <span className="text-[10px] uppercase tracking-widest text-[#BAAB48] mb-2 animate-bounce">Scroll</span>
             <div className="w-[1px] h-16 bg-gradient-to-b from-[#BAAB48] to-[#111]"></div>
          </div>
        </div>
      </div>

      {/* Intro / About text - exact matching */}
      <section id="about" className="py-24 md:py-40 bg-[#111] px-6 border-b border-[#222]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em] mb-10">About SecureLogix</h3>
          <p className="text-xl md:text-[28px] font-medium text-[#ccc] leading-tight md:leading-[1.4] tracking-tight">
            SecureLogix provides the luxury goods industry, high-net worth individuals and international banks with a global team of experts, including logistics, security, customs house and special operations professionals. SecureLogix provides a smooth, expedient and professional service tailored to precise specifications and needs.
          </p>
          <div className="mt-16">
            <Link to="/about" className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#BAAB48] border-b-2 border-[#BAAB48] pb-1 hover:text-white hover:border-white transition-all">Read More</Link>
          </div>
        </div>
      </section>

      {/* Services Section - Grid exactly matching Malca-Amit's exact videos */}
      <section id="services" className="bg-[#111] py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto text-center mb-16">
           <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em]">Our Global Services</h3>
           <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white mt-4">Uncompromising Solutions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-2">
          
          {[
            { title: "Diamonds & Jewellery", sub: "Explore Services", video: "5d68eed8029cb2ef395f314b_diamonds2-transcode.mp4", poster: "5d68eed8029cb2ef395f314b_diamonds2-poster-00001.jpg" },
            { title: "Precious Metals", sub: "Explore Services", video: "5d68eee6029cb277125f318a_metals2-transcode.mp4", poster: "5d68eee6029cb277125f318a_metals2-poster-00001.jpg" },
            { title: "Fine Art Global", sub: "Explore Services", video: "618a922ad08b29131be39e27_New fine art-transcode.mp4", poster: "618a922ad08b29131be39e27_New fine art-poster-00001.jpg" },
            { title: "Vaulting Facilities", sub: "Explore Services", video: "5d68ef03029cb26f945f31a7_vault2-transcode.mp4", poster: "5d68ef03029cb26f945f31a7_vault2-poster-00001.jpg" },
            { title: "Special Operations", sub: "Explore Services", video: "5d68ee525d863286538e69e0_spec-transcode.mp4", poster: "5d68ee525d863286538e69e0_spec-poster-00001.jpg" },
            { title: "Technology Services", sub: "Explore Services", video: "5d68ef0e45243048f0c46d12_tech2-transcode.mp4", poster: "5d68ef0e45243048f0c46d12_tech2-poster-00001.jpg" },
            { title: "Digital Asset Services", sub: "Explore Services", video: "6183c6e43697fccab01abebe_digital asset home page video-transcode.mp4", poster: "6183c6e43697fccab01abebe_digital asset home page video-poster-00001.jpg" }
          ].map((item, index) => (
            <Link to="/services" key={index} className={`group block relative aspect-[4/3] md:aspect-[3/2] bg-[#000] border-none overflow-hidden cursor-pointer ${index === 6 ? 'md:col-span-2 lg:col-span-3 aspect-video md:aspect-[21/9]' : ''}`}>
               <video 
                 autoPlay 
                 loop 
                 muted 
                 playsInline 
                 className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-80"
                 poster={`https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/${item.poster}`}
               >
                 <source src={`https://cdn.prod.website-files.com/5ce3e78374fe12ece8160ee5/${item.video}`} type="video/mp4" />
               </video>
               
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 z-10" />
               
               {/* Content */}
               <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8">
                 <h3 className="text-2xl md:text-[34px] leading-none font-bold uppercase tracking-tight text-white mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                   {item.title}
                 </h3>
                 <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BAAB48] opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 translate-y-2 transition-all duration-500">
                   {item.sub}
                 </span>
               </div>
            </Link>
          ))}
          
        </div>
      </section>

      {/* Feature Splitting like "Ultra Vault" and "Express Shipping" */}
      <section className="py-24 md:py-40 bg-[#111] px-6">
        <div className="max-w-[1600px] mx-auto">
           <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
             
             {/* Left - UltraVault style */}
             <div className="space-y-10 pl-0 lg:pl-12 border-l-0 lg:border-l border-[#333]">
               <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em]">To Safeguard Your Assets</h3>
               <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.9]">
                 The Diamond Class of <br/> Safe Depository Services
               </h2>
               <p className="text-[#A9A9A9] text-lg md:text-2xl font-light max-w-xl leading-snug">
                 State-of-the-art highly secured facilities outside of the traditional banking system. Providing uncompromising security and unyielding confidentiality.
               </p>
               <Link to="/services" className="inline-block px-10 py-5 border border-white/20 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all bg-white/5">
                 Read More
               </Link>
             </div>

             {/* Right - Express Shipping style */}
             <div className="space-y-10 pl-0 lg:pl-12 border-l-0 lg:border-l border-[#333] mt-20 lg:mt-0">
               <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em]">SecureLogix Express Shipping</h3>
               <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.9]">
                 Rapid Delivery <br/> Absolute Security
               </h2>
               <p className="text-[#A9A9A9] text-lg md:text-2xl font-light max-w-xl leading-snug">
                 Cost-effective shipping solution enabling the rapid delivery of lower and mid-value goods. Dedicated to customer excellence globally.
               </p>
               <Link to="/services" className="inline-block px-10 py-5 border border-white/20 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all bg-white/5">
                 Read More
               </Link>
             </div>

           </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section id="network" className="bg-[#111] border-t border-[#222] pt-32 pb-0 overflow-hidden relative">
        <div className="max-w-[1600px] mx-auto px-6 text-center z-20 relative">
          <h2 className="text-5xl md:text-[8rem] font-bold uppercase tracking-tighter leading-none mb-16 text-[#BAAB48]/10">Global Network</h2>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-widest text-[#BAAB48]">World Wide</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-16 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A9A9A9] mb-32 relative z-30">
            {['North America', 'Europe', 'Asia', 'Africa', 'Oceania'].map((continent) => (
              <span key={continent} className="group flex items-center gap-2 hover:text-[#BAAB48] cursor-pointer transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BAAB48] animate-pulse group-hover:scale-150 transition-transform"></span>
                {continent}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#111] border-t border-[#222] py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-[#BAAB48] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Get In Touch</h3>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white">Contact SecureLogix</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Details */}
            <div className="space-y-12">
              <div>
                <h4 className="text-white text-lg font-bold uppercase tracking-widest mb-4">Global Headquarters</h4>
                <p className="text-[#A9A9A9] leading-relaxed">
                  123 Secure Logistics Way<br />
                  International Trade Zone<br />
                  SL 10001
                </p>
              </div>
              <div>
                <h4 className="text-white text-lg font-bold uppercase tracking-widest mb-4">Direct Lines</h4>
                <p className="text-[#A9A9A9] leading-relaxed">
                  <span className="text-[#BAAB48]">Phone:</span> +1 (800) 555-0199<br />
                  <span className="text-[#BAAB48]">Email:</span> operations@securelogix.com
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  value={contactForm.firstName}
                  onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                  className="bg-[#222] border border-[#333] text-white px-4 py-4 text-sm outline-none focus:border-[#BAAB48] transition-colors w-full"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={contactForm.lastName}
                  onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                  className="bg-[#222] border border-[#333] text-white px-4 py-4 text-sm outline-none focus:border-[#BAAB48] transition-colors w-full"
                  required
                />
              </div>
              <input 
                type="email" 
                placeholder="Corporate Email Address" 
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="bg-[#222] border border-[#333] text-white px-4 py-4 text-sm outline-none focus:border-[#BAAB48] transition-colors w-full"
                required
              />
              <textarea 
                placeholder="Message or Inquiry Details" 
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="bg-[#222] border border-[#333] text-white px-4 py-4 text-sm outline-none focus:border-[#BAAB48] transition-colors w-full resize-none"
                required
              ></textarea>
              
              {contactSuccess && (
                <div className="text-green-500 font-bold tracking-widest text-xs bg-green-500/10 border border-green-500/20 p-4">
                  {contactSuccess}
                </div>
              )}
              {contactError && (
                <div className="text-red-500 font-bold tracking-widest text-xs bg-red-500/10 border border-red-500/20 p-4">
                  {contactError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={contactLoading}
                className="w-full bg-[#BAAB48] hover:bg-white text-[#111] px-6 py-4 font-bold uppercase tracking-widest text-[11px] transition-colors duration-300 disabled:opacity-50"
              >
                {contactLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] pt-32 pb-12 border-t border-[#222] px-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 text-sm text-[#ccc] mb-32">
          <div className="lg:col-span-2">
             <h1 className="text-2xl font-serif font-black tracking-widest uppercase text-white mb-6">
              Secure<span className="text-[#A9A9A9]">Logix</span>
            </h1>
            <p className="max-w-sm text-lg font-light leading-relaxed mb-8 text-[#A9A9A9]">
              Delivering absolute peace of mind through secure global logistics and high-tech vaulting facilities.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-8">About Us</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li><Link to="/about" className="hover:text-[#BAAB48] transition-colors">Our History</Link></li>
              <li><a href="#contact" className="hover:text-[#BAAB48] transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-[#BAAB48] transition-colors">Media</a></li>
              <li><a href="#contact" className="hover:text-[#BAAB48] transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-8">Services</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li><Link to="/services" className="hover:text-[#BAAB48] transition-colors">Diamonds & Jewellery</Link></li>
              <li><Link to="/services" className="hover:text-[#BAAB48] transition-colors">Precious Metals</Link></li>
              <li><Link to="/services" className="hover:text-[#BAAB48] transition-colors">Fine Art Global</Link></li>
              <li><Link to="/services" className="hover:text-[#BAAB48] transition-colors">Vaulting Facilities</Link></li>
              <li><Link to="/services" className="hover:text-[#BAAB48] transition-colors">Technology Services</Link></li>
              <li><Link to="/services" className="hover:text-[#BAAB48] transition-colors">Digital Asset Services</Link></li>
              <li><Link to="/services" className="hover:text-[#BAAB48] transition-colors">Special Operations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-8">Legal</h4>
            <ul className="space-y-5 text-sm font-medium mb-12">
              <li><a href="#" className="hover:text-[#BAAB48] transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-[#BAAB48] transition-colors">Privacy Policy</a></li>
            </ul>
            <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-6">Connect</h4>
            <div className="flex space-x-4 text-[#A9A9A9]">
              <div className="w-10 h-10 border border-[#A9A9A9] flex items-center justify-center hover:bg-[#BAAB48] hover:border-[#BAAB48] hover:text-black cursor-pointer transition-colors text-xs font-bold uppercase">In</div>
              <div className="w-10 h-10 border border-[#A9A9A9] flex items-center justify-center hover:bg-[#BAAB48] hover:border-[#BAAB48] hover:text-black cursor-pointer transition-colors text-xs font-bold uppercase">Ig</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1600px] mx-auto border-t border-[#333] pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#A9A9A9]">
          <p className="mb-4 md:mb-0">© {new Date().getFullYear()} SECURELOGIX. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="hover:text-[#BAAB48] cursor-pointer transition-colors">Media</span>
            <span className="hover:text-[#BAAB48] cursor-pointer transition-colors">Blog</span>
            <span className="hover:text-[#BAAB48] cursor-pointer transition-colors">App</span>
            <span className="hover:text-[#BAAB48] cursor-pointer transition-colors">Videos</span>
          </div>
        </div>
      </footer>
      <LiveChat />
    </div>
  );
}
