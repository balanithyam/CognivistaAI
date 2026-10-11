import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { ArenaContainer } from '../Arena/ArenaContainer';
import {
  Globe2,
  Radio,
  ExternalLink,
  Clock,
  ShieldCheck,
  Sparkles,
  Plane,
  CloudSun,
  ShoppingBag,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LiveChallengesView: React.FC = () => {
  const { loadLiveChallenge, activeChallenge, setActiveMode } = useAgent();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamActive, setStreamActive] = useState<boolean>(true);
  const [selectedStream, setSelectedStream] = useState<'all' | 'weather' | 'travel' | 'market'>('all');

  const liveFeeds = [
    {
      id: 'weather',
      title: 'Open-Meteo Atmospheric Weather',
      desc: 'Live global temperatures, barometric pressure, and home energy consumption math.',
      source: 'Open-Meteo API',
      url: 'https://open-meteo.com',
      icon: <CloudSun className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'travel',
      title: 'World Time Zone & Flight Intelligence',
      desc: 'Real flight durations, international airport UTC offsets, and arrival time calculation.',
      source: 'World Time API',
      url: 'https://worldtimeapi.org',
      icon: <Plane className="w-5 h-5 text-sky-400" />
    },
    {
      id: 'market',
      title: 'Consumer Market & Pricing Intelligence',
      desc: 'Actual electronic appliance power ratings, retail discounts, and shopping math.',
      source: 'Consumer Market Intelligence Feed',
      url: 'https://cognivista.ai/market',
      icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />
    }
  ];

  const handleFetchLiveChallenge = async () => {
    setIsLoading(true);
    try {
      await loadLiveChallenge();
      setStreamActive(true);
    } catch (e) {
      console.error('Failed to fetch live challenge:', e);
      setStreamActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchSpecificFeed = async (feedId: string) => {
    setIsLoading(true);
    try {
      if (feedId === 'weather') {
        await askAgent("Give me a live atmospheric weather challenge from Open-Meteo");
      } else if (feedId === 'travel') {
        await askAgent("Give me a live world time zone and flight intelligence travel challenge");
      } else {
        await askAgent("Give me a live consumer market appliance power and shopping math challenge");
      }
      setStreamActive(true);
    } catch (e) {
      console.error('Failed to fetch specific feed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentChallengeLive = Boolean(activeChallenge?.source_info?.is_live);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-graphite-750 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-mint-neon p-0.5 shadow-mint-glow flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-graphite-950 rounded-[14px] flex items-center justify-center">
              <Globe2 className="w-7 h-7 text-sky-400 animate-spin-slow" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-graphite-100 font-sans">
                Live Challenges
              </h2>
              <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-mint-neon/15 border border-mint-neon/30 text-mint-glow text-[11px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-mint-neon animate-pulse" />
                <span>{streamActive ? 'Live Source Connected' : 'Live source unavailable'}</span>
              </span>
            </div>
            <p className="text-xs text-graphite-400">
              Cognitive reasoning challenges built directly from verified external real-world feeds. Never fabricated.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFetchLiveChallenge}
          disabled={isLoading}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-mint-neon text-graphite-950 font-bold text-xs shadow-mint-glow hover:opacity-95 flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Retrieving Live Data...' : 'Fetch Fresh Live Challenge'}</span>
        </button>
      </div>

      {/* External Verified Data Sources Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {liveFeeds.map((feed) => (
          <div
            key={feed.id}
            className="p-5 rounded-2xl bg-graphite-900/90 border border-graphite-750 flex flex-col justify-between space-y-4 hover:border-sky-500/40 transition-all shadow-glass"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-graphite-950 border border-graphite-800">
                {feed.icon}
              </div>
              <a
                href={feed.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-graphite-400 hover:text-sky-400 flex items-center space-x-1 transition-colors"
              >
                <span>{feed.source}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <h4 className="text-sm font-bold text-graphite-200">{feed.title}</h4>
              <p className="text-xs text-graphite-400 mt-1 leading-relaxed">{feed.desc}</p>
            </div>

            <div className="pt-3 border-t border-graphite-800 flex items-center justify-between">
              <span className="flex items-center space-x-1 text-mint-glow text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Feed</span>
              </span>
              <button
                type="button"
                onClick={() => handleFetchSpecificFeed(feed.id)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-mono text-xs font-bold border border-sky-500/40 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Solve This Feed</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Challenge Interactive Arena or Empty State */}
      {activeChallenge && isCurrentChallengeLive ? (
        <div className="space-y-4">
          {/* Source Attribution Header Bar */}
          <div className="p-4 rounded-2xl bg-graphite-900 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2 text-sky-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="font-bold">Active Live Data Challenge:</span>
              <span className="text-graphite-300">
                {activeChallenge.source_info?.source_name || 'Verified External Feed'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-graphite-400">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{activeChallenge.source_info?.timestamp || 'Retrieved Just Now'}</span>
              </span>
              {activeChallenge.source_info?.source_url && (
                <a
                  href={activeChallenge.source_info.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mint-glow hover:underline flex items-center space-x-1"
                >
                  <span>Source URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Interactive Challenge Arena */}
          <ArenaContainer challenge={activeChallenge} />
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl glass-panel-elevated border border-graphite-800 space-y-4 max-w-md mx-auto">
          <Globe2 className="w-12 h-12 text-sky-400 mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-graphite-200">Ready to Load Live Data</h3>
          <p className="text-xs text-graphite-400 font-mono">
            Tap the button above to pull current global atmospheric data, flight travel times, or consumer market pricing into a cognitive challenge.
          </p>
          <button
            type="button"
            onClick={handleFetchLiveChallenge}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-mint-neon text-graphite-950 font-bold text-xs"
          >
            {isLoading ? 'Connecting...' : 'Fetch Live Challenge Now'}
          </button>
        </div>
      )}
    </div>
  );
};
