'use client';

import React, { useState } from 'react';
import { StandingTeam, ESPN_LEAGUES } from '@/lib/sports-api';
import { Search, Trophy, Shield, ArrowUpRight } from 'lucide-react';

interface LeagueStandingsTableProps {
  leagueId: string;
  standings: StandingTeam[];
  loading?: boolean;
  onSelectTeam?: (teamName: string) => void;
  title?: string;
  compact?: boolean;
}

export default function LeagueStandingsTable({
  leagueId,
  standings,
  loading = false,
  onSelectTeam,
  title,
  compact = false,
}: LeagueStandingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const leagueInfo = ESPN_LEAGUES[leagueId] || {
    slug: 'intl',
    name: title || 'Liga de Fútbol',
    flag: '🏆',
    country: 'Internacional',
  };

  const filteredStandings = standings.filter((team) =>
    team.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getZoneStyle = (zone?: StandingTeam['zone'], rank?: number) => {
    if (zone === 'ucl' || (rank && rank <= 4)) {
      return {
        pill: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        border: 'border-l-2 border-l-blue-500',
        label: 'Champions League',
      };
    }
    if (zone === 'uel' || (rank && (rank === 5 || rank === 6))) {
      return {
        pill: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        border: 'border-l-2 border-l-amber-500',
        label: 'Europa League',
      };
    }
    if (zone === 'uecl' || (rank && rank === 7)) {
      return {
        pill: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
        border: 'border-l-2 border-l-teal-500',
        label: 'Conference League',
      };
    }
    if (zone === 'relegation' || (rank && rank >= standings.length - 2 && standings.length >= 16)) {
      return {
        pill: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        border: 'border-l-2 border-l-rose-500',
        label: 'Descenso',
      };
    }
    return {
      pill: 'bg-slate-800 text-slate-400 border-slate-700',
      border: 'border-l-2 border-l-transparent',
      label: 'Posición regular',
    };
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
      {/* Table Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
            {leagueInfo.flag}
          </span>
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
              <span>{leagueInfo.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Oficial 2026/2027
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Clasificación general, estadísticas de gol y racha de puntos
            </p>
          </div>
        </div>

        {!compact && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar club..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <div className="w-9 h-9 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Cargando clasificación de {leagueInfo.name}...</p>
        </div>
      ) : filteredStandings.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No se encontraron clubes que coincidan con la búsqueda.
        </div>
      ) : (
        /* Scrollable table container */
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 bg-slate-950/70 uppercase tracking-wider">
                <th className="py-3 px-3 sm:px-4 text-center w-12">#</th>
                <th className="py-3 px-3 sm:px-4 min-w-[160px]">Equipo</th>
                <th className="py-3 px-2 sm:px-3 text-center">PJ</th>
                <th className="py-3 px-2 sm:px-3 text-center">G</th>
                <th className="py-3 px-2 sm:px-3 text-center">E</th>
                <th className="py-3 px-2 sm:px-3 text-center">P</th>
                {!compact && <th className="py-3 px-2 sm:px-3 text-center hidden md:table-cell">GF</th>}
                {!compact && <th className="py-3 px-2 sm:px-3 text-center hidden md:table-cell">GC</th>}
                <th className="py-3 px-2 sm:px-3 text-center">DG</th>
                <th className="py-3 px-3 sm:px-4 text-center font-black text-emerald-400">PTS</th>
                {!compact && <th className="py-3 px-3 sm:px-4 text-center hidden lg:table-cell">Racha</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredStandings.map((item) => {
                const zone = getZoneStyle(item.zone, item.rank);
                return (
                  <tr
                    key={item.team}
                    onClick={() => onSelectTeam && onSelectTeam(item.team)}
                    className={`hover:bg-slate-800/50 transition-colors group cursor-pointer ${zone.border}`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold border ${zone.pill}`}>
                        {item.rank}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-3 sm:px-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.team}
                            className="w-6 h-6 object-contain flex-shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Fallback if logo fails
                              (e.target as HTMLImageElement).src = 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png';
                            }}
                          />
                        ) : (
                          <Shield className="w-5 h-5 text-slate-500 flex-shrink-0" />
                        )}
                        <span className="truncate group-hover:text-emerald-400 transition-colors">
                          {item.team}
                        </span>
                      </div>
                    </td>

                    {/* Games Played */}
                    <td className="py-3 px-2 sm:px-3 text-center text-slate-300 font-mono">
                      {item.played}
                    </td>

                    {/* Won */}
                    <td className="py-3 px-2 sm:px-3 text-center text-slate-300 font-mono">
                      {item.won}
                    </td>

                    {/* Drawn */}
                    <td className="py-3 px-2 sm:px-3 text-center text-slate-400 font-mono">
                      {item.drawn}
                    </td>

                    {/* Lost */}
                    <td className="py-3 px-2 sm:px-3 text-center text-slate-400 font-mono">
                      {item.lost}
                    </td>

                    {/* Goals For */}
                    {!compact && (
                      <td className="py-3 px-2 sm:px-3 text-center text-slate-400 font-mono hidden md:table-cell">
                        {item.goalsFor}
                      </td>
                    )}

                    {/* Goals Against */}
                    {!compact && (
                      <td className="py-3 px-2 sm:px-3 text-center text-slate-400 font-mono hidden md:table-cell">
                        {item.goalsAgainst}
                      </td>
                    )}

                    {/* Goal Difference */}
                    <td className="py-3 px-2 sm:px-3 text-center font-mono font-semibold">
                      <span
                        className={
                          item.goalDiff > 0
                            ? 'text-emerald-400'
                            : item.goalDiff < 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }
                      >
                        {item.goalDiff > 0 ? `+${item.goalDiff}` : item.goalDiff}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="py-3 px-3 sm:px-4 text-center font-mono font-black text-sm text-emerald-400">
                      <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        {item.points}
                      </span>
                    </td>

                    {/* Recent Form (Last 5 matches) */}
                    {!compact && (
                      <td className="py-3 px-3 sm:px-4 text-center hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {(item.form || ['W', 'D', 'W', 'W', 'W']).map((f, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${
                                f === 'W'
                                  ? 'bg-emerald-500 text-slate-950'
                                  : f === 'D'
                                  ? 'bg-amber-500/80 text-slate-950'
                                  : 'bg-rose-500 text-white'
                              }`}
                              title={f === 'W' ? 'Victoria' : f === 'D' ? 'Empate' : 'Derrota'}
                            >
                              {f === 'W' ? 'V' : f === 'D' ? 'E' : 'D'}
                            </span>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Fase de Liga UEFA Champions League (1-4)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>UEFA Europa League (5-6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span>Conference League (7)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Zona de Descenso</span>
          </div>
        </div>

        <span className="text-slate-500 font-mono">
          {standings.length} clubes computados
        </span>
      </div>
    </div>
  );
}
