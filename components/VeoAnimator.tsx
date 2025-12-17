import React, { useState } from 'react';
import { Film, Upload, Settings, Camera, AlertCircle } from 'lucide-react';
import { generateVeoVideo } from '../services/geminiService';
import { AspectRatio } from '../types';

interface VeoAnimatorProps {
  isDarkMode: boolean;
}

export const VeoAnimator: React.FC<VeoAnimatorProps> = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Format not supported.');
        return;
      }
      setImageFile(file);
      setResultVideo(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) return;
    setIsGenerating(true);
    setError(null);
    setResultVideo(null);
    setProgressMessage('Processing at Los Santos Customs...');

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      const base64 = await base64Promise;

      setProgressMessage('Installing Mods... (This may take a minute)');
      
      const videoUrl = await generateVeoVideo(base64, prompt, aspectRatio);
      setResultVideo(videoUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Mod failed. Check API Key.");
    } finally {
      setIsGenerating(false);
      setProgressMessage('');
    }
  };

  return (
    <div className="h-full bg-[#121212] font-sans text-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto border border-white/10 bg-[#1e1e1e]">
          
          {/* Header - LS Customs Style */}
          <div className="bg-black p-6 border-b-4 border-[#56B458] flex justify-between items-center">
              <div>
                  <h2 className="font-gta text-4xl text-white uppercase italic tracking-tighter">LOS SANTOS <span className="text-[#56B458]">CUSTOMS</span></h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Video Modification Shop</p>
              </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="bg-[#121212] p-4 border border-white/5">
                      <label className="text-[#56B458] font-bold uppercase text-xs tracking-wider mb-2 block">1. Import Vehicle (Image)</label>
                      <div className="relative h-40 border-2 border-dashed border-gray-700 hover:border-white transition-colors flex items-center justify-center bg-black/50 group">
                          {imagePreview ? (
                              <img src={imagePreview} className="max-h-full max-w-full object-contain" />
                          ) : (
                              <div className="text-center text-gray-600 group-hover:text-white">
                                  <Upload className="mx-auto mb-2" />
                                  <span className="text-xs uppercase font-bold">Drag & Drop</span>
                              </div>
                          )}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                      </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-[#121212] p-4 border border-white/5">
                       <label className="text-[#56B458] font-bold uppercase text-xs tracking-wider mb-2 block">2. Customization (Prompt)</label>
                       <input 
                          type="text" 
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Make it fly, neon lights..."
                          className="w-full bg-black border border-gray-700 p-3 text-white text-sm focus:border-[#56B458] outline-none font-mono"
                       />
                  </div>

                  {/* Step 3 */}
                  <div className="bg-[#121212] p-4 border border-white/5">
                       <label className="text-[#56B458] font-bold uppercase text-xs tracking-wider mb-2 block">3. Display</label>
                       <div className="flex gap-2">
                           {[AspectRatio.LANDSCAPE, AspectRatio.PORTRAIT].map((ratio) => (
                               <button 
                                  key={ratio}
                                  onClick={() => setAspectRatio(ratio)}
                                  className={`flex-1 py-2 text-xs font-bold uppercase border ${aspectRatio === ratio ? 'bg-[#56B458] text-black border-[#56B458]' : 'bg-black text-gray-500 border-gray-700'}`}
                               >
                                   {ratio}
                               </button>
                           ))}
                       </div>
                  </div>

                  <button 
                      onClick={handleGenerate}
                      disabled={!imageFile || isGenerating}
                      className="w-full py-4 bg-[#56B458] hover:bg-[#66c768] disabled:bg-gray-800 disabled:text-gray-600 text-black font-gta text-2xl uppercase tracking-widest transition-colors"
                  >
                      {isGenerating ? 'Installing...' : 'MOD IT'}
                  </button>

                  {isGenerating && <p className="text-center text-xs text-[#56B458] font-mono animate-pulse">{progressMessage}</p>}
                  {error && <p className="text-center text-xs text-red-500 font-bold uppercase">{error}</p>}
              </div>

              {/* Preview Screen */}
              <div className="bg-black border border-white/10 flex items-center justify-center min-h-[300px] relative">
                  {resultVideo ? (
                      <video src={resultVideo} controls autoPlay loop className="w-full h-full object-contain" />
                  ) : (
                      <div className="text-center opacity-20">
                          <Film size={48} className="mx-auto mb-2" />
                          <p className="font-gta text-xl">NO SIGNAL</p>
                      </div>
                  )}
                  {/* Scanlines overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
              </div>
          </div>
      </div>
    </div>
  );
};