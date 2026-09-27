"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Calendar, Volume2, ArrowUpRight, Github, Twitter, Instagram } from 'lucide-react';
import { ReactLenis } from '@studio-freight/react-lenis';

// ==========================================
// PRELOADER COMPONENT
// ==========================================
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
            document.body.style.overflow = 'auto'; // unlock scroll
          }, 800);
          return 100;
        }
        return p + Math.floor(Math.random() * 20) + 5;
      });
    }, 150);
    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#05060d] flex flex-col items-center justify-center"
      exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="w-80 font-pixel text-neon-cyan flex flex-col items-center">
        <motion.div 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="mb-8 text-xl tracking-widest text-shadow-neon"
        >
          SYS_BOOT_SEQ...
        </motion.div>
        
        <div className="w-full h-4 border-2 border-neon-cyan p-[2px] relative overflow-hidden">
          <motion.div 
            className="h-full bg-neon-cyan"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ type: "tween", ease: "linear", duration: 0.2 }}
          />
        </div>
        
        <div className="mt-6 flex justify-between w-full text-xs font-mono text-gray-500">
          <span>LOADING ASSETS</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
      </div>
      
      {/* Glitch effects overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </motion.div>
  );
};


// ==========================================
// MAIN PAGE
// ==========================================
export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Scroll references
  const containerRef = useRef(null);
  
  // Hero Parallax
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Gallery Horizontal Scroll
  const galleryRef = useRef(null);
  const { scrollYProgress: galleryScrollY } = useScroll({
    target: galleryRef,
  });
  const xGallery = useTransform(galleryScrollY, [0, 1], ["0%", "-66.66%"]);

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <main ref={containerRef} className="bg-[#0b0d1b] text-white overflow-x-hidden selection:bg-hot-pink selection:text-white">
        
        <AnimatePresence>
          {loading && <Preloader onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        {/* NAVIGATION */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed top-0 w-full z-50 bg-[#0b0d1b]/50 backdrop-blur-md border-b border-white/10 mix-blend-screen"
        >
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-baseline gap-2">
              <span className="font-pixel text-neon-cyan text-xl">STUCO</span>
              <span className="text-xs font-mono text-gray-500">FRCRCE</span>
            </div>
            
            <div className="hidden md:flex items-center gap-10 font-mono text-xs tracking-widest">
              <a href="#events" className="hover:text-neon-cyan transition-colors">/ EVENTS</a>
              <a href="#council" className="hover:text-hot-pink transition-colors">/ COUNCIL</a>
              <a href="#gallery" className="hover:text-amber transition-colors">/ GALLERY</a>
              <a href="#sponsors" className="hover:text-white transition-colors">/ SPONSORS</a>
            </div>
            
            <button className="text-neon-cyan hover:scale-110 transition-transform">
              <Volume2 size={24} />
            </button>
          </div>
        </motion.nav>

        {/* ================= HERO SECTION ================= */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Background Image with Parallax */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0 w-full h-full z-0"
          >
            <div className="absolute inset-0 bg-[#0b0d1b]/70 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2070&auto=format&fit=crop" 
              alt="Cyberpunk City" 
              className="w-full h-full object-cover filter contrast-125 saturate-150"
            />
          </motion.div>

          <div className="relative z-10 w-full max-w-[1400px] px-6 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={!loading ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            >
              <h2 className="font-mono text-hot-pink tracking-[0.3em] mb-4 text-sm md:text-base">FRCRCE OFFICIAL</h2>
              <h1 className="font-pixel text-4xl md:text-7xl lg:text-[6rem] leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-hot-pink filter drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                STUDENTS'<br/>COUNCIL<br/>2026-27
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={!loading ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="mt-16 flex flex-col sm:flex-row gap-6"
            >
              <button className="px-8 py-4 bg-neon-cyan text-[#0b0d1b] font-pixel text-xs hover:bg-white transition-all box-shadow-neon flex items-center justify-center gap-3 group">
                ENTER SYSTEM <ArrowUpRight className="group-hover:rotate-45 transition-transform" size={16}/>
              </button>
              <button className="px-8 py-4 border border-hot-pink text-hot-pink font-pixel text-xs hover:bg-hot-pink/10 transition-all box-shadow-pink">
                VIEW DIRECTORY
              </button>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={!loading ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
          >
            <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">Scroll Down</span>
            <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
              <motion.div 
                className="w-full h-1/2 bg-neon-cyan absolute top-0"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </motion.div>
        </section>

        {/* ================= EVENTS (SCROLL REVEAL) ================= */}
        <section id="events" className="relative py-32 bg-[#05060d] z-20">
          <div className="max-w-[1400px] mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-20 flex items-end gap-6"
            >
              <h2 className="text-5xl md:text-7xl font-pixel text-white mix-blend-difference">EVENTS</h2>
              <span className="text-neon-cyan font-mono text-lg pb-2">// FLAGSHIP_PROTOCOLS</span>
            </motion.div>

            <div className="flex flex-col gap-12">
              {[
                { name: "CRMD", desc: "Flagship Cultural & Performing Arts Festival. The biggest stage in the circuit.", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" },
                { name: "CRESCENDO", desc: "Inter-College Cultural Extravaganza. Battle of the colleges.", img: "https://images.unsplash.com/photo-1540039155732-684736382c4f?q=80&w=2070&auto=format&fit=crop" },
                { name: "ATHLEAD", desc: "Ultimate Sports Tournament and Annual Meet. Pure adrenaline.", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop" }
              ].map((event, idx) => (
                <motion.div 
                  key={event.name}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.76, 0, 0.24, 1] }}
                  className="group relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer"
                >
                  <img src={event.img} alt={event.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d1b] via-[#0b0d1b]/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-4xl md:text-6xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-neon-cyan group-hover:to-hot-pink transition-all duration-500 mb-4">{event.name}</h3>
                        <p className="font-mono text-gray-300 max-w-xl text-sm md:text-base">{event.desc}</p>
                      </div>
                      <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:border-neon-cyan group-hover:bg-neon-cyan/20 transition-all duration-500">
                        <ArrowUpRight className="text-white group-hover:text-neon-cyan" size={32} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= COUNCIL ROSTER (HOVER & REVEAL) ================= */}
        <section id="council" className="py-32 bg-[#0b0d1b] relative overflow-hidden">
          {/* Abstract background blobs */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-hot-pink/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-24"
            >
              <h2 className="text-5xl md:text-6xl font-pixel text-white mb-6">THE DIRECTORY</h2>
              <p className="font-mono text-gray-400 max-w-2xl mx-auto">Meet the core personnel running the system. Elected leaders driving the narrative for the 2026-27 protocol.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "YASHDEEP K.", role: "PRESIDENT", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop", color: "neon-cyan" },
                { name: "VEDANT K.", role: "GEN SECRETARY", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop", color: "hot-pink" },
                { name: "DIVA S.", role: "CULTURAL SEC", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop", color: "amber" },
                { name: "SOAH F.", role: "TECH SEC", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop", color: "neon-cyan" }
              ].map((member, i) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="group relative bg-[#13162b] border border-white/5 overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="h-[400px] w-full overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Cyberpunk Scanner effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan/50 opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
                    
                    {/* Overlay gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-[#0b0d1b] to-transparent opacity-100`} />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className={`w-8 h-1 mb-4 ${member.color === 'neon-cyan' ? 'bg-neon-cyan' : member.color === 'hot-pink' ? 'bg-hot-pink' : 'bg-amber'}`} />
                    <h3 className="font-pixel text-xl mb-2">{member.name}</h3>
                    <p className="font-mono text-xs tracking-widest text-gray-400">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HORIZONTAL SCROLL GALLERY ================= */}
        <section id="gallery" ref={galleryRef} className="h-[300vh] bg-[#05060d] relative">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
            
            <div className="absolute top-20 left-10 z-20">
              <h2 className="text-4xl md:text-6xl font-pixel text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent opacity-30 pointer-events-none">
                MEMORY_BANK
              </h2>
            </div>

            <motion.div 
              style={{ x: xGallery }}
              className="flex gap-10 px-[10vw] w-[300vw]"
            >
              {[
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070",
                "https://images.unsplash.com/photo-1540039155732-684736382c4f?q=80&w=2070",
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070",
                "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=2070",
                "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070"
              ].map((src, i) => (
                <div key={i} className="relative w-[60vw] md:w-[40vw] h-[60vh] flex-shrink-0 group overflow-hidden border border-white/10 hover:border-neon-cyan transition-colors duration-500 rounded-lg">
                  <img src={src} alt="Gallery image" className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-150 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-6 left-6 font-mono text-xs bg-black/50 backdrop-blur-md px-3 py-1 border border-white/20">
                    IMG_REF_00{i+1}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= SPONSORS MARQUEE ================= */}
        <section id="sponsors" className="py-24 bg-neon-cyan text-[#0b0d1b] overflow-hidden rotate-[-2deg] scale-110 border-y-[10px] border-[#0b0d1b]">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex items-center gap-16 px-8">
                {["CANARA BANK", "UNSTOP", "DEVFOLIO", "KLAW", "STARBUCKS", "ASUS"].map((sponsor, i) => (
                  <div key={i} className="flex items-center gap-8">
                    <span className="font-pixel text-4xl md:text-6xl text-transparent [-webkit-text-stroke:2px_#0b0d1b]">{sponsor}</span>
                    <span className="font-pixel text-4xl md:text-6xl">*</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-[#0b0d1b] pt-32 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />
          
          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24 border-b border-white/10 pb-12">
              <div>
                <h2 className="text-6xl md:text-[8rem] font-pixel text-white mb-6 leading-none">STUCO</h2>
                <div className="flex gap-6">
                  <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-neon-cyan hover:border-neon-cyan hover:text-[#0b0d1b] transition-all">
                    <Github size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-hot-pink hover:border-hot-pink hover:text-white transition-all">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-amber hover:border-amber hover:text-[#0b0d1b] transition-all">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end font-mono text-sm text-gray-400 space-y-2">
                <p>FR. CONCEICAO RODRIGUES COLLEGE OF ENGINEERING</p>
                <p>BANDRA WEST, MUMBAI 400050</p>
                <p className="mt-4 text-neon-cyan cursor-pointer hover:underline">SYS.ADMIN@FRCRCE.EDU.IN</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center font-mono text-xs text-gray-600 gap-4">
              <p>COPYRIGHT &copy; 2026 STUCO. ALL SYSTEMS SECURE.</p>
              <p>DESIGNED FOR HIGH-PERFORMANCE AWWARDS.</p>
            </div>
          </div>
        </footer>

        {/* Global Styles for Keyframes */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}} />
      </main>
    </ReactLenis>
  );
}
