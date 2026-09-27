"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useAnimationFrame, AnimatePresence } from 'framer-motion';

function Preloader({ phase }: { phase: number }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          layoutId="nav-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl"
        >
          <img 
            src="/council-group.jpg" 
            alt="Council Logo" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="overflow-hidden mt-8 flex flex-col justify-center min-h-[100px]">
          <AnimatePresence>
            {phase === 0 && (
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: "20%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                <h1 className="font-serif text-3xl md:text-5xl tracking-widest text-black mb-2">
                  STUDENT COUNCIL
                </h1>
                <p className="text-sm md:text-base tracking-[0.4em] text-black/50 uppercase">
                  2026 — 2027
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function Navbar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center pointer-events-auto">
      <motion.nav 
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
        layout
        className="flex items-center bg-white/90 backdrop-blur-md border border-black/10 shadow-lg rounded-full overflow-hidden p-2 cursor-pointer h-16 md:h-20"
      >
        <motion.div 
          layoutId="nav-logo" 
          transition={{ layout: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }}
          className="flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden shadow-sm"
        >
          <img 
            src="/council-group.jpg" 
            alt="Council Logo" 
            className="w-full h-full object-cover pointer-events-none" 
          />
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-center gap-6 md:gap-8 overflow-hidden whitespace-nowrap pl-6 pr-4"
            >
              <a href="#about" className="text-xs md:text-sm uppercase tracking-widest text-black/70 hover:text-black transition-colors">About</a>
              <a href="#events" className="text-xs md:text-sm uppercase tracking-widest text-black/70 hover:text-black transition-colors">Events</a>
              <a href="#gallery" className="text-xs md:text-sm uppercase tracking-widest text-black/70 hover:text-black transition-colors">Gallery</a>
              <a href="#council" className="text-xs md:text-sm uppercase tracking-widest text-black/70 hover:text-black transition-colors">Directory</a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

function GalleryGlobe() {
  const rotationX = useMotionValue(0);
  const rotationY = useMotionValue(0);
  const smoothX = useSpring(rotationX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(rotationY, { damping: 20, stiffness: 100 });

  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0.1 }); 

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startRot.current = { x: rotationX.get(), y: rotationY.get() };
    velocity.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startMouse.current.x;
    const dy = e.clientY - startMouse.current.y;
    rotationY.set(startRot.current.y + dx * 0.5);
    rotationX.set(startRot.current.x - dy * 0.5);
    velocity.current = { x: -dy * 0.05, y: dx * 0.05 };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useAnimationFrame(() => {
    if (!isDragging.current) {
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;
      
      if (Math.abs(velocity.current.y) < 0.15) {
        velocity.current.y = velocity.current.y >= 0 ? 0.15 : -0.15;
      }
      if (Math.abs(velocity.current.x) < 0.01) {
        velocity.current.x = 0;
      }

      rotationX.set(rotationX.get() + velocity.current.x);
      rotationY.set(rotationY.get() + velocity.current.y);
    }
  });

  const N = 65;
  const cards = useRef(Array.from({ length: N }).map((_, i) => {
    const phi = Math.acos(-1 + (2 * i) / N);
    const theta = Math.sqrt(N * Math.PI) * phi;
    return {
      lat: phi * (180 / Math.PI),
      lng: theta * (180 / Math.PI)
    };
  })).current;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-full h-[60vh] md:h-[700px]" />;
  }

  return (
    <div 
      className="relative w-full h-[60vh] md:h-[700px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing [perspective:1200px]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <motion.div 
        className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
        style={{ rotateX: smoothX, rotateY: smoothY }}
      >
        {cards.map((card, i) => (
          <div 
            key={i}
            className="absolute w-20 h-20 md:w-28 md:h-28 rounded-[24px] overflow-hidden shadow-lg transition-transform duration-300 hover:!scale-150 bg-gray-200 cursor-pointer hover:z-50"
            style={{
              backfaceVisibility: "hidden",
              transform: `rotateY(${card.lng}deg) rotateX(${card.lat}deg) translateZ(clamp(200px, 35vw, 400px))`
            }}
          >
            <img 
              src={`https://images.unsplash.com/photo-15${34528741775 + (i % 24)}?q=80&w=200&auto=format&fit=crop`} 
              alt="gallery"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState(0); 
  const containerRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800);
    const t2 = setTimeout(() => setPhase(2), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  
  // Hero Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      <AnimatePresence>
        {phase < 2 && <Preloader key="preloader" phase={phase} />}
      </AnimatePresence>
      <main ref={containerRef} className={`bg-white text-black min-h-screen selection:bg-black selection:text-white font-sans overflow-x-hidden ${phase < 2 ? 'h-screen overflow-hidden' : ''}`}>
        
        {/* NAV */}
        <Navbar />

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
              <h2 className="font-serif text-6xl md:text-[10rem] leading-none tracking-tighter mb-8 text-white">COUNCIL.</h2>
              <p className="text-white/60 max-w-sm font-light text-lg">Official Representative Body<br/>University Students' Council</p>
            </div>
            
            <div className="flex flex-col gap-4 text-sm uppercase tracking-widest">
              <a href="#" className="hover:underline">Instagram</a>
              <a href="#" className="hover:underline">Contact</a>
              <p className="text-white/40 mt-8">&copy; 2026 STUDENTS' COUNCIL</p>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
