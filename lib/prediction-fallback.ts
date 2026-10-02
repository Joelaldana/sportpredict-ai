import type { HeadToHeadData, Match } from './sports-api';
import type { AIPredictionResult } from './ai-types';

/**
 * Deterministic fallback used when the AI provider is unavailable.
 * It contains no secrets and is safe to execute in the browser.
 */
export function generateFallbackPrediction(
  match: Match,
  h2h?: HeadToHeadData | null,
): AIPredictionResult {
  const homeAttack = match.homeTeam.stats.goalsScoredAvg;
  const awayDefense = match.awayTeam.stats.goalsConcededAvg;
  const awayAttack = match.awayTeam.stats.goalsScoredAvg;
  const homeDefense = match.homeTeam.stats.goalsConcededAvg;

  const homeExpGoals = (homeAttack + awayDefense) / 2;
  const awayExpGoals = (awayAttack + homeDefense) / 2;
  const totalExpectedGoals = homeExpGoals + awayExpGoals;

  let localProb = Math.round((homeExpGoals / (totalExpectedGoals + 1)) * 100) + 5;
  let visitanteProb = Math.round((awayExpGoals / (totalExpectedGoals + 1)) * 100);
  let empateProb = 100 - (localProb + visitanteProb);

  if (empateProb < 18) {
    empateProb = 22;
    localProb -= 2;
    visitanteProb -= 2;
  }

  localProb = Math.max(0, Math.min(100, localProb));
  visitanteProb = Math.max(0, Math.min(100, visitanteProb));
  empateProb = Math.max(0, 100 - localProb - visitanteProb);

  const mercado = totalExpectedGoals > 2.7 ? 'Más de 2.5 Goles' : 'Ambos Anotan - SÍ';

  return {
    probabilidad: {
      local: localProb,
      empate: empateProb,
      visitante: visitanteProb,
    },
    analisis_tactico: `${match.homeTeam.name} llega con una propuesta ofensiva sólida promediando ${match.homeTeam.stats.goalsScoredAvg} goles por encuentro y un dominio posicional del ${match.homeTeam.stats.possessionAvg}%. A pesar de las ausencias en plantilla (${match.homeTeam.injuries.join(', ') || 'sin bajas clave'}), su racha reciente (${match.homeTeam.form.join('-')}) aporta contexto al análisis.\n\nPor su parte, ${match.awayTeam.name} mantiene un promedio de ${match.awayTeam.stats.goalsConcededAvg} goles concedidos y ${match.awayTeam.stats.goalsScoredAvg} goles a favor. El registro H2H disponible (${h2h?.avgGoals ?? 'N/D'} goles de promedio y ${h2h?.bothScoredPercentage ?? 'N/D'}% en ambos anotan) complementa la estimación estadística.`,
    mercado_sugerido: mercado,
    nivel_confianza: localProb > 50 || visitanteProb > 50 ? 'Alto' : 'Medio',
    modelo_utilizado: 'SportPredict AI Core Engine (fallback estadístico)',
    fecha_analisis: new Date().toISOString(),
  };
}
