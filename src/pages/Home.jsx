import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Activity, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Heart,
  Users,
  Clock,
  AlertCircle
} from 'lucide-react';

export const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { value: t('statsSeatedHours'), sub: t('statsSeatedHoursSub'), icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: t('statsDriverCount'), sub: t('statsDriverCountSub'), icon: Users, color: 'bg-teal-100 text-teal-700 border-teal-200' },
    { value: t('statsPainRate'), sub: t('statsPainRateSub'), icon: AlertCircle, color: 'bg-rose-100 text-rose-700 border-rose-200' },
  ];

  const cards = [
    { 
      path: '/risk-check', 
      titleKey: 'ctaRiskCheck', 
      descKey: 'ctaRiskCheckDesc', 
      icon: Activity, 
      color: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50',
      iconColor: 'bg-amber-500 text-white'
    },
    { 
      path: '/stretches', 
      titleKey: 'ctaStretches', 
      descKey: 'ctaStretchesDesc', 
      icon: Sparkles, 
      color: 'border-teal-200 bg-teal-50/50 hover:bg-teal-50',
      iconColor: 'bg-teal-500 text-white'
    },
    { 
      path: '/find-help', 
      titleKey: 'ctaFindHelp', 
      descKey: 'ctaFindHelpDesc', 
      icon: MapPin, 
      color: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50',
      iconColor: 'bg-blue-500 text-white'
    },
    { 
      path: '/daily-log', 
      titleKey: 'ctaDailyLog', 
      descKey: 'ctaDailyLogDesc', 
      icon: TrendingUp, 
      color: 'border-purple-200 bg-purple-50/50 hover:bg-purple-50',
      iconColor: 'bg-purple-500 text-white'
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      

      {/* Hero Section */}
      <div className="text-center md:text-left py-6 space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
          {t('heroDesc')}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className={`p-5 rounded-2xl border flex items-center gap-4 bg-white shadow-sm ${stat.color}`}
            >
              <div className="p-3 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-90">{stat.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-400 text-right italic mt-1 pr-2">
        {t('statsNote')}
      </p>

      {/* Personal Note Card */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-100 rounded-full opacity-35" />
        <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start">
          <div className="bg-amber-500 text-white p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <Heart className="h-7 w-7 fill-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-black text-slate-800">
              {t('personalNoteTitle')}
            </h3>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium">
              {t('personalNoteText')}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Menu */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          {t('featuresTitle')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className={`w-full text-left p-5 rounded-2xl border-2 shadow-sm transition-all duration-200 hover:shadow-md flex items-center gap-4 ${card.color} group tap-target`}
              >
                <div className={`${card.iconColor} p-3.5 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-sm flex items-center justify-center`}>
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-slate-800 leading-snug">
                    {t(card.titleKey)} &rarr;
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 font-semibold leading-normal">
                    {t(card.descKey)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
