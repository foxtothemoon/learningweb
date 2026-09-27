import React, { useState } from 'react';
import { Lesson, UserProfile, TeamChallenge, ViewMode, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Users2,
  ChevronRight,
  TrendingUp,
  Target,
  Trophy,
  Coffee,
  Check
} from 'lucide-react';

interface HomeScreenProps {
  user: UserProfile;
  lessons: Lesson[];
  teamChallenge: TeamChallenge;
  onStartLesson: (lesson: Lesson) => void;
  onNavigate: (view: ViewMode) => void;
  lang: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  lessons,
  teamChallenge,
  onStartLesson,
  onNavigate,
  lang,
}) => {
  const [dailyMomentClaimed, setDailyMomentClaimed] = useState(false);
  const t = translations[lang];

  // Find Continue Learning hero (e.g. Digital Wellbeing or first uncompleted)
  const continueLesson = lessons.find((l) => l.id === 'lesson-wellbeing') || lessons[0];
  const quickWins = lessons.filter((l) => l.id !== continueLesson?.id).slice(0, 3);

  const getLessonTitle = (lesson: Lesson) => (lang === 'th' && lesson.titleTh ? lesson.titleTh : lesson.title);
  const getLessonCategory = (lesson: Lesson) => (lang === 'th' && lesson.categoryTh ? lesson.categoryTh : lesson.category);
  const getLessonDesc = (lesson: Lesson) => (lang === 'th' && lesson.shortDescTh ? lesson.shortDescTh : lesson.shortDesc);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Warm Greeting & Daily Motivator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold tracking-wide uppercase">
            <span>{t.workdayMomentum}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">{t.sprintSchedule}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-900 tracking-tight mt-1">
            {t.greeting(user.name.split(' ')[0])}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
            {t.motivationalSub(user.streakDays)}
          </p>
        </div>

        {/* Motivational Streak Banner */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3.5 rounded-2xl border border-amber-200/60 shadow-xs self-start md:self-auto">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {t.streakBannerTitle(user.streakDays)}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {t.streakBannerSub}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Daily Moment / Micro Challenge */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-sky-600/15">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-100 flex items-center gap-1.5">
                <span>{t.todayQuickWin}</span>
                <span className="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded text-[10px]">{t.xpBonusTag}</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-white mt-0.5">
                {t.quickWinPrompt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {dailyMomentClaimed ? (
              <div className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{t.goalActivated}</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setDailyMomentClaimed(true);
                  if (continueLesson) onStartLesson(continueLesson);
                }}
                className="px-5 py-2.5 rounded-full bg-white text-sky-700 hover:bg-sky-50 text-xs font-extrabold shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{t.acceptAndStart}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Hero "Continue Learning" Card & Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Continue Learning Hero Card (Span 7 cols) */}
        {continueLesson && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-100/50 to-indigo-100/30 rounded-bl-full pointer-events-none -z-0" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                    {t.continueLearning}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>{continueLesson.durationMinutes} {lang === 'th' ? 'นาที' : 'min'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-amber-600">+{continueLesson.xpReward} XP</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight">
                  {getLessonTitle(continueLesson)}
                </h3>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {getLessonDesc(continueLesson)}
                </p>
              </div>

              {/* Visual Progress Bar & Lesson Step details */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {lang === 'th' ? 'บทเรียนที่ 2 จาก 4' : 'Lesson 2 of 4'}
                  </span>
                  <span className="font-bold text-sky-600 tabular-nums">
                    {continueLesson.progressPercent}% {lang === 'th' ? 'สำเร็จ' : 'complete'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${continueLesson.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {t.nextUpLabel}{' '}
                <span className="font-medium text-slate-700">
                  {lang === 'th' ? 'ออกแบบจังหวะการทำงานในแต่ละวัน' : 'Designing Your Workday Rhythm'}
                </span>
              </div>
              <button
                onClick={() => onStartLesson(continueLesson)}
                className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>{t.keepGoing}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Progress Snapshot Strip (Span 5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {/* Stat 1: Streak */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.streakMetric}</span>
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tabular-nums">
                {user.streakDays} <span className="text-sm font-normal text-slate-500">{t.days}</span>
              </div>
              <p className="text-xs text-amber-700 font-medium mt-1">{t.streakKeepAlive}</p>
            </div>
          </div>

          {/* Stat 2: Total XP & Level */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.learningXP}</span>
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-sky-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tabular-nums">
                {user.totalXP}
              </div>
              <p className="text-xs text-sky-700 font-medium mt-1">
                Lvl {user.level} · {lang === 'th' && user.levelTitleTh ? user.levelTitleTh : user.levelTitle}
              </p>
            </div>
          </div>

          {/* Stat 3: Weekly Goal */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.weeklyGoalMetric}</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tabular-nums">
                {user.weeklyGoalCompleted}/{user.weeklyGoalTarget} <span className="text-sm font-normal text-slate-500">{t.days}</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-1">{t.weeklyGoalSub}</p>
            </div>
          </div>

          {/* Stat 4: Completed Lessons */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.winsDoneMetric}</span>
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tabular-nums">
                {user.completedLessonsCount}
              </div>
              <p className="text-xs text-purple-700 font-medium mt-1">94% {t.accuracySub}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Collaborative Team Challenge Banner */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/80 rounded-3xl p-6 sm:p-7 border border-indigo-100/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5" />
                <span>{lang === 'th' && teamChallenge.teamNameTh ? teamChallenge.teamNameTh : teamChallenge.teamName}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">{t.activeMonthlySprint}</span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                “{lang === 'th' && teamChallenge.titleTh ? teamChallenge.titleTh : teamChallenge.title}”
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {lang === 'th' && teamChallenge.goalDescriptionTh ? teamChallenge.goalDescriptionTh : teamChallenge.goalDescription}{' '}
                <span className="font-semibold text-indigo-900 inline-flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  {lang === 'th' && teamChallenge.rewardTitleTh ? teamChallenge.rewardTitleTh : teamChallenge.rewardTitle}
                </span>
              </p>
            </div>

            {/* Team Progress Bar */}
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-900 tabular-nums">
                  {teamChallenge.currentCount} / {teamChallenge.targetCount} {t.activitiesCompletedLabel}
                </span>
                <span className="text-indigo-600 font-semibold">
                  {t.almostThereLabel(teamChallenge.targetCount - teamChallenge.currentCount)}
                </span>
              </div>
              <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${(teamChallenge.currentCount / teamChallenge.targetCount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Colleague Avatars & CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4">
            <div className="flex items-center -space-x-2">
              {teamChallenge.topContributors.map((c, i) => (
                <img
                  key={i}
                  src={c.avatar}
                  alt={c.name}
                  title={`${c.name} (${c.count} ${t.lessonsLabel})`}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs"
                />
              ))}
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                +{teamChallenge.topContributors.length}
              </div>
            </div>

            <button
              onClick={() => onNavigate('team')}
              className="px-5 py-2 rounded-full border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>{lang === 'th' ? 'ดูชาเลนจ์ของทีม' : 'View Team Sprint'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Recommended Quick Wins */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              {t.quickWinsHeading}
            </h2>
            <p className="text-xs text-slate-500">{t.quickWinsSub}</p>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>{t.exploreAllTopics}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickWins.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => onStartLesson(lesson)}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {getLessonCategory(lesson)}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Zap className="w-3 h-3 fill-amber-500" />
                    <span>+{lesson.xpReward} XP</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                    {getLessonTitle(lesson)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {getLessonDesc(lesson)}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lesson.durationMinutes} {t.minActivity}</span>
                </span>
                <span className="font-bold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t.start}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Quick Teammate Leaderboard Snippet */}
      <div className="p-5 rounded-3xl bg-slate-100/70 border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">{t.leaderboardUpdate}</div>
            <div className="text-sm font-bold text-slate-800">
              {t.leaderboardBanner(user.rankInTeam, 3)}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('leaderboard')}
          className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 transition-colors"
        >
          {t.viewMoversBtn}
        </button>
      </div>

    </div>
  );
};
