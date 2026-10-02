'use client';

import React from 'react';
import { Match } from '@/lib/sports-api';
import { BrainCircuit, ChevronRight, Clock, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onSelect?: (matchId: string) => void;
  featured?: boolean;
}

export default function MatchCard({ match, onSelect, featured = false }: MatchCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(match.id);
    }
  };

  const isLive = match.status === 'LIVE';

  return (
    <article
      className={`group rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 overflow-hidden ${
        featured
          ? 'border-emerald-500/40 dark:border-emerald-500/30 shadow-lg shadow-emerald-500/5 hover:border-emerald-500'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Competition Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
          <span className="text-base">{match.league.flag}</span>
          <span className="truncate max-w-[160px] sm:max-w-none">{match.league.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm shadow-rose-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>EN VIVO {match.displayClock || (match.minute ? `${match.minute}'` : '')}</span>
            </span>
          ) : match.status === 'FINISHED' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              <span>FINALIZADO</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{match.date} • {match.time}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Teams Face-off */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-7 items-center gap-2 sm:gap-4 mb-4">
          {/* Home Team */}
          <div className="col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center justify-center mb-2 shadow-inner">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
              {match.homeTeam.name}
            </h3>
            {/* Form indicators */}
            <div className="flex items-center gap-1 mt-1.5">
              {match.homeTeam.form.map((res, i) => (
                <span
                  key={i}
                  className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${
                    res === 'W'
                      ? 'bg-emerald-500'
                      : res === 'D'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  title={`Resultado: ${res === 'W' ? 'Victoria' : res === 'D' ? 'Empate' : 'Derrota'}`}
                >
                  {res}
                </span>
              ))}
            </div>
          </div>

          {/* Center VS or Score */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            {match.score ? (
              <div
                className={`flex items-center gap-1 font-black text-lg sm:text-2xl px-2.5 py-1 rounded-xl ${
                  isLive
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 shadow-sm animate-pulse'
                    : 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <span>{match.score.home}</span>
                <span className="text-slate-400 text-sm sm:text-base">-</span>
                <span>{match.score.away}</span>
              </div>
            ) : (
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                VS
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="col-span-3 flex flex-col items-center sm:items-end text-center sm:text-right">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center justify-center mb-2 shadow-inner">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
              {match.awayTeam.name}
            </h3>
            {/* Form indicators */}
            <div className="flex items-center gap-1 mt-1.5">
              {match.awayTeam.form.map((res, i) => (
                <span
                  key={i}
                  className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${
                    res === 'W'
                      ? 'bg-emerald-500'
                      : res === 'D'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  title={`Resultado: ${res === 'W' ? 'Victoria' : res === 'D' ? 'Empate' : 'Derrota'}`}
                >
                  {res}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 1X2 Market Odds */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">1 (Local)</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {match.odds.home.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-x border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">X (Empate)</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {match.odds.draw.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">2 (Visitante)</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {match.odds.away.toFixed(2)}
            </span>
          </div>
        </div>

        {/* AI Prediction Badge & CTA Link */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Predicción IA Disponible</span>
          </div>

          <a
            href={`/partido/${match.id}`}
            onClick={handleClick}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 group-hover:translate-x-0.5 transition-all"
          >
            <span>Ver Análisis H2H</span>
            <ChevronRight className="w-4 h-4 text-emerald-500" />
          </a>
        </div>
      </div>
    </article>
  );
}
