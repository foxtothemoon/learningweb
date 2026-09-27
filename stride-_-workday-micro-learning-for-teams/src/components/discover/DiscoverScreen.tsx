import React, { useState } from 'react';
import { Lesson, ViewMode, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { Search, Clock, Zap, ArrowRight, CheckCircle2, Sparkles, Filter } from 'lucide-react';

interface DiscoverScreenProps {
  lessons: Lesson[];
  onStartLesson: (lesson: Lesson) => void;
  onNavigate: (view: ViewMode) => void;
  lang: Language;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  lessons,
  onStartLesson,
  onNavigate,
  lang,
}) => {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const t = translations[lang];

  const categoryOptions = [
    { key: 'all', label: t.catAll },
    { key: 'for-you', label: t.catForYou },
    { key: 'quick-wins', label: t.catQuickWins },
    { key: 'Wellbeing', label: t.catWellbeing },
    { key: 'Digital Skills', label: t.catDigitalSkills },
    { key: 'People Skills', label: t.catPeopleSkills },
    { key: 'Leadership', label: t.catLeadership },
  ];

  const filteredLessons = lessons.filter((lesson) => {
    const matchesCategory =
      selectedCategoryKey === 'all'
        ? true
        : selectedCategoryKey === 'for-you'
        ? lesson.progressPercent > 0 || lesson.difficulty === 'Quick'
        : selectedCategoryKey === 'quick-wins'
        ? lesson.durationMinutes <= 6
        : lesson.category === selectedCategoryKey;

    const titleEn = lesson.title.toLowerCase();
    const titleTh = (lesson.titleTh || '').toLowerCase();
    const descEn = lesson.shortDesc.toLowerCase();
    const descTh = (lesson.shortDescTh || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      titleEn.includes(q) ||
      titleTh.includes(q) ||
      descEn.includes(q) ||
      descTh.includes(q) ||
      lesson.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const getLessonTitle = (lesson: Lesson) => (lang === 'th' && lesson.titleTh ? lesson.titleTh : lesson.title);
  const getLessonCategory = (lesson: Lesson) => (lang === 'th' && lesson.categoryTh ? lesson.categoryTh : lesson.category);
  const getLessonDesc = (lesson: Lesson) => (lang === 'th' && lesson.shortDescTh ? lesson.shortDescTh : lesson.shortDesc);
  const getLessonDifficulty = (lesson: Lesson) => (lang === 'th' && lesson.difficultyTh ? lesson.difficultyTh : lesson.difficulty);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            {t.exploreActivities}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mt-1">
            {t.catalogHeading}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            {t.catalogSub}
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              {t.clearSearch}
            </button>
          )}
        </div>
      </div>

      {/* Category Segmented Tabs (Buttons with click handlers) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categoryOptions.map((cat) => {
          const isActive = selectedCategoryKey === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategoryKey(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Learning Cards */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-sky-300 transition-all flex flex-col justify-between group"
            >
              {/* Card Header Visual with Category Theme */}
              <div
                className={`p-6 bg-gradient-to-br ${
                  lesson.accentColor === 'sky'
                    ? 'from-sky-50 to-cyan-50/50'
                    : lesson.accentColor === 'indigo'
                    ? 'from-indigo-50 to-blue-50/50'
                    : lesson.accentColor === 'emerald'
                    ? 'from-emerald-50 to-teal-50/50'
                    : lesson.accentColor === 'violet'
                    ? 'from-violet-50 to-purple-50/50'
                    : lesson.accentColor === 'amber'
                    ? 'from-amber-50 to-orange-50/50'
                    : 'from-rose-50 to-pink-50/50'
                } border-b border-slate-100 flex items-start justify-between relative`}
              >
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{getLessonCategory(lesson)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{getLessonDifficulty(lesson)}</span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-slate-900 mt-2 group-hover:text-sky-600 transition-colors leading-snug">
                    {getLessonTitle(lesson)}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-white/80 px-2.5 py-1 rounded-full border border-amber-200/60 shadow-xs shrink-0">
                  <Zap className="w-3.5 h-3.5 fill-amber-500" />
                  <span>+{lesson.xpReward} XP</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {getLessonDesc(lesson)}
                </p>

                {/* Progress bar if started */}
                {lesson.progressPercent > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{lesson.completed ? (lang === 'th' ? 'สำเร็จแล้ว' : 'Completed') : (lang === 'th' ? 'กำลังเรียน' : 'In Progress')}</span>
                      <span className="font-semibold text-sky-600 tabular-nums">{lesson.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${lesson.completed ? 'bg-emerald-500' : 'bg-sky-500'}`}
                        style={{ width: `${lesson.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Card Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lesson.durationMinutes} {t.minActivity}</span>
                  </div>

                  <button
                    onClick={() => onStartLesson(lesson)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      lesson.completed
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : lesson.progressPercent > 0
                        ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {lesson.completed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.review}</span>
                      </>
                    ) : lesson.progressPercent > 0 ? (
                      <>
                        <span>{t.resume}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>{t.start}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t.noLessonsFound}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t.noLessonsSub}
          </p>
          <button
            onClick={() => {
              setSelectedCategoryKey('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-full bg-sky-50 text-sky-600 text-xs font-bold hover:bg-sky-100"
          >
            {t.resetFilters}
          </button>
        </div>
      )}

      {/* Suggested Path Banner */}
      <div className="p-6 bg-gradient-to-r from-sky-50 via-indigo-50 to-violet-50 rounded-3xl border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{t.structuredBannerTitle}</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.structuredBannerSub}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('path')}
          className="px-5 py-2 rounded-full bg-white text-sky-700 hover:bg-sky-50 border border-sky-200 text-xs font-bold shadow-xs whitespace-nowrap"
        >
          {t.viewPathBtn}
        </button>
      </div>

    </div>
  );
};
