'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getLeagueStandings, StandingTeam, ESPN_LEAGUES } from '@/lib/sports-api';
import LeagueStandingsTable from '@/components/LeagueStandingsTable';
import AdBanner from '@/components/AdBanner';
import { 
  Trophy, 
  RefreshCw, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface TablasPageProps {
  onSelectMatch?: (matchId: string) => void;
  onNavigateHome?: () => void;
}

const LEAGUES = [
  { id: 'all', name: 'Todas las Ligas', flag: '🌍' },
  { id: 'laliga', name: 'LaLiga EA Sports', flag: '🇪🇸', country: 'España' },
  { id: 'premier', name: 'Premier League', flag: '🇬🇧', country: 'Inglaterra' },
  { id: 'seriea', name: 'Serie A', flag: '🇮🇹', country: 'Italia' },
  { id: 'bundesliga', name: 'Bundesliga', flag: '🇩🇪', country: 'Alemania' },
  { id: 'ligue1', name: 'Ligue 1', flag: '🇫🇷', country: 'Francia' },
  { id: 'ucl', name: 'Champions League', flag: '🇪🇺', country: 'Europa' },
];

export default function TablasPage({ onSelectMatch, onNavigateHome }: TablasPageProps) {
  const [selectedLeague, setSelectedLeague] = useState<string>('laliga');
  const [standingsMap, setStandingsMap] = useState<Record<string, StandingTeam[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchStandingsForLeague = useCallback(async (leagueId: string, isRefresh = false) => {
    try {
      const url = `/api/sports?type=standings&league=${leagueId}${isRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.standings && Array.isArray(data.standings)) {
          return data.standings as StandingTeam[];
        }
      }
      return await getLeagueStandings(leagueId);
    } catch {
      return await getLeagueStandings(leagueId);
    }
  }, []);

  const loadAllStandings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const leagueKeys = ['laliga', 'premier', 'seriea', 'bundesliga', 'ligue1', 'ucl'];
      const results = await Promise.all(
        leagueKeys.map(async (key) => {
          const data = await fetchStandingsForLeague(key, isRefresh);
          return { key, data };
        })
      );

      const map: Record<string, StandingTeam[]> = {};
      for (const r of results) {
        map[r.key] = r.data;
      }
      setStandingsMap(map);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Error loading league tables:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchStandingsForLeague]);

  useEffect(() => {
    loadAllStandings(false);
  }, [loadAllStandings]);

  const currentStandings = standingsMap[selectedLeague] || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/70 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>TABLAS DE CLASIFICACIÓN OFICIALES</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Datos ESPN Actualizados en Directo</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tablas de Clasificación de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Fútbol Mundial</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consulta las posiciones oficiales, puntos acumulados, diferencia de gol, rachas de forma y zonas de clasificación europea y descenso para todas las ligas de élite.
            </p>
          </div>

          {/* Quick Refresh & Last Updated Widget */}
          <div className="flex flex-col items-start sm:items-end gap-2.5">
            {lastUpdated && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Actualizado: <strong className="text-slate-200 font-mono">{lastUpdated}</strong>
              </span>
            )}
            <button
              onClick={() => loadAllStandings(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Actualizando tablas...' : 'Recargar Tablas'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Strategic AdSense Leaderboard Placement */}
      <AdBanner
        slot="tablas-top-leaderboard"
        format="horizontal"
        label="Publicidad Patrocinada"
      />

      {/* League Selection Filter Bar */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Selecciona Competición
          </h2>
          <span className="text-xs text-slate-400">
            6 competiciones monitorizadas
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedLeague === league.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{league.flag}</span>
              <span>{league.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      {selectedLeague === 'all' ? (
        /* Multi-League Bento Overview Grid */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Resumen General de Todas las Ligas</span>
              <span className="text-xs font-normal text-slate-400">(Top 6 & Zona de Descenso)</span>
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">
              Haz clic en cualquier tabla para ampliarla
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {LEAGUES.filter((l) => l.id !== 'all').map((league) => {
              const teams = standingsMap[league.id] || [];
              const topTeams = teams.slice(0, 6);
              const bottomTeams = teams.length >= 12 ? teams.slice(-2) : [];

              return (
                <div
                  key={league.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                        {league.flag}
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">{league.name}</h4>
                        <span className="text-[11px] text-slate-400">{league.country}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedLeague(league.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <span>Ver Tabla Completa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Preview Table */}
                  <div className="p-3">
                    {loading ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Cargando posiciones...
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                            <th className="py-1.5 px-2 text-center w-8">#</th>
                            <th className="py-1.5 px-2">Club</th>
                            <th className="py-1.5 px-2 text-center">PJ</th>
                            <th className="py-1.5 px-2 text-center">DG</th>
                            <th className="py-1.5 px-2 text-center font-black text-emerald-400">PTS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {topTeams.map((t) => (
                            <tr
                              key={t.team}
                              onClick={() => setSelectedLeague(league.id)}
                              className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                            >
                              <td className="py-2 px-2 text-center">
                                <span
                                  className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${
                                    t.rank <= 4
                                      ? 'bg-blue-500/20 text-blue-400'
                                      : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {t.rank}
                                </span>
                              </td>
                              <td className="py-2 px-2 font-semibold text-white">
                                <div className="flex items-center gap-2">
                                  {t.logo && (
                                    <img
                                      src={t.logo}
                                      alt={t.team}
                                      className="w-4 h-4 object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <span className="truncate">{t.team}</span>
                                </div>
                              </td>
                              <td className="py-2 px-2 text-center text-slate-400 font-mono">{t.played}</td>
                              <td className="py-2 px-2 text-center font-mono text-[11px]">
                                <span className={t.goalDiff > 0 ? 'text-emerald-400' : 'text-slate-400'}>
                                  {t.goalDiff > 0 ? `+${t.goalDiff}` : t.goalDiff}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-center font-mono font-black text-emerald-400">
                                {t.points}
                              </td>
                            </tr>
                          ))}

                          {/* Relegation preview divider */}
                          {bottomTeams.length > 0 && (
                            <>
                              <tr className="bg-slate-950/60">
                                <td colSpan={5} className="py-1 px-2 text-[10px] text-center text-rose-400 font-bold uppercase tracking-wider">
                                  Zona de Riesgo / Descenso
                                </td>
                              </tr>
                              {bottomTeams.map((t) => (
                                <tr
                                  key={t.team}
                                  onClick={() => setSelectedLeague(league.id)}
                                  className="hover:bg-slate-800/40 transition-colors cursor-pointer text-slate-400"
                                >
                                  <td className="py-1.5 px-2 text-center">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">
                                      {t.rank}
                                    </span>
                                  </td>
                                  <td className="py-1.5 px-2 font-medium truncate">{t.team}</td>
                                  <td className="py-1.5 px-2 text-center font-mono">{t.played}</td>
                                  <td className="py-1.5 px-2 text-center font-mono text-rose-400">{t.goalDiff}</td>
                                  <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-300">{t.points}</td>
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total clubes: {teams.length || 20}</span>
                    <button
                      onClick={() => setSelectedLeague(league.id)}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Abrir Tabla</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed View of the Selected League */
        <div className="space-y-6">
          <LeagueStandingsTable
            leagueId={selectedLeague}
            standings={currentStandings}
            loading={loading}
          />

          {/* Quick Action links */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div>
              <h4 className="font-bold text-white text-sm">¿Deseas ver pronósticos de esta liga?</h4>
              <p className="text-xs text-slate-400">
                Nuestros modelos cuantitativos de IA analizan cada partido de la jornada con xG y probabilidades.
              </p>
            </div>
            <a
              href="/pronosticos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-colors shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Pronósticos IA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Mid-page Responsive AdSense Placement */}
      <AdBanner
        slot="tablas-middle-responsive"
        format="auto"
        label="Espacio Publicitario Patrocinado"
      />
    </div>
  );
}
