import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Compass, 
  Dumbbell, 
  Flame, 
  ShieldCheck, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Web Audio API sound generator for premium micro-interactions
const playTone = (frequency, type, duration) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio Context block or unsupported", e);
  }
};

const playSuccessSound = () => {
  // Play a quick cheerful major third arpeggio (C5 -> E5 -> G5)
  playTone(523.25, 'triangle', 0.15); // C5
  setTimeout(() => playTone(659.25, 'triangle', 0.15), 120); // E5
  setTimeout(() => playTone(783.99, 'triangle', 0.3), 240); // G5
};

const playTickSound = () => {
  // Quiet wooden block tick sound
  playTone(1000, 'sine', 0.05);
};

// Sub-component: Individual Stretch Timer
const StretchTimer = ({ durationSeconds, onComplete }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playSuccessSound();
            if (onComplete) onComplete();
            return 0;
          }
          playTickSound();
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onComplete]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationSeconds);
  };

  // SVG Circular path math
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / durationSeconds) * circumference;

  return (
    <div className="flex items-center gap-4 bg-amber-50/60 border border-amber-100 p-3 rounded-2xl">
      
      {/* Circular Timer Visual */}
      <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
        <svg className="h-16 w-16 transform -rotate-90">
          <circle 
            className="circle-bg" 
            cx="32" 
            cy="32" 
            r={radius} 
            strokeWidth="4"
          />
          <circle 
            className="circle-progress" 
            cx="32" 
            cy="32" 
            r={radius} 
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="absolute text-sm font-black text-slate-800">
          {timeLeft > 0 ? `${timeLeft}s` : <Check className="h-5 w-5 text-teal-600 stroke-[3.5] animate-bounce" />}
        </span>
      </div>

      {/* Controls */}
      <div className="flex-grow space-y-2">
        <div className="flex gap-2">
          {timeLeft > 0 ? (
            <button
              onClick={handleStartPause}
              className={`tap-target flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black shadow-sm transition-colors duration-150 active:scale-95 ${
                isRunning 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4.5 w-4.5 fill-white" />
                  <span>{t('btnPause')}</span>
                </>
              ) : (
                <>
                  <Play className="h-4.5 w-4.5 fill-white" />
                  <span>{t('btnStartTimer')}</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex-1 text-xs font-bold text-teal-700 bg-teal-100/70 border border-teal-200 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1">
              <Check className="h-4.5 w-4.5" />
              <span>{t('stretchComplete')}</span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="tap-target bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 p-2.5 rounded-xl flex items-center justify-center shadow-sm active:scale-95"
            title={t('btnReset')}
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export const Stretches = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [completedStretches, setCompletedStretches] = useState({});

  const categories = [
    { id: 'all', labelKey: 'filterAll' },
    { id: 'neck', labelKey: 'filterNeck' },
    { id: 'shoulders', labelKey: 'filterShoulders' },
    { id: 'back', labelKey: 'filterBack' },
    { id: 'legs', labelKey: 'filterLegs' }
  ];

  const stretchesData = [
    {
      id: 'neck-rolls',
      category: 'neck',
      title: 'Neck Tilts & Rolls / गर्दन झुकाना और घुमाना',
      duration: 30,
      steps: [
        'Sit straight, let your shoulders drop naturally.',
        'Slowly tip your right ear towards your right shoulder until you feel a gentle stretch. Hold for 5 seconds.',
        'Roll your head forward slowly, bringing chin to chest.',
        'Slowly tilt left ear to left shoulder. Hold for 5 seconds. Repeat in reverse direction.'
      ],
      illustration: '🧘'
    },
    {
      id: 'seated-twist',
      category: 'back',
      title: 'Seated Spinal Twist / बैठकर रीढ़ की घुमावदार स्ट्रेच',
      duration: 30,
      steps: [
        'Sit forward in your seat with feet flat on the cabin floor.',
        'Place your right hand on your left knee and your left hand on the seat backrest or armrest behind you.',
        'Breathe in, then breathe out and gently twist your torso to the left, looking over your shoulder.',
        'Hold for 10-15 seconds. Slowly release and repeat on the other side.'
      ],
      illustration: '🔄'
    },
    {
      id: 'shoulder-shrugs',
      category: 'shoulders',
      title: 'Shoulder Shrugs & Rolls / कंधे सिकुड़ना और घुमाना',
      duration: 30,
      steps: [
        'Inhale deeply and shrug your shoulders up high towards your ears.',
        'Hold the shrug tightly for 3 seconds.',
        'Exhale and drop your shoulders down, rolling them backwards in a slow circular motion.',
        'Repeat this circular movement forward and backward 5 times.'
      ],
      illustration: '💪'
    },
    {
      id: 'chest-stretch',
      category: 'shoulders',
      title: 'Steering Wheel Chest Opener / छाती को खोलने वाला स्ट्रेच',
      duration: 30,
      steps: [
        'Place both hands on the steering wheel/handlebars at 9 and 3 o’clock positions.',
        'Push your chest forward and pull your shoulder blades together behind you.',
        'Gently tilt your chin upward slightly to expand your throat and chest.',
        'Hold for 15 seconds, breathing deeply and letting tension leave your chest muscles.'
      ],
      illustration: '👐'
    },
    {
      id: 'ankle-pumps',
      category: 'legs',
      title: 'Ankle Pumps & Circles / टखने का पंप और घुमाव',
      duration: 30,
      steps: [
        'Lift your right foot slightly off the cabin floor.',
        'Point your toes forward away from you, then flex them upward towards your face. Do this 10 times.',
        'Rotate your ankle in a circle clockwise 5 times, then counter-clockwise 5 times.',
        'Lower your foot and repeat the sequence with your left foot.'
      ],
      illustration: '👣'
    },
    {
      id: 'wrist-extensions',
      category: 'shoulders',
      title: 'Wrist & Finger Stretches / कलाई और उंगलियों का खिंचाव',
      duration: 30,
      steps: [
        'Extend your right arm straight in front of you, palm facing outward, fingers pointing up.',
        'Use your left hand to pull your fingers gently back towards your body until you stretch the forearm.',
        'Hold for 10 seconds, then point your fingers down and stretch the top of your wrist.',
        'Repeat the cycle with your left arm and fingers.'
      ],
      illustration: '✋'
    }
  ];

  const handleStretchComplete = (id) => {
    setCompletedStretches(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const filteredStretches = filter === 'all' 
    ? stretchesData 
    : stretchesData.filter(s => s.category === filter);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <Sparkles className="h-7 w-7 text-amber-500 fill-amber-100" />
          <span>{t('stretchesTitle')}</span>
        </h1>
        <p className="text-sm text-slate-600 font-semibold leading-relaxed">
          {t('stretchesSubtitle')}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`tap-target px-4 py-2 rounded-xl text-xs md:text-sm font-black border transition-all duration-150 active:scale-95 ${
              filter === cat.id
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Stretches Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStretches.map((stretch) => {
          const isDone = completedStretches[stretch.id];
          return (
            <div 
              key={stretch.id} 
              className={`driver-card flex flex-col justify-between border-2 bg-white relative overflow-hidden ${
                isDone ? 'border-teal-200 shadow-teal-50 bg-teal-50/5' : 'border-amber-100'
              }`}
            >
              {/* Badge for finished stretch */}
              {isDone && (
                <div className="absolute top-2 right-2 bg-teal-100 text-teal-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>DONE</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Title & Icon Header */}
                <div className="flex gap-3.5 items-start">
                  <div className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-center shrink-0 shadow-sm">
                    {stretch.illustration}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 leading-snug">
                      {stretch.title}
                    </h3>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {stretch.category}
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    Instructions:
                  </span>
                  <ol className="space-y-2">
                    {stretch.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-slate-700 font-semibold leading-relaxed">
                        <span className="text-amber-600 font-bold shrink-0">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Bottom Timer Component */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <StretchTimer 
                  durationSeconds={stretch.duration} 
                  onComplete={() => handleStretchComplete(stretch.id)} 
                />
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
