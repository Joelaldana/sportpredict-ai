'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  getDailyMatches, 
  getLeagueStandings,
  Match, 
  StandingTeam,
  PREMIER_MATCHES 
} from '@/lib/sports-api';
import MatchCard from '@/components/MatchCard';
import AdBanner from '@/components/AdBanner';
import LeagueStandingsTable from '@/components/LeagueStandingsTable';
import { 
  BrainCircuit, 
  Flame, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Filter,
  RefreshCw,
  Activity,
  CheckCircle2,
  Clock,
  ListOrdered,
  TableProperties
} from 'lucide-react';

interface HomePageProps {
  onNavigateMatch?: (matchId: string) => void;
  onNavigateAllPredictions?: () => void;
}

export default function HomePage({ onNavigateMatch, onNavigateAllPredictions }: HomePageProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'scheduled' | 'finished'>('all');
  const [viewMode, setViewMode] = useState<'matches' | 'standings'>('matches');
  const [standings, setStandings] = useState<StandingTeam[]>([]);
  const [standingsLoading, setStandingsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchMatches = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const url = `/api/sports?league=${selectedLeague}${isManualRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.matches && Array.isArray(json.matches) && json.matches.length > 0) {
          setMatches(json.matches);
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          return;
        }
      }
      const data = await getDailyMatches(selectedLeague, isManualRefresh);
      setMatches(data);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Error fetching matches:', err);
      const data = await getDailyMatches(selectedLeague);
      setMatches(data);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, [selectedLeague]);

  useEffect(() => {
    setLoading(true);
    fetchMatches(false);

    // Auto-refresh every 45 seconds to keep live scores and clock up to date
    const timer = setInterval(() => {
      fetchMatches(false);
    }, 45000);

    return () => clearInterval(timer);
  }, [fetchMatches]);

  const fetchStandings = useCallback(async (leagueId: string) => {
    setStandingsLoading(true);
    const target = (!leagueId || leagueId === 'all') ? 'laliga' : leagueId;
    try {
      const res = await fetch(`/api/sports?type=standings&league=${target}`);
      if (res.ok) {
        const json = await res.json();
        if (json.standings && Array.isArray(json.standings)) {
          setStandings(json.standings);
          return;
        }
      }
      const data = await getLeagueStandings(target);
      setStandings(data);
    } catch {
      const data = await getLeagueStandings(target);
      setStandings(data);
    } finally {
      setStandingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (viewMode === 'standings') {
      fetchStandings(selectedLeague);
    }
  }, [viewMode, selectedLeague, fetchStandings]);

  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const scheduledMatches = matches.filter((m) => m.status === 'SCHEDULED');
  const finishedMatches = matches.filter((m) => m.status === 'FINISHED');

  // Filtered matches based on status tab
  const filteredMatches = matches.filter((m) => {
    if (statusFilter === 'live') return m.status === 'LIVE';
    if (statusFilter === 'scheduled') return m.status === 'SCHEDULED';
    if (statusFilter === 'finished') return m.status === 'FINISHED';
    return true;
  });

  // Highlighted match: prioritize live match, else next scheduled match
  const featuredMatch = liveMatches[0] || scheduledMatches[0] || matches[0] || PREMIER_MATCHES[0];

  const leagues = [
    { id: 'all', name: 'Todas las Ligas', flag: '🌍' },
    { id: 'laliga', name: 'LaLiga EA Sports', flag: '🇪🇸' },
    { id: 'premier', name: 'Premier League', flag: '🇬🇧' },
    { id: 'seriea', name: 'Serie A', flag: '🇮🇹' },
    { id: 'bundesliga', name: 'Bundesliga', flag: '🇩🇪' },
    { id: 'ucl', name: 'Champions League', flag: '🇪🇺' },
    { id: 'ligue1', name: 'Ligue 1', flag: '🇫🇷' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero Banner: Pick del Día Asistido por IA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ALGORITMO ESTADÍSTICO EN TIEMPO REAL</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Feed Oficial ESPN Live</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Pronósticos Deportivos con <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Inteligencia Artificial</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Métricas cuantitativas imparciales, marcadores en directo, historial H2H, cálculo de xG y análisis predictivo en tiempo real con datos de las principales ligas del mundo.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`/partido/${featuredMatch.id}`}
                onClick={(e) => {
                  if (onNavigateMatch) {
                    e.preventDefault();
                    onNavigateMatch(featuredMatch.id);
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Analizar Pick: {featuredMatch.homeTeam.shortName} vs {featuredMatch.awayTeam.shortName}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/pronosticos"
                onClick={(e) => {
                  if (onNavigateAllPredictions) {
                    e.preventDefault();
                    onNavigateAllPredictions();
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 transition-colors"
              >
                <span>Ver Todos los Pronósticos</span>
              </a>
            </div>
          </div>

          {/* Quick Match Preview Highlight Card */}
          <div className="w-full lg:w-80 rounded-2xl bg-slate-800/70 border border-slate-700/80 p-4 space-y-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700 pb-2">
              <span className="font-semibold">{featuredMatch.league.name}</span>
              {featuredMatch.status === 'LIVE' ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  {featuredMatch.minute ? `${featuredMatch.minute}'` : 'EN VIVO'}
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">{featuredMatch.time}</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="text-center flex-1">
                <span className="block font-bold text-white text-sm truncate">{featuredMatch.homeTeam.name}</span>
                {featuredMatch.score ? (
                  <span className="text-xl font-black text-emerald-400">{featuredMatch.score.home}</span>
                ) : (
                  <span className="text-xs text-slate-400">Cuota: {featuredMatch.odds.home}</span>
                )}
              </div>
              <span className="text-xs font-black text-slate-500 px-2">
                {featuredMatch.status === 'LIVE' || featuredMatch.status === 'FINISHED' ? '-' : 'VS'}
              </span>
              <div className="text-center flex-1">
                <span className="block font-bold text-white text-sm truncate">{featuredMatch.awayTeam.name}</span>
                {featuredMatch.score ? (
                  <span className="text-xl font-black text-emerald-400">{featuredMatch.score.away}</span>
                ) : (
                  <span className="text-xs text-slate-400">Cuota: {featuredMatch.odds.away}</span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Recomendación IA</span>
              <span className="text-xs font-extrabold text-white">
                {featuredMatch.status === 'LIVE' ? 'Apuesta en Vivo Activa' : 'Ambos Anotan & Más de 2.5 Goles'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Strategic Placement: Header Leaderboard */}
      <AdBanner 
        slot="home-header-leaderboard" 
        format="horizontal" 
        label="Publicidad Patrocinada"
      />

      {/* Leagues Filter Bar + Live Status Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-500" />
            <h2 className="text-lg font-extrabold text-white">Ligas y Competiciones</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Actualizado: <strong className="text-slate-300 font-mono">{lastUpdated}</strong>
              </span>
            )}
            <button
              onClick={() => fetchMatches(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-60 cursor-pointer"
              title="Recargar datos en vivo ahora"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Actualizando...' : 'Recargar en Vivo'}</span>
            </button>
          </div>
        </div>

        {/* League Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* View Mode Switcher: Matches vs Standings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('matches')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'matches'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Partidos y Resultados ({matches.length})</span>
            </button>

            <button
              onClick={() => setViewMode('standings')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'standings'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Tabla de Clasificación</span>
            </button>
          </div>

          {viewMode === 'matches' ? (
            /* Status Filter Tabs (Todos, En Vivo, Próximos, Finalizados) */
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({matches.length})
              </button>

              <button
                onClick={() => setStatusFilter('live')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'live'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                En Vivo ({liveMatches.length})
              </button>

              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'scheduled'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Próximos ({scheduledMatches.length})
              </button>

              <button
                onClick={() => setStatusFilter('finished')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'finished'
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Finalizados ({finishedMatches.length})
              </button>
            </div>
          ) : (
            <a
              href="/tablas"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1"
            >
              <span>Ver comparador de todas las ligas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </section>

      {/* Main Display: Matches Grid OR League Standings Table */}
      {viewMode === 'standings' ? (
        <section className="space-y-4">
          <LeagueStandingsTable
            leagueId={selectedLeague === 'all' ? 'laliga' : selectedLeague}
            standings={standings}
            loading={standingsLoading}
          />
        </section>
      ) : (
        <section className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-300">Conectando con feeds deportivos en tiempo real...</p>
              <p className="text-xs text-slate-500">Recuperando marcadores, cuotas e incidencias de ESPN</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center space-y-3">
              <Activity className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-base font-bold text-white">No hay partidos en esta categoría</p>
              <p className="text-xs text-slate-400">Intenta seleccionar otra liga o cambiar el filtro de estado arriba.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  featured={match.status === 'LIVE'}
                  onSelect={(id) => onNavigateMatch && onNavigateMatch(id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* AdSense Strategic Placement: Mid-page In-Feed Banner */}
      <AdBanner 
        slot="home-middle-responsive" 
        format="auto" 
        label="Espacio Comercial Patrocinado" 
      />

      {/* Information & Value Proposition Section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Modelos de IA Cuantitativos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algoritmos calibrados para procesar métricas objetivas: rachas de 5 encuentros, promedios de gol a favor y en contra, xG y reporte de bajas actualizado.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Arquitectura 100% Stateless</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cero bases de datos que rastreen o almacenen tu navegación. Rendimiento de servidor ultraligero con cumplimiento estricto del RGPD europeo.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Juego Responsable & Transparencia</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Las probabilidades estadísticas no son garantías infalibles. Fomentamos el análisis fundamentado, la gestión de banca y el juego seguro sólo para mayores de 18 años.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
