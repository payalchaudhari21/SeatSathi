import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Map, 
  Filter, 
  Check, 
  Building,
  Activity,
  HeartHandshake
} from 'lucide-react';

export const FindHelp = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [activeClinic, setActiveClinic] = useState(null);

  const clinics = [
    {
      id: 'clinic-1',
      name: 'Arogya Auto Driver Health Camp / आरोग्य ऑटो चालक स्वास्थ्य शिविर',
      type: 'camp',
      distance: '0.8 km',
      address: 'Auto Stand Area, Sector 4, Near Metro Pillar 140',
      time: '9:00 AM - 5:00 PM (Every Saturday)',
      phone: '+91 98765 43210',
      cost: 'free',
      coordinates: { x: 120, y: 110 }
    },
    {
      id: 'clinic-2',
      name: 'Lokmanya Transit Physiotherapy / लोकमान्य ट्रांजिट फिजियोथेरेपी केंद्र',
      type: 'physio',
      distance: '1.4 km',
      address: 'Shop 12, Municipal Market Complex, Station Road',
      time: '10:00 AM - 8:00 PM (Mon - Sat)',
      phone: '+91 99887 76655',
      cost: 'low-cost',
      costDetail: '₹50 per session',
      coordinates: { x: 260, y: 80 }
    },
    {
      id: 'clinic-3',
      name: 'Sanjay Gandhi Govt Welfare Clinic / संजय गांधी सरकारी कल्याण क्लिनिक',
      type: 'gov',
      distance: '2.3 km',
      address: 'Opposite State Transport Depot, Block B',
      time: 'Open 24 hours (Mon - Sun)',
      phone: '+91 11 2345 6789',
      cost: 'free',
      coordinates: { x: 60, y: 190 }
    },
    {
      id: 'clinic-4',
      name: 'Namma Driver Occupational Care Center / नम्मा चालक व्यावसायिक देखभाल केंद्र',
      type: 'physio',
      distance: '3.1 km',
      address: 'Driver Rest Arena, Central Bus Stand Terminal',
      time: '8:00 AM - 2:00 PM (Daily)',
      phone: '+91 91234 56789',
      cost: 'low-cost',
      costDetail: '₹30 per checkup',
      coordinates: { x: 320, y: 220 }
    }
  ];

  const categories = [
    { id: 'all', labelKey: 'clinicFilterAll' },
    { id: 'camp', labelKey: 'clinicFilterCamp' },
    { id: 'gov', labelKey: 'clinicFilterGov' },
    { id: 'physio', labelKey: 'clinicFilterPhysio' }
  ];

  const filteredClinics = filter === 'all' 
    ? clinics 
    : clinics.filter(c => c.type === filter);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <MapPin className="h-7 w-7 text-amber-500 fill-amber-100" />
          <span>{t('helpTitle')}</span>
        </h1>
        <p className="text-sm text-slate-600 font-semibold leading-relaxed">
          {t('helpSubtitle')}
        </p>
      </div>

      {/* Production Notice */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
        <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">i</span>
        <p className="text-xs text-blue-700 leading-normal font-semibold">
          {t('helpNote')}
        </p>
      </div>

      {/* Map + List Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Illustrative SVG Map */}
        <div className="lg:col-span-5 driver-card p-4 space-y-3 bg-white border border-amber-100">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Map className="h-4 w-4 text-slate-400" />
              Live Clinic Radar
            </span>
            <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Mock GPS Connected
            </span>
          </div>

          {/* Styled SVG Map Screen */}
          <div className="relative h-64 bg-slate-50 rounded-xl overflow-hidden border border-slate-200/60 shadow-inner flex items-center justify-center">
            
            {/* Map Background grid & roads */}
            <svg className="w-full h-full absolute inset-0 select-none opacity-40">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Mock Road Lines */}
              <path d="M 0,100 L 400,100" fill="none" stroke="#CBD5E1" strokeWidth="12" />
              <path d="M 180,0 L 180,300" fill="none" stroke="#CBD5E1" strokeWidth="12" />
              <path d="M 0,200 L 400,220" fill="none" stroke="#CBD5E1" strokeWidth="8" />
              
              {/* Road markings */}
              <path d="M 0,100 L 400,100" fill="none" stroke="#FAF7F0" strokeWidth="1" strokeDasharray="6 6" />
              <path d="M 180,0 L 180,300" fill="none" stroke="#FAF7F0" strokeWidth="1" strokeDasharray="6 6" />
            </svg>

            {/* Current Driver Dot Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 border-2 border-white items-center justify-center shadow-md">
                  <Activity className="h-3 w-3 text-white" />
                </span>
              </div>
              <span className="text-[9px] bg-slate-900 text-white font-extrabold px-1.5 py-0.5 rounded shadow mt-1">
                YOU (Auto)
              </span>
            </div>

            {/* SVG Markers for Clinics */}
            {clinics.map((clinic) => {
              const isSelected = activeClinic === clinic.id;
              const isFilteredOut = filter !== 'all' && clinic.type !== filter;
              if (isFilteredOut) return null;

              return (
                <button
                  key={clinic.id}
                  onClick={() => setActiveClinic(clinic.id)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group transition-transform duration-150 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  style={{ left: `${clinic.coordinates.x}px`, top: `${clinic.coordinates.y}px` }}
                >
                  <div className={`p-1.5 rounded-full border-2 shadow-md transition-colors ${
                    isSelected 
                      ? 'bg-rose-500 border-white text-white' 
                      : 'bg-white border-teal-500 text-teal-600 hover:bg-teal-50'
                  }`}>
                    {clinic.type === 'camp' ? (
                      <HeartHandshake className="h-4.5 w-4.5" />
                    ) : clinic.type === 'gov' ? (
                      <Building className="h-4.5 w-4.5" />
                    ) : (
                      <Activity className="h-4.5 w-4.5" />
                    )}
                  </div>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shadow mt-1 border ${
                    isSelected 
                      ? 'bg-rose-900 border-rose-800 text-white' 
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    {clinic.distance}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick instructions to interact with map */}
          <p className="text-[10px] text-slate-400 font-bold text-center italic">
            *Tap markers on the radar map to highlight matching clinic details.
          </p>
        </div>

        {/* Right Side: Registry List & Filters */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilter(cat.id);
                  setActiveClinic(null);
                }}
                className={`tap-target px-3.5 py-2 rounded-xl text-xs font-black border transition-all duration-150 active:scale-95 flex items-center gap-1.5 ${
                  filter === cat.id
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{t(cat.labelKey)}</span>
              </button>
            ))}
          </div>

          {/* Clinic Cards List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredClinics.map((clinic) => {
              const isSelected = activeClinic === clinic.id;
              return (
                <div
                  key={clinic.id}
                  onClick={() => setActiveClinic(clinic.id)}
                  className={`driver-card border-2 transition-all cursor-pointer p-4 bg-white relative ${
                    isSelected 
                      ? 'border-rose-500 ring-2 ring-rose-100 shadow-md' 
                      : 'border-amber-100/70 hover:border-amber-200'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm md:text-base font-black text-slate-800 leading-snug">
                      {clinic.name}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        clinic.cost === 'free'
                          ? 'bg-teal-50 border-teal-200 text-teal-700'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {clinic.cost === 'free' ? t('freeTag') : t('lowCostTag')}
                      </span>
                    </div>
                  </div>

                  {/* Metadata fields */}
                  <div className="mt-3.5 space-y-2.5 text-xs text-slate-600 font-semibold border-t border-slate-50 pt-3">
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span>{clinic.address}</span>
                        <span className="ml-2 font-bold text-amber-600">({clinic.distance})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{clinic.time}</span>
                    </div>

                    {clinic.costDetail && (
                      <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 w-fit">
                        <span>Charge:</span>
                        <span className="font-bold">{clinic.costDetail}</span>
                      </div>
                    )}

                  </div>

                  {/* Interactive Button Grid inside card */}
                  <div className="mt-4 flex gap-3 pt-3 border-t border-slate-100">
                    <a
                      href={`tel:${clinic.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="tap-target flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 font-black text-xs py-2 px-3 shadow-sm transition-colors active:scale-95"
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      <span>{t('btnCall')}</span>
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Opening mock GPS navigation to ${clinic.name.split('/')[0]} (${clinic.distance}).`);
                      }}
                      className="tap-target flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-xs py-2 px-3 shadow-sm transition-colors active:scale-95"
                    >
                      <MapPin className="h-3.5 w-3.5 fill-white" />
                      <span>{t('btnGetDirections')}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
