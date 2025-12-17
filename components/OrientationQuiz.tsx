import React, { useState } from 'react';
import { Target, X, CheckCircle, Users, MapPin, DollarSign, Briefcase } from 'lucide-react';

interface QuizProps {
  onClose: () => void;
  onComplete: (result: string) => void;
  isDarkMode: boolean;
}

type Category = 'ECONOMICO' | 'TURISMO' | 'COSTRUZIONI' | 'AGRARIA' | 'ELETTRONICA' | 'PROFESSIONALE';

interface Option {
  text: string;
  points: Partial<Record<Category, number>>;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "CHOOSE YOUR SKILLSET",
    options: [
      { text: "Money Laundering & Business (Math)", points: { ECONOMICO: 3, ELETTRONICA: 2 } },
      { text: "Negotiation & Languages", points: { TURISMO: 3, ECONOMICO: 1 } },
      { text: "Engineering & Blueprints", points: { COSTRUZIONI: 3, ELETTRONICA: 1 } },
      { text: "Wilderness Survival (Nature)", points: { AGRARIA: 3, PROFESSIONALE: 1 } },
      { text: "Hands-on Mechanics", points: { PROFESSIONALE: 3, AGRARIA: 1 } }
    ]
  },
  {
    id: 2,
    text: "PREFERRED ROLE IN THE CREW",
    options: [
      { text: "Mastermind / Hacker", points: { ECONOMICO: 3, ELETTRONICA: 3 } },
      { text: "The Face / Hotel Owner", points: { TURISMO: 3, ECONOMICO: 1 } },
      { text: "Architect / Builder", points: { COSTRUZIONI: 3 } },
      { text: "Tech Specialist / Electrician", points: { ELETTRONICA: 3 } },
      { text: "Medic / Chef", points: { PROFESSIONALE: 3 } }
    ]
  },
  {
    id: 3,
    text: "DOWNTIME ACTIVITY",
    options: [
      { text: "Gaming / Coding", points: { ECONOMICO: 2, ELETTRONICA: 2 } },
      { text: "Traveling / Planning Trips", points: { TURISMO: 3 } },
      { text: "Hiking Mt. Chiliad", points: { AGRARIA: 3 } },
      { text: "Modding Cars", points: { ELETTRONICA: 3, COSTRUZIONI: 2 } },
      { text: "Cooking for the gang", points: { PROFESSIONALE: 3 } }
    ]
  }
];

const RESULTS_MAP: Record<Category, string> = {
  ECONOMICO: "AFM (The Lester Crest Path)",
  TURISMO: "Turismo (Michael's Lifestyle)",
  COSTRUZIONI: "Costruzioni (Franklin's Architect)",
  AGRARIA: "Agraria (Trevor's Wilderness)",
  ELETTRONICA: "Elettronica (The Hacker)",
  PROFESSIONALE: "Professionale (The Specialist)"
};

export const OrientationQuiz: React.FC<QuizProps> = ({ onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<Category, number>>({
    ECONOMICO: 0, TURISMO: 0, COSTRUZIONI: 0, AGRARIA: 0, ELETTRONICA: 0, PROFESSIONALE: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState<string>("");

  const handleOptionSelect = (points: Partial<Record<Category, number>>) => {
    const newScores = { ...scores };
    (Object.keys(points) as Category[]).forEach((key) => {
      newScores[key] = (newScores[key] || 0) + (points[key] || 0);
    });
    setScores(newScores);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (finalScores: Record<Category, number>) => {
    let maxScore = -1;
    let winningCategory: Category = 'ECONOMICO';

    (Object.keys(finalScores) as Category[]).forEach((key) => {
      if (finalScores[key] > maxScore) {
        maxScore = finalScores[key];
        winningCategory = key;
      }
    });

    setCalculatedResult(RESULTS_MAP[winningCategory]);
    setShowResult(true);
  };

  if (showResult) {
    return (
      <div className="w-full h-full md:h-auto md:max-w-4xl bg-[#f0f0f0] md:rounded-sm shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-pop-in">
         {/* Left Side: The Plan */}
         <div className="flex-1 p-8 bg-white border-r border-gray-300 relative">
             <div className="absolute top-4 left-4 text-4xl text-red-600 font-gta opacity-20 transform -rotate-12 pointer-events-none">CONFIDENTIAL</div>
             
             <h2 className="font-gta text-4xl text-black mb-1 uppercase tracking-tighter">Heist Setup: Complete</h2>
             <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-8">The Board is ready</p>

             <div className="bg-yellow-100 border border-yellow-300 p-4 transform rotate-1 shadow-md mb-8">
                 <p className="font-handwriting text-xl text-black" style={{fontFamily: 'cursive'}}>
                    Based on your skills, this is the best approach. Don't mess it up!
                 </p>
             </div>

             <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-[#56B458] flex items-center justify-center text-white rounded-full">
                     <Target size={32} />
                 </div>
                 <div>
                     <p className="text-xs font-bold text-gray-400 uppercase">Recommended Path</p>
                     <h3 className="text-2xl font-bold text-black">{calculatedResult}</h3>
                 </div>
             </div>

             <div className="flex gap-4">
                 <button onClick={onClose} className="px-6 py-3 border-2 border-gray-300 font-bold text-gray-500 uppercase hover:bg-gray-100">
                     Cancel
                 </button>
                 <button onClick={() => onComplete(calculatedResult)} className="flex-1 px-6 py-3 bg-black text-white font-bold uppercase hover:bg-[#56B458] hover:text-white transition-colors">
                     Select Approach
                 </button>
             </div>
         </div>

         {/* Right Side: Map/Visuals */}
         <div className="hidden md:block w-1/3 bg-blue-900 relative">
             <img src="https://images.unsplash.com/photo-1624625808803-a400f08960fa?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 grayscale" />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-30"></div>
             
             <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 text-white mb-2">
                    <MapPin size={16} />
                    <span className="font-mono text-xs">LOC: LOS SANTOS</span>
                </div>
                <div className="h-1 bg-white/20 w-full">
                    <div className="h-full bg-[#56B458] w-full animate-pulse"></div>
                </div>
             </div>
         </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];

  return (
    <div className="w-full h-full md:h-auto md:max-w-4xl bg-[#e0e0e0] md:rounded shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-message font-sans">
      
      {/* Sidebar showing crew slots */}
      <div className="w-full md:w-64 bg-[#1a1a1a] p-6 flex flex-col gap-4 border-r border-gray-700">
          <h3 className="text-white font-gta text-2xl uppercase tracking-wider mb-4">Planning Board</h3>
          
          <div className="space-y-4">
              {[0, 1, 2].map((step) => (
                  <div key={step} className={`p-3 border-l-4 ${currentStep === step ? 'border-[#56B458] bg-white/10' : 'border-gray-600'}`}>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Step 0{step + 1}</p>
                      <p className={`text-sm font-bold ${currentStep === step ? 'text-white' : 'text-gray-500'}`}>
                          {step === 0 ? 'Skill Assessment' : step === 1 ? 'Role Selection' : 'Downtime'}
                      </p>
                  </div>
              ))}
          </div>

          <button onClick={onClose} className="mt-auto text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold uppercase">
              <X size={16} /> Abort Setup
          </button>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 p-8 bg-[#f5f5f5] relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] opacity-50"></div>
          
          <div className="relative z-10">
              <span className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest inline-block mb-4">
                  Setup Phase
              </span>
              
              <h2 className="text-3xl font-black text-black uppercase mb-8 leading-none">
                  {currentQuestion.text}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(option.points)}
                        className="group relative bg-white border border-gray-300 p-4 text-left shadow-sm hover:shadow-lg hover:border-[#56B458] transition-all transform hover:-translate-y-1"
                      >
                          {/* Tape effect */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-100 opacity-50 transform rotate-1"></div>
                          
                          <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-800 uppercase tracking-tight group-hover:text-black text-sm md:text-base">{option.text}</span>
                              <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-[#56B458] flex items-center justify-center">
                                  <div className="w-3 h-3 bg-[#56B458] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      </div>

    </div>
  );
};