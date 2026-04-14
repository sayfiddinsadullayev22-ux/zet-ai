import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MicOff, Camera, CameraOff, User, Bot, Sparkles } from 'lucide-react';
import { ZetFace } from './components/ZetFace';
import { chatWithZet, analyzeEmotion, speakUzbek } from './services/geminiService';
import { cn } from './lib/utils';

interface Message {
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Assalomu alaykum! Men Zet AI modeliman. Sizga qanday yordam bera olaman?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showWebcam, setShowWebcam] = useState(true);
  const [emotion, setEmotion] = useState('neytral');
  const [isListening, setIsListening] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Emotion detection loop
  useEffect(() => {
    const interval = setInterval(async () => {
      if (showWebcam && webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          const base64Data = imageSrc.split(',')[1];
          const detectedEmotion = await analyzeEmotion(base64Data);
          if (detectedEmotion !== emotion) {
            setEmotion(detectedEmotion);
          }
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [showWebcam, emotion]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithZet(text, history, emotion);
    
    const botMessage: Message = { role: 'bot', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);

    handleSpeak(responseText);
  };

  const handleSpeak = async (text: string) => {
    setIsSpeaking(true);
    const audioData = await speakUzbek(text);
    if (audioData) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      audio.play().catch(e => {
        console.error("Audio play error:", e);
        setIsSpeaking(false);
      });
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="h-screen bg-zet-bg text-zet-text font-sans grid grid-cols-1 md:grid-cols-[280px_1fr_320px] grid-rows-[80px_1fr_60px] gap-[1px] overflow-hidden">
      {/* Header */}
      <header className="col-span-full flex items-center justify-between px-10 bg-zet-bg/95 border-b border-zet-muted/10 z-10">
        <div className="flex items-center gap-3 text-2xl font-bold tracking-[2px]">
          <div className="w-8 h-8 bg-gradient-to-br from-zet-accent to-zet-anor rounded-[4px] [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]" />
          GEN ZET <span className="font-light opacity-60 text-base">v2.0</span>
        </div>
        <div className="hidden md:flex gap-6 text-zet-muted text-xs uppercase tracking-wider">
          <span>UZBEK (MUKAMMAL)</span>
          <span>ENGLISH (NATIVE)</span>
          <span className="text-zet-accent">VISION: ACTIVE</span>
        </div>
      </header>

      {/* Left Sidebar: Status Panel */}
      <aside className="hidden md:flex flex-col gap-5 p-6 bg-[#020c1b]/50">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-zet-muted mb-1 block">Vizual Tahlil</span>
          <div className="relative aspect-[4/3] bg-[#020c1b] rounded-xl border border-zet-bubble flex items-center justify-center overflow-hidden">
            {showWebcam ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover grayscale contrast-125"
                disablePictureInPicture={false}
                forceScreenshotSourceSize={false}
                imageSmoothing={true}
                mirrored={false}
                screenshotQuality={0.92}
                onUserMedia={() => {}}
                onUserMediaError={() => {}}
              />
            ) : (
              <Camera size={40} className="text-zet-muted/30" />
            )}
            <div className="absolute bottom-2 left-2 text-[10px] text-zet-accent bg-black/50 px-1.5 py-0.5 rounded">
              Face Detection 99.8%
            </div>
            <button 
              onClick={() => setShowWebcam(!showWebcam)}
              className="absolute top-2 right-2 p-1.5 bg-zet-bg/80 rounded-md text-zet-muted hover:text-zet-accent transition-colors"
            >
              {showWebcam ? <CameraOff size={14} /> : <Camera size={14} />}
            </button>
          </div>
        </div>

        <div className="bg-zet-bubble p-3 rounded-lg border-l-[3px] border-zet-accent">
          <div className="text-[10px] text-zet-muted uppercase mb-1">Aniqlangan Hissiyot</div>
          <div className="text-lg text-zet-accent capitalize">{emotion}</div>
          <div className="text-[11px] mt-1 opacity-80">Intonatsiya: Tabiiy</div>
        </div>

        <div className="bg-zet-bubble p-3 rounded-lg border-l-[3px] border-zet-anor">
          <div className="text-[10px] text-zet-muted uppercase mb-1">Tizim Holati</div>
          <div className="text-sm">Zet AI Protsessor</div>
          <div className="w-full h-1 bg-[#020c1b] mt-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-zet-accent" 
              initial={{ width: "0%" }}
              animate={{ width: "45%" }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content: AI Face */}
      <main className="relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#112240_0%,#0A192F_70%)]">
        <div className="w-full max-w-[400px] aspect-square relative">
          <ZetFace isSpeaking={isSpeaking} emotion={emotion} />
        </div>
        
        <div className="text-center mt-5">
          <div className="h-10 flex items-center justify-center gap-[3px]">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] bg-zet-accent rounded-full"
                animate={isSpeaking ? {
                  height: [10, 35, 15, 30, 10][i % 5],
                } : {
                  height: 3
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
          <div className="text-xs mt-2.5 text-zet-accent tracking-[2px] uppercase">
            {isSpeaking ? "ZET AI GAPIRMOQDA..." : "ZET AI TINGLAMOQDA..."}
          </div>
        </div>
      </main>

      {/* Right Sidebar: Chat Panel */}
      <aside className="flex flex-col p-5 bg-[#020c1b]/30 border-l border-zet-muted/10">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-3 px-4 rounded-xl max-w-[90%] text-[13px] leading-relaxed",
                  msg.role === 'bot' 
                    ? "bg-zet-bubble text-zet-text self-start rounded-bl-none" 
                    : "bg-transparent border border-zet-muted text-zet-text self-end rounded-br-none"
                )}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex items-center gap-2 text-zet-muted text-[11px] animate-pulse">
              <Sparkles size={12} className="animate-spin" />
              <span>Zet AI o'ylamoqda...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="mt-auto bg-zet-bubble p-3 rounded-lg flex items-center gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Xabar yozing yoki gapiring..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-zet-text placeholder:text-zet-muted/50 text-[13px]"
          />
          <div className="flex gap-2">
            <button 
              onClick={() => setIsListening(!isListening)}
              className={cn(
                "p-1.5 rounded-md transition-all",
                isListening ? "text-zet-error" : "text-zet-accent"
              )}
            >
              <Mic size={18} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="text-zet-accent disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer className="col-span-full px-10 flex items-center justify-between bg-[#020c1b] text-[11px] text-zet-muted">
        <div>© 2026 Sa'dullayev S.B. — Zet AI Startup Ecosystem</div>
        <div className="flex gap-4">
          <span>LATENCY: 42ms</span>
          <span>TOKEN RATE: 120/s</span>
        </div>
      </footer>
    </div>
  );
}

