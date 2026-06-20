import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLog } from '../context/LogContext';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Activity, 
  Coins, 
  Moon, 
  Plus, 
  Minus,
  CheckCircle,
  TrendingDown,
  Info,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const DailyLog = () => {
  const { t } = useLanguage();
  const { logs, addLog, deleteLog, averagePain, streak } = useLog();

  // Get current date string (YYYY-MM-DD)
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Form State
  const [date, setDate] = useState(getTodayDateString());
  const [hours, setHours] = useState(10);
  const [sleep, setSleep] = useState(6.5);
  const [pain, setPain] = useState(5);
  const [earnings, setEarnings] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleIncrementHours = () => {
    if (hours < 24) setHours(h => h + 1);
  };

  const handleDecrementHours = () => {
    if (hours > 1) setHours(h => h - 1);
  };

  const handleIncrementSleep = () => {
    if (sleep < 24) setSleep(s => Math.min(24, s + 0.5));
  };

  const handleDecrementSleep = () => {
    if (sleep > 0.5) setSleep(s => Math.max(0, s - 0.5));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const entry = {
      date,
      hours: Number(hours),
      sleep: Number(sleep),
      pain: Number(pain),
      earnings: earnings ? Number(earnings) : undefined
    };

    addLog(entry);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset optional earnings fields
    setEarnings('');
  };

  // Pain Level color gradients mapping for large tap targets
  const getPainColor = (val) => {
    if (val <= 3) return 'bg-teal-500 text-white border-teal-600';
    if (val <= 6) return 'bg-amber-500 text-white border-amber-600';
    return 'bg-rose-500 text-white border-rose-600';
  };

  const getPainOutlineColor = (val, currentPain) => {
    const isSelected = val === currentPain;
    if (val <= 3) {
      return isSelected 
        ? 'bg-teal-500 text-white border-teal-600 ring-4 ring-teal-100 scale-105' 
        : 'bg-teal-50 border-teal-100 text-teal-800 hover:bg-teal-100';
    }
    if (val <= 6) {
      return isSelected 
        ? 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-100 scale-105' 
        : 'bg-amber-50 border-amber-100 text-amber-800 hover:bg-amber-100';
    }
    return isSelected 
      ? 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-100 scale-105' 
      : 'bg-rose-50 border-rose-100 text-rose-800 hover:bg-rose-100';
  };

  // Prepare chart data: format date for display (e.g. "Jun 18")
  const chartData = logs.map(log => {
    const d = new Date(log.date);
    const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return {
      ...log,
      displayDate: formattedDate,
      // Create readable labels for charts
      'Pain Level (1-10)': log.pain,
      'Driving Hours': log.hours,
      'Sleep (Hours)': log.sleep
    };
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <TrendingUp className="h-7 w-7 text-amber-500" />
          <span>{t('logTitle')}</span>
        </h1>
        <p className="text-sm text-slate-600 font-semibold leading-relaxed">
          {t('logSubtitle')}
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Average Pain */}
        <div className="driver-card flex items-center gap-4 bg-white p-5">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider">Average Pain Score</div>
            <div className="text-2xl font-black text-slate-800">{averagePain} / 10</div>
          </div>
        </div>

        {/* Active Streak */}
        <div className="driver-card flex items-center gap-4 bg-white p-5">
          <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center shrink-0">
            <TrendingDown className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider">{t('streakCount')}</div>
            <div className="text-2xl font-black text-slate-800">{streak} {streak === 1 ? 'Day' : 'Days'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Log Inputs */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 driver-card bg-white p-5 md:p-6 space-y-5 border border-amber-100">
          
          <h2 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Plus className="h-4.5 w-4.5 text-amber-500" />
            Add Today's Entry
          </h2>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              {t('formDate')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="tap-target w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-amber-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Hours Driven (Increment/Decrement style) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              {t('formHours')}
            </label>
            <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl px-2 py-1 bg-slate-50/50">
              <button
                type="button"
                onClick={handleDecrementHours}
                className="tap-target h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold active:scale-95 shadow-sm"
              >
                <Minus className="h-4.5 w-4.5" />
              </button>
              <span className="text-base font-black text-slate-800">{hours} Hrs</span>
              <button
                type="button"
                onClick={handleIncrementHours}
                className="tap-target h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold active:scale-95 shadow-sm"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Sleep Hours (Increment/Decrement style) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Moon className="h-4 w-4 text-slate-400" />
              {t('formSleep')}
            </label>
            <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl px-2 py-1 bg-slate-50/50">
              <button
                type="button"
                onClick={handleDecrementSleep}
                className="tap-target h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold active:scale-95 shadow-sm"
              >
                <Minus className="h-4.5 w-4.5" />
              </button>
              <span className="text-base font-black text-slate-800">{sleep} Hrs</span>
              <button
                type="button"
                onClick={handleIncrementSleep}
                className="tap-target h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold active:scale-95 shadow-sm"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Pain Level 1-10 Tap Blocks */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-slate-400" />
              {t('formPain')}: <span className="text-slate-800 font-black text-sm">{pain}</span>
            </label>
            
            {/* 1-10 Grid buttons with color templates */}
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPain(val)}
                  className={`tap-target h-10 border rounded-xl font-black text-sm flex items-center justify-center transition-all ${
                    getPainOutlineColor(val, pain)
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            
            {/* Visual description slider label */}
            <div className="flex justify-between text-[10px] font-black text-slate-400 px-1 uppercase tracking-wide">
              <span className="text-teal-600">Gentle (1-3)</span>
              <span className="text-amber-600">Stiff (4-6)</span>
              <span className="text-rose-600">Severe (7-10)</span>
            </div>
          </div>

          {/* Earnings (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-slate-400" />
              {t('formEarnings')}
            </label>
            <input
              type="number"
              value={earnings}
              placeholder="e.g. 850"
              onChange={(e) => setEarnings(e.target.value)}
              className="tap-target w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-amber-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Success Alerts */}
          {showSuccess && (
            <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl flex items-center gap-2 text-xs text-teal-800 font-black">
              <CheckCircle className="h-4.5 w-4.5 text-teal-600 shrink-0" />
              <span>{t('logSuccess')}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="driver-btn-primary w-full gap-2"
          >
            <span>{t('btnSaveLog')}</span>
          </button>

        </form>

        {/* Right Section: Recharts Trends */}
        <div className="lg:col-span-7 driver-card bg-white p-5 md:p-6 space-y-4 border border-amber-100 flex flex-col justify-between self-stretch">
          
          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-amber-500" />
              {t('chartTitle')}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {t('chartSubtitle')}
            </p>
          </div>

          {/* Interactive Graph Container */}
          <div className="h-64 md:h-80 w-full bg-slate-50/50 rounded-2xl p-2 border border-slate-100 flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="displayDate" 
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                  />
                  <YAxis 
                    domain={[0, 14]} 
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '10px', fontWeight: '800', marginTop: '10px' }}
                    iconType="circle"
                  />
                  {/* Hours Driven Area */}
                  <Area 
                    type="monotone" 
                    dataKey="Driving Hours" 
                    stroke="#d97706" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorHours)" 
                  />
                  {/* Pain Level Area */}
                  <Area 
                    type="monotone" 
                    dataKey="Pain Level (1-10)" 
                    stroke="#f43f5e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPain)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-6 space-y-2">
                <Info className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-bold max-w-xs leading-normal">
                  {t('noLogsYet')}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Chart Insights */}
          <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl text-[11px] text-slate-700 font-semibold leading-relaxed">
            <span className="font-black text-amber-700 block mb-0.5 uppercase tracking-wide">💡 Insight Finder:</span>
            By plotting both curves, you can track if working longer shifts directly drives up your physical strain. Aim to break the pattern by doing 2-minute seated stretches when hours exceed 8!
          </div>

        </div>

      </div>

      {/* Saved Daily Driver Log History */}
      <div className="driver-card bg-white p-5 md:p-6 space-y-4 border border-amber-100 shadow-sm">
        <h2 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-500" />
          <span>{t('logHistoryTitle')}</span>
        </h2>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="hidden md:table w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">{t('tableDate')}</th>
                  <th className="py-3 px-4">{t('tableHours')}</th>
                  <th className="py-3 px-4">{t('tableSleep')}</th>
                  <th className="py-3 px-4">{t('tablePain')}</th>
                  <th className="py-3 px-4">{t('tableEarnings')}</th>
                  <th className="py-3 px-4 text-center">{t('btnDelete')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
                {[...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).map((log) => (
                  <tr key={log.date} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {new Date(log.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">{log.hours} Hrs</td>
                    <td className="py-3 px-4">{log.sleep} Hrs</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        log.pain <= 3 ? 'bg-teal-100 text-teal-800' :
                        log.pain <= 6 ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {log.pain} / 10
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {log.earnings !== undefined && log.earnings !== '' ? `₹${log.earnings}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteLog(log.date)}
                        title={t('btnDelete')}
                        className="tap-target p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors inline-flex items-center justify-center"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {[...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).map((log) => (
                <div key={log.date} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400">
                      {new Date(log.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => deleteLog(log.date)}
                      className="tap-target p-2 -mr-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors inline-flex items-center justify-center"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400 font-bold mb-0.5">{t('tableHours')}</div>
                      <div className="font-black text-slate-800">{log.hours} Hrs</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-bold mb-0.5">{t('tableSleep')}</div>
                      <div className="font-black text-slate-800">{log.sleep} Hrs</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-bold mb-0.5">{t('tablePain')}</div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full font-black ${
                          log.pain <= 3 ? 'bg-teal-100 text-teal-800' :
                          log.pain <= 6 ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {log.pain} / 10
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-bold mb-0.5">{t('tableEarnings')}</div>
                      <div className="font-black text-slate-800">
                        {log.earnings !== undefined && log.earnings !== '' ? `₹${log.earnings}` : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-xs text-slate-400 font-bold">{t('noLogsYet')}</p>
          </div>
        )}
      </div>

    </div>
  );
};
