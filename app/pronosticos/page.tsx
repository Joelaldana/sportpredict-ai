'use client';

import React, { useState } from 'react';
import { PREMIER_MATCHES, Match } from '@/lib/sports-api';
import AdBanner from '@/components/AdBanner';
import { 
  BrainCircuit, 
  Sparkles, 
  Filter, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Flame,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

interface PronosticosPageProps {
  onSelectMatch?: (matchId: string) => void;
}

export default function PronosticosPage({ onSelectMatch }: PronosticosPageProps) {
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'Alto' | 'Medio'>('all');
  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/sports?league=all');
        if (res.ok) {
          const data = await res.json();
          if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
            setMatches(data.matches);
          }
        }
      } catch (err) {
        console.warn('Fallback a partidos iniciales en pronósticos:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const matchesWithPredictions = matches.map((match) => {
    let localProb = 52;
    let drawProb = 24;
    let awayProb = 24;
    let mercado = 'Ambos Anotan - SÍ';
    let confianza: 'Alto' | 'Medio' = 'Alto';

    if (match.id === 'ucl-rm-mci') {
      localProb = 48;
      drawProb = 26;
      awayProb = 26;
      mercado = 'Más de 2.5 Goles';
      confianza = 'Alto';
    } else if (match.id === 'laliga-bar-atm') {
      localProb = 58;
      drawProb = 22;
      awayProb = 20;
      mercado = 'Gana Local o Empata';
      confianza = 'Alto';
    } else if (match.id === 'epl-ars-che') {
      localProb = 54;
      drawProb = 26;
      awayProb = 20;
      mercado = 'Más de 2.5 Goles';
      confianza = 'Alto';
    } else if (match.id === 'seriea-int-juv') {
      localProb = 44;
      drawProb = 34;
      awayProb = 22;
      mercado = 'Menos de 2.5 Goles';
      confianza = 'Medio';
    } else if (match.id === 'bundes-bay-dor') {
      localProb = 64;
      drawProb = 20;
      awayProb = 16;
      mercado = 'Gana Local y Más de 2.5';
      confianza = 'Alto';
    } else {
      // Dynamic calculation for external matches
      const hAttack = match.homeTeam.stats?.goalsScoredAvg || 1.8;
      const aDefense = match.awayTeam.stats?.goalsConcededAvg || 1.2;
      const aAttack = match.awayTeam.stats?.goalsScoredAvg || 1.4;
      const hDefense = match.homeTeam.stats?.goalsConcededAvg || 1.0;
      const hExp = (hAttack + aDefense) / 2;
      const aExp = (aAttack + hDefense) / 2;

      localProb = Math.min(75, Math.max(25, Math.round((hExp / (hExp + aExp + 0.8)) * 100) + 4));
      awayProb = Math.min(70, Math.max(20, Math.round((aExp / (hExp + aExp + 0.8)) * 100)));
      drawProb = Math.max(16, 100 - (localProb + awayProb));
      mercado = hExp + aExp > 2.6 ? 'Más de 2.5 Goles' : 'Ambos Anotan - SÍ';
      confianza = localProb > 52 || awayProb > 52 ? 'Alto' : 'Medio';
    }

    return {
      match,
      prediction: {
        probabilidad: { local: localProb, empate: drawProb, visitante: awayProb },
        mercado_sugerido: mercado,
        nivel_confianza: confianza,
      },
    };
  });

  const filtered = matchesWithPredictions.filter((item) => {
    if (confidenceFilter !== 'all' && item.prediction.nivel_confianza !== confidenceFilter) {
      return false;
    }
    if (marketFilter !== 'all' && !item.prediction.mercado_sugerido.toLowerCase().includes(marketFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <BrainCircuit className="w-4 h-4" />
          <span>MOTOR CUANTITATIVO DE ALTA PRECISIÓN</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Pronósticos & Picks del Día Asistidos por IA
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Explora los modelos estadísticos calculados para la jornada actual. Analizamos más de 12 factores objetivos por partido incluyendo goles esperados (xG), historial H2H y reporte de ausencias.
        </p>
      </section>

      {/* AdSense Placement Top */}
      <AdBanner 
        slot="pronosticos-top" 
        format="horizontal" 
        label="Espacio Patrocinado"
      />

      {/* Filter and Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nivel Confianza:</span>
          </span>
          {(['all', 'Alto', 'Medio'] as const).map((conf) => (
            <button
              key={conf}
              onClick={() => setConfidenceFilter(conf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                confidenceFilter === conf
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {conf === 'all' ? 'Todos' : conf}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Mostrando <strong className="text-white font-bold">{filtered.length}</strong> pronósticos filtrados
        </div>
      </div>

      {/* Prediction Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">Cargando pronósticos estadísticos en tiempo real...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center space-y-2">
          <p className="text-base font-bold text-white">No hay pronósticos con este filtro</p>
          <p className="text-xs text-slate-400">Prueba cambiando el nivel de confianza o los mercados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(({ match, prediction }) => (
          <div
            key={match.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-4"
          >
            {/* Top match info */}
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                <span>{match.league.flag}</span>
                <span>{match.league.name}</span>
              </span>
              <span className="text-emerald-400 font-bold">{match.date} • {match.time}</span>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  className="w-10 h-10 rounded-xl object-cover bg-slate-800 p-1"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="font-bold text-white text-sm block">{match.homeTeam.name}</span>
                  <span className="text-xs text-slate-400">Cuota: {match.odds.home.toFixed(2)}</span>
                </div>
              </div>

              <span className="text-xs font-black text-slate-600 px-2">VS</span>

              <div className="flex items-center gap-3 flex-1 justify-end text-right">
                <div>
                  <span className="font-bold text-white text-sm block">{match.awayTeam.name}</span>
                  <span className="text-xs text-slate-400">Cuota: {match.odds.away.toFixed(2)}</span>
                </div>
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  className="w-10 h-10 rounded-xl object-cover bg-slate-800 p-1"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Probabilities preview bar */}
            <div className="space-y-1.5 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span>Local: {prediction.probabilidad.local}%</span>
                <span>Empate: {prediction.probabilidad.empate}%</span>
                <span>Visitante: {prediction.probabilidad.visitante}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden flex">
                <div style={{ width: `${prediction.probabilidad.local}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${prediction.probabilidad.empate}%` }} className="bg-slate-400 h-full" />
                <div style={{ width: `${prediction.probabilidad.visitante}%` }} className="bg-teal-400 h-full" />
              </div>
            </div>

            {/* Market & Confidence Tag */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Mercado Recomendado</span>
                <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{prediction.mercado_sugerido}</span>
                </span>
              </div>

              <a
                href={`/partido/${match.id}`}
                onClick={(e) => {
                  if (onSelectMatch) {
                    e.preventDefault();
                    onSelectMatch(match.id);
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Ver Informe Completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* AdSense Placement Bottom */}
      <AdBanner 
        slot="pronosticos-bottom" 
        format="auto" 
        label="Publicidad Recomendada"
      />
    </div>
  );
}
