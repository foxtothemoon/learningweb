import React, { useState } from 'react';
import { Badge, UserProfile, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Sparkles,
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Calendar,
  Lock,
  Settings,
  X
} from 'lucide-react';

interface MyProgressScreenProps {
  user: UserProfile;
  badges: Badge[];
  lang: Language;
  onOpenSettings?: () => void;
}

export const MyProgressScreen: React.FC<MyProgressScreenProps> = ({
  user,
  badges,
  lang,
  onOpenSettings,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const t = translations[lang];

  const filteredBadges =
    badgeFilter === 'all'
      ? badges
      : badgeFilter === 'unlocked'
      ? badges.filter((b) => b.unlocked)
      : badges.filter((b) => !b.unlocked);

  const daysOfWeek = [
    { label: lang === 'th' ? 'จ.' : 'Mon', completed: true, date: lang === 'th' ? '21 ก.ย.' : 'Sep 21' },
    { label: lang === 'th' ? 'อ.' : 'Tue', completed: true, date: lang === 'th' ? '22 ก.ย.' : 'Sep 22' },
    { label: lang === 'th' ? 'พ.' : 'Wed', completed: true, date: lang === 'th' ? '23 ก.ย.' : 'Sep 23' },
    { label: lang === 'th' ? 'พฤ.' : 'Thu', completed: true, date: lang === 'th' ? '24 ก.ย.' : 'Sep 24' },
    { label: lang === 'th' ? 'ศ.' : 'Fri', completed: false, date: lang === 'th' ? '25 ก.ย.' : 'Sep 25', isToday: true },
    { label: lang === 'th' ? 'ส.' : 'Sat', completed: false, date: lang === 'th' ? '26 ก.ย.' : 'Sep 26' },
    { label: lang === 'th' ? 'อา.' : 'Sun', completed: false, date: lang === 'th' ? '27 ก.ย.' : 'Sep 27' },
  ];

  const levelTitle = lang === 'th' && user.levelTitleTh ? user.levelTitleTh : user.levelTitle;
  const nextLevelTitle = lang === 'th' ? 'ผู้สร้างทักษะ (Skill Builder)' : 'Skill Builder';

  const getBadgeTitle = (b: Badge) => (lang === 'th' && b.titleTh ? b.titleTh : b.title);
  const getBadgeDesc = (b: Badge) => (lang === 'th' && b.descriptionTh ? b.descriptionTh : b.description);
  const getBadgeCategory = (b: Badge) => (lang === 'th' && b.categoryTh ? b.categoryTh : b.category);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t.personalMomentum}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mt-1">
            {t.progressHeading}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            {t.progressSub}
          </p>
        </div>

        {/* Level Highlight Pill & Settings Action Button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-sky-50 border border-sky-200/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">
              L{user.level}
            </div>
            <div>
              <div className="text-xs font-bold text-sky-900">{levelTitle}</div>
              <div className="text-[11px] text-slate-500">{user.totalXP} total XP</div>
            </div>
          </div>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
              title={t.settingsTitle}
            >
              <Settings className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">{t.navSettings}</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Level Progression Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.currentRankTier}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
              Level {user.level}: {levelTitle}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-sky-600 tabular-nums">
              {user.xpInCurrentLevel} / {user.xpForNextLevel} XP
            </span>
            <div className="text-xs text-slate-400">
              {t.levelUntilNext(user.xpForNextLevel - user.xpInCurrentLevel, nextLevelTitle)}
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${(user.xpInCurrentLevel / user.xpForNextLevel) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Level 4: {levelTitle}</span>
            <span>Level 5: {nextLevelTitle}</span>
          </div>
        </div>

        {/* 4 Core Summary Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span className="text-xl font-bold font-display text-slate-900 tabular-nums">{user.streakDays}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t.dayStreakStat}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-sky-500">
              <Zap className="w-4 h-4 fill-sky-500" />
              <span className="text-xl font-bold font-display text-slate-900 tabular-nums">{user.totalXP}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t.totalXPStat}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xl font-bold font-display text-slate-900 tabular-nums">{user.completedLessonsCount}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t.lessonsDoneStat}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-500">
              <Target className="w-4 h-4" />
              <span className="text-xl font-bold font-display text-slate-900 tabular-nums">{user.accuracyRate}%</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t.quizAccuracyStat}</div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Habit Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <h3 className="text-base font-bold font-display text-slate-900">
              {t.weeklyRhythmHeading}
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            {t.goalCompletedRhythm(user.weeklyGoalCompleted, user.weeklyGoalTarget)}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-2">
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl text-center border transition-all ${
                day.completed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                  : day.isToday
                  ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400/20 text-sky-950'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider">{day.label}</div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto my-2 text-xs font-bold">
                {day.completed ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    ✓
                  </div>
                ) : day.isToday ? (
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center animate-pulse">
                    ●
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-slate-300 text-slate-300 flex items-center justify-center">
                    ○
                  </div>
                )}
              </div>
              <div className="text-[10px] text-slate-500">{day.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Collectible Badges Showcase */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              {t.badgesHeading}
            </h2>
            <p className="text-xs text-slate-500">{t.badgesSub}</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
            {[
              { id: 'all', label: t.badgeTabAll },
              { id: 'unlocked', label: t.badgeTabUnlocked },
              { id: 'locked', label: t.badgeTabLocked },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBadgeFilter(tab.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  badgeFilter === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-3xl border transition-all text-center flex flex-col items-center justify-between cursor-pointer group ${
                badge.unlocked
                  ? 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
                  : 'bg-slate-50/70 border-slate-200/80 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="relative my-2">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:scale-105 ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-sky-100 to-indigo-100 text-sky-800'
                      : 'bg-slate-200 text-slate-400 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>
                {!badge.unlocked && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="mt-2">
                <div className="text-xs sm:text-sm font-bold text-slate-900">{getBadgeTitle(badge)}</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {getBadgeDesc(badge)}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 w-full text-[10px] font-semibold text-slate-400">
                {badge.unlocked ? (
                  <span className="text-emerald-600 font-bold">
                    {t.unlockedBadgeLabel(lang === 'th' && badge.unlockedDateTh ? badge.unlockedDateTh : (badge.unlockedDate || ''))}
                  </span>
                ) : (
                  <span>{t.xpOnUnlock(badge.xpBonus)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4 relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-100 to-indigo-100 flex items-center justify-center text-4xl mx-auto shadow-inner">
              {selectedBadge.icon}
            </div>

            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                {getBadgeCategory(selectedBadge)} {t.achievementTag}
              </span>
              <h3 className="text-xl font-bold font-display text-slate-900 mt-1">
                {getBadgeTitle(selectedBadge)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                {getBadgeDesc(selectedBadge)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
              <span className="text-slate-500">{t.rewardLabel}</span>
              <span className="font-bold text-amber-600">+{selectedBadge.xpBonus} Bonus XP</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
