import React from 'react';
import { Play, Map, Users } from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden font-sans text-white bg-black">
      
      {/* Background Image - GTA Style Art */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=2574&auto=format&fit=crop" 
            alt="Los Santos Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"></div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
        
        {/* The V Logo Container */}
        <div className="relative mb-12 transform hover:scale-105 transition-transform duration-700 ease-out cursor-default">
            {/* The V shape */}
            <div className="font-gta text-[200px] md:text-[300px] leading-none text-[#56B458] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] border-text-black">
                V
            </div>
            
            {/* The "five" banner */}
            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-16 md:h-24 bg-gradient-to-r from-transparent via-black to-transparent flex items-center justify-center">
                <span className="font-serif italic font-bold text-4xl md:text-6xl text-white tracking-widest drop-shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
                    five
                </span>
            </div>
            
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-max bg-white text-black px-2 font-gta text-2xl tracking-tighter">
                ROMAGNOSI
            </div>
        </div>

        {/* Menu Options */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-center">
            
            {/* Story Mode Card */}
            <button 
                onClick={onStart}
                className="group relative w-full md:w-80 h-48 bg-black/40 backdrop-blur-md border border-white/20 hover:border-[#56B458] transition-all overflow-hidden flex flex-col justify-end p-6 hover:scale-105"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                {/* Simulated Screenshot */}
                <img 
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover -z-10 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                />
                
                <div className="relative z-10 text-left">
                    <h3 className="font-gta text-3xl uppercase text-white group-hover:text-[#56B458] transition-colors">Story Mode</h3>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider mt-1">Start Chat • Orientation</p>
                </div>
            </button>

            {/* Online Mode Card (Disabled) */}
            <button 
                className="group relative w-full md:w-80 h-48 bg-black/40 backdrop-blur-md border border-white/20 opacity-70 cursor-not-allowed overflow-hidden flex flex-col justify-end p-6"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50 grayscale"
                />
                
                <div className="relative z-10 text-left">
                    <h3 className="font-gta text-3xl uppercase text-white">Online</h3>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider mt-1">Multiplayer (Coming Soon)</p>
                </div>
                
                <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 uppercase">
                    DLC Required
                </div>
            </button>
        </div>
        
        <div className="mt-12 text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">
            © 2025 ISIS Romagnosi • Los Santos Branch
        </div>
      </main>
    </div>
  );
};