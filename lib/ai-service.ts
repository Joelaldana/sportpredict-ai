import { GoogleGenAI } from '@google/genai';
import { Match, HeadToHeadData, Lineup } from './sports-api';

import type { AIPredictionResult } from './ai-types';
import { generateFallbackPrediction } from './prediction-fallback';
const SYSTEM_PROMPT = `Eres un analista estadístico y táctico deportivo profesional de élite. Tu trabajo es procesar métricas objetivas (historial H2H, alineaciones y jugadores activos en cancha en tiempo real, eventos en vivo, promedio de goles anotados/concedidos, racha y bajas) y responder ÚNICAMENTE en un formato JSON válido con las siguientes claves:
- \`probabilidad\`: { \`local\`: number, \`empate\`: number, \`visitante\`: number } (la suma debe ser 100).
- \`analisis_tactico\`: string (resumen explicativo de 2 párrafos sobre el momento de ambos equipos, tomando en cuenta si el partido está en juego, quiénes están jugando en cancha en este momento, sustituciones y tarjetas si existen).
- \`mercado_sugerido\`: string (ej: 'Ambos Anotan - SÍ', 'Más de 2.5 Goles', 'Gana Local o Empata', 'Próximo Gol Local').
- \`nivel_confianza\`: 'Bajo' | 'Medio' | 'Alto'.
Sé estrictamente imparcial y fundamenta todo en las métricas proporcionadas.`;

export async function generateMatchPrediction(
  match: Match,
  h2h?: HeadToHeadData | null,
  lineups?: { home: Lineup; away: Lineup } | null
): Promise<AIPredictionResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Extract who is active on the pitch right now
  const homeActivePlayers = lineups?.home.startingXI
    ? [
        ...lineups.home.startingXI.filter((p) => p.isOnPitch !== false).map((p) => `${p.name} (${p.position})`),
        ...lineups.home.substitutes.filter((p) => p.isOnPitch === true).map((p) => `${p.name} (${p.position}, entró ${p.subbedInMinute || ''})`),
      ]
    : [];

  const awayActivePlayers = lineups?.away.startingXI
    ? [
        ...lineups.away.startingXI.filter((p) => p.isOnPitch !== false).map((p) => `${p.name} (${p.position})`),
        ...lineups.away.substitutes.filter((p) => p.isOnPitch === true).map((p) => `${p.name} (${p.position}, entró ${p.subbedInMinute || ''})`),
      ]
    : [];

  const matchMetrics = {
    partido: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    competicion: match.league.name,
    estadio: match.stadium,
    estado_partido: match.status,
    marcador_actual: match.score ? `${match.score.home} - ${match.score.away}` : 'No iniciado',
    minuto_reloj: match.displayClock || (match.minute ? `${match.minute}'` : 'Previa'),
    jugadores_en_cancha_ahora: {
      local: homeActivePlayers.length > 0 ? homeActivePlayers : 'Alineación táctica estándar',
      visitante: awayActivePlayers.length > 0 ? awayActivePlayers : 'Alineación táctica estándar',
    },
    eventos_en_vivo: match.events && match.events.length > 0
      ? match.events.slice(-6).map((e) => `[${e.minute}] ${e.type}: ${e.text}`)
      : 'Sin incidencias críticas',
    estadisticas_en_vivo: match.liveStats || 'Pendiente de inicio',
    local: {
      nombre: match.homeTeam.name,
      racha_ultimos_5: match.homeTeam.form.join('-'),
      promedio_goles_anotados: match.homeTeam.stats.goalsScoredAvg,
      promedio_goles_concedidos: match.homeTeam.stats.goalsConcededAvg,
      porterias_a_cero_pct: match.homeTeam.stats.cleanSheetsPct,
      posesion_promedio: match.homeTeam.stats.possessionAvg,
      bajas_y_lesiones: match.homeTeam.injuries,
    },
    visitante: {
      nombre: match.awayTeam.name,
      racha_ultimos_5: match.awayTeam.form.join('-'),
      promedio_goles_anotados: match.awayTeam.stats.goalsScoredAvg,
      promedio_goles_concedidos: match.awayTeam.stats.goalsConcededAvg,
      porterias_a_cero_pct: match.awayTeam.stats.cleanSheetsPct,
      posesion_promedio: match.awayTeam.stats.possessionAvg,
      bajas_y_lesiones: match.awayTeam.injuries,
    },
    historial_h2h: h2h
      ? {
          partidos_totales: h2h.totalMatches,
          victorias_local: h2h.homeWins,
          empates: h2h.draws,
          victorias_visitante: h2h.awayWins,
          promedio_goles: h2h.avgGoals,
          ambos_marcan_pct: h2h.bothScoredPercentage,
        }
      : 'Historial equilibrado en competiciones oficiales.',
    cuotas_mercado: match.odds,
  };

  const userPrompt = `Analiza las siguientes métricas del enfrentamiento deportivo y genera el informe predictivo estricto:\n\n${JSON.stringify(
    matchMetrics,
    null,
    2
  )}`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      let rawText = '';
      let usedModel = 'Gemini 3.1 Flash Lite';

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-flash-latest'];
      let lastError: unknown = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          });
          if (response.text?.trim()) {
            rawText = response.text.trim();
            usedModel = modelName === 'gemini-3.1-flash-lite' ? 'Gemini 3.1 Flash' : modelName;
            break;
          }
        } catch (modelErr) {
          lastError = modelErr;
          console.warn(`Intento con ${modelName} no completado, probando siguiente modelo:`, (modelErr as Error)?.message || modelErr);
        }
      }

      if (!rawText && lastError) {
        throw lastError;
      }

      const parsed = JSON.parse(rawText) as AIPredictionResult;

      // Ensure probabilities sum to 100
      let total = parsed.probabilidad.local + parsed.probabilidad.empate + parsed.probabilidad.visitante;
      if (total !== 100 && total > 0) {
        parsed.probabilidad.local = Math.round((parsed.probabilidad.local / total) * 100);
        parsed.probabilidad.empate = Math.round((parsed.probabilidad.empate / total) * 100);
        parsed.probabilidad.visitante = 100 - (parsed.probabilidad.local + parsed.probabilidad.empate);
      }

      return {
        ...parsed,
        modelo_utilizado: `${usedModel} (Motor Estadístico Cuantitativo)`,
        fecha_analisis: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error invocando Gemini API en ai-service, aplicando fallback analítico:', err);
    }
  }

  // Fallback analítico determinista si el proveedor de IA no está disponible.
  return generateFallbackPrediction(match, h2h);
}
