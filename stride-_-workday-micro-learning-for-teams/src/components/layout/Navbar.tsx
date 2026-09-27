import React from 'react';
import { ViewMode, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { Home, Compass, MapPin, Trophy, Users2, UserCheck, Settings } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  lang: Language;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, lang, onOpenSettings }) => {
  const t = translations[lang];

  const navItems = [
    { id: 'home' as ViewMode, label: t.navHome, icon: Home },
    { id: 'discover' as ViewMode, label: t.navDiscover, icon: Compass },
    { id: 'path' as ViewMode, label: t.navPath, icon: MapPin },
    { id: 'leaderboard' as ViewMode, label: t.navLeaderboard, icon: Trophy },
    { id: 'team' as ViewMode, label: t.navTeam, icon: Users2 },
    { id: 'progress' as ViewMode, label: t.navProgress, icon: UserCheck },
  ];

  return (
    <>
      {/* Desktop Main Navigation Bar */}
      <nav className="hidden md:flex items-center justify-between px-6 lg:px-10 py-2.5 bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="hidden lg:flex items-center gap-2">
            <span className="font-medium text-slate-700">
              {lang === 'th' ? 'พลังการทำงานสปรินต์' : 'Spring Momentum'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'th' ? 'ชนะเล็กๆ วันละ 5 นาที' : '5-min daily wins'}</span>
          </div>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t.navSettings}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Fixed Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
        <div className="grid grid-cols-6 items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 min-h-[44px] transition-colors ${
                  isActive ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1 rounded-full ${isActive ? 'bg-sky-100 text-sky-600' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[48px] ${isActive ? 'font-bold text-sky-700' : 'font-medium'}`}>
                  {item.id === 'path' ? (lang === 'th' ? 'เส้นทาง' : 'Path') :
                   item.id === 'team' ? (lang === 'th' ? 'ทีม' : 'Team') :
                   item.id === 'progress' ? (lang === 'th' ? 'ฉัน' : 'Me') :
                   item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
