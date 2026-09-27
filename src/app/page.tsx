"use client";

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function GalleryGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const N = 60; 
  
  const points = useRef(Array.from({length: N}).map((_, i) => {
    const phi = Math.acos(-1 + (2 * i) / N);
    const theta = Math.sqrt(N * Math.PI) * phi;
    return {
      x: Math.cos(theta) * Math.sin(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(phi)
    };
  })).current;

  useEffect(() => {
    let frame: number;
    let rx = 0;
    let ry = 0;
    let speedX = 0.002;
    let speedY = 0.002;
    
    const loop = () => {
      const isMobile = window.innerWidth < 768;
      const RADIUS = isMobile ? 180 : 350;
      const FOCAL_LENGTH = isMobile ? 400 : 800;
      
      const targetSpeedX = mouseRef.current.y * 0.00002 + 0.002;
      const targetSpeedY = mouseRef.current.x * 0.00002 + 0.002;
      
      speedX += (targetSpeedX - speedX) * 0.05;
      speedY += (targetSpeedY - speedY) * 0.05;
      
      rx += speedX;
      ry += speedY;
      
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        const p = points[i];

        const px = p.x * RADIUS;
        const py = p.y * RADIUS;
        const pz = p.z * RADIUS;

        const y1 = py * cosX - pz * sinX;
        const z1 = py * sinX + pz * cosX;
        const x2 = px * cosY + z1 * sinY;
        const z2 = -px * sinY + z1 * cosY;

        const scale = FOCAL_LENGTH / (FOCAL_LENGTH - z2);
        const opacity = (z2 + RADIUS) / (2 * RADIUS) * 0.8 + 0.2; 
        const zIndex = Math.round(z2 + RADIUS);

        el.style.transform = `translate3d(${x2}px, ${y1}px, 0) scale(${scale})`;
        el.style.opacity = opacity.toString();
        el.style.zIndex = zIndex.toString();
      });

      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [points]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseRef.current = { x, y };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: 0, y: 0 };
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[60vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-white"
    >
      {Array.from({length: N}).map((_, i) => (
        <div
          key={i}
          ref={(el) => { itemsRef.current[i] = el; }}
          className="absolute top-1/2 left-1/2 w-16 h-16 md:w-24 md:h-24 -ml-8 -mt-8 md:-ml-12 md:-mt-12"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.8] cursor-pointer border border-black/5 bg-white">
            <img 
              src={`https://images.unsplash.com/photo-15${34528741775 + (i % 24)}?q=80&w=200&auto=format&fit=crop`} 
              alt="gallery"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const containerRef = useRef(null);
  
  // Hero Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="bg-white text-black min-h-screen selection:bg-black selection:text-white font-sans overflow-x-hidden">
        
        {/* NAV */}
        <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-black/5">
          <div className="flex items-center gap-4 pointer-events-auto">
            <img src="/council-group.jpg" alt="Council Logo" className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border border-black/10 shadow-sm" />
            <span className="font-serif text-xl md:text-2xl tracking-tighter text-black">STUCO.</span>
          </div>
          <div className="hidden md:flex gap-12 text-sm uppercase tracking-widest pointer-events-auto opacity-70 hover:opacity-100 transition-opacity text-black">
            <a href="#about" className="hover:text-black/60 transition-colors">About</a>
            <a href="#events" className="hover:text-black/60 transition-colors">Events</a>
            <a href="#council" className="hover:text-black/60 transition-colors">Directory</a>
          </div>
          <div className="text-sm uppercase tracking-widest pointer-events-auto hidden sm:block text-black">Menu</div>
        </nav>

        {/* HERO */}
        <section className="relative h-[100svh] w-full flex flex-col justify-center px-8 md:px-16 overflow-hidden pt-20 bg-white">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="z-10 mt-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-base uppercase tracking-[0.3em] text-black/50 mb-6"
            >
              The Official Students' Representative Body
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl md:text-[8rem] lg:text-[11rem] leading-[0.85] tracking-tighter text-black"
            >
              <h1>Students'</h1>
              <h1 className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                <span className="italic text-black/70">Council</span> 
                <span className="text-xl md:text-4xl font-sans tracking-normal font-light border border-black/20 rounded-full px-8 py-3">2026—27</span>
              </h1>
            </motion.div>
          </motion.div>
          
          <div className="absolute bottom-12 left-8 md:left-16 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-black/40">Scroll to explore</span>
            <div className="w-[1px] h-16 bg-black/20 relative overflow-hidden">
              <motion.div 
                className="w-full h-1/2 bg-black absolute top-0"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </div>
          </div>
        </section>

        {/* ABOUT / MISSION */}
        <section id="about" className="py-32 md:py-48 px-8 md:px-16 bg-[#f9f9f9]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-3/4"
            >
              <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl mb-8 leading-tight text-black">Elevating the student experience through unified leadership.</h2>
              <p className="text-black/60 leading-relaxed font-light text-lg md:text-xl max-w-2xl">We are the bridge between the administration and the student body, dedicated to fostering an environment of innovation, culture, and sportsmanship. This is our legacy.</p>
            </motion.div>
          </div>
        </section>

        {/* EVENTS SECTION - ELEGANT LIST */}
        <section id="events" className="py-32 px-8 md:px-16 border-t border-black/10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-20">
              <h2 className="font-serif text-5xl md:text-8xl text-black">Initiatives</h2>
              <span className="text-sm uppercase tracking-widest text-black/40 mb-4 hidden md:block">Flagship Events</span>
            </div>
            
            <div className="flex flex-col border-t border-black/10">
              {[
                { name: "CRMD", desc: "Cultural & Performing Arts", year: "2026" },
                { name: "Crescendo", desc: "Inter-College Extravaganza", year: "2026" },
                { name: "Euphoria", desc: "Annual Festival", year: "2027" },
                { name: "Athlead", desc: "Sports Tournament", year: "2027" }
              ].map((event, i) => (
                <motion.div 
                  key={event.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col md:flex-row justify-between items-start md:items-center py-10 border-b border-black/10 cursor-pointer hover:px-6 transition-all duration-500 hover:bg-[#f9f9f9]"
                >
                  <h3 className="font-serif text-4xl md:text-6xl text-black/70 group-hover:text-black transition-colors">{event.name}</h3>
                  <div className="flex items-center gap-8 mt-4 md:mt-0">
                    <p className="text-black/40 font-light group-hover:text-black/80 transition-colors">{event.desc}</p>
                    <span className="text-xs uppercase tracking-widest px-4 py-2 border border-black/20 rounded-full group-hover:border-black transition-colors">{event.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY GLOBE SECTION */}
        <section id="gallery" className="pt-32 bg-white overflow-hidden flex flex-col items-center">
          <h2 className="font-serif text-5xl md:text-8xl text-black mb-8 text-center">Gallery</h2>
          <GalleryGlobe />
        </section>

        {/* DIRECTORY SECTION */}
        <section id="council" className="py-32 px-8 md:px-16 bg-[#f9f9f9]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-5xl md:text-8xl text-center mb-32 text-black">The Core</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24">
              {[
                { name: "Yashdeep Kulkarni", role: "President" },
                { name: "Vedant Kanekar", role: "General Secretary" },
                { name: "Diva Sharma", role: "Cultural Secretary" },
                { name: "Soah Fernandes", role: "Technical Secretary" }
              ].map((member, i) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-[3/4] bg-[#eee] mb-8 overflow-hidden rounded-sm relative shadow-sm">
                    <img 
                      src={`https://images.unsplash.com/photo-15${34528741775 + i}?q=80&w=800&auto=format&fit=crop`} 
                      alt={member.name} 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    />
                  </div>
                  <h3 className="font-serif text-2xl mb-2 text-black">{member.name}</h3>
                  <p className="text-sm uppercase tracking-widest text-black/40">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-20 px-8 md:px-16 bg-[#0a0a0a] text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div>
              <h2 className="font-serif text-6xl md:text-[10rem] leading-none tracking-tighter mb-8 text-white">STUCO.</h2>
              <p className="text-white/60 max-w-sm font-light text-lg">Official Representative Body<br/>University Students' Council</p>
            </div>
            
            <div className="flex flex-col gap-4 text-sm uppercase tracking-widest">
              <a href="#" className="hover:underline">Instagram</a>
              <a href="#" className="hover:underline">Contact</a>
              <p className="text-white/40 mt-8">&copy; 2026 STUCO</p>
            </div>
          </div>
        </footer>

      </main>
  );
}
