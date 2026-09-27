import React, { useState } from 'react';
import { PathNode, Lesson, ViewMode, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Check,
  Lock,
  ArrowRight,
  Clock,
  Zap,
  Sparkles,
  MapPin,
  Compass,
  Trophy
} from 'lucide-react';

interface LearningPathScreenProps {
  pathNodes: PathNode[];
  lessons: Lesson[];
  onStartLesson: (lesson: Lesson) => void;
  onNavigate: (view: ViewMode) => void;
  lang: Language;
}

export const LearningPathScreen: React.FC<LearningPathScreenProps> = ({
  pathNodes,
  lessons,
  onStartLesson,
  lang,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('path-2');
  const t = translations[lang];

  const selectedNode = pathNodes.find((n) => n.id === selectedNodeId) || pathNodes[1];
  const associatedLesson = lessons.find((l) => l.id === selectedNode.lessonId);

  const getNodeTitle = (node: PathNode) => (lang === 'th' && node.titleTh ? node.titleTh : node.title);
  const getNodeCategory = (node: PathNode) => (lang === 'th' && node.categoryTh ? node.categoryTh : node.category);

  // Group nodes by checkpoint
  const checkpoints = [
    {
      name: lang === 'th' ? 'สปรินต์ที่ 1: เกราะป้องกันในที่ทำงานดิจิทัล' : 'Sprint 1: Digital Workplace Guardrails',
      description: lang === 'th' ? 'ทักษะการสร้างสมาธิและการรักษาความปลอดภัยข้อมูลสำหรับทีมไฮบริด' : 'Foundational focus habits and data security practices for hybrid teams.',
      nodes: pathNodes.filter((n) => n.stepNumber <= 2),
    },
    {
      name: lang === 'th' ? 'สปรินต์ที่ 2: พลังของทีมและฟีดแบ็ก' : 'Sprint 2: Team Dynamics & Feedback',
      description: lang === 'th' ? 'การสร้างพื้นที่ปลอดภัย การให้ฟีดแบ็กที่ชัดเจน และการใช้งาน AI' : 'Building psychological safety, giving crisp feedback, and prompting AI.',
      nodes: pathNodes.filter((n) => n.stepNumber >= 3 && n.stepNumber <= 4),
    },
    {
      name: lang === 'th' ? 'สปรินต์ที่ 3: ความคล่องตัวในการปฏิบัติงาน' : 'Sprint 3: Operational Agility',
      description: lang === 'th' ? 'การประชุมที่กระชับและการโน้มน้าวใจเพื่อนร่วมงานต่างแผนก' : 'Streamlined meeting practices and cross-functional leadership.',
      nodes: pathNodes.filter((n) => n.stepNumber >= 5),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>{t.steppingStones}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mt-1">
            {t.pathHeading}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            {t.pathSub}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-600 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs self-start md:self-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>{t.legendCompleted}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 animate-pulse inline-block" />
            <span className="font-semibold text-slate-900">{t.legendCurrent}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
            <span>{t.legendNext}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: The Visual Stepping-Stone Journey Path (Span 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-8 relative">
          {checkpoints.map((cp, cpIdx) => (
            <div key={cpIdx} className="space-y-4">
              {/* Checkpoint Banner */}
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  {cpIdx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{cp.name}</h3>
                  <p className="text-[11px] text-slate-500">{cp.description}</p>
                </div>
              </div>

              {/* Stepping stone items with connecting lines */}
              <div className="relative pl-6 space-y-6">
                {/* Vertical connecting line */}
                <div className="absolute left-[2.4rem] top-3 bottom-3 w-0.5 bg-slate-200 -z-0" />

                {cp.nodes.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  const isCompleted = node.status === 'completed';
                  const isCurrent = node.status === 'current';
                  const isLocked = node.status === 'locked';

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`relative z-10 flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-300 shadow-md ring-2 ring-sky-400/20'
                          : isCurrent
                          ? 'bg-white border-sky-200 hover:border-sky-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Node Status Circle */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : isCurrent
                            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105 animate-pulse-ring'
                            : isLocked
                            ? 'bg-slate-100 text-slate-400 border border-slate-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 stroke-[3]" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : (
                          node.stepNumber
                        )}
                      </div>

                      {/* Node Text & Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {lang === 'th' ? `ขั้นตอนที่ ${node.stepNumber}` : `Step ${node.stepNumber}`} · {getNodeCategory(node)}
                          </span>
                          {isCurrent && (
                            <span className="bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                              {t.legendCurrent}
                            </span>
                          )}
                        </div>

                        <div className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                          {getNodeTitle(node)}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{node.durationMinutes} {t.minutesLabel}</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-amber-600">+{node.xpReward} XP</span>
                        </div>
                      </div>

                      <div className="text-slate-400">
                        <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-sky-600' : ''}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Path Finish Trophy */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                {t.milestoneTrophyTitle}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {t.milestoneTrophySub}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Node Detail & Quick Start Card (Span 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm sticky top-20 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              {t.stepDetails}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              selectedNode.status === 'completed'
                ? 'bg-emerald-50 text-emerald-700'
                : selectedNode.status === 'current'
                ? 'bg-sky-50 text-sky-700'
                : selectedNode.status === 'locked'
                ? 'bg-slate-100 text-slate-500'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {selectedNode.status === 'completed'
                ? t.statusCompleted
                : selectedNode.status === 'current'
                ? t.statusActive
                : selectedNode.status === 'locked'
                ? t.statusLocked
                : t.statusUpNext}
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold font-display text-slate-900">
              {getNodeTitle(selectedNode)}
            </h3>
            {associatedLesson && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lang === 'th' && associatedLesson.shortDescTh ? associatedLesson.shortDescTh : associatedLesson.shortDesc}
              </p>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">{t.estimatedTime}</span>
              <div className="text-base font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-sky-500" />
                <span>{selectedNode.durationMinutes} {t.minutesLabel}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">{t.rewardLabel}</span>
              <div className="text-base font-bold text-amber-600 flex items-center gap-1.5 mt-0.5">
                <Zap className="w-4 h-4 fill-amber-500" />
                <span>+{selectedNode.xpReward} XP</span>
              </div>
            </div>
          </div>

          {/* What You Will Learn */}
          {associatedLesson && associatedLesson.steps.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.whatYoullPractice}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(lang === 'th' && associatedLesson.steps[0].takeawaysTh
                  ? associatedLesson.steps[0].takeawaysTh
                  : associatedLesson.steps[0].takeaways
                ).map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          {associatedLesson && (
            <button
              onClick={() => onStartLesson(associatedLesson)}
              disabled={selectedNode.status === 'locked'}
              className="w-full py-3 rounded-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold shadow-md shadow-sky-600/20 disabled:shadow-none flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {selectedNode.status === 'locked' ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t.lockedStepBtn}</span>
                </>
              ) : selectedNode.status === 'completed' ? (
                <>
                  <span>{t.reviewStepBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{t.startLessonBtn(selectedNode.durationMinutes)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
