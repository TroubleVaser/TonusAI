import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Mic, MicOff, Settings as SettingsIcon, User, BarChart3, Play, Pause, LayoutDashboard, X, ArrowRight, Award, Calendar as CalendarIcon } from 'lucide-react';
import Orb from './components/Orb';
import { MentalWealthList } from './components/Gamification';
import { Calendar } from './components/Calendar';
import { Settings } from './components/Settings';
import { EmotionType, EmotionAnalysis, UserSettings, Task } from './types';
import { EMOTION_COLORS, MOCK_HISTORY_DAYS, DEFAULT_SETTINGS, TASK_POOL, BADGES, MOCK_TRANSCRIPTS_BY_EMOTION } from './constants';
import { analyzeEmotion } from './services/geminiService';
import { format } from 'date-fns';

// Types for Audio Context
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Generate mock history
const generateMockHistory = () => {
  const history = [];
  const emotions = Object.values(EmotionType);
  
  for (let i = 0; i < 40; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Randomly skip some days to make it look realistic
    if (Math.random() > 0.85) continue;

    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    // Pick transcript relevant to emotion, or fallback to default
    const relevantTranscripts = MOCK_TRANSCRIPTS_BY_EMOTION[emotion] || MOCK_TRANSCRIPTS_BY_EMOTION[EmotionType.NEUTRAL];
    const transcript = relevantTranscripts[Math.floor(Math.random() * relevantTranscripts.length)];

    history.push({
      date,
      emotion,
      intensity: 0.2 + Math.random() * 0.7,
      transcript
    });
  }
  return history.reverse();
};

// --- Sub-Components for Views ---

const DashboardView: React.FC<{ history: any[], onDateSelect: (d: Date) => void }> = ({ history, onDateSelect }) => {
  // Calculate stats
  const emotionCounts = history.reduce((acc, curr) => {
    acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEmotion = Object.entries(emotionCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'Neutral';

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-3xl font-light text-slate-800">Dashboard</h2>
            <p className="text-slate-500 mt-1">Your emotional resonance overview.</p>
          </div>
          <div className="hidden md:block text-right">
             <div className="text-2xl font-bold text-indigo-600 capitalize">{topEmotion}</div>
             <div className="text-xs text-slate-400 uppercase tracking-wider">Dominant Vibe</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-2 h-96">
            <Calendar history={history} onDateSelect={onDateSelect} />
          </div>

          {/* Quick Stats Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Distribution</h3>
              <div className="space-y-3">
                {Object.entries(emotionCounts).slice(0, 5).map(([emo, count]: [string, any]) => (
                  <div key={emo} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: EMOTION_COLORS[emo as EmotionType] }} />
                      <span className="capitalize text-slate-700">{emo}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / history.length) * 100}%`, backgroundColor: EMOTION_COLORS[emo as EmotionType] }} />
                      </div>
                      <span className="text-slate-400 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-lg font-medium mb-1">Weekly Insight</h3>
                 <p className="text-indigo-100 text-sm leading-relaxed">
                   Your resilience score has improved by 15% this week. You are logging more positive interactions in the morning.
                 </p>
               </div>
               <div className="absolute -right-4 -bottom-4 opacity-10">
                 <BarChart3 size={120} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC<{ points: number, level: number, badges: any[] }> = ({ points, level, badges }) => {
  return (
     <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center space-x-6 mb-8">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-4xl shadow-lg">
                😶‍🌫️
             </div>
             <div>
               <h2 className="text-2xl font-bold text-slate-800">Explorer</h2>
               <p className="text-slate-500">Joined September 2024</p>
               <div className="mt-3 flex items-center space-x-3">
                 <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">Level {level}</span>
                 <span className="text-sm text-slate-600 font-medium">{points} Points</span>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
             <h3 className="text-lg font-medium text-slate-800 mb-6">Badges & Achievements</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map(badge => (
                  <div key={badge.id} className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="font-bold text-slate-700 text-sm">{badge.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{badge.desc}</div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
             <h3 className="text-lg font-medium text-slate-800 mb-6">Account Settings</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                  <span className="text-slate-600">Export Data</span>
                  <ArrowRight size={24} className="text-slate-300 group-hover:text-indigo-500" />
               </div>
               <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                  <span className="text-slate-600">Notification Preferences</span>
                  <ArrowRight size={24} className="text-slate-300 group-hover:text-indigo-500" />
               </div>
               <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                  <span className="text-slate-600">Privacy Policy</span>
                  <ArrowRight size={24} className="text-slate-300 group-hover:text-indigo-500" />
               </div>
             </div>
          </div>
        </div>
     </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // --- State ---
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'profile'>('home');
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>(EmotionType.NEUTRAL);
  const [audioIntensity, setAudioIntensity] = useState(0);
  
  // UX State
  const [greeting, setGreeting] = useState("How are you feeling today?");
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // For modal
  
  // Gamification State
  const [points, setPoints] = useState(150); // Start lower to show growth
  const [streak, setStreak] = useState(2);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    { id: '1', label: '5 min grounding breath', completed: false },
    { id: '2', label: 'Log a gratitude thought', completed: false },
    { id: '3', label: 'Take a short walk', completed: false },
  ]);

  const historyData = useMemo(() => generateMockHistory(), []);

  // --- Refs ---
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastAnalyzedTextRef = useRef('');

  // --- Task Logic ---
  // Periodically check for unlocked tasks to refresh them
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let needsUpdate = false;

      const newTasks = dailyTasks.map(task => {
        if (task.unlocksAt && task.unlocksAt <= now) {
          needsUpdate = true;
          // Replace unlocked placeholder with real task
          const availableTasks = TASK_POOL.filter(poolItem => !dailyTasks.some(p => p.label === poolItem));
          const randomTaskLabel = availableTasks[Math.floor(Math.random() * availableTasks.length)];
          
          return {
            id: Date.now().toString() + Math.random(),
            label: randomTaskLabel || "Deep breath",
            completed: false
          };
        }
        return task;
      });

      if (needsUpdate) {
        setDailyTasks(newTasks);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dailyTasks]);

  const handleCompleteTask = useCallback((id: string) => {
     setPoints(p => p + 100);
     
     setDailyTasks(prev => prev.map(task => {
       if (task.id === id) {
         // Instead of removing, transform into a locked placeholder
         return {
           id: task.id, // keep id stable or change? keeping stable helps exit anim, actually gamification handles exit
           label: 'Refreshing...',
           completed: true, // effectively ignored by new logic in gamification, but good for data
         };
       }
       return task;
     }));

     // After animation time, replace with locked state
     setTimeout(() => {
        setDailyTasks(prev => prev.map(task => {
           if (task.id === id) {
             return {
               id: task.id,
               label: 'Locked',
               completed: false,
               unlocksAt: Date.now() + 10000 // 10 second cooldown
             };
           }
           return task;
        }));
     }, 500); // Sync with Gamification.tsx remove delay
  }, []);

  // --- Audio & Speech Setup ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Audio Context for Visuals
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      
      updateVisualizer();

      // Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const finalText = event.results[i][0].transcript;
              setTranscript(prev => [...prev, finalText]);
              setCurrentText('');
              performAnalysis(finalText);
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (interimTranscript) {
            setCurrentText(interimTranscript);
            if (Math.abs(interimTranscript.length - lastAnalyzedTextRef.current.length) > 15) {
                 const words = interimTranscript.split(' ');
                 const chunk = words.slice(-5).join(' ');
                 performAnalysis(chunk);
            }
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      setIsRecording(true);
      setGreeting("Listening...");
      
    } catch (err) {
      console.error("Error initializing audio:", err);
      alert("Microphone access denied or not supported.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (audioContextRef.current) audioContextRef.current.close();
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    
    setIsRecording(false);
    setAudioIntensity(0);
    setGreeting("Session logged. Nice work.");
    
    setTimeout(() => {
      setCurrentEmotion(EmotionType.NEUTRAL);
      setTimeout(() => setGreeting("How are you feeling today?"), 3000);
    }, 2000);
  };

  const updateVisualizer = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i];
    }
    const average = sum / dataArrayRef.current.length;
    const normalized = Math.min(1, average / 128); 
    
    setAudioIntensity(normalized);
    rafIdRef.current = requestAnimationFrame(updateVisualizer);
  };

  const performAnalysis = async (text: string) => {
    lastAnalyzedTextRef.current = text;
    const result = await analyzeEmotion(text, audioIntensity, 0.5); 
    setCurrentEmotion(result.emotion);
    if (isRecording) setPoints(p => p + 5);
  };

  // Helper to find entry for selected date
  const selectedEntry = useMemo(() => {
    if (!selectedDate) return null;
    return historyData.find(h => 
      h.date.getDate() === selectedDate.getDate() && 
      h.date.getMonth() === selectedDate.getMonth()
    );
  }, [selectedDate, historyData]);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row overflow-hidden transition-colors duration-500 ${userSettings.theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        settings={userSettings}
        onUpdate={setUserSettings}
      />

      {/* Detail Modal for Calendar */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setSelectedDate(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
              
              <div className="mb-6 text-center">
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-widest">{format(selectedDate, 'MMMM d, yyyy')}</h3>
                {selectedEntry ? (
                  <div className="mt-4 flex flex-col items-center">
                     <div 
                        className="w-16 h-16 rounded-full mb-3 shadow-inner" 
                        style={{ backgroundColor: EMOTION_COLORS[selectedEntry.emotion] }}
                     />
                     <div className="text-3xl font-light capitalize text-slate-800">{selectedEntry.emotion}</div>
                  </div>
                ) : (
                  <div className="mt-8 text-slate-400 italic">No entry recorded for this day.</div>
                )}
              </div>

              {selectedEntry && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Transcript</div>
                   <p className="text-slate-700 italic">"{selectedEntry.transcript || '...'}"</p>
                   <div className="mt-4 flex justify-between text-xs text-slate-500">
                      <span>Intensity: {(selectedEntry.intensity * 100).toFixed(0)}%</span>
                      <span>09:41 AM</span>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Left Sidebar / Navigation */}
      <aside className={`w-full md:w-20 lg:w-64 border-r flex flex-col items-center lg:items-start p-6 z-20 shadow-sm md:shadow-none ${userSettings.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="mb-10 flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          <h1 className="hidden lg:block text-2xl font-light tracking-tight">Tonus</h1>
        </div>
        
        <nav className="flex md:flex-col space-x-6 md:space-x-0 md:space-y-4 w-full">
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${currentView === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Mic size={28} className="stroke-[1.5]" />
            <span className="hidden lg:inline font-medium">Live Session</span>
          </button>

          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${currentView === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={28} className="stroke-[1.5]" />
            <span className="hidden lg:inline font-medium">Dashboard</span>
          </button>

          <button 
            onClick={() => setCurrentView('profile')}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${currentView === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <User size={28} className="stroke-[1.5]" />
            <span className="hidden lg:inline font-medium">Profile</span>
          </button>

          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <SettingsIcon size={28} className="stroke-[1.5]" />
            <span className="hidden lg:inline font-medium">Settings</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 hidden lg:block w-full">
           <div className={`p-4 rounded-xl ${userSettings.theme === 'dark' ? 'bg-slate-700/50' : 'bg-indigo-50'}`}>
             <p className={`text-xs font-semibold mb-1 ${userSettings.theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Daily Tip</p>
             <p className={`text-sm leading-snug ${userSettings.theme === 'dark' ? 'text-slate-300' : 'text-indigo-900'}`}>"Pause before reacting. Your calm is your power."</p>
           </div>
        </div>
      </aside>

      {/* Main Content Router */}
      {currentView === 'home' && (
        <main className="flex-1 relative flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
          
          {/* Center: The Orb & Interactions */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-4 md:p-8">
             
             {/* Emotion Label Overlay */}
             <div className="absolute top-8 text-center z-10">
               <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">Current Resonance</h2>
               <div className={`text-3xl md:text-4xl font-light capitalize transition-all duration-700 ${userSettings.theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                 {currentEmotion}
               </div>
               {isRecording && (
                 <div className="mt-2 flex items-center justify-center space-x-2">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-xs text-red-500 font-medium">ANALYZING VOICE</span>
                 </div>
               )}
             </div>

             {/* The 3D Orb */}
             <div className="w-full max-w-md aspect-square md:max-w-lg lg:max-w-xl relative z-0">
               <Orb 
                  emotion={currentEmotion} 
                  intensity={audioIntensity} 
                  isRecording={isRecording}
                  config={{
                    sensitivity: userSettings.micSensitivity,
                    reducedMotion: userSettings.reducedMotion
                  }}
               />
             </div>

             {/* Live Transcription */}
             <div className="absolute bottom-32 w-full max-w-2xl px-6 text-center min-h-[3rem]">
               <p className={`text-lg md:text-xl font-light leading-relaxed transition-opacity duration-300 ${userSettings.theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                 {currentText || (transcript.length > 0 ? transcript[transcript.length - 1] : greeting)}
               </p>
             </div>

             {/* Controls */}
             <div className="absolute bottom-8 z-20">
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`
                    group relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300
                    ${isRecording ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105' : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-110'}
                  `}
                >
                   {isRecording ? <Pause size={28} fill="currentColor" /> : <Mic size={28} />}
                   {isRecording && (
                     <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20 animate-ping"></span>
                   )}
                </button>
             </div>
          </div>

          {/* Right Panel: Gamification & Quick Stats (Collapsible on mobile) */}
          <div className={`hidden md:flex w-80 lg:w-96 border-l flex-col p-6 overflow-y-auto z-10 ${userSettings.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="space-y-8">
              {/* Gamification Component */}
              <MentalWealthList 
                points={points} 
                streak={streak} 
                dailyTasks={dailyTasks} 
                onCompleteTask={handleCompleteTask}
              />

              {/* Compact Calendar (Quick Look) */}
              <Calendar 
                history={historyData} 
                compact={true} 
                onDateSelect={(date) => setSelectedDate(date)} 
              />
            </div>
          </div>
        </main>
      )}

      {currentView === 'dashboard' && (
        <DashboardView 
          history={historyData} 
          onDateSelect={(date) => setSelectedDate(date)} 
        />
      )}

      {currentView === 'profile' && (
        <ProfileView 
          points={points} 
          level={Math.floor(points / 300) + 1} 
          badges={BADGES} 
        />
      )}

    </div>
  );
};

export default App;