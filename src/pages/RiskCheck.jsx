import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Activity, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  RefreshCw, 
  AlertTriangle,
  HeartPulse,
  Smile
} from 'lucide-react';

export const RiskCheck = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 to 4 for questions, 5 for result
  
  // Quiz Answers State
  const [hours, setHours] = useState('');
  const [painAreas, setPainAreas] = useState([]);
  const [frequency, setFrequency] = useState('');
  const [sleep, setSleep] = useState('');
  const [breaks, setBreaks] = useState('');

  const questions = [
    {
      id: 'q1',
      titleKey: 'q1',
      type: 'single',
      options: [
        { label: '1 - 4 Hours', value: '1-4', score: 1 },
        { label: '5 - 8 Hours', value: '5-8', score: 2 },
        { label: '9 - 12 Hours', value: '9-12', score: 3 },
        { label: 'More than 12 Hours', value: '12+', score: 4 },
      ],
      state: hours,
      setState: setHours
    },
    {
      id: 'q2',
      titleKey: 'q2',
      type: 'multi',
      options: [
        { label: 'Lower Back / पीठ के निचले हिस्से में', value: 'back', score: 2 },
        { label: 'Neck / गर्दन में', value: 'neck', score: 2 },
        { label: 'Shoulders & Arms / कंधे और बाहों में', value: 'shoulders', score: 1 },
        { label: 'Legs & Ankles / पैरों और टखनों में', value: 'legs', score: 1 },
        { label: 'No Pain / कोई दर्द नहीं', value: 'none', score: 0 }
      ],
      state: painAreas,
      setState: (val) => {
        // If 'none' is selected, clear other selections. If others are selected, clear 'none'.
        if (val === 'none') {
          setPainAreas(['none']);
        } else {
          setPainAreas((prev) => {
            const filtered = prev.filter(x => x !== 'none');
            if (filtered.includes(val)) {
              return filtered.filter(x => x !== val);
            } else {
              return [...filtered, val];
            }
          });
        }
      }
    },
    {
      id: 'q3',
      titleKey: 'q3',
      type: 'single',
      options: [
        { label: 'Rarely / कभी-कभार', value: 'rarely', score: 1 },
        { label: 'Sometimes (few times a week) / कभी-कभी', value: 'sometimes', score: 2 },
        { label: 'Daily (after shift) / दैनिक', value: 'daily', score: 3 },
        { label: 'Constant (always aching) / लगातार', value: 'constant', score: 4 }
      ],
      state: frequency,
      setState: setFrequency
    },
    {
      id: 'q4',
      titleKey: 'q4',
      type: 'single',
      options: [
        { label: 'Less than 5 Hours / 5 घंटे से कम', value: 'less-5', score: 3 },
        { label: '5 - 6 Hours / 5 - 6 घंटे', value: '5-6', score: 2 },
        { label: '7 - 8 Hours / 7 - 8 घंटे', value: '7-8', score: 1 },
        { label: 'More than 8 Hours / 8 घंटे से अधिक', value: '8+', score: 0 }
      ],
      state: sleep,
      setState: setSleep
    },
    {
      id: 'q5',
      titleKey: 'q5',
      type: 'single',
      options: [
        { label: 'Every 1-2 hours / हर 1-2 घंटे में', value: '1-2h', score: 1 },
        { label: 'Every 3-4 hours / हर 3-4 घंटे में', value: '3-4h', score: 2 },
        { label: 'Rarely / बहुत कम ही', value: 'rarely', score: 3 }
      ],
      state: breaks,
      setState: setBreaks
    }
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length); // results
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setHours('');
    setPainAreas([]);
    setFrequency('');
    setSleep('');
    setBreaks('');
    setStep(0);
  };

  // Check if current question has an answer selected
  const isQuestionAnswered = () => {
    const q = questions[step];
    if (!q) return false;
    if (q.type === 'single') return q.state !== '';
    if (q.type === 'multi') return q.state.length > 0;
    return false;
  };

  // Risk calculation logic
  const calculateRisk = () => {
    let total = 0;
    
    // Q1
    const q1Opt = questions[0].options.find(o => o.value === hours);
    if (q1Opt) total += q1Opt.score;

    // Q2 (multi-select pain areas)
    let painScore = 0;
    painAreas.forEach(val => {
      const opt = questions[1].options.find(o => o.value === val);
      if (opt) painScore += opt.score;
    });
    // Cap pain areas score at 4
    total += Math.min(painScore, 4);

    // Q3
    const q3Opt = questions[2].options.find(o => o.value === frequency);
    if (q3Opt) total += q3Opt.score;

    // Q4
    const q4Opt = questions[3].options.find(o => o.value === sleep);
    if (q4Opt) total += q4Opt.score;

    // Q5
    const q5Opt = questions[4].options.find(o => o.value === breaks);
    if (q5Opt) total += q5Opt.score;

    if (total <= 6) return 'low';
    if (total <= 11) return 'mod';
    return 'high';
  };

  const riskResult = step === questions.length ? calculateRisk() : null;

  return (
    <div className="max-w-2xl mx-auto pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center md:text-left mb-6 space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          {t('riskTitle')}
        </h1>
        {step < questions.length && (
          <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">
            {t('riskIntro')}
          </p>
        )}
      </div>

      {step < questions.length ? (
        /* Questionnaire Wizard */
        <div className="driver-card space-y-6 bg-white">
          
          {/* Progress Indicators */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black text-slate-500">
              <span>Question {step + 1} of {questions.length}</span>
              <span className="text-amber-600 font-extrabold">{Math.round(((step) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Title */}
          <div className="py-2">
            <h2 className="text-lg md:text-xl font-black text-slate-800 leading-snug">
              {t(questions[step].titleKey)}
            </h2>
            {questions[step].type === 'multi' && (
              <span className="text-xs font-bold text-amber-600 mt-1 block">
                (Select all that apply / एक से अधिक विकल्प चुन सकते हैं)
              </span>
            )}
          </div>

          {/* Question Option Buttons */}
          <div className="grid grid-cols-1 gap-3">
            {questions[step].options.map((opt) => {
              const q = questions[step];
              let isSelected = false;
              if (q.type === 'single') {
                isSelected = q.state === opt.value;
              } else {
                isSelected = q.state.includes(opt.value);
              }

              return (
                <button
                  key={opt.value}
                  onClick={() => q.setState(opt.value)}
                  className={`tap-target w-full text-left p-4 rounded-xl border-2 font-bold transition-all duration-150 flex items-center justify-between active:scale-[0.99] ${
                    isSelected 
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-sm md:text-base leading-tight">{opt.label}</span>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected 
                      ? 'border-amber-500 bg-amber-500 text-white' 
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="h-4.5 w-4.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 pt-4 border-t border-slate-100 justify-between">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`driver-btn-secondary gap-2 px-5 py-3 ${step === 0 ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400' : ''}`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t('btnPrev')}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isQuestionAnswered()}
              className={`driver-btn-primary gap-2 px-6 py-3 shrink-0 ${
                !isQuestionAnswered() ? 'opacity-55 cursor-not-allowed bg-slate-300 hover:bg-slate-300 text-slate-500 border-transparent shadow-none' : ''
              }`}
            >
              <span>{step === questions.length - 1 ? t('btnSubmit') : t('btnNext')}</span>
              {step < questions.length - 1 && <ArrowRight className="h-5 w-5" />}
            </button>
          </div>

        </div>
      ) : (
        /* Risk Result Dashboard */
        <div className="space-y-6">
          
          {/* Main Score Card */}
          <div className="driver-card text-center p-8 space-y-6 relative overflow-hidden bg-white">
            
            {/* Design accents */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-rose-400 to-teal-400" />
            
            <div className="flex justify-center">
              {riskResult === 'low' ? (
                <div className="bg-teal-50 text-teal-600 border border-teal-200 p-5 rounded-full flex items-center justify-center">
                  <Smile className="h-14 w-14" />
                </div>
              ) : riskResult === 'mod' ? (
                <div className="bg-amber-50 text-amber-600 border border-amber-200 p-5 rounded-full flex items-center justify-center">
                  <HeartPulse className="h-14 w-14" />
                </div>
              ) : (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 p-5 rounded-full flex items-center justify-center animate-bounce">
                  <AlertTriangle className="h-14 w-14" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">
                {t('resultTitle')}
              </h2>
              
              <div className={`text-3xl md:text-4xl font-black ${
                riskResult === 'low' ? 'text-teal-600' :
                riskResult === 'mod' ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {riskResult === 'low' && t('riskLow')}
                {riskResult === 'mod' && t('riskMod')}
                {riskResult === 'high' && t('riskHigh')}
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold max-w-lg mx-auto">
              {riskResult === 'low' && t('riskLowDesc')}
              {riskResult === 'mod' && t('riskModDesc')}
              {riskResult === 'high' && t('riskHighDesc')}
            </p>

            {/* Recommendations Section */}
            <div className="border-t border-slate-100 pt-6 text-left space-y-4">
              <h4 className="text-sm uppercase tracking-wide text-slate-500 font-black">
                Recommended Actions:
              </h4>
              <ul className="space-y-2.5 text-slate-700 text-sm font-semibold">
                {riskResult === 'low' && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <span className="bg-teal-100 text-teal-800 rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                      <span>Continue to take a 2-minute stretch break every 3-4 hours.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="bg-teal-100 text-teal-800 rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                      <span>Try our simple hand and wrist stretches while waiting for customers.</span>
                    </li>
                  </>
                )}
                {riskResult === 'mod' && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <span className="bg-amber-100 text-amber-800 rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5">!</span>
                      <span>Perform the **Seated Spinal Twist** and **Shoulders Shrugs** twice daily.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="bg-amber-100 text-amber-800 rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5">!</span>
                      <span>Set a alarm or remember to step out of your seat after every 4th passenger.</span>
                    </li>
                  </>
                )}
                {riskResult === 'high' && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <span className="bg-rose-100 text-rose-800 rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5">⚠</span>
                      <span>Do at least 3 minutes of **Spinal Twist** and **Neck Rolls** immediately.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="bg-rose-100 text-rose-800 rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5">⚠</span>
                      <span>Seek a free checkup at a nearby Transit Health Camp as soon as possible.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="bg-rose-100 text-rose-800 rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5">⚠</span>
                      <span>Try to log your daily pain level to track pattern changes.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleReset}
                className="driver-btn-secondary gap-2 flex-1"
              >
                <RefreshCw className="h-5 w-5" />
                <span>{t('ctaRecheck')}</span>
              </button>
              
              {(riskResult === 'mod' || riskResult === 'high') && (
                <button
                  onClick={() => navigate('/stretches')}
                  className="driver-btn-primary gap-2 flex-1 animate-pulse"
                >
                  <span>{t('ctaGoToStretches')}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
