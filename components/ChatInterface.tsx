import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, MoreVertical, ChevronLeft, Phone } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createSchoolChat, generateSpeech } from '../services/geminiService';
import { Message, Role } from '../types';

interface ChatInterfaceProps {
  isDarkMode: boolean;
  externalMessage?: string | null;
  onExternalMessageHandled?: () => void;
  onToggleSidebar?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  externalMessage, 
  onExternalMessageHandled,
  onToggleSidebar 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createSchoolChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (externalMessage) {
      handleSendMessage(externalMessage);
      if (onExternalMessageHandled) onExternalMessageHandled();
    }
  }, [externalMessage]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: text });
      const responseText = result.text;

      if (responseText) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: Role.MODEL,
          text: responseText,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error("Empty response from model");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: Role.MODEL,
        text: "Connection lost. Try again later.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="flex flex-col h-full relative font-sans items-center justify-center p-0 md:p-6 bg-transparent">
      
      {/* PHONE FRAME (Visible on desktop, full screen on mobile) */}
      <div className="w-full h-full md:max-w-[400px] md:h-[800px] bg-black md:rounded-[40px] md:border-[8px] md:border-[#1a1a1a] shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-30 hidden md:block"></div>

          {/* Phone Header (Status Bar) */}
          <div className="h-24 bg-[#1c1c1e] flex flex-col justify-end pb-3 px-4 shrink-0 z-20 border-b border-white/10">
              <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-1 text-blue-500 cursor-pointer" onClick={onToggleSidebar}>
                      <ChevronLeft size={24} />
                      <span className="text-lg">Contacts</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mb-1 border-2 border-white/20">
                           <img src="./avatar.jpg" className="w-full h-full object-cover" alt="Bot" />
                      </div>
                      <span className="text-xs text-white/50">Romagnosi Bot</span>
                  </div>
                  <div className="flex gap-4 text-blue-500">
                      <Phone size={20} />
                  </div>
              </div>
          </div>

          {/* Chat Background & Messages */}
          <div className="flex-1 overflow-y-auto bg-black custom-scrollbar relative">
              {/* Wallpaper */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"></div>
              
              <div className="p-4 space-y-4 relative z-10 min-h-full flex flex-col justify-end">
                {/* Time Stamp */}
                <div className="text-center text-[#8e8e93] text-xs font-medium my-4">Today 10:24 AM</div>

                {messages.map((msg) => {
                  const isUser = msg.role === Role.USER;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-message`}
                    >
                      <div className={`
                         max-w-[80%] px-4 py-2 rounded-2xl text-[15px] leading-snug
                         ${isUser 
                           ? 'bg-[#56B458] text-white rounded-br-sm' 
                           : 'bg-[#2c2c2e] text-white rounded-bl-sm'
                         }
                      `}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {/* Loading Bubble */}
                {isLoading && (
                  <div className="flex justify-start">
                      <div className="bg-[#2c2c2e] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200"></div>
                      </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
          </div>

          {/* Input Area - iMessage Style */}
          <div className="bg-[#1c1c1e] p-3 flex items-end gap-3 shrink-0 z-20 pb-6 md:pb-3">
              <button className="text-[#8e8e93] p-2 hover:text-white transition-colors">
                  <Camera size={24} />
              </button>
              
              <div className="flex-1 bg-[#2c2c2e] rounded-full border border-[#3a3a3c] flex items-center px-4 py-1">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="iFruit Message"
                    rows={1}
                    className="w-full bg-transparent text-white text-[15px] resize-none outline-none max-h-24 py-2 placeholder:text-[#8e8e93]"
                  />
              </div>

              <button 
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className={`p-2 rounded-full transition-all ${
                    inputText.trim() ? 'bg-[#56B458] text-white' : 'bg-[#3a3a3c] text-[#8e8e93]'
                }`}
              >
                 <Send size={18} />
              </button>
          </div>
          
          {/* Home Bar (simulated) */}
          <div className="h-1 w-1/3 bg-white/20 mx-auto rounded-full mb-2 md:hidden absolute bottom-1 left-1/3 pointer-events-none"></div>
      </div>
    </div>
  );
};