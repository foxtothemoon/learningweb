import React, { useState, useEffect } from 'react';
import { Lesson, QuizOption, UserProfile, Language } from '../../types';
import { translations } from '../../i18n/translations';
import confetti from 'canvas-confetti';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Clock,
  Compass,
  Lightbulb,
  Check
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  user: UserProfile;
  onClose: () => void;
  onComplete: (lessonId: string, earnedXP: number, quizScore: number) => void;
  onNavigateToLeaderboard?: () => void;
  lang: Language;
  enableConfetti?: boolean;
  enableSoundEffects?: boolean;
}

type LessonStage = 'content' | 'quiz-intro' | 'quiz' | 'celebration';

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  user,
  onClose,
  onComplete,
  onNavigateToLeaderboard,
  lang,
  enableConfetti = true,
  enableSoundEffects = true,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stage, setStage] = useState<LessonStage>('content');
  
  // Interactive reflection prompt inside content step
  const [selectedReflection, setSelectedReflection] = useState<number | null>(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const t = translations[lang];

  const totalSteps = lesson.steps.length;
  const currentStep = lesson.steps[currentStepIndex];
  const totalQuestions = lesson.quiz.length;
  const currentQuestion = lesson.quiz[currentQuestionIndex];

  // Play subtle celebratory chime using Web Audio API on correct answer / finish
  const playPositiveChime = () => {
    if (!enableSoundEffects) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  };

  // Trigger celebration confetti
  useEffect(() => {
    if (stage === 'celebration' && enableConfetti) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#f59e0b', '#8b5cf6', '#10b981'],
        });
        playPositiveChime();
      } catch {
        // Fallback gracefully if canvas unavailable
      }
    }
  }, [stage, enableConfetti]);

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedReflection(null);
    } else {
      setStage('quiz-intro');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setSelectedReflection(null);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));

    if (optionId === currentQuestion.correctOptionId) {
      setCorrectCount((prev) => prev + 1);
      playPositiveChime();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished all questions!
      const finalScore = Math.round(((correctCount + (selectedOptionId === currentQuestion.correctOptionId ? 0 : 0)) / totalQuestions) * 100);
      onComplete(lesson.id, lesson.xpReward, finalScore);
      setStage('celebration');
    }
  };

  const isCurrentAnswerCorrect = selectedOptionId === currentQuestion?.correctOptionId;
  const selectedOptionObj = currentQuestion?.options.find((o) => o.id === selectedOptionId);

  // Localization Helpers
  const lessonTitle = lang === 'th' && lesson.titleTh ? lesson.titleTh : lesson.title;
  const lessonCategory = lang === 'th' && lesson.categoryTh ? lesson.categoryTh : lesson.category;

  const stepTitle = currentStep ? (lang === 'th' && currentStep.titleTh ? currentStep.titleTh : currentStep.title) : '';
  const stepSubtitle = currentStep ? (lang === 'th' && currentStep.subtitleTh ? currentStep.subtitleTh : currentStep.subtitle) : '';
  const stepContent = currentStep ? (lang === 'th' && currentStep.contentTh ? currentStep.contentTh : currentStep.content) : '';
  const stepTakeaways = currentStep ? (lang === 'th' && currentStep.takeawaysTh ? currentStep.takeawaysTh : currentStep.takeaways) : [];
  const stepProTip = currentStep ? (lang === 'th' && currentStep.proTipTh ? currentStep.proTipTh : currentStep.proTip) : '';

  const questionText = currentQuestion ? (lang === 'th' && currentQuestion.questionTh ? currentQuestion.questionTh : currentQuestion.question) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Strip */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
              {stage === 'celebration' ? '🎉' : stage === 'quiz' ? '🎯' : `${currentStepIndex + 1}/${totalSteps}`}
            </span>
            <div>
              <div className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                {stage === 'celebration' ? t.lessonCompletedTag : stage === 'quiz' ? t.knowledgeCheckTag : lessonCategory}
              </div>
              <div className="text-sm font-bold text-slate-800 line-clamp-1">{lessonTitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              <span>+{lesson.xpReward} XP</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
              aria-label="Close lesson"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
            style={{
              width:
                stage === 'content'
                  ? `${((currentStepIndex + 1) / (totalSteps + 1)) * 100}%`
                  : stage === 'quiz-intro'
                  ? '75%'
                  : stage === 'quiz'
                  ? `${75 + ((currentQuestionIndex + 1) / totalQuestions) * 25}%`
                  : '100%',
            }}
          />
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* STAGE 1: CONTENT STEPS */}
          {stage === 'content' && currentStep && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'th' ? `ขั้นตอนที่ ${currentStepIndex + 1} จาก ${totalSteps}` : `Step ${currentStepIndex + 1} of ${totalSteps}`}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-1">
                  {stepTitle}
                </h2>
                <p className="text-sm text-sky-700 font-medium mt-1">{stepSubtitle}</p>
              </div>

              <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 text-slate-700 text-sm leading-relaxed">
                {stepContent}
              </div>

              {/* Actionable Key Takeaways */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  {t.keyInsights}
                </h4>
                <ul className="space-y-2">
                  {stepTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Tip Box */}
              {stepProTip && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs sm:text-sm">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">{t.workdayProTip} </span>
                    <span>{stepProTip}</span>
                  </div>
                </div>
              )}

              {/* Interactive Mini Reflection Prompt */}
              {currentStep.interactivePrompt && (
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>{t.quickReflection}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {lang === 'th' && currentStep.interactivePrompt.questionTh
                      ? currentStep.interactivePrompt.questionTh
                      : currentStep.interactivePrompt.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(lang === 'th' && currentStep.interactivePrompt.choicesTh
                      ? currentStep.interactivePrompt.choicesTh
                      : currentStep.interactivePrompt.choices
                    ).map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedReflection(i)}
                        className={`text-left text-xs p-3 rounded-xl border transition-all ${
                          selectedReflection === i
                            ? 'bg-indigo-600 text-white font-medium shadow-sm border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                  {selectedReflection !== null && (
                    <div className="p-3 bg-white/90 rounded-xl border border-indigo-200/70 text-xs text-indigo-900 animate-in fade-in">
                      💡{' '}
                      {lang === 'th' && currentStep.interactivePrompt.insightTh
                        ? currentStep.interactivePrompt.insightTh
                        : currentStep.interactivePrompt.insight}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STAGE 2: QUIZ INTRO */}
          {stage === 'quiz-intro' && (
            <div className="text-center py-6 sm:py-10 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  {t.readyForQuiz}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                  {t.quizIntroPrompt(totalQuestions, lesson.xpReward)}
                </p>
              </div>

              <div className="inline-flex items-center gap-4 bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-full text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-500" /> {t.about2Min}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> {t.instantFeedback}
                </span>
              </div>
            </div>
          )}

          {/* STAGE 3: INTERACTIVE QUIZ */}
          {stage === 'quiz' && currentQuestion && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-sky-600 uppercase tracking-wider">
                  {lang === 'th'
                    ? `คำถามข้อที่ ${currentQuestionIndex + 1} จาก ${totalQuestions}`
                    : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
                </span>
                <span className="tabular-nums">
                  {lang === 'th' ? `คะแนน: ตอบถูก ${correctCount} ข้อ` : `Score: ${correctCount} correct`}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-snug">
                {questionText}
              </h3>

              {/* Answer Option Cards */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = option.id === currentQuestion.correctOptionId;

                  let cardStyle = 'bg-white border-slate-200 text-slate-800 hover:border-sky-300 hover:bg-slate-50';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-50/90 border-emerald-400 text-emerald-950 font-medium ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'bg-amber-50/90 border-amber-300 text-amber-950 ring-1 ring-amber-300';
                    } else {
                      cardStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  const optionText = lang === 'th' && option.textTh ? option.textTh : option.text;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border transition-all text-sm flex items-start gap-3.5 shadow-xs ${cardStyle}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                          isAnswerSubmitted && isCorrect
                            ? 'bg-emerald-500 text-white'
                            : isAnswerSubmitted && isSelected && !isCorrect
                            ? 'bg-amber-500 text-white'
                            : isSelected
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isAnswerSubmitted && isCorrect ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : isAnswerSubmitted && isSelected && !isCorrect ? (
                          '✕'
                        ) : (
                          option.id.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 leading-snug">{optionText}</div>
                    </button>
                  );
                })}
              </div>

              {/* Instant Encouraging Feedback Banner */}
              {isAnswerSubmitted && selectedOptionObj && (
                <div
                  className={`p-4 rounded-2xl border animate-in slide-in-from-bottom-2 duration-200 ${
                    isCurrentAnswerCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {isCurrentAnswerCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>{t.correctCheer}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span>{t.incorrectEncouragement}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm mt-1.5 leading-relaxed opacity-95">
                    {lang === 'th' && selectedOptionObj.explanationTh
                      ? selectedOptionObj.explanationTh
                      : selectedOptionObj.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STAGE 4: CELEBRATION & REWARDS */}
          {stage === 'celebration' && (
            <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-400 to-cyan-300 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30">
                <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                  {t.niceWorkHeading(user.name.split(' ')[0])}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {t.youCompletedMsg} <span className="font-semibold text-slate-800">{lessonTitle}</span>
                </p>
              </div>

              {/* Reward Cards Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 text-center">
                  <div className="text-xs text-sky-600 font-medium">{t.earnedStat}</div>
                  <div className="text-xl sm:text-2xl font-black text-sky-700 font-display mt-0.5">
                    +{lesson.xpReward}
                  </div>
                  <div className="text-[10px] text-sky-600/80">{t.xpPointsLabel}</div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                  <div className="text-xs text-amber-600 font-medium">{t.streakStat}</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-700 font-display mt-0.5 flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span>{user.streakDays + 1}</span>
                  </div>
                  <div className="text-[10px] text-amber-600/80">{t.daysStrongLabel}</div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <div className="text-xs text-emerald-600 font-medium">{t.quizScoreStat}</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 font-display mt-0.5">
                    {correctCount}/{totalQuestions}
                  </div>
                  <div className="text-[10px] text-emerald-600/80">{t.questionsRightLabel}</div>
                </div>
              </div>

              {/* Badge Unlocked Celebration Moment */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/80 max-w-md mx-auto text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                  🧘
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700">
                    <Award className="w-4 h-4 text-violet-600" />
                    <span>{t.newBadgeTag}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">
                    {lang === 'th' ? 'ผู้บุกเบิกสมาธิ' : 'Focus Pioneer'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {lang === 'th' ? 'จบบทเรียนแรกด้านสุขภาวะดิจิทัล' : 'Completed 1st Digital Wellbeing session'}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic">
                “{t.motto}”
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {stage === 'content' && (
            <>
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:hover:text-slate-600 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {t.previousBtn}
              </button>
              <button
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>{currentStepIndex === totalSteps - 1 ? t.startQuizBtn : t.nextStepBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {stage === 'quiz-intro' && (
            <>
              <button
                onClick={() => setStage('content')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                {t.reviewConceptsBtn}
              </button>
              <button
                onClick={() => {
                  setStage('quiz');
                  setCurrentQuestionIndex(0);
                  setIsAnswerSubmitted(false);
                  setSelectedOptionId(null);
                }}
                className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>{t.beginQuizBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {stage === 'quiz' && (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {!isAnswerSubmitted ? t.selectAnswerNotice : t.feedbackNotice}
              </span>
              <button
                onClick={handleNextQuestion}
                disabled={!isAnswerSubmitted}
                className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white text-xs font-bold shadow-md shadow-sky-600/20 disabled:shadow-none flex items-center gap-2 transition-all active:scale-95"
              >
                <span>{currentQuestionIndex === totalQuestions - 1 ? t.finishAndCelebrateBtn : t.nextQuestionBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {stage === 'celebration' && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-end gap-2.5">
              {onNavigateToLeaderboard && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToLeaderboard();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  {t.viewLeaderboardBtn}
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all active:scale-95"
              >
                {t.backHomeBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
