import React from 'react';
import { TeamChallenge, UserProfile, Lesson, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Users2,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Gift,
  Flame,
  Award,
  Calendar
} from 'lucide-react';

interface TeamChallengeScreenProps {
  challenge: TeamChallenge;
  user: UserProfile;
  onStartLesson: (lesson: Lesson) => void;
  continueLesson: Lesson;
  lang: Language;
}

export const TeamChallengeScreen: React.FC<TeamChallengeScreenProps> = ({
  challenge,
  user,
  onStartLesson,
  continueLesson,
  lang,
}) => {
  const t = translations[lang];
  const percentComplete = Math.round((challenge.currentCount / challenge.targetCount) * 100);
  const remainingCount = challenge.targetCount - challenge.currentCount;

  const teamName = lang === 'th' && challenge.teamNameTh ? challenge.teamNameTh : challenge.teamName;
  const challengeTitle = lang === 'th' && challenge.titleTh ? challenge.titleTh : challenge.title;
  const goalDesc = lang === 'th' && challenge.goalDescriptionTh ? challenge.goalDescriptionTh : challenge.goalDescription;
  const rewardTitle = lang === 'th' && challenge.rewardTitleTh ? challenge.rewardTitleTh : challenge.rewardTitle;
  const rewardDesc = lang === 'th' && challenge.rewardDescriptionTh ? challenge.rewardDescriptionTh : challenge.rewardDescription;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <Users2 className="w-4 h-4" />
          <span>{t.collaborativeGoal}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mt-1">
          {teamName}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-xl">
          {goalDesc}
        </p>
      </div>

      {/* Hero Collaborative Progress Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-sky-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                {t.activeMonthlySprint}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
                “{challengeTitle}”
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md self-start sm:self-auto">
              <Calendar className="w-4 h-4 text-sky-300" />
              <span>{t.daysRemainingLabel(challenge.daysRemaining)}</span>
            </div>
          </div>

          {/* Big Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <span className="text-sky-200">
                <span className="text-white text-lg font-bold tabular-nums">{challenge.currentCount}</span> of {challenge.targetCount} {t.activitiesCompletedLabel}
              </span>
              <span className="text-amber-300 font-bold">{percentComplete}% {t.doneLabel}</span>
            </div>

            <div className="w-full bg-black/30 h-4 rounded-full p-1 overflow-hidden backdrop-blur-md">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${percentComplete}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-sky-200/80 pt-1">
              <span>{t.almostThereLabel(remainingCount)}</span>
              <span>{t.targetLabel} 100</span>
            </div>
          </div>

          {/* Unlocks Team Reward Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{t.teamRewardTag}</span>
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {rewardTitle}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {rewardDesc}
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartLesson(continueLesson)}
              className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>{t.contributeLessonBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Contributors & Live Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Top Team Contributors */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold font-display text-slate-900">
                {t.topContributorsHeading}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">{t.activitiesCompletedLabel}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {challenge.topContributors.map((c, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-slate-400">{i + 1}</span>
                  <img
                    src={c.avatar}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">{c.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {lang === 'th' && c.roleTh ? c.roleTh : c.role}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold font-display text-indigo-600 tabular-nums">
                    {c.count}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">{t.lessonsLabel}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100/70 text-xs text-indigo-900 text-center">
            {t.userContributionNote(12)}
          </div>
        </div>

        {/* Right Column: Live Teammate Activity Stream */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <h3 className="text-base font-bold font-display text-slate-900">
              {t.recentMomentumHeading}
            </h3>
          </div>

          <div className="space-y-3">
            {challenge.recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-slate-100/60 transition-colors"
              >
                <img
                  src={act.userAvatar}
                  alt={act.userName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-800">
                    <span className="font-bold">{act.userName}</span> {lang === 'th' ? 'ทำเสร็จสิ้น' : 'completed'}{' '}
                    <span className="font-semibold text-sky-700">
                      {lang === 'th' && act.lessonTitleTh ? act.lessonTitleTh : act.lessonTitle}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{lang === 'th' && act.timestampTh ? act.timestampTh : act.timestamp}</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-semibold">+1 to team goal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onStartLesson(continueLesson)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            >
              <span>{t.addMomentumNow}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
