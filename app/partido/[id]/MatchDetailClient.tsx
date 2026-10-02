'use client';

import React, { useState } from 'react';
import { 
  Match, 
  HeadToHeadData, 
  Lineup 
} from '@/lib/sports-api';
import type { AIPredictionResult } from '@/lib/ai-types';
import AdBanner from '@/components/AdBanner';
import { 
  BrainCircuit, 
  Clock, 
  MapPin, 
  UserCheck, 
  TrendingUp, 
  ShieldAlert, 
  BarChart3, 
  Users, 
  Sparkles, 
  RefreshCw, 
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Activity,
  Radio,
  Trophy
} from 'lucide-react';

interface MatchDetailClientProps {
  match: Match;
  h2h: HeadToHeadData;
  lineups: { home: Lineup; away: Lineup };
  initialPrediction: AIPredictionResult;
  onBack?: () => void;
}

export default function MatchDetailClient({
  match,
  h2h,
  lineups,
  initialPrediction,
  onBack,
}: MatchDetailClientProps) {
  const isLive = match.status === 'LIVE';
  const hasLiveEvents = (match.events && match.events.length > 0) || match.liveStats;
  const [activeTab, setActiveTab] = useState<'ia' | 'live' | 'lineups' | 'h2h'>(
    isLive ? 'live' : 'ia'
  );
  const [prediction, setPrediction] = useState<AIPredictionResult>(initialPrediction);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAI = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/ai-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.id }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.prediction) {
          setPrediction(data.prediction);
        }
      }
    } catch (err) {
      console.error('Error actualizando predicción IA:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            if (onBack) {
              e.preventDefault();
              onBack();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver a Partidos</span>
        </a>

        <span className="text-[11px] font-semibold text-slate-500">
          ID Evento: <code className="font-mono text-slate-400">{match.id}</code>
        </span>
      </div>

      {/* Main Match Header Card */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-base">{match.league.flag}</span>
            <span className="font-bold text-slate-200">{match.league.name}</span>
            <span>• Temporada {match.league.season}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{match.stadium}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Árbitro: {match.referee}</span>
            </div>
          </div>
        </div>

        {/* Face-off Scoreboard */}
        <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-6 py-2">
          {/* Home Team */}
          <div className="md:col-span-3 flex items-center md:flex-row-reverse gap-4 text-left md:text-right">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 p-2 shadow-inner flex items-center justify-center flex-shrink-0">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Equipo Local</span>
              <h1 className="text-xl sm:text-2xl font-black text-white">{match.homeTeam.name}</h1>
              <div className="flex items-center md:justify-end gap-1 mt-2">
                <span className="text-[10px] text-slate-500 mr-1">Racha:</span>
                {match.homeTeam.form.map((res, i) => (
                  <span
                    key={i}
                    className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center text-white ${
                      res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  >
                    {res}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Center VS / Score & Time */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center py-2">
            {match.score ? (
              <div className="space-y-1.5">
                <div
                  className={`flex items-center justify-center gap-2 font-black text-3xl sm:text-4xl px-4 py-1.5 rounded-2xl border ${
                    isLive
                      ? 'text-rose-400 bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/30'
                      : 'text-white bg-slate-800/90 border-slate-700'
                  }`}
                >
                  <span>{match.score.home}</span>
                  <span className="text-slate-500 text-2xl">-</span>
                  <span>{match.score.away}</span>
                </div>
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-rose-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>EN VIVO {match.displayClock || `${match.minute || 0}'`}</span>
                  </span>
                ) : match.status === 'FINISHED' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    FINALIZADO
                  </span>
                ) : null}
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 px-3 py-1 rounded-lg bg-slate-800">
                  VS
                </span>
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{match.date}, {match.time}</span>
                </div>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="md:col-span-3 flex items-center gap-4 text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 p-2 shadow-inner flex items-center justify-center flex-shrink-0">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Equipo Visitante</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{match.awayTeam.name}</h2>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[10px] text-slate-500 mr-1">Racha:</span>
                {match.awayTeam.form.map((res, i) => (
                  <span
                    key={i}
                    className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center text-white ${
                      res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  >
                    {res}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Market Odds Row */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">1 (Victoria Local)</span>
            <span className="text-base font-black text-white">{match.odds.home.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">X (Empate)</span>
            <span className="text-base font-black text-white">{match.odds.draw.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">2 (Victoria Visitante)</span>
            <span className="text-base font-black text-white">{match.odds.away.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Más de 2.5 Goles</span>
            <span className="text-base font-black text-emerald-400">{match.odds.over25.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* AdSense Strategic Placement: Top in-article banner */}
      <AdBanner 
        slot="match-top-article" 
        format="horizontal" 
        label="Espacio Patrocinado"
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('ia')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ia'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Informe Analista IA</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-slate-950/20">
            {prediction.nivel_confianza}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'live'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-400" />
          <span>En Vivo & Minuto a Minuto</span>
          {isLive && (
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('lineups')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'lineups'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quién Juega & Plantillas</span>
        </button>

        <button
          onClick={() => setActiveTab('h2h')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'h2h'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Historial H2H</span>
        </button>
      </div>

      {/* Tab 1: AI Prediction Report */}
      {activeTab === 'ia' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-xl font-black text-white">Veredicto Estadístico de la IA</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Modelo: {prediction.modelo_utilizado || 'Gemini 3.8 Flash'} • Análisis fundamentado en métricas objetivas y racha
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-2 text-slate-300">
                  <span>Confianza:</span>
                  <span
                    className={`font-black ${
                      prediction.nivel_confianza === 'Alto'
                        ? 'text-emerald-400'
                        : prediction.nivel_confianza === 'Medio'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {prediction.nivel_confianza}
                  </span>
                </div>

                <button
                  onClick={handleRefreshAI}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Calculando...' : 'Reanalizar'}</span>
                </button>
              </div>
            </div>

            {/* Calculated Probabilities Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-400">Gana {match.homeTeam.name}: {prediction.probabilidad.local}%</span>
                <span className="text-slate-300">Empate: {prediction.probabilidad.empate}%</span>
                <span className="text-teal-400">Gana {match.awayTeam.name}: {prediction.probabilidad.visitante}%</span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${prediction.probabilidad.local}%` }}
                  className="bg-emerald-500 h-full transition-all duration-500"
                  title={`Local: ${prediction.probabilidad.local}%`}
                />
                <div
                  style={{ width: `${prediction.probabilidad.empate}%` }}
                  className="bg-slate-500 h-full transition-all duration-500"
                  title={`Empate: ${prediction.probabilidad.empate}%`}
                />
                <div
                  style={{ width: `${prediction.probabilidad.visitante}%` }}
                  className="bg-teal-400 h-full transition-all duration-500"
                  title={`Visitante: ${prediction.probabilidad.visitante}%`}
                />
              </div>
            </div>

            {/* Recommended Market Callout */}
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">
                  Mercado Sugerido con Mayor Valor
                </span>
                <p className="text-xl font-black text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>{prediction.mercado_sugerido}</span>
                </p>
              </div>

              <div className="text-xs text-slate-300 sm:text-right max-w-xs">
                Basado en el índice de goles esperados y balance defensivo de ambos conjuntos.
              </div>
            </div>

            {/* Tactical 2-paragraph analysis */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-black uppercase text-slate-300 tracking-wider">
                Análisis Táctico & Contexto del Enfrentamiento
              </h4>
              <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-normal">
                {prediction.analisis_tactico}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Head to Head Stats */}
      {activeTab === 'h2h' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Historial Histórico de Enfrentamientos Directos</span>
            </h3>

            {/* H2H Metrics summary grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-xs text-slate-400 block font-semibold">Total Partidos H2H</span>
                <span className="text-2xl font-black text-white">{h2h.totalMatches}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-xs text-slate-400 block font-semibold">Victorias {match.homeTeam.shortName}</span>
                <span className="text-2xl font-black text-emerald-400">{h2h.homeWins}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-xs text-slate-400 block font-semibold">Empates</span>
                <span className="text-2xl font-black text-slate-300">{h2h.draws}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <span className="text-xs text-slate-400 block font-semibold">Victorias {match.awayTeam.shortName}</span>
                <span className="text-2xl font-black text-teal-400">{h2h.awayWins}</span>
              </div>
            </div>

            {/* Secondary stat pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Promedio de Goles por Partido H2H</span>
                <span className="text-base font-black text-white">{h2h.avgGoals} goles</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Ambos Marcan Histórico</span>
                <span className="text-base font-black text-emerald-400">{h2h.bothScoredPercentage}%</span>
              </div>
            </div>

            {/* Recent Match List */}
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Últimos 5 Duelos Directos
              </h4>
              <div className="space-y-2">
                {h2h.recentMatches.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-xs">{item.date}</span>
                      <span className="hidden sm:inline text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {item.competition}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-bold">
                      <span className="text-slate-200">{item.homeTeamName}</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 font-black text-white border border-slate-700">
                        {item.homeScore} - {item.awayScore}
                      </span>
                      <span className="text-slate-200">{item.awayTeamName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: En Vivo & Minuto a Minuto */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/30 p-6 sm:p-8 space-y-6">
            {/* Header / Feed indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isLive ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <span>Incidencias en Tiempo Real</span>
                    {isLive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white uppercase animate-pulse">
                        Live Feed
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {match.sourceProvider === 'espn'
                      ? '⚡ Conectado a la API oficial de ESPN en Vivo con actualización de incidencias y alineaciones'
                      : '⚡ Conectado al Feed Central de Estadísticas Deportivas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2">
                  <span>Reloj:</span>
                  <span className="font-mono text-emerald-400 font-black">
                    {match.displayClock || (match.minute ? `${match.minute}'` : match.status === 'FINISHED' ? 'Finalizado' : 'Previo')}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Stats Comparative Section */}
            {match.liveStats && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Estadísticas del Encuentro en Vivo</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Possession */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{match.liveStats.possession.home}%</span>
                      <span className="text-slate-400 uppercase text-[10px]">Posesión</span>
                      <span className="text-slate-300">{match.liveStats.possession.away}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden flex">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${match.liveStats.possession.home}%` }} />
                      <div className="bg-rose-500 h-full transition-all" style={{ width: `${match.liveStats.possession.away}%` }} />
                    </div>
                  </div>

                  {/* Shots on Target */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-400">{match.liveStats.shotsOnTarget.home}</span>
                      <span className="text-slate-400 uppercase text-[10px]">Tiros a Puerta</span>
                      <span className="text-rose-400">{match.liveStats.shotsOnTarget.away}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{
                          width: `${
                            (match.liveStats.shotsOnTarget.home /
                              Math.max(1, match.liveStats.shotsOnTarget.home + match.liveStats.shotsOnTarget.away)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="bg-rose-500 h-full transition-all"
                        style={{
                          width: `${
                            (match.liveStats.shotsOnTarget.away /
                              Math.max(1, match.liveStats.shotsOnTarget.home + match.liveStats.shotsOnTarget.away)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Corners */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{match.liveStats.corners.home}</span>
                      <span className="text-slate-400 uppercase text-[10px]">Tiros de Esquina</span>
                      <span className="text-slate-300">{match.liveStats.corners.away}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{
                          width: `${
                            (match.liveStats.corners.home /
                              Math.max(1, match.liveStats.corners.home + match.liveStats.corners.away)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="bg-rose-500 h-full transition-all"
                        style={{
                          width: `${
                            (match.liveStats.corners.away /
                              Math.max(1, match.liveStats.corners.home + match.liveStats.corners.away)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Total Shots */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{match.liveStats.totalShots.home}</span>
                      <span className="text-slate-400 uppercase text-[10px]">Tiros Totales</span>
                      <span className="text-slate-300">{match.liveStats.totalShots.away}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{
                          width: `${
                            (match.liveStats.totalShots.home / Math.max(1, match.liveStats.totalShots.home + match.liveStats.totalShots.away)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="bg-rose-500 h-full transition-all"
                        style={{
                          width: `${
                            (match.liveStats.totalShots.away / Math.max(1, match.liveStats.totalShots.home + match.liveStats.totalShots.away)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Fouls */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">{match.liveStats.fouls.home}</span>
                      <span className="text-slate-400 uppercase text-[10px]">Faltas Cometidas</span>
                      <span className="text-slate-300">{match.liveStats.fouls.away}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{
                          width: `${
                            (match.liveStats.fouls.home / Math.max(1, match.liveStats.fouls.home + match.liveStats.fouls.away)) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="bg-rose-500 h-full transition-all"
                        style={{
                          width: `${
                            (match.liveStats.fouls.away / Math.max(1, match.liveStats.fouls.home + match.liveStats.fouls.away)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Events Timeline */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Línea de Tiempo del Partido (Goles, Tarjetas y Sustituciones)</span>
              </h4>

              {match.events && match.events.length > 0 ? (
                <div className="space-y-2.5">
                  {match.events.map((event, idx) => (
                    <div
                      key={event.id || idx}
                      className={`flex items-start gap-3 p-3 rounded-2xl border text-xs sm:text-sm ${
                        event.type === 'GOAL' || event.type === 'PENALTY'
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : event.type === 'RED_CARD'
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                          : event.type === 'YELLOW_CARD'
                          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-900/90 font-mono font-black text-xs flex items-center justify-center flex-shrink-0 border border-slate-700">
                        {event.minute}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {event.type === 'GOAL' || event.type === 'PENALTY'
                              ? '⚽'
                              : event.type === 'RED_CARD'
                              ? '🟥'
                              : event.type === 'YELLOW_CARD'
                              ? '🟨'
                              : event.type === 'SUBSTITUTION'
                              ? '🔄'
                              : '📺'}
                          </span>
                          <span className="font-bold text-white uppercase text-xs">
                            {event.type === 'GOAL'
                              ? '¡GOL!'
                              : event.type === 'PENALTY'
                              ? 'PENALTI'
                              : event.type === 'RED_CARD'
                              ? 'TARJETA ROJA'
                              : event.type === 'YELLOW_CARD'
                              ? 'TARJETA AMARILLA'
                              : event.type === 'SUBSTITUTION'
                              ? 'SUSTITUCIÓN'
                              : 'REVISIÓN VAR'}
                          </span>
                          {event.player && (
                            <span className="font-bold text-slate-200 text-xs">
                              • {event.player}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300">{event.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-800 text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-300">
                    No hay incidencias críticas reportadas todavía.
                  </p>
                  <p className="text-xs text-slate-500">
                    Los goles, tarjetas y cambios aparecerán automáticamente en esta línea de tiempo a medida que ocurran en el terreno de juego.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Lineups and Absences (Quién Juega) */}
      {activeTab === 'lineups' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span>Quién Juega: Titulares, Jugadores en Cancha & Suplentes</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Estado táctico en tiempo real: los jugadores activos están marcados con indicador verde en cancha.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  En Cancha Ahora
                </span>
              </div>
            </div>

            {/* Medical / Absences section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Bajas {match.homeTeam.name}
                </span>
                {match.homeTeam.injuries.length > 0 ? (
                  <ul className="space-y-1 text-xs text-slate-300">
                    {match.homeTeam.injuries.map((inj, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{inj}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">Sin bajas reportadas en el informe oficial.</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Bajas {match.awayTeam.name}
                </span>
                {match.awayTeam.injuries.length > 0 ? (
                  <ul className="space-y-1 text-xs text-slate-300">
                    {match.awayTeam.injuries.map((inj, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{inj}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">Sin bajas reportadas en el informe oficial.</p>
                )}
              </div>
            </div>

            {/* Teams Rosters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Home Team */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{match.homeTeam.name}</h4>
                    <span className="text-[11px] font-mono text-emerald-400">Formación: {lineups.home.formation}</span>
                  </div>
                  <span className="text-xs text-slate-400">DT: {lineups.home.coach}</span>
                </div>

                {/* Starters */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Once Titular (Titulares)
                  </span>
                  <div className="space-y-1.5">
                    {lineups.home.startingXI.map((p) => (
                      <div
                        key={p.number}
                        className={`flex items-center justify-between text-xs p-2.5 rounded-xl border transition-all ${
                          p.isOnPitch !== false
                            ? 'bg-slate-800/60 border-slate-700/60'
                            : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded bg-slate-700 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                            {p.number}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200">{p.name}</span>
                            {p.goals && p.goals > 0 ? (
                              <span className="text-[11px]" title={`${p.goals} goles`}>
                                ⚽ {p.goals > 1 ? `x${p.goals}` : ''}
                              </span>
                            ) : null}
                            {p.yellowCard ? (
                              <span className="text-[11px]" title="Tarjeta Amarilla">
                                🟨
                              </span>
                            ) : null}
                            {p.redCard ? (
                              <span className="text-[11px]" title="Tarjeta Roja">
                                🟥
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {p.isOnPitch !== false ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              En Cancha
                            </span>
                          ) : (
                            <span className="text-[10px] text-rose-400">
                              Salió {p.subbedOutMinute ? `min ${p.subbedOutMinute}` : ''}
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-bold text-slate-400 w-8 text-right">
                            {p.position}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                {lineups.home.substitutes && lineups.home.substitutes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Banquillo de Suplentes
                    </span>
                    <div className="space-y-1.5">
                      {lineups.home.substitutes.map((p) => (
                        <div
                          key={p.number}
                          className={`flex items-center justify-between text-xs p-2 rounded-lg border ${
                            p.isOnPitch === true
                              ? 'bg-emerald-950/20 border-emerald-500/30'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center text-[10px]">
                              {p.number}
                            </span>
                            <span className="font-medium text-slate-300">{p.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.isOnPitch === true ? (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                Entró {p.subbedInMinute ? `min ${p.subbedInMinute}` : ''}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">Banquillo</span>
                            )}
                            <span className="text-[10px] uppercase font-bold text-slate-500 w-8 text-right">
                              {p.position}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{match.awayTeam.name}</h4>
                    <span className="text-[11px] font-mono text-emerald-400">Formación: {lineups.away.formation}</span>
                  </div>
                  <span className="text-xs text-slate-400">DT: {lineups.away.coach}</span>
                </div>

                {/* Starters */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Once Titular (Titulares)
                  </span>
                  <div className="space-y-1.5">
                    {lineups.away.startingXI.map((p) => (
                      <div
                        key={p.number}
                        className={`flex items-center justify-between text-xs p-2.5 rounded-xl border transition-all ${
                          p.isOnPitch !== false
                            ? 'bg-slate-800/60 border-slate-700/60'
                            : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded bg-slate-700 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                            {p.number}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200">{p.name}</span>
                            {p.goals && p.goals > 0 ? (
                              <span className="text-[11px]" title={`${p.goals} goles`}>
                                ⚽ {p.goals > 1 ? `x${p.goals}` : ''}
                              </span>
                            ) : null}
                            {p.yellowCard ? (
                              <span className="text-[11px]" title="Tarjeta Amarilla">
                                🟨
                              </span>
                            ) : null}
                            {p.redCard ? (
                              <span className="text-[11px]" title="Tarjeta Roja">
                                🟥
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {p.isOnPitch !== false ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              En Cancha
                            </span>
                          ) : (
                            <span className="text-[10px] text-rose-400">
                              Salió {p.subbedOutMinute ? `min ${p.subbedOutMinute}` : ''}
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-bold text-slate-400 w-8 text-right">
                            {p.position}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                {lineups.away.substitutes && lineups.away.substitutes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Banquillo de Suplentes
                    </span>
                    <div className="space-y-1.5">
                      {lineups.away.substitutes.map((p) => (
                        <div
                          key={p.number}
                          className={`flex items-center justify-between text-xs p-2 rounded-lg border ${
                            p.isOnPitch === true
                              ? 'bg-emerald-950/20 border-emerald-500/30'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center text-[10px]">
                              {p.number}
                            </span>
                            <span className="font-medium text-slate-300">{p.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.isOnPitch === true ? (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                Entró {p.subbedInMinute ? `min ${p.subbedInMinute}` : ''}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">Banquillo</span>
                            )}
                            <span className="text-[10px] uppercase font-bold text-slate-500 w-8 text-right">
                              {p.position}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AdSense Strategic Placement: Bottom Responsive */}
      <AdBanner 
        slot="match-bottom-responsive" 
        format="auto" 
        label="Publicidad Recomendada"
      />

      {/* Legal & Gambling Disclaimer on Match Conversion Page */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Aviso de Probabilidades:</strong> Los porcentajes y análisis mostrados son estimaciones cuantitativas generadas por modelos de aprendizaje automático sobre datos históricos. No aseguran ganancias y no nos responsabilizamos por decisiones financieras de los usuarios. Juega de forma responsable (+18).
        </p>
      </div>
    </div>
  );
}
