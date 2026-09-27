import React, { useState } from 'react';
import { UserProfile, UserSettings, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { ThaiFlag, UkFlag } from '../common/FlagIcon';
import {
  X,
  Globe,
  Clock,
  Calendar,
  Bell,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  Shield,
  Check,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface SettingsModalProps {
  user: UserProfile;
  settings: UserSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (newSettings: UserSettings, updatedProfile: Partial<UserProfile>) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  settings,
  isOpen,
  onClose,
  onSaveSettings,
  onResetProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'learning' | 'notifications' | 'experience'>('profile');
  
  // Local state for editing
  const [currentLang, setCurrentLang] = useState<Language>(settings.language);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(settings.dailyGoalMinutes);
  const [weeklyDaysTarget, setWeeklyDaysTarget] = useState(settings.weeklyDaysTarget);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);
  const [enableTeamsNudge, setEnableTeamsNudge] = useState(settings.enableTeamsNudge);
  const [enableSoundEffects, setEnableSoundEffects] = useState(settings.enableSoundEffects);
  const [enableConfetti, setEnableConfetti] = useState(settings.enableConfetti);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(settings.showOnLeaderboard);
  const [allowTeammateCheers, setAllowTeammateCheers] = useState(settings.allowTeammateCheers);
  const [quietHoursFocus, setQuietHoursFocus] = useState(settings.quietHoursFocus);

  // Profile fields
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [team, setTeam] = useState(user.team);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);

  const t = translations[currentLang];

  if (!isOpen) return null;

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  // Play subtle celebratory audio chime using Web Audio API
  const playPreviewChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, now + 0.1); // G5
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.22); // C6
      gain2.gain.setValueAtTime(0.25, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.45);
    } catch {
      // Audio fallback
    }
  };

  const handleSave = () => {
    onSaveSettings(
      {
        language: currentLang,
        dailyGoalMinutes,
        weeklyDaysTarget,
        reminderTime,
        enableTeamsNudge,
        enableSoundEffects,
        enableConfetti,
        showOnLeaderboard,
        allowTeammateCheers,
        quietHoursFocus,
      },
      {
        name,
        role,
        team,
        avatar: selectedAvatar,
        weeklyGoalTarget: weeklyDaysTarget,
      }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 leading-tight">
                {t.settingsTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.settingsSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center px-6 pt-3 bg-white border-b border-slate-100 overflow-x-auto gap-2">
          {[
            { id: 'profile', label: t.tabProfile, icon: User },
            { id: 'learning', label: t.tabLearning, icon: Clock },
            { id: 'notifications', label: t.tabNotifications, icon: Bell },
            { id: 'experience', label: t.tabExperience, icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: PROFILE & LANGUAGE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Language Switcher Card - Highlighted prominently */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-white border border-sky-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {t.languageSectionTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-sky-700 font-medium">
                    {currentLang === 'en' ? 'English (Primary)' : 'ภาษาไทย (ภาษารอง)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {t.languageSectionSub}
                </p>

                {/* Segmented bilingual language toggle */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentLang('en')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      currentLang === 'en'
                        ? 'bg-white border-sky-500 shadow-md ring-2 ring-sky-500/20'
                        : 'bg-white/70 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <UkFlag className="w-6 h-6 shadow-xs" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">English</div>
                        <div className="text-[10px] text-slate-500">Primary Language</div>
                      </div>
                    </div>
                    {currentLang === 'en' && <Check className="w-4 h-4 text-sky-600 stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentLang('th')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      currentLang === 'th'
                        ? 'bg-white border-sky-500 shadow-md ring-2 ring-sky-500/20'
                        : 'bg-white/70 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ThaiFlag className="w-6 h-6 shadow-xs" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">ภาษาไทย</div>
                        <div className="text-[10px] text-slate-500">ภาษารอง (Secondary)</div>
                      </div>
                    </div>
                    {currentLang === 'th' && <Check className="w-4 h-4 text-sky-600 stroke-[3]" />}
                  </button>
                </div>

                {/* Sarabun Font indicator for Thai */}
                {currentLang === 'th' && (
                  <div className="pt-1 flex items-center gap-2 text-xs text-sky-800 bg-sky-100/70 px-3.5 py-2 rounded-xl border border-sky-200">
                    <span className="font-bold">✨ แบบฟอนต์:</span>
                    <span>ปรับใช้ฟอนต์ <strong>Sarabun (สารบรรณ)</strong> สไตล์ทางการ ละมุนตา อ่านง่าย</span>
                  </div>
                )}
              </div>

              {/* Edit Profile Fields */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.editProfileName} &amp; Role
                </span>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center gap-3">
                    {avatarOptions.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`relative rounded-full transition-transform ${
                          selectedAvatar === av ? 'ring-3 ring-sky-500 scale-105 shadow-sm' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={av}
                          alt="Avatar option"
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {selectedAvatar === av && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-sky-600 text-white rounded-full flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.editProfileName}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.editProfileRole}
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.editProfileTeam}
                  </label>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEARNING GOALS & PACE */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              {/* Daily Target Minutes */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  {t.dailyPaceTitle}
                </label>
                <p className="text-xs text-slate-500">
                  {t.dailyPaceSub}
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyGoalMinutes(mins)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        dailyGoalMinutes === mins
                          ? 'bg-sky-50 border-sky-400 font-bold text-sky-800 ring-2 ring-sky-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-lg font-extrabold font-display">{mins}</div>
                      <div className="text-[11px] text-slate-500">{t.minutesDay}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Habit Target */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-900">
                  {t.weeklyCommitmentTitle}
                </label>
                <p className="text-xs text-slate-500">
                  {t.weeklyCommitmentSub}
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[3, 5, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setWeeklyDaysTarget(days)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        weeklyDaysTarget === days
                          ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-lg font-extrabold font-display">{days}</div>
                      <div className="text-[11px] text-slate-500">{t.daysPerWeek}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEAMS NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.teamsNotificationTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Designed to respect your calendar and avoid workday interruption.
                </p>
              </div>

              {/* Toggle 1: Teams Nudge */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-slate-800">{t.enableNudgesLabel}</div>
                  <div className="text-xs text-slate-500">{t.enableNudgesDesc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableTeamsNudge(!enableTeamsNudge)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    enableTeamsNudge ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      enableTeamsNudge ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Reminder Time selector */}
              {enableTeamsNudge && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    {t.nudgeTimeLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:30 AM', '01:30 PM', '04:30 PM'].map((tm) => (
                      <button
                        key={tm}
                        type="button"
                        onClick={() => setReminderTime(tm)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          reminderTime === tm
                            ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {tm}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Toggle 2: Focus Hours Do Not Disturb */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-slate-800">{t.quietHoursLabel}</div>
                  <div className="text-xs text-slate-500">{t.quietHoursDesc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuietHoursFocus(!quietHoursFocus)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    quietHoursFocus ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      quietHoursFocus ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE & AUDIO */}
          {activeTab === 'experience' && (
            <div className="space-y-5">
              {/* Confetti Fireworks */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{t.confettiLabel}</span>
                  </div>
                  <div className="text-xs text-slate-500">{t.confettiDesc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableConfetti(!enableConfetti)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    enableConfetti ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      enableConfetti ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Chimes */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    {enableSoundEffects ? (
                      <Volume2 className="w-4 h-4 text-sky-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{t.soundLabel}</span>
                  </div>
                  <div className="text-xs text-slate-500">{t.soundDesc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableSoundEffects(!enableSoundEffects)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    enableSoundEffects ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      enableSoundEffects ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {enableSoundEffects && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={playPreviewChime}
                    className="px-4 py-2 rounded-full border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>{t.testSoundBtn}</span>
                  </button>
                </div>
              )}

              {/* Privacy & Social Toggles */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.privacySectionTitle}
                </h4>

                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnLeaderboard}
                    onChange={(e) => setShowOnLeaderboard(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <span>{t.showLeaderboardLabel}</span>
                </label>

                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowTeammateCheers}
                    onChange={(e) => setAllowTeammateCheers(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <span>{t.allowCheersLabel}</span>
                </label>
              </div>

              {/* Reset Demo Progress Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-700">Prototype Demo Reset</div>
                  <div className="text-[11px] text-slate-400">Reset completed lessons and streak to start fresh</div>
                </div>
                <button
                  type="button"
                  onClick={onResetProgress}
                  className="px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetProgressBtn}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            {t.closeModal}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>{t.saveSettingsBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
