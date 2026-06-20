import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Phone, User, AlertCircle, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState('signup'); // 'signup' or 'otp'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const timerRef = useRef();

  // Handle countdown for Resend OTP button
  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, resendTimer]);

  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('errorEmptyName') || 'Please enter your name.');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError(t('errorInvalidPhone') || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setStep('otp');
    setResendTimer(30);
    setOtpInputs(['', '', '', '']);
    
    // Auto focus the first OTP input in the next tick
    setTimeout(() => {
      if (inputRefs[0].current) inputRefs[0].current.focus();
    }, 100);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Allow only numbers
    
    const newOtp = [...otpInputs];
    // Take only the last character if pasted/multiple typed
    newOtp[index] = value.slice(-1);
    setOtpInputs(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Focus previous on backspace
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otpInputs.join('');
    
    if (enteredOtp === generatedOtp) {
      login(name, phone);
    } else {
      setError(t('invalidOtp') || 'Incorrect OTP. Please check the code and try again.');
      setIsShaking(true);
      setOtpInputs(['', '', '', '']);
      if (inputRefs[0].current) inputRefs[0].current.focus();
      
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    
    setError('');
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setResendTimer(30);
    setOtpInputs(['', '', '', '']);
    if (inputRefs[0].current) inputRefs[0].current.focus();
  };

  const handleBackToSignup = () => {
    setStep('signup');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 animate-fadeIn">
      <div className="driver-card bg-white border border-amber-100 p-6 md:p-8 space-y-6 shadow-md text-center">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-amber-500 p-3 rounded-2xl text-white shadow-sm flex items-center justify-center">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none mt-2">
            {t('appName')}
          </h2>
          <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">
            {t('tagline')}
          </p>
        </div>

        {step === 'signup' ? (
          /* Signup Form Step */
          <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
            <div className="text-center space-y-1 mb-4">
              <h3 className="text-base font-black text-slate-700">
                {t('loginWelcome') || 'Driver Sign In'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t('loginIntro') || 'Verify your profile with a quick, secure code.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-start gap-2 text-xs font-bold leading-normal">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-400" />
                {t('formName') || 'Your Full Name'}
              </label>
              <input
                type="text"
                value={name}
                required
                placeholder="e.g. Ramesh Kumar"
                onChange={(e) => setName(e.target.value)}
                className="tap-target w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-amber-500 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-400" />
                {t('formPhone') || 'Mobile Number'}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-black text-slate-400 border-r border-slate-200 pr-2">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  required
                  placeholder="9876543210"
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="tap-target w-full pl-16 pr-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-amber-500 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="driver-btn-primary w-full gap-2 mt-2">
              <span>{t('btnSendOtp') || 'Request 4-Digit OTP'}</span>
            </button>

          </form>
        ) : (
          /* OTP Verification Step */
          <div className="space-y-5 text-center">
            
            {/* Demo Mode OTP Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-slate-700 shadow-inner flex flex-col items-center justify-center gap-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-700">Demo Verification Box</span>
              <span className="text-base font-black text-slate-800 tracking-wide">
                🔑 {t('demoBanner', { otp: generatedOtp }) || `Demo Mode: Your OTP is ${generatedOtp}`}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-700">
                {t('enterOtp') || 'Enter the 4-digit code sent to your phone'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Sent to: <span className="font-bold text-slate-600">+91 {phone}</span>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-start justify-center gap-2 text-xs font-bold leading-normal">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* OTP 4 Input Grid */}
            <div className={`flex justify-center gap-3 py-2 ${isShaking ? 'animate-shake' : ''}`}>
              {otpInputs.map((val, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  value={val}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-14 h-14 border-2 border-slate-200 focus:border-amber-500 rounded-2xl text-center font-black text-xl text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-amber-50"
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpInputs.some(x => !x)}
                className={`driver-btn-primary w-full gap-2 ${
                  otpInputs.some(x => !x) ? 'opacity-50 cursor-not-allowed bg-slate-300 hover:bg-slate-300 border-transparent shadow-none text-slate-500' : ''
                }`}
              >
                <KeyRound className="h-5 w-5" />
                <span>{t('btnVerify') || 'Verify & Enter'}</span>
              </button>

              <div className="flex items-center justify-between text-xs px-1">
                <button
                  type="button"
                  onClick={handleBackToSignup}
                  className="text-slate-500 hover:text-slate-800 font-black flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t('btnBackToSignup') || 'Change Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className={`font-black flex items-center gap-1 ${
                    resendTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-amber-600 hover:text-amber-700'
                  }`}
                >
                  <RefreshCw className={`h-4 w-4 ${resendTimer > 0 ? '' : 'animate-spin'}`} style={{ animationDuration: '4s' }} />
                  <span>
                    {resendTimer > 0 
                      ? `${t('btnResendTimer') || 'Resend in'} ${resendTimer}s` 
                      : t('btnResend') || 'Resend OTP'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
