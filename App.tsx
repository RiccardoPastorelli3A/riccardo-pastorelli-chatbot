import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { OrientationQuiz } from './components/OrientationQuiz';
import { HomePage } from './components/HomePage';
import { HelpCircle, Lightbulb, X, Map, Radio, Menu, Users, Briefcase, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [autoQuestion, setAutoQuestion] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Feedback Modal State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const faqItems = [
    { icon: <GraduationCap size={18} />, text: "Quali indirizzi offre la scuola?" },
    { icon: <Briefcase size={18} />, text: "Sbocchi Lavorativi (Money)" },
    { icon: <Users size={18} />, text: "Docenti & Crew" },
    { icon: <Radio size={18} />, text: "Laboratori & Tech" },
  ];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      setIsFeedbackOpen(false);
    }, 2000);
  };

  const handleFaqClick = (question: string) => {
    setAutoQuestion(question);
    setIsSidebarOpen(false);
  };

  const handleQuizComplete = (result: string) => {
    setIsQuizOpen(false);
    setIsSidebarOpen(false);
    handleFaqClick(`Ho completato il Setup del Colpo (Quiz) e il risultato è: "${result}". Dammi i dettagli.`);
  };

  return (
    <div className={`h-[100dvh] w-screen flex overflow-hidden relative font-sans text-white bg-black`}>
      
      {/* GTA V Background Gradient */}
      <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-[#1a1c2c] to-[#4a1c40]`}>
           {/* Subtle texture overlay */}
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {showLanding ? (
        <HomePage 
          onStart={() => setShowLanding(false)} 
          isDarkMode={true} 
          toggleTheme={() => {}}
        />
      ) : (
        <>
          {/* Mobile Sidebar Backdrop */}
          {isSidebarOpen && (
            <div 
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar Navigation - GTA V Pause Menu Style */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-80 flex flex-col transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:z-auto bg-[#000000] shadow-2xl border-r border-white/10
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Sidebar Header */}
            <div className="h-32 bg-[#56B458] p-6 flex flex-col justify-end relative overflow-hidden">
               {/* Decorative V Logo watermark */}
               <div className="absolute -right-4 -top-4 text-black/10 font-gta text-[150px] leading-none select-none">V</div>
               
               <h1 className="font-gta text-4xl text-white relative z-10 drop-shadow-md">ROMAGNOSI</h1>
               <p className="text-white/90 text-xs font-bold uppercase tracking-widest relative z-10">Orientation City</p>
               
               <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden absolute top-4 right-4 text-white hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Menu Items - Clean List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#121212]">
                
                {/* Stats / Info Box */}
                <div className="p-5 border-b border-white/10">
                    <div className="flex items-center gap-3 text-white/70">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#56B458]">
                           <Map size={20} />
                        </div>
                        <div className="text-sm font-medium">
                           <p className="text-white font-bold uppercase text-xs tracking-wider mb-1">Current Objective</p>
                           <p className="leading-tight">Find your path. Don't get wasted.</p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="py-4">
                    <p className="px-6 text-xs font-bold uppercase text-[#56B458] tracking-widest mb-3">Menu</p>
                    
                    <button 
                        onClick={() => setIsQuizOpen(true)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 group transition-colors border-l-4 border-transparent hover:border-[#56B458]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-white/50 group-hover:text-white uppercase font-bold text-sm tracking-wide">Heist Setup (Quiz)</span>
                        </div>
                        <div className="bg-[#56B458] text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                           Start
                        </div>
                    </button>

                    <button 
                         onClick={() => setShowLanding(true)}
                         className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 group transition-colors border-l-4 border-transparent hover:border-[#56B458]"
                    >
                         <span className="text-white/50 group-hover:text-white uppercase font-bold text-sm tracking-wide">Leave Session</span>
                    </button>
                </div>

                {/* FAQ List */}
                <div className="py-4 border-t border-white/10">
                    <p className="px-6 text-xs font-bold uppercase text-[#56B458] tracking-widest mb-3 flex items-center gap-2">
                        <HelpCircle size={12} />
                        Quick GPS (FAQ)
                    </p>
                    <div className="space-y-1">
                        {faqItems.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleFaqClick(item.text)}
                                className="w-full px-6 py-3 flex items-center gap-4 hover:bg-white/5 group transition-colors"
                            >
                                <span className="text-white/40 group-hover:text-[#56B458] transition-colors">{item.icon}</span>
                                <span className="text-white/70 group-hover:text-white text-sm font-medium">{item.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black border-t border-white/10">
              <button 
                 onClick={() => setIsFeedbackOpen(true)}
                 className="w-full flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded text-xs font-bold uppercase tracking-wider text-white transition-colors"
              >
                  <Lightbulb size={14} className="text-[#56B458]" />
                  Send Feedback
              </button>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 h-full relative z-10 flex flex-col overflow-hidden bg-black/40">
             {/* Simple Header for Mobile */}
             <div className="md:hidden h-14 flex items-center px-4 bg-black/80 border-b border-white/10 backdrop-blur-md">
                 <button onClick={() => setIsSidebarOpen(true)} className="text-white">
                     <Menu />
                 </button>
                 <span className="ml-4 font-gta text-xl">ROMAGNOSI V</span>
             </div>

            <div className="w-full h-full relative">
               <ChatInterface 
                 isDarkMode={true} 
                 externalMessage={autoQuestion}
                 onExternalMessageHandled={() => setAutoQuestion(null)}
                 onToggleSidebar={() => setIsSidebarOpen(true)}
               />
            </div>
          </main>

          {/* Quiz Modal - Heist Board Style */}
          {isQuizOpen && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                 <OrientationQuiz 
                    onClose={() => setIsQuizOpen(false)}
                    onComplete={handleQuizComplete}
                    isDarkMode={true}
                 />
             </div>
          )}

          {/* Feedback Modal */}
          {isFeedbackOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <div className="w-full max-w-md bg-[#121212] border border-white/20 p-8 shadow-2xl transform scale-100 animate-pop-in relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#56B458] to-blue-500"></div>
                  
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-gta text-3xl uppercase tracking-wide">Feedback</h3>
                      <button onClick={() => setIsFeedbackOpen(false)} className="text-white/50 hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  
                  {feedbackSent ? (
                      <div className="text-center py-8">
                          <h4 className="font-gta text-4xl text-[#56B458] mb-2">SENT</h4>
                          <p className="font-medium text-white/70">Thanks for the intel.</p>
                      </div>
                  ) : (
                      <form onSubmit={handleSendFeedback}>
                          <textarea 
                              required
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              className="w-full h-32 p-4 bg-black border border-white/10 focus:border-[#56B458] text-white resize-none outline-none mb-4 text-sm font-medium"
                              placeholder="Type your message..."
                          />
                          <button 
                              type="submit"
                              className="w-full py-3 bg-white text-black font-bold uppercase hover:bg-[#56B458] transition-colors tracking-widest text-sm"
                          >
                              Submit
                          </button>
                      </form>
                  )}
               </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;