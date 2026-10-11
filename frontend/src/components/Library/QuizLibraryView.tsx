import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAgent } from '../../context/AgentContext';
import { QuizLibraryItem } from '../../types';
import {
  Search,
  Sparkles,
  Play,
  Wand2,
  Users,
  Flame,
  Star,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  ShoppingBag,
  Zap,
  SearchCode,
  Lightbulb,
  BookOpen,
  Globe2,
  Brain
} from 'lucide-react';

export const QuizLibraryView: React.FC = () => {
  const { askAgent, setActiveMode } = useAgent();
  const [quizzes, setQuizzes] = useState<QuizLibraryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const res = await api.getQuizLibrary();
        setQuizzes(res.quizzes || []);
      } catch (err) {
        console.error('Failed to load quiz library:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const subjects = [
    { id: 'all', label: 'All Subjects', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'math', label: 'Everyday Math', icon: <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'speed', label: 'Speed & Reflexes', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'logic', label: 'Detective Logic', icon: <SearchCode className="w-3.5 h-3.5 text-violet-400" /> },
    { id: 'science', label: 'Practical Science', icon: <Lightbulb className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'language', label: 'Words & Riddles', icon: <BookOpen className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'life_skills', label: 'Life Skills', icon: <Globe2 className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'memory', label: 'Memory & Shapes', icon: <Brain className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  const levels = [
    { id: 'all', label: '🌟 All Levels' },
    { id: 'easy', label: '🎒 Middle School (Grades 5-8)' },
    { id: 'medium', label: '🎓 High School' },
    { id: 'hard', label: '💼 Adults & Advanced' },
  ];

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSubject = selectedSubject === 'all' || quiz.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'all' || quiz.difficulty_level === selectedLevel;
    const matchesSearch =
      searchQuery.trim() === '' ||
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSubject && matchesLevel && matchesSearch;
  });

  const handlePlayQuiz = (quiz: QuizLibraryItem) => {
    askAgent(quiz.prompt_trigger);
    setActiveMode('challenge');
  };

  const handleAiRemix = (quiz: QuizLibraryItem) => {
    askAgent(`Create a fresh AI dynamic variation of the ${quiz.title} challenge`);
    setActiveMode('challenge');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Wayground vs Cognivista Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-graphite-750 shadow-glass relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-mint-deep/30 border border-mint-glow/40 text-mint-glow text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wayground-Inspired Multi-Subject Library</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-graphite-100 font-sans tracking-tight">
              Real-World Quizzes & Puzzles For All Levels
            </h1>
            <p className="text-xs md:text-sm text-graphite-300 leading-relaxed">
              Explore practical, understandable challenges across everyday math, gadget physics, detective clues, and reaction reflexes. Every quiz is powered by the Cognivista Autonomous AI Agent!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-graphite-900/90 border border-violet-neon/40 text-xs font-mono space-y-2 shrink-0 md:max-w-xs shadow-violet-glow/10">
            <div className="flex items-center space-x-2 text-violet-glow font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AI Agent Advantage</span>
            </div>
            <p className="text-graphite-300 text-[11px] leading-normal">
              Wayground requires teachers to manually write quizzes. Cognivista has an AI Agent that generates, adapts, and diagnoses challenges automatically!
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-400" />
          <input
            type="text"
            placeholder="Search quizzes by title, topic, or keyword (e.g., 'shopping', 'stroop', 'mystery', 'flight')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-graphite-900 border border-graphite-750 text-graphite-100 text-sm placeholder:text-graphite-500 focus:outline-none focus:border-mint-glow focus:ring-1 focus:ring-mint-glow/40 transition-all font-sans"
          />
        </div>

        {/* Audience Grade Level Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-graphite-400 font-bold uppercase shrink-0 mr-1">
            Grade Level:
          </span>
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-mint-glow text-graphite-950 font-bold shadow-mint-glow/20'
                    : 'bg-graphite-900 border border-graphite-800 text-graphite-300 hover:border-graphite-700 hover:text-graphite-100'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

        {/* Subject Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubject(sub.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-neon text-white font-bold shadow-violet-glow/30'
                    : 'bg-graphite-900/80 border border-graphite-800 text-graphite-400 hover:text-graphite-200 hover:border-graphite-700'
                }`}
              >
                {sub.icon}
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-graphite-900/60 border border-graphite-800 space-y-3">
          <Sparkles className="w-8 h-8 text-mint-glow mx-auto animate-pulse" />
          <div className="text-xs font-mono text-graphite-400">Loading Wayground quiz packs...</div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-graphite-900/60 border border-graphite-800 space-y-3">
          <HelpCircle className="w-8 h-8 text-graphite-500 mx-auto" />
          <h4 className="text-sm font-bold text-graphite-300">No quizzes match your filter</h4>
          <p className="text-xs text-graphite-500 font-mono">
            Try choosing 'All Subjects' or typing a different keyword in the search bar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-5 rounded-3xl bg-graphite-900/90 border border-graphite-800 hover:border-graphite-700 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-glass group hover:-translate-y-1"
            >
              <div className="space-y-3">
                {/* Header Badge & Level */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-violet-neon/20 border border-violet-neon/30 text-violet-glow text-[11px] font-mono font-bold flex items-center space-x-1">
                    <span>{quiz.badge}</span>
                  </span>
                  <span className="text-[10px] font-mono text-graphite-400 px-2 py-0.5 rounded-lg bg-graphite-950 border border-graphite-800">
                    {quiz.difficulty}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-graphite-100 group-hover:text-mint-glow transition-colors font-sans line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-graphite-400 mt-1 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quiz.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-graphite-400 bg-graphite-950 px-2 py-0.5 rounded-md border border-graphite-850"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Meta & Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-graphite-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-graphite-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-graphite-500" />
                    <span>{quiz.plays_count} plays</span>
                  </span>
                  <span className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>4.9</span>
                  </span>
                  <span className="flex items-center space-x-1 text-mint-glow">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{quiz.questions_count} Qs</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlayQuiz(quiz)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs font-mono shadow-mint-glow/20 hover:opacity-95 flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Quiz</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAiRemix(quiz)}
                    className="w-full py-2.5 px-3 rounded-xl bg-graphite-950 border border-graphite-750 text-graphite-300 hover:text-white hover:border-violet-neon/50 text-xs font-mono font-medium flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                    title="Generate a personalized new variant using Cognivista AI"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-violet-glow" />
                    <span>AI Remix</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
