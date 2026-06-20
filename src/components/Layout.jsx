import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useLog } from '../context/LogContext';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Activity, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Languages, 
  Award,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  UserCheck
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { t, language, changeLanguage } = useLanguage();
  const { streak } = useLog();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { path: '/', labelKey: 'navHome', icon: Home },
    { path: '/risk-check', labelKey: 'navRisk', icon: Activity },
    { path: '/stretches', labelKey: 'navStretches', icon: Sparkles },
    { path: '/find-help', labelKey: 'navHelp', icon: MapPin },
    { path: '/daily-log', labelKey: 'navLog', icon: TrendingUp },
  ];

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeDrawer();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#111E2E]">
      
      {/* Top Header */}
      <header className="bg-white border-b border-amber-100 sticky top-0 z-50 px-4 py-3 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Side: Logo & Hamburger */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Mobile Only) */}
            <button 
              onClick={toggleDrawer}
              className="md:hidden tap-target p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-transform"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6 stroke-[2.2]" />
            </button>

            <NavLink to="/" className="flex items-center gap-2">
              <div className="bg-amber-500 p-2 rounded-xl text-white shadow-sm flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-lg md:text-2xl font-black text-slate-800 tracking-tight block leading-none">
                  {t('appName')}
                </span>
                <span className="text-[9px] md:text-xs text-amber-600 font-semibold tracking-wide uppercase">
                  {t('tagline')}
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation links (hidden on mobile, shown in header center on desktop) */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                    isActive 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(item.labelKey)}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2.5">
            {/* Streak Badge */}
            {streak > 0 && (
              <div className="hidden sm:flex bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full items-center gap-1.5 text-xs font-bold shadow-sm animate-pulse">
                <Award className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>{streak} {t('streakDays')}!</span>
              </div>
            )}

            {/* Language Selector Dropdown (Accessible & Clean) */}
            <div className="relative flex items-center bg-amber-50 border border-amber-200 text-slate-700 rounded-xl px-2 py-1 select-none">
              <Languages className="h-4 w-4 text-amber-600 mr-1.5 pointer-events-none" />
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="bg-transparent text-xs font-extrabold pr-4 py-1 outline-none appearance-none cursor-pointer text-slate-800"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
                <option value="te">తెలుగు</option>
              </select>
              <div className="absolute right-2.5 pointer-events-none text-slate-500 text-[10px] font-black">&#9662;</div>
            </div>

            {/* Nav Profile (Desktop Only) */}
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center gap-2 bg-slate-900 text-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm text-xs font-bold">
                <UserCheck className="h-4 w-4 text-amber-400" />
                <span>{user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="ml-2 pl-2 border-l border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={closeDrawer}
        >
          {/* Drawer Sidebar */}
          <div 
            className="w-72 max-w-[80vw] h-full bg-white shadow-2xl flex flex-col justify-between p-5 animate-slideInLeft"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Area */}
            <div className="space-y-6">
              
              {/* Drawer Header with Profile/Close */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Driver Portal</span>
                  {isAuthenticated && user ? (
                    <div className="flex items-center gap-2 text-slate-800">
                      <UserCheck className="h-5 w-5 text-amber-500" />
                      <div className="text-sm font-black truncate max-w-[160px]">{user.name}</div>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-slate-500">Not Logged In / अनुपलब्ध</div>
                  )}
                </div>

                <button 
                  onClick={closeDrawer}
                  className="tap-target p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink 
                      key={item.path} 
                      to={item.path}
                      onClick={closeDrawer}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-extrabold transition-all ${
                        isActive 
                          ? 'bg-amber-500 text-white shadow-md' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{t(item.labelKey)}</span>
                    </NavLink>
                  );
                })}
              </nav>

            </div>

            {/* Bottom Area: Logout */}
            <div className="border-t border-slate-100 pt-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="tap-target w-full flex items-center justify-center gap-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 font-black rounded-xl py-3.5 transition-colors active:scale-95"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout / लॉगआउट</span>
                </button>
              ) : (
                <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-wide">
                  Protected System &bull; सुरक्षित प्रणाली
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 md:px-8">
        {children}
      </main>

      {/* Static Footer (Not Fixed) */}
      <footer className="hidden md:block bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs font-bold mt-auto">
        <p>&copy; 2026 {t('appName')} &bull; {t('tagline')}</p>
      </footer>

    </div>
  );
};
