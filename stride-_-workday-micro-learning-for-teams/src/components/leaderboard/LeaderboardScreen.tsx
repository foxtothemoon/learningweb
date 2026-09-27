import React, { useState } from 'react';
import { LeaderboardUser, UserProfile, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Flame,
  Zap,
  Users2,
  Building2,
  Check
} from 'lucide-react';

interface LeaderboardScreenProps {
  user: UserProfile;
  teamUsers: LeaderboardUser[];
  companyUsers: LeaderboardUser[];
  lang: Language;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  user,
  teamUsers,
  companyUsers,
  lang,
}) => {
  const [scope, setScope] = useState<'team' | 'company'>('team');
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  
  // Track high-five / cheers sent to colleagues
  const [cheeredUsers, setCheeredUsers] = useState<Record<string, boolean>>({});
  const t = translations[lang];

  const displayedUsers = scope === 'team' ? teamUsers : companyUsers;

  const handleSendCheer = (userId: string) => {
    setCheeredUsers((prev) => ({ ...prev, [userId]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Motivator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t.celebrateTeamGrowth}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mt-1">
            {t.moversHeading}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-lg">
            {t.moversSub}
          </p>
        </div>

        {/* Current User Highlights Pill Card */}
        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            #{user.rankInTeam}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{user.name}</span>
              <span className="text-emerald-600 flex items-center gap-0.5 text-[11px] font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> +3 spots
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {user.totalXP} XP · {user.streakDays}-{lang === 'th' ? 'วันสตรีก' : 'day streak'} 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Scope & Timeframe Toggle Bars */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Scope: Team vs Company */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full border border-slate-200/60 max-w-xs">
          <button
            onClick={() => setScope('team')}
            className={`flex-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              scope === 'team'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>{t.marketingTeamTab}</span>
          </button>
          <button
            onClick={() => setScope('company')}
            className={`flex-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              scope === 'company'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.allTeamsTab}</span>
          </button>
        </div>

        {/* Timeframe: Week vs Month */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1">{t.timeframeLabel}</span>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              timeframe === 'week' ? 'bg-sky-100 text-sky-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.thisWeekTab}
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              timeframe === 'month' ? 'bg-sky-100 text-sky-700' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.thisMonthTab}
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Card List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden divide-y divide-slate-100">
        {displayedUsers.map((learner) => {
          const isMe = learner.isCurrentUser;
          const isCheered = cheeredUsers[learner.id];

          return (
            <div
              key={learner.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 transition-colors ${
                isMe ? 'bg-sky-50/60 font-medium ring-1 ring-inset ring-sky-300' : 'hover:bg-slate-50/70'
              }`}
            >
              {/* Rank & Trend */}
              <div className="flex items-center gap-3 w-12 sm:w-16 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs sm:text-sm tabular-nums ${
                    learner.rank === 1
                      ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300'
                      : learner.rank === 2
                      ? 'bg-slate-200 text-slate-700'
                      : learner.rank === 3
                      ? 'bg-amber-50 text-amber-800'
                      : isMe
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-500 bg-slate-100'
                  }`}
                >
                  {learner.rank}
                </div>

                {/* Trend icon */}
                <div className="text-[11px] font-semibold">
                  {learner.rankChange === 'up' ? (
                    <span className="text-emerald-600 flex items-center" title={`Up ${learner.rankChangeAmount} places`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                    </span>
                  ) : learner.rankChange === 'down' ? (
                    <span className="text-slate-400 flex items-center">
                      <TrendingDown className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      <Minus className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={learner.avatar}
                    alt={learner.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  {learner.streak >= 7 && (
                    <span className="absolute -top-1 -right-1 text-xs" title={`${learner.streak} ${t.days}`}>
                      🔥
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold truncate ${isMe ? 'text-sky-900' : 'text-slate-900'}`}>
                      {learner.name}
                    </span>
                    {isMe && (
                      <span className="bg-sky-200/80 text-sky-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {lang === 'th' ? 'คุณ' : 'You'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {lang === 'th' && learner.roleTh ? learner.roleTh : learner.role} ·{' '}
                    {lang === 'th' && learner.teamTh ? learner.teamTh : learner.team}
                  </div>
                </div>
              </div>

              {/* Learning Stats (XP & Streak) */}
              <div className="text-right shrink-0">
                <div className="text-sm sm:text-base font-extrabold font-display text-slate-900 tabular-nums flex items-center justify-end gap-1">
                  <Zap className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
                  <span>{learner.xp}</span>
                  <span className="text-xs font-normal text-slate-500">XP</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-end gap-1">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{learner.streak}d streak</span>
                </div>
              </div>

              {/* Friendly Peer Kudos Action Button */}
              <div className="w-20 sm:w-28 text-right shrink-0">
                {isMe ? (
                  <span className="text-[11px] text-sky-600 font-semibold px-2 py-1">
                    {t.yourSpotLabel}
                  </span>
                ) : isCheered ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-in zoom-in">
                    <Check className="w-3 h-3" /> {t.cheeredBtn}
                  </span>
                ) : (
                  <button
                    onClick={() => handleSendCheer(learner.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 transition-all active:scale-95"
                    title={t.cheerBtn}
                  >
                    <span>👏</span>
                    <span className="hidden sm:inline">{t.cheerBtn}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement Footer */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-sky-500" />
        <span>
          {t.leaderboardRefreshNote}
        </span>
      </div>

    </div>
  );
};
