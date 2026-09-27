/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, DeviceFrame, Lesson, UserProfile, LeaderboardUser, UserSettings, Language } from './types';
import {
  initialUserProfile,
  mockLessons,
  mockPathNodes,
  mockLeaderboardUsers,
  mockCompanyLeaderboard,
  mockTeamChallenge,
  mockBadges,
} from './data/mockData';
import { defaultSettings, translations } from './i18n/translations';
import { TeamsHeader } from './components/layout/TeamsHeader';
import { Navbar } from './components/layout/Navbar';
import { HomeScreen } from './components/home/HomeScreen';
import { DiscoverScreen } from './components/discover/DiscoverScreen';
import { LearningPathScreen } from './components/path/LearningPathScreen';
import { LeaderboardScreen } from './components/leaderboard/LeaderboardScreen';
import { TeamChallengeScreen } from './components/team/TeamChallengeScreen';
import { MyProgressScreen } from './components/progress/MyProgressScreen';
import { LessonModal } from './components/lesson/LessonModal';
import { SettingsModal } from './components/profile/SettingsModal';
import { Check } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [pathNodes, setPathNodes] = useState(mockPathNodes);
  const [teamUsers, setTeamUsers] = useState<LeaderboardUser[]>(mockLeaderboardUsers);
  const [companyUsers, setCompanyUsers] = useState<LeaderboardUser[]>(mockCompanyLeaderboard);
  const [teamChallenge, setTeamChallenge] = useState(mockTeamChallenge);
  const [badges, setBadges] = useState(mockBadges);

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('teams');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Floating celebration toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const lang = settings.language;
  const t = translations[lang];

  // Sync data attributes on html document for automatic Sarabun Thai typography
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleToggleLang = () => {
    const nextLang: Language = settings.language === 'en' ? 'th' : 'en';
    setSettings((prev) => ({ ...prev, language: nextLang }));
    if (nextLang === 'th') {
      showToast('เปลี่ยนภาษาเป็น ภาษาไทย (ฟอนต์ Sarabun) เรียบร้อยแล้ว 🇹🇭');
    } else {
      showToast('Language switched to English (Plus Jakarta Sans) 🇬🇧');
    }
  };

  const handleSaveSettings = (newSettings: UserSettings, updatedProfile: Partial<UserProfile>) => {
    setSettings(newSettings);
    setUser((prev) => ({ ...prev, ...updatedProfile }));
    showToast(translations[newSettings.language].settingsSavedToast);
  };

  const handleResetProgress = () => {
    setUser({
      ...initialUserProfile,
      totalXP: 640,
      streakDays: 7,
      completedLessonsCount: 14,
    });
    setLessons(mockLessons);
    setPathNodes(mockPathNodes);
    setBadges(mockBadges);
    setTeamChallenge(mockTeamChallenge);
    setIsSettingsOpen(false);
    showToast(t.resetConfirmNotice);
  };

  // Complete a lesson flow with persistent updates
  const handleCompleteLesson = (lessonId: string, earnedXP: number, quizScore: number) => {
    // 1. Update User Profile
    setUser((prev) => {
      const newTotalXP = prev.totalXP + earnedXP;
      const newStreak = prev.streakActiveToday ? prev.streakDays : prev.streakDays + 1;
      const newXpInLevel = prev.xpInCurrentLevel + earnedXP;
      let newLevel = prev.level;
      let newLevelTitle = prev.levelTitle;
      let remainingLevelXP = newXpInLevel;

      if (newXpInLevel >= prev.xpForNextLevel) {
        newLevel = prev.level + 1;
        newLevelTitle = 'Skill Builder';
        remainingLevelXP = newXpInLevel - prev.xpForNextLevel;
      }

      return {
        ...prev,
        totalXP: newTotalXP,
        streakDays: newStreak,
        streakActiveToday: true,
        level: newLevel,
        levelTitle: newLevelTitle,
        xpInCurrentLevel: remainingLevelXP,
        completedLessonsCount: prev.completedLessonsCount + 1,
        weeklyGoalCompleted: Math.min(prev.weeklyGoalCompleted + 1, prev.weeklyGoalTarget),
      };
    });

    // 2. Mark Lesson as Completed
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId ? { ...l, completed: true, progressPercent: 100 } : l
      )
    );

    // 3. Advance Path Nodes
    setPathNodes((prev) => {
      const updated = prev.map((node) => {
        if (node.lessonId === lessonId) {
          return { ...node, status: 'completed' as const };
        }
        return node;
      });

      return updated.map((node) => {
        if (node.status === 'completed') return node;
        const prevNode = updated.find((n) => n.stepNumber === node.stepNumber - 1);
        if (prevNode && prevNode.status === 'completed') {
          return { ...node, status: 'current' as const };
        }
        return node;
      });
    });

    // 4. Update Team Challenge Progress
    setTeamChallenge((prev) => ({
      ...prev,
      currentCount: Math.min(prev.currentCount + 1, prev.targetCount),
      recentActivities: [
        {
          id: `act-${Date.now()}`,
          userName: user.name,
          userAvatar: user.avatar,
          lessonTitle: lessons.find((l) => l.id === lessonId)?.title || 'Workplace Lesson',
          lessonTitleTh: lessons.find((l) => l.id === lessonId)?.titleTh,
          timestamp: 'Just now',
          timestampTh: 'เมื่อสักครู่',
        },
        ...prev.recentActivities.slice(0, 5),
      ],
    }));

    // 5. Update Leaderboard Entry for Current User
    setTeamUsers((prev) =>
      prev.map((u) =>
        u.isCurrentUser ? { ...u, xp: u.xp + earnedXP, streak: u.streak + 1 } : u
      )
    );

    setCompanyUsers((prev) =>
      prev.map((u) =>
        u.isCurrentUser ? { ...u, xp: u.xp + earnedXP, streak: u.streak + 1 } : u
      )
    );

    // 6. Unlock relevant badge (e.g. Focus Pioneer if lesson is wellbeing)
    if (lessonId === 'lesson-wellbeing') {
      setBadges((prev) =>
        prev.map((b) =>
          b.id === 'badge-focus'
            ? { ...b, unlocked: true, unlockedDate: 'Just now', unlockedDateTh: 'เมื่อสักครู่' }
            : b
        )
      );
    }

    const toastText =
      lang === 'th'
        ? `ยอดเยี่ยมมาก! ได้รับ +${earnedXP} XP · สตรีกเพิ่มเป็น ${user.streakDays + 1} วัน 🔥`
        : `Nice work! +${earnedXP} XP earned · Streak is now ${user.streakDays + 1} days 🔥`;

    showToast(toastText);
  };

  const continueLesson = lessons.find((l) => !l.completed) || lessons[0];

  return (
    <div
      data-lang={lang}
      className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white"
    >
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container: Full screen or Mobile Simulator */}
      {deviceFrame === 'mobile' ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 px-3 bg-slate-200">
          <div className="w-full max-w-[420px] h-[860px] bg-slate-50 rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col relative">
            {/* Phone Notch/Speaker */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50" />
            
            {/* Mobile Header */}
            <TeamsHeader
              user={user}
              deviceFrame={deviceFrame}
              setDeviceFrame={setDeviceFrame}
              lang={lang}
              onToggleLang={handleToggleLang}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Mobile Scrollable View */}
            <div className="flex-1 overflow-y-auto pb-20">
              {currentView === 'home' && (
                <HomeScreen
                  user={user}
                  lessons={lessons}
                  teamChallenge={teamChallenge}
                  onStartLesson={setActiveLesson}
                  onNavigate={setCurrentView}
                  lang={lang}
                />
              )}
              {currentView === 'discover' && (
                <DiscoverScreen
                  lessons={lessons}
                  onStartLesson={setActiveLesson}
                  onNavigate={setCurrentView}
                  lang={lang}
                />
              )}
              {currentView === 'path' && (
                <LearningPathScreen
                  pathNodes={pathNodes}
                  lessons={lessons}
                  onStartLesson={setActiveLesson}
                  onNavigate={setCurrentView}
                  lang={lang}
                />
              )}
              {currentView === 'leaderboard' && (
                <LeaderboardScreen
                  user={user}
                  teamUsers={teamUsers}
                  companyUsers={companyUsers}
                  lang={lang}
                />
              )}
              {currentView === 'team' && (
                <TeamChallengeScreen
                  challenge={teamChallenge}
                  user={user}
                  onStartLesson={setActiveLesson}
                  continueLesson={continueLesson}
                  lang={lang}
                />
              )}
              {currentView === 'progress' && (
                <MyProgressScreen
                  user={user}
                  badges={badges}
                  lang={lang}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              )}
            </div>

            {/* Mobile Bottom Navigation */}
            <Navbar
              currentView={currentView}
              onNavigate={setCurrentView}
              lang={lang}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Microsoft Teams Header & App Bar */}
          <TeamsHeader
            user={user}
            deviceFrame={deviceFrame}
            setDeviceFrame={setDeviceFrame}
            lang={lang}
            onToggleLang={handleToggleLang}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Sub Navigation Bar */}
          <Navbar
            currentView={currentView}
            onNavigate={setCurrentView}
            lang={lang}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Active Screen View */}
          <main className="flex-1 pb-16 md:pb-12">
            {currentView === 'home' && (
              <HomeScreen
                user={user}
                lessons={lessons}
                teamChallenge={teamChallenge}
                onStartLesson={setActiveLesson}
                onNavigate={setCurrentView}
                lang={lang}
              />
            )}
            {currentView === 'discover' && (
              <DiscoverScreen
                lessons={lessons}
                onStartLesson={setActiveLesson}
                onNavigate={setCurrentView}
                lang={lang}
              />
            )}
            {currentView === 'path' && (
              <LearningPathScreen
                pathNodes={pathNodes}
                lessons={lessons}
                onStartLesson={setActiveLesson}
                onNavigate={setCurrentView}
                lang={lang}
              />
            )}
            {currentView === 'leaderboard' && (
              <LeaderboardScreen
                user={user}
                teamUsers={teamUsers}
                companyUsers={companyUsers}
                lang={lang}
              />
            )}
            {currentView === 'team' && (
              <TeamChallengeScreen
                challenge={teamChallenge}
                user={user}
                onStartLesson={setActiveLesson}
                continueLesson={continueLesson}
                lang={lang}
              />
            )}
            {currentView === 'progress' && (
              <MyProgressScreen
                user={user}
                badges={badges}
                lang={lang}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            )}
          </main>

          {/* Subtle Clean Applet Footer */}
          <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>Stride · {t.appTagline}</span>
              </div>
              <div>{t.motto}</div>
            </div>
          </footer>
        </div>
      )}

      {/* Active Interactive Lesson Flow Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          user={user}
          onClose={() => setActiveLesson(null)}
          onComplete={handleCompleteLesson}
          onNavigateToLeaderboard={() => {
            setActiveLesson(null);
            setCurrentView('leaderboard');
          }}
          lang={lang}
          enableConfetti={settings.enableConfetti}
          enableSoundEffects={settings.enableSoundEffects}
        />
      )}

      {/* Profile & Preferences Settings Modal */}
      <SettingsModal
        user={user}
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={handleSaveSettings}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
