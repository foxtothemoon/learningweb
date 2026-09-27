export type ViewMode = 'home' | 'discover' | 'path' | 'leaderboard' | 'team' | 'progress';

export type DeviceFrame = 'teams' | 'clean' | 'mobile';

export type Language = 'en' | 'th';

export interface UserSettings {
  language: Language;
  dailyGoalMinutes: number; // 5, 10, 15
  weeklyDaysTarget: number; // 3, 5, 7
  reminderTime: string; // e.g. "09:30 AM", "01:30 PM", "04:30 PM"
  enableTeamsNudge: boolean;
  enableSoundEffects: boolean;
  enableConfetti: boolean;
  showOnLeaderboard: boolean;
  allowTeammateCheers: boolean;
  quietHoursFocus: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  roleTh?: string;
  team: string;
  teamTh?: string;
  streakDays: number;
  streakActiveToday: boolean;
  totalXP: number;
  level: number;
  levelTitle: string;
  levelTitleTh?: string;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  weeklyGoalCompleted: number;
  weeklyGoalTarget: number;
  completedLessonsCount: number;
  rankInTeam: number;
  rankOverall: number;
  accuracyRate: number;
}

export interface QuizOption {
  id: string;
  text: string;
  textTh?: string;
  explanation: string;
  explanationTh?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionTh?: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface LessonStep {
  id: string;
  title: string;
  titleTh?: string;
  subtitle: string;
  subtitleTh?: string;
  content: string;
  contentTh?: string;
  takeaways: string[];
  takeawaysTh?: string[];
  proTip?: string;
  proTipTh?: string;
  interactivePrompt?: {
    question: string;
    questionTh?: string;
    choices: string[];
    choicesTh?: string[];
    insight: string;
    insightTh?: string;
  };
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  titleTh?: string;
  category: 'Wellbeing' | 'Digital Skills' | 'People Skills' | 'Leadership' | 'Quick Wins';
  categoryTh?: string;
  shortDesc: string;
  shortDescTh?: string;
  durationMinutes: number;
  xpReward: number;
  difficulty: 'Quick' | 'Core' | 'Deep Dive';
  difficultyTh?: string;
  completed: boolean;
  progressPercent: number;
  accentColor: 'sky' | 'indigo' | 'amber' | 'violet' | 'rose' | 'emerald';
  badgeRewardId?: string;
  steps: LessonStep[];
  quiz: QuizQuestion[];
}

export interface PathNode {
  id: string;
  lessonId: string;
  stepNumber: number;
  title: string;
  titleTh?: string;
  category: string;
  categoryTh?: string;
  durationMinutes: number;
  xpReward: number;
  status: 'completed' | 'current' | 'next' | 'locked';
  checkpointName?: string;
  checkpointNameTh?: string;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  role: string;
  roleTh?: string;
  team: string;
  teamTh?: string;
  xp: number;
  streak: number;
  isCurrentUser: boolean;
  rankChange: 'up' | 'down' | 'same';
  rankChangeAmount: number;
  recentLesson: string;
  recentLessonTh?: string;
}

export interface TeamChallenge {
  id: string;
  teamName: string;
  teamNameTh?: string;
  title: string;
  titleTh?: string;
  goalDescription: string;
  goalDescriptionTh?: string;
  currentCount: number;
  targetCount: number;
  daysRemaining: number;
  rewardTitle: string;
  rewardTitleTh?: string;
  rewardDescription: string;
  rewardDescriptionTh?: string;
  topContributors: {
    name: string;
    avatar: string;
    count: number;
    role: string;
    roleTh?: string;
  }[];
  recentActivities: {
    id: string;
    userName: string;
    userAvatar: string;
    lessonTitle: string;
    lessonTitleTh?: string;
    timestamp: string;
    timestampTh?: string;
  }[];
}

export interface Badge {
  id: string;
  title: string;
  titleTh?: string;
  description: string;
  descriptionTh?: string;
  icon: string;
  category: 'Streak' | 'Quiz' | 'Speed' | 'Team' | 'Mastery';
  categoryTh?: string;
  unlocked: boolean;
  unlockedDate?: string;
  unlockedDateTh?: string;
  xpBonus: number;
}

