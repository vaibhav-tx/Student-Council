"use client";
import { motion } from 'framer-motion';
import { Calendar, Users, Camera, Mail, Volume2, Target } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d1b] text-white selection:bg-hot-pink selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b0d1b]/80 backdrop-blur-md border-b border-neon-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-pixel text-neon-cyan text-sm sm:text-base">STUCO</span>
              <span className="text-xs text-gray-400 font-mono hidden sm:block">FRCRCE</span>
            </div>
            <div className="hidden md:flex space-x-8 font-mono text-sm">
              <a href="#events" className="hover:text-neon-cyan transition-colors">EVENTS</a>
              <a href="#leadership" className="hover:text-hot-pink transition-colors">LEADERSHIP</a>
              <a href="#roster" className="hover:text-amber transition-colors">MEMBERS</a>
              <a href="#gallery" className="hover:text-neon-cyan transition-colors">GALLERY</a>
              <a href="#contact" className="hover:text-hot-pink transition-colors">CONTACT</a>
            </div>
            <div className="flex items-center">
              <button className="text-neon-cyan hover:text-white transition-colors">
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col justify-center items-center min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-[#13162b] to-[#0b0d1b]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-hot-pink mb-6 leading-tight"
          >
            STUDENTS' COUNCIL <br/> 2026-27
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 font-mono"
          >
            "Empowering Student Voice — Building Tomorrow's Leaders."
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <a href="#events" className="px-8 py-3 bg-hot-pink/10 border border-hot-pink text-hot-pink font-mono hover:bg-hot-pink hover:text-white transition-all box-shadow-pink">
              [ EXPLORE EVENTS ]
            </a>
            <a href="#roster" className="px-8 py-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-mono hover:bg-neon-cyan hover:text-[#0b0d1b] transition-all box-shadow-neon hidden sm:block">
              [ MEET THE COUNCIL ]
            </a>
          </motion.div>
        </div>
      </section>

      {/* Flagship Events Section */}
      <section id="events" className="py-20 bg-[#0b0d1b] relative min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-hot-pink font-mono">// SECTION_NAME</span>
            <h2 className="text-3xl font-pixel text-white">EVENTS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['CRMD', 'CRESCENDO', 'EUPHORIA', 'ATHLEAD', 'ATHLOS'].map((event, i) => (
              <motion.div 
                key={event}
                whileHover={{ scale: 1.05 }}
                className="group relative bg-[#13162b] border border-gray-800 hover:border-neon-cyan p-6 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <Calendar className="text-neon-cyan" size={48} />
                </div>
                <h3 className="text-xl font-pixel text-neon-cyan mb-4">{event}</h3>
                <p className="text-gray-400 font-mono text-sm mb-6">
                  {event === 'CRMD' ? 'Flagship Cultural & Performing Arts Festival' : 
                   event === 'CRESCENDO' ? 'Inter-College Cultural Extravaganza' : 
                   event === 'EUPHORIA' ? 'The Ultimate College Annual Fest' :
                   'Sports Tournament and Annual Meet'}
                </p>
                <button className="text-xs font-mono text-hot-pink uppercase tracking-wider group-hover:text-white transition-colors">
                  View Details &rarr;
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-neon-cyan font-mono">// SECTION_NAME</span>
            <h2 className="text-3xl font-pixel text-white">LEADERSHIP</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Fr. Valerian D'Souza", role: "Director, Fr. CRCE" },
              { name: "Fr. Trevor Pereira", role: "Assistant Director, Fr. CRCE" },
              { name: "Dr. Sapna Prabhu", role: "Principal, Fr. CRCE" },
              { name: "Dr. Joseph Rodrigues", role: "Dean of Students' Welfare, Fr. CRCE" },
            ].map((leader) => (
              <div key={leader.name} className="flex flex-col bg-gradient-to-r from-[#13162b] to-transparent p-6 border-l-4 border-amber hover:border-neon-cyan transition-colors">
                <h3 className="text-xl font-bold mb-2">{leader.name}</h3>
                <p className="text-amber font-mono text-sm">{leader.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Council Roster */}
      <section id="roster" className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-amber font-mono">// SECTION_NAME</span>
            <h2 className="text-3xl font-pixel text-white">ROSTER</h2>
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-hot-pink mb-6">Senior Council</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono text-gray-300">
              <div className="p-4 bg-[#13162b] rounded-sm hover:text-white hover:bg-neon-cyan/20 transition-all border border-transparent hover:border-neon-cyan cursor-pointer">Yashdeep Kulkarni <br/><span className="text-xs text-neon-cyan mt-1 block">President</span></div>
              <div className="p-4 bg-[#13162b] rounded-sm hover:text-white hover:bg-neon-cyan/20 transition-all border border-transparent hover:border-neon-cyan cursor-pointer">Vedant Kanekar <br/><span className="text-xs text-neon-cyan mt-1 block">General Secretary</span></div>
              <div className="p-4 bg-[#13162b] rounded-sm hover:text-white hover:bg-hot-pink/20 transition-all border border-transparent hover:border-hot-pink cursor-pointer">Diva Sharma <br/><span className="text-xs text-hot-pink mt-1 block">Cultural Secretary</span></div>
              <div className="p-4 bg-[#13162b] rounded-sm hover:text-white hover:bg-amber/20 transition-all border border-transparent hover:border-amber cursor-pointer">Soah Fernandes <br/><span className="text-xs text-amber mt-1 block">Technical Secretary</span></div>
            </div>
            <div className="mt-8 text-center">
              <button className="text-xs font-mono text-gray-400 hover:text-white underline tracking-widest">VIEW FULL ROSTER</button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Sponsors */}
      <section className="py-20 border-y border-gray-800 bg-[#05060d] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
          <h2 className="text-xl font-pixel text-gray-500 mb-4">PARTNERS & SPONSORS</h2>
          <p className="font-mono text-sm text-gray-600">TRUSTED BY 50+ BRANDS ACROSS 5+ YEARS</p>
        </div>
        <div className="w-full flex overflow-hidden">
          <div className="flex space-x-16 animate-marquee whitespace-nowrap opacity-50 font-mono text-xl text-gray-400 py-4">
            <span>CANARA BANK</span>
            <span>UNSTOP</span>
            <span>DEVFOLIO</span>
            <span>KLAW</span>
            <span>STARBUCKS</span>
            <span>ASUS</span>
            <span>COLGATE</span>
            <span>CANARA BANK</span>
            <span>UNSTOP</span>
            <span>DEVFOLIO</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0b0d1b] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-pixel text-white mb-8">CONTACT</h2>
              <form className="space-y-4 font-mono">
                <input type="text" placeholder="NAME" className="w-full bg-[#13162b] border border-gray-800 p-4 text-white focus:outline-none focus:border-neon-cyan transition-colors" />
                <input type="email" placeholder="EMAIL" className="w-full bg-[#13162b] border border-gray-800 p-4 text-white focus:outline-none focus:border-neon-cyan transition-colors" />
                <textarea placeholder="MESSAGE" rows={4} className="w-full bg-[#13162b] border border-gray-800 p-4 text-white focus:outline-none focus:border-neon-cyan transition-colors"></textarea>
                <button className="w-full py-4 bg-neon-cyan/90 text-[#0b0d1b] font-bold hover:bg-white hover:text-[#0b0d1b] transition-all box-shadow-neon mt-2">
                  [ SEND MESSAGE ]
                </button>
              </form>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-pixel text-white mb-8">MISSION</h2>
                <ul className="space-y-4 font-mono text-gray-400">
                  <li className="flex items-center gap-3"><span className="text-neon-cyan">/&gt;</span> LEADERSHIP</li>
                  <li className="flex items-center gap-3"><span className="text-hot-pink">/&gt;</span> INCLUSIVITY</li>
                  <li className="flex items-center gap-3"><span className="text-amber">/&gt;</span> INNOVATION</li>
                  <li className="flex items-center gap-3"><span className="text-neon-cyan">/&gt;</span> TRANSPARENCY</li>
                </ul>
              </div>
              <div className="mt-12 font-mono text-sm text-gray-500 space-y-2">
                <p>Email: frcrce.stuco@gmail.com</p>
                <p>Instagram: @frcrcestuco_official</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-gray-600">
            <p>&copy; 2026-27 STUCO FRCRCE. All Rights Reserved.</p>
            <p className="text-center md:text-right">Designed & Built by Soah Fernandes & Nigel Fernandes. <br/> (Replica MVP by AI)</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
