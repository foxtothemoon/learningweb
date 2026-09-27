import React from 'react';
import { DeviceFrame, UserProfile, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { ThaiFlag, UkFlag } from '../common/FlagIcon';
import {
  Sparkles,
  Flame,
  Zap,
  CheckCircle2,
  Monitor,
  Smartphone,
  Maximize2,
  Search,
  Bell,
  Grid,
  MessageSquare,
  Calendar,
  Users,
  Settings
} from 'lucide-react';

interface TeamsHeaderProps {
  user: UserProfile;
  deviceFrame: DeviceFrame;
  setDeviceFrame: (frame: DeviceFrame) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenSettings: () => void;
  onOpenStreakModal?: () => void;
  onOpenXPModal?: () => void;
}

export const TeamsHeader: React.FC<TeamsHeaderProps> = ({
  user,
  deviceFrame,
  setDeviceFrame,
  lang,
  onToggleLang,
  onOpenSettings,
}) => {
  const t = translations[lang];

  return (
    <div className="w-full bg-slate-900 text-white select-none">
      {/* Top Microsoft Teams App Host Bar (simulated Teams desktop shell when in teams mode) */}
      {deviceFrame === 'teams' && (
        <div className="border-b border-slate-800 bg-[#1f1f24] px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">T</span>
              <span className="hidden sm:inline">Microsoft Teams</span>
            </div>
            <div className="h-3 w-px bg-slate-700 hidden sm:block" />
            <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <Bell className="w-3.5 h-3.5" /> {t.activity}
              </span>
              <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> {t.chat}
              </span>
              <span className="flex items-center gap-1 text-sky-400 font-medium cursor-pointer">
                <Users className="w-3.5 h-3.5" /> {lang === 'th' ? 'ทีมการตลาด' : 'Marketing Team'}
              </span>
              <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <Calendar className="w-3.5 h-3.5" /> {t.calendar}
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xs mx-4 hidden lg:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                readOnly
                placeholder={t.searchInTeams}
                className="w-full bg-slate-800/80 border border-slate-700/60 rounded-md py-1 pl-8 pr-2 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400 hidden xl:inline">{t.connected}</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title={t.connected} />
          </div>
        </div>
      )}

      {/* Teams Channel Tab Bar (When in Teams view mode) */}
      {deviceFrame === 'teams' && (
        <div className="bg-[#29292e] px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="text-slate-400 flex items-center gap-1 text-[11px] mr-2">
              <span className="font-semibold text-slate-300">{lang === 'th' ? 'ทีมการตลาด' : 'Marketing Team'}</span>
              <span>/</span>
              <span>{lang === 'th' ? 'ทั่วไป' : 'General'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-3 py-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                {lang === 'th' ? 'โพสต์' : 'Posts'}
              </span>
              <span className="px-3 py-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                {lang === 'th' ? 'ไฟล์' : 'Files'}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white font-medium rounded-t-md border-b-2 border-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Stride Learning
              </span>
              <span className="px-2 py-1 text-slate-500 hover:text-slate-300 cursor-pointer">+</span>
            </div>
          </div>

          {/* Viewport Frame Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/50">
            <button
              onClick={() => setDeviceFrame('teams')}
              className="px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all bg-sky-600 text-white shadow-sm"
              title="View with Microsoft Teams Tab host styling"
            >
              <Grid className="w-3 h-3" />
              <span className="hidden sm:inline">{t.teamsFrame}</span>
            </button>
            <button
              onClick={() => setDeviceFrame('clean')}
              className="px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all text-slate-400 hover:text-white"
              title="Full Window View"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">{t.fullView}</span>
            </button>
            <button
              onClick={() => setDeviceFrame('mobile')}
              className="px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all text-slate-400 hover:text-white"
              title="Mobile Device View"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden sm:inline">{t.mobile}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Stride App Header (Zone 1: Brand, Zone 2: Progress stats, Zone 3: Language & Settings & Profile) */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Zone 1: Wordmark with playful dot */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5 animate-float-subtle" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1">
                Stride
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Live Progress Metrics (Streak, Points, Level) */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Streak indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
            title={`${user.streakDays}-day streak! Keep it going today`}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span className="tabular-nums font-bold text-white">{user.streakDays}</span>
            <span className="hidden sm:inline text-amber-200/80">{t.days}</span>
          </div>

          {/* XP & Level Indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 border border-sky-500/30 text-sky-300 text-xs font-semibold cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
            title={`${user.totalXP} total XP earned. Level ${user.level} ${lang === 'th' && user.levelTitleTh ? user.levelTitleTh : user.levelTitle}`}
          >
            <Zap className="w-4 h-4 text-sky-400 fill-sky-400" />
            <span className="tabular-nums font-bold text-white">{user.totalXP}</span>
            <span className="hidden sm:inline text-sky-200/80">XP</span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-slate-300 text-[11px]">
              Lvl {user.level}
            </span>
          </div>

          {/* Weekly goal pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="tabular-nums font-bold text-white">{user.weeklyGoalCompleted}/{user.weeklyGoalTarget}</span>
            <span className="text-emerald-200/80">{t.thisWeek}</span>
          </div>
        </div>

        {/* Zone 3: Language Toggle, Settings Button, and User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Viewport Frame Switcher if not in Teams Frame */}
          {deviceFrame !== 'teams' && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setDeviceFrame('teams')}
                className="px-2 py-1 text-slate-400 hover:text-white text-xs rounded transition-colors"
                title="Switch to Teams host frame"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceFrame('clean')}
                className={`px-2 py-1 text-xs rounded transition-colors ${deviceFrame === 'clean' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Full Screen View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceFrame('mobile')}
                className={`px-2 py-1 text-xs rounded transition-colors ${deviceFrame === 'mobile' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Minimal Circular Flag Language Switcher */}
          <button
            onClick={onToggleLang}
            className="w-8 h-8 rounded-full p-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 hover:border-sky-400 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-xs hover:shadow-sky-500/20 group cursor-pointer"
            title={
              lang === 'en'
                ? 'English (คลิกเพื่อเปลี่ยนเป็น ภาษาไทย 🇹🇭)'
                : 'ภาษาไทย (Click to switch to English 🇬🇧)'
            }
            aria-label={lang === 'en' ? 'Switch to Thai' : 'Switch to English'}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner ring-1 ring-white/10">
              {lang === 'en' ? (
                <UkFlag className="w-full h-full object-cover" />
              ) : (
                <ThaiFlag className="w-full h-full object-cover" />
              )}
            </div>
          </button>

          {/* Settings Trigger Icon */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            title={t.navSettings}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Info - Clickable to open Profile Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 pl-1 group text-left transition-opacity hover:opacity-90"
            title="Open Profile & Settings"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/50 group-hover:ring-sky-400 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-none group-hover:text-sky-300 transition-colors">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'th' && user.teamTh ? user.teamTh : user.team}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
