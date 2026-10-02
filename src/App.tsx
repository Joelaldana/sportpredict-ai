import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/app/page';
import MatchDetailClient from '@/app/partido/[id]/MatchDetailClient';
import PronosticosPage from '@/app/pronosticos/page';
import PrivacidadPage from '@/app/privacidad/page';
import TerminosPage from '@/app/terminos/page';
import TablasPage from '@/app/tablas/page';
import { PREMIER_MATCHES, getMatchById, getHeadToHead, getLineups, Match, HeadToHeadData, Lineup } from '@/lib/sports-api';
import type { AIPredictionResult } from '@/lib/ai-types';
import { generateFallbackPrediction } from '@/lib/prediction-fallback';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Match detail state
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [currentH2H, setCurrentH2H] = useState<HeadToHeadData | null>(null);
  const [currentLineups, setCurrentLineups] = useState<{ home: Lineup; away: Lineup } | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<AIPredictionResult | null>(null);
  const [matchLoading, setMatchLoading] = useState<boolean>(false);

  // Synchronize with window history when available
  useEffect(() => {
    const initialPath = window.location.pathname;
    if (initialPath.startsWith('/partido/')) {
      void handleNavigate(initialPath, false);
    }

    const handlePopState = () => {
      void handleNavigate(window.location.pathname, false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = async (path: string, pushState = true) => {
    if (pushState && typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If path is /partido/:id
    const matchRoute = path.match(/^\/partido\/([^/]+)/);
    if (matchRoute) {
      const id = matchRoute[1];
      setSelectedMatchId(id);
      await loadMatchData(id);
    } else {
      setSelectedMatchId(null);
    }
  };

  const loadMatchData = async (id: string) => {
    setMatchLoading(true);
    try {
      let matchData: Match | null = null;
      let h2hData: HeadToHeadData | null = null;
      let lineupsData: { home: Lineup; away: Lineup } | null = null;

      // 1. Fetch match, h2h, and lineups from Express API
      try {
        const sportsRes = await fetch(`/api/sports?matchId=${id}`);
        if (sportsRes.ok) {
          const json = await sportsRes.json();
          if (json.match) matchData = json.match;
          if (json.h2h) h2hData = json.h2h;
          if (json.lineups) lineupsData = json.lineups;
        }
      } catch (err) {
        console.warn('Fallback a cargador local de partido:', err);
      }

      if (!matchData) {
        matchData = (await getMatchById(id)) || PREMIER_MATCHES.find((m) => m.id === id) || PREMIER_MATCHES[0];
      }
      if (!h2hData) {
        h2hData = await getHeadToHead(matchData.homeTeam.id, matchData.awayTeam.id);
      }
      if (!lineupsData) {
        lineupsData = await getLineups(matchData.id);
      }

      setCurrentMatch(matchData);
      setCurrentH2H(h2hData);
      setCurrentLineups(lineupsData);

      // 2. Fetch AI prediction from /api/ai-predict (Gemini 3.6 Flash on server)
      let predictionData: AIPredictionResult | null = null;
      try {
        const aiRes = await fetch('/api/ai-predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId: id }),
        });
        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson.prediction) {
            predictionData = aiJson.prediction;
          }
        }
      } catch (aiErr) {
        console.warn('Error fetching server AI prediction:', aiErr);
      }

      if (!predictionData) {
        predictionData = generateFallbackPrediction(matchData, h2hData);
      }

      setCurrentPrediction(predictionData);
    } catch (err) {
      console.error('Error cargando datos del partido:', err);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleSelectMatch = (matchId: string) => {
    handleNavigate(`/partido/${matchId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      <Navbar currentPath={currentPath} onNavigate={(path) => handleNavigate(path)} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPath.startsWith('/partido/') ? (
          matchLoading || !currentMatch || !currentH2H || !currentLineups || !currentPrediction ? (
            <div className="py-24 text-center text-slate-400 space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-200">
                Cargando métricas estadísticas & algoritmo de IA...
              </p>
            </div>
          ) : (
            <MatchDetailClient
              match={currentMatch}
              h2h={currentH2H}
              lineups={currentLineups}
              initialPrediction={currentPrediction}
              onBack={() => handleNavigate('/')}
            />
          )
        ) : currentPath === '/tablas' ? (
          <TablasPage onSelectMatch={handleSelectMatch} onNavigateHome={() => handleNavigate('/')} />
        ) : currentPath === '/pronosticos' ? (
          <PronosticosPage onSelectMatch={handleSelectMatch} />
        ) : currentPath === '/privacidad' ? (
          <PrivacidadPage />
        ) : currentPath === '/terminos' ? (
          <TerminosPage />
        ) : (
          <HomePage
            onNavigateMatch={handleSelectMatch}
            onNavigateAllPredictions={() => handleNavigate('/pronosticos')}
          />
        )}
      </main>

      <Footer onNavigate={(path) => handleNavigate(path)} />
    </div>
  );
}
