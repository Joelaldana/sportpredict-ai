export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  form: ('W' | 'D' | 'L')[];
  stats: {
    goalsScoredAvg: number;
    goalsConcededAvg: number;
    cleanSheetsPct: number;
    possessionAvg: number;
  };
  injuries: string[];
}

export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
  over25: number;
  under25: number;
  bttsYes: number;
  bttsNo: number;
}

export interface MatchEvent {
  id: string;
  minute: string;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'VAR' | 'PENALTY';
  team?: 'home' | 'away';
  player: string;
  secondaryPlayer?: string;
  text: string;
}

export interface MatchLiveStats {
  possession: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  totalShots: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  saves?: { home: number; away: number };
}

export interface Match {
  id: string;
  league: {
    id: string;
    name: string;
    country: string;
    flag: string;
    season: string;
  };
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  minute?: number;
  displayClock?: string;
  score?: {
    home: number;
    away: number;
  };
  stadium: string;
  referee: string;
  odds: MatchOdds;
  events?: MatchEvent[];
  liveStats?: MatchLiveStats;
  sourceProvider?: 'espn' | 'thesportsdb' | 'football-data' | 'local';
}

export interface H2HMatch {
  id: string;
  date: string;
  competition: string;
  homeScore: number;
  awayScore: number;
  homeTeamName: string;
  awayTeamName: string;
  winner: 'HOME' | 'AWAY' | 'DRAW';
}

export interface HeadToHeadData {
  totalMatches: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  avgGoals: number;
  bothScoredPercentage: number;
  recentMatches: H2HMatch[];
}

export interface LineupPlayer {
  number: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  starter?: boolean;
  isOnPitch?: boolean;
  subbedOutMinute?: string;
  subbedInMinute?: string;
  goals?: number;
  yellowCard?: boolean;
  redCard?: boolean;
}

export interface Lineup {
  formation: string;
  coach: string;
  startingXI: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface StandingTeam {
  rank: number;
  team: string;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  zone?: 'ucl' | 'uel' | 'uecl' | 'relegation' | 'normal';
}

// In-memory cache for ISR / 60 seconds TTL for fresh sports data
interface CacheItem<T> {
  timestamp: number;
  data: T;
}

const memoryCache = new Map<string, CacheItem<unknown>>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds ISR

export function clearSportsCache(): void {
  memoryCache.clear();
}

function getCached<T>(key: string): T | null {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return item.data as T;
}

function setCached<T>(key: string, data: T): void {
  memoryCache.set(key, {
    timestamp: Date.now(),
    data,
  });
}

// Primary Seed Data to guarantee instantaneous high-performance availability without API quotas
export const PREMIER_MATCHES: Match[] = [
  {
    id: 'ucl-rm-mci',
    league: {
      id: 'ucl',
      name: 'UEFA Champions League',
      country: 'Europa',
      flag: '🇪🇺',
      season: '2026/2027',
    },
    homeTeam: {
      id: 'real-madrid',
      name: 'Real Madrid',
      shortName: 'RMA',
      logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=128&auto=format&fit=crop&q=60',
      form: ['W', 'W', 'D', 'W', 'W'],
      stats: {
        goalsScoredAvg: 2.35,
        goalsConcededAvg: 0.85,
        cleanSheetsPct: 45,
        possessionAvg: 58.4,
      },
      injuries: ['David Alaba (Recuperación rodilla)', 'Éder Militão (Molestia muscular)'],
    },
    awayTeam: {
      id: 'man-city',
      name: 'Manchester City',
      shortName: 'MCI',
      logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=128&auto=format&fit=crop&q=60',
      form: ['W', 'D', 'W', 'W', 'D'],
      stats: {
        goalsScoredAvg: 2.45,
        goalsConcededAvg: 1.05,
        cleanSheetsPct: 38,
        possessionAvg: 64.2,
      },
      injuries: ['Kevin De Bruyne (Precaución isquiotibial)'],
    },
    date: 'Hoy',
    time: '21:00 CET',
    status: 'SCHEDULED',
    stadium: 'Estadio Santiago Bernabéu, Madrid',
    referee: 'Szymon Marciniak (POL)',
    odds: {
      home: 2.35,
      draw: 3.50,
      away: 2.85,
      over25: 1.62,
      under25: 2.25,
      bttsYes: 1.55,
      bttsNo: 2.35,
    },
  },
  {
    id: 'laliga-bar-atm',
    league: {
      id: 'laliga',
      name: 'LaLiga EA Sports',
      country: 'España',
      flag: '🇪🇸',
      season: '2026/2027',
    },
    homeTeam: {
      id: 'fc-barcelona',
      name: 'FC Barcelona',
      shortName: 'BAR',
      logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=128&auto=format&fit=crop&q=60',
      form: ['W', 'W', 'W', 'L', 'W'],
      stats: {
        goalsScoredAvg: 2.65,
        goalsConcededAvg: 1.15,
        cleanSheetsPct: 40,
        possessionAvg: 67.1,
      },
      injuries: ['Gavi (Sobrecarga gemelo)'],
    },
    awayTeam: {
      id: 'atletico-madrid',
      name: 'Atlético de Madrid',
      shortName: 'ATM',
      logo: 'https://images.unsplash.com/photo-1489944445391-11dd3536645a?w=128&auto=format&fit=crop&q=60',
      form: ['W', 'D', 'W', 'W', 'L'],
      stats: {
        goalsScoredAvg: 1.85,
        goalsConcededAvg: 0.75,
        cleanSheetsPct: 52,
        possessionAvg: 48.3,
      },
      injuries: ['Ángel Correa (Esguince tobillo)'],
    },
    date: 'Hoy',
    time: '18:30 CET',
    status: 'LIVE',
    minute: 68,
    score: {
      home: 2,
      away: 1,
    },
    stadium: 'Estadi Olímpic Lluís Companys, Barcelona',
    referee: 'Jesús Gil Manzano (ESP)',
    odds: {
      home: 1.95,
      draw: 3.60,
      away: 3.75,
      over25: 1.70,
      under25: 2.10,
      bttsYes: 1.65,
      bttsNo: 2.15,
    },
  },
  {
    id: 'epl-ars-che',
    league: {
      id: 'premier',
      name: 'Premier League',
      country: 'Inglaterra',
      flag: '🇬🇧',
      season: '2026/2027',
    },
    homeTeam: {
      id: 'arsenal',
      name: 'Arsenal FC',
      shortName: 'ARS',
      logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=128&auto=format&fit=crop&q=60',
      form: ['W', 'W', 'W', 'D', 'W'],
      stats: {
        goalsScoredAvg: 2.20,
        goalsConcededAvg: 0.80,
        cleanSheetsPct: 50,
        possessionAvg: 59.8,
      },
      injuries: ['Martin Ødegaard (Duda por golpe)'],
    },
    awayTeam: {
      id: 'chelsea',
      name: 'Chelsea FC',
      shortName: 'CHE',
      logo: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=128&auto=format&fit=crop&q=60',
      form: ['L', 'W', 'D', 'W', 'D'],
      stats: {
        goalsScoredAvg: 1.90,
        goalsConcededAvg: 1.35,
        cleanSheetsPct: 30,
        possessionAvg: 56.2,
      },
      injuries: ['Reece James (Aductor)'],
    },
    date: 'Mañana',
    time: '17:30 CET',
    status: 'SCHEDULED',
    stadium: 'Emirates Stadium, Londres',
    referee: 'Michael Oliver (ENG)',
    odds: {
      home: 1.75,
      draw: 3.90,
      away: 4.40,
      over25: 1.65,
      under25: 2.20,
      bttsYes: 1.68,
      bttsNo: 2.10,
    },
  },
  {
    id: 'seriea-int-juv',
    league: {
      id: 'seriea',
      name: 'Serie A',
      country: 'Italia',
      flag: '🇮🇹',
      season: '2026/2027',
    },
    homeTeam: {
      id: 'inter-milan',
      name: 'Inter de Milán',
      shortName: 'INT',
      logo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=128&auto=format&fit=crop&q=60',
      form: ['W', 'W', 'D', 'W', 'W'],
      stats: {
        goalsScoredAvg: 2.10,
        goalsConcededAvg: 0.70,
        cleanSheetsPct: 55,
        possessionAvg: 55.4,
      },
      injuries: ['Hakan Çalhanoğlu (Suspensión tarjetas)'],
    },
    awayTeam: {
      id: 'juventus',
      name: 'Juventus FC',
      shortName: 'JUV',
      logo: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=128&auto=format&fit=crop&q=60',
      form: ['D', 'W', 'D', 'W', 'D'],
      stats: {
        goalsScoredAvg: 1.45,
        goalsConcededAvg: 0.65,
        cleanSheetsPct: 60,
        possessionAvg: 52.0,
      },
      injuries: ['Gleison Bremer (Rotura LCA)'],
    },
    date: 'Mañana',
    time: '20:45 CET',
    status: 'SCHEDULED',
    stadium: 'Stadio Giuseppe Meazza (San Siro), Milán',
    referee: 'Daniele Orsato (ITA)',
    odds: {
      home: 2.05,
      draw: 3.30,
      away: 3.65,
      over25: 2.10,
      under25: 1.72,
      bttsYes: 1.85,
      bttsNo: 1.90,
    },
  },
  {
    id: 'bundes-bay-dor',
    league: {
      id: 'bundesliga',
      name: 'Bundesliga',
      country: 'Alemania',
      flag: '🇩🇪',
      season: '2026/2027',
    },
    homeTeam: {
      id: 'bayern-munich',
      name: 'Bayern Múnich',
      shortName: 'BAY',
      logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=128&auto=format&fit=crop&q=60',
      form: ['W', 'W', 'W', 'W', 'D'],
      stats: {
        goalsScoredAvg: 3.10,
        goalsConcededAvg: 1.00,
        cleanSheetsPct: 42,
        possessionAvg: 68.3,
      },
      injuries: ['Jamal Musiala (Duda por fatiga)'],
    },
    awayTeam: {
      id: 'borussia-dortmund',
      name: 'Borussia Dortmund',
      shortName: 'BVB',
      logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=128&auto=format&fit=crop&q=60',
      form: ['L', 'W', 'L', 'W', 'W'],
      stats: {
        goalsScoredAvg: 2.05,
        goalsConcededAvg: 1.55,
        cleanSheetsPct: 28,
        possessionAvg: 54.7,
      },
      injuries: ['Karim Adeyemi (Bíceps femoral)'],
    },
    date: 'En 2 días',
    time: '18:30 CET',
    status: 'SCHEDULED',
    stadium: 'Allianz Arena, Múnich',
    referee: 'Felix Zwayer (GER)',
    odds: {
      home: 1.50,
      draw: 4.80,
      away: 5.50,
      over25: 1.40,
      under25: 2.90,
      bttsYes: 1.50,
      bttsNo: 2.50,
    },
  },
];

// React cache() wrapped fetcher for ISR (300 seconds revalidation)
const THE_SPORTS_DB_LEAGUES: Record<string, { sdbId: string; name: string; flag: string; country: string }> = {
  premier: { sdbId: '4328', name: 'Premier League', flag: '🇬🇧', country: 'Inglaterra' },
  laliga: { sdbId: '4335', name: 'LaLiga EA Sports', flag: '🇪🇸', country: 'España' },
  seriea: { sdbId: '4332', name: 'Serie A', flag: '🇮🇹', country: 'Italia' },
  bundesliga: { sdbId: '4331', name: 'Bundesliga', flag: '🇩🇪', country: 'Alemania' },
  ucl: { sdbId: '4480', name: 'UEFA Champions League', flag: '🇪🇺', country: 'Europa' },
};

function parseTheSportsDBEvent(ev: any, defaultLeagueKey: string): Match {
  const homeName = ev.strHomeTeam || 'Equipo Local';
  const awayName = ev.strAwayTeam || 'Equipo Visitante';
  const leagueMeta = THE_SPORTS_DB_LEAGUES[defaultLeagueKey] || {
    sdbId: ev.idLeague || '4328',
    name: ev.strLeague || 'Liga Internacional',
    flag: '🌍',
    country: ev.strCountry || 'Internacional',
  };

  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  };

  const hVal = hash(homeName) % 100;
  const aVal = hash(awayName) % 100;

  const homeOdds = Number((1.65 + (aVal / 100) * 1.4).toFixed(2));
  const awayOdds = Number((1.85 + (hVal / 100) * 2.0).toFixed(2));
  const drawOdds = Number((3.10 + ((hVal + aVal) % 40) / 100).toFixed(2));
  const overOdds = Number((1.55 + (hVal % 45) / 100).toFixed(2));
  const underOdds = Number((2.00 + (aVal % 45) / 100).toFixed(2));
  const bttsYes = Number((1.60 + ((hVal + aVal) % 35) / 100).toFixed(2));
  const bttsNo = Number((2.10 + ((hVal * 2) % 35) / 100).toFixed(2));

  const homeGoals = Number((1.4 + (hVal % 15) / 10).toFixed(2));
  const awayGoals = Number((1.2 + (aVal % 15) / 10).toFixed(2));
  const homeConceded = Number((0.8 + (aVal % 10) / 10).toFixed(2));
  const awayConceded = Number((1.1 + (hVal % 10) / 10).toFixed(2));

  const forms: ('W' | 'D' | 'L')[][] = [
    ['W', 'W', 'D', 'W', 'W'],
    ['W', 'D', 'W', 'L', 'W'],
    ['D', 'W', 'W', 'W', 'D'],
    ['W', 'L', 'W', 'D', 'W'],
    ['L', 'W', 'W', 'W', 'D']
  ];
  const homeForm = forms[hVal % forms.length];
  const awayForm = forms[aVal % forms.length];

  const dateStr = ev.dateEvent ? ev.dateEvent : 'Hoy';
  const timeStr = ev.strTime ? `${ev.strTime.slice(0, 5)} CET` : '20:00 CET';

  return {
    id: `sdb-${ev.idEvent}`,
    league: {
      id: defaultLeagueKey,
      name: ev.strLeague || leagueMeta.name,
      country: leagueMeta.country,
      flag: leagueMeta.flag,
      season: ev.strSeason || '2025/2026',
    },
    homeTeam: {
      id: `team-${ev.idHomeTeam || homeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: homeName,
      shortName: homeName.slice(0, 3).toUpperCase(),
      logo: ev.strHomeTeamBadge || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=128&auto=format&fit=crop&q=60',
      form: homeForm,
      stats: {
        goalsScoredAvg: homeGoals,
        goalsConcededAvg: homeConceded,
        cleanSheetsPct: 35 + (hVal % 25),
        possessionAvg: 48 + (hVal % 18),
      },
      injuries: [],
    },
    awayTeam: {
      id: `team-${ev.idAwayTeam || awayName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: awayName,
      shortName: awayName.slice(0, 3).toUpperCase(),
      logo: ev.strAwayTeamBadge || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=128&auto=format&fit=crop&q=60',
      form: awayForm,
      stats: {
        goalsScoredAvg: awayGoals,
        goalsConcededAvg: awayConceded,
        cleanSheetsPct: 30 + (aVal % 25),
        possessionAvg: 45 + (aVal % 15),
      },
      injuries: [],
    },
    date: dateStr,
    time: timeStr,
    status: ev.strStatus === 'Match Finished' ? 'FINISHED' : (ev.intHomeScore != null ? 'LIVE' : 'SCHEDULED'),
    score: ev.intHomeScore != null ? { home: Number(ev.intHomeScore), away: Number(ev.intAwayScore || 0) } : undefined,
    stadium: ev.strVenue || 'Estadio Principal',
    referee: ev.strOfficial || 'Árbitro Oficial Designado',
    odds: {
      home: homeOdds,
      draw: drawOdds,
      away: awayOdds,
      over25: overOdds,
      under25: underOdds,
      bttsYes,
      bttsNo,
    },
  };
}

export const ESPN_LEAGUES: Record<string, { slug: string; name: string; flag: string; country: string }> = {
  laliga: { slug: 'esp.1', name: 'LaLiga EA Sports', flag: '🇪🇸', country: 'España' },
  premier: { slug: 'eng.1', name: 'Premier League', flag: '🇬🇧', country: 'Inglaterra' },
  seriea: { slug: 'ita.1', name: 'Serie A', flag: '🇮🇹', country: 'Italia' },
  bundesliga: { slug: 'ger.1', name: 'Bundesliga', flag: '🇩🇪', country: 'Alemania' },
  ucl: { slug: 'uefa.champions', name: 'UEFA Champions League', flag: '🇪🇺', country: 'Europa' },
  ligue1: { slug: 'fra.1', name: 'Ligue 1', flag: '🇫🇷', country: 'Francia' },
};

function parseESPNEvent(ev: any, leagueKey: string): Match {
  const comp = ev.competitions?.[0] || {};
  const competitors = comp.competitors || [];
  const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0] || {};
  const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1] || {};

  const homeName = homeComp.team?.displayName || 'Equipo Local';
  const awayName = awayComp.team?.displayName || 'Equipo Visitante';
  const homeLogo = homeComp.team?.logo || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=128&auto=format&fit=crop&q=60';
  const awayLogo = awayComp.team?.logo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=128&auto=format&fit=crop&q=60';

  const leagueMeta = ESPN_LEAGUES[leagueKey] || {
    slug: 'intl',
    name: ev.league?.name || 'Liga Internacional',
    flag: '🌍',
    country: 'Internacional',
  };

  const statusType = ev.status?.type || {};
  let status: 'SCHEDULED' | 'LIVE' | 'FINISHED' = 'SCHEDULED';
  if (statusType.state === 'in') {
    status = 'LIVE';
  } else if (statusType.state === 'post' || statusType.completed) {
    status = 'FINISHED';
  }

  const displayClock = statusType.shortDetail || statusType.detail || ev.status?.displayClock || '';
  const minuteMatch = displayClock.match(/(\d+)/);
  const minute = minuteMatch ? parseInt(minuteMatch[1], 10) : (status === 'LIVE' ? 45 : undefined);

  let score: { home: number; away: number } | undefined = undefined;
  if (status !== 'SCHEDULED' || (homeComp.score != null && awayComp.score != null)) {
    score = {
      home: parseInt(homeComp.score || '0', 10),
      away: parseInt(awayComp.score || '0', 10),
    };
  }

  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  };
  const hVal = hash(homeName) % 100;
  const aVal = hash(awayName) % 100;

  let dateStr = 'Hoy';
  let timeStr = '20:00 CET';
  if (ev.date) {
    try {
      const d = new Date(ev.date);
      const now = new Date();
      
      const isToday = d.toDateString() === now.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = d.toDateString() === yesterday.toDateString();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const isTomorrow = d.toDateString() === tomorrow.toDateString();

      if (isToday) {
        dateStr = 'Hoy';
      } else if (isYesterday) {
        dateStr = 'Ayer';
      } else if (isTomorrow) {
        dateStr = 'Mañana';
      } else {
        dateStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      }
      timeStr = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }) + ' CET';
    } catch {
      // fallback
    }
  }

  return {
    id: `espn-${ev.id}`,
    league: {
      id: leagueKey,
      name: leagueMeta.name,
      country: leagueMeta.country,
      flag: leagueMeta.flag,
      season: '2026/2027',
    },
    homeTeam: {
      id: `team-${homeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: homeName,
      shortName: homeComp.team?.abbreviation || homeName.slice(0, 3).toUpperCase(),
      logo: homeLogo,
      form: ['W', 'D', 'W', 'W', 'D'],
      stats: {
        goalsScoredAvg: Number((1.5 + (hVal % 15) / 10).toFixed(2)),
        goalsConcededAvg: Number((0.9 + (aVal % 10) / 10).toFixed(2)),
        cleanSheetsPct: 40 + (hVal % 25),
        possessionAvg: 50 + (hVal % 15),
      },
      injuries: [],
    },
    awayTeam: {
      id: `team-${awayName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: awayName,
      shortName: awayComp.team?.abbreviation || awayName.slice(0, 3).toUpperCase(),
      logo: awayLogo,
      form: ['W', 'W', 'D', 'L', 'W'],
      stats: {
        goalsScoredAvg: Number((1.3 + (aVal % 15) / 10).toFixed(2)),
        goalsConcededAvg: Number((1.1 + (hVal % 10) / 10).toFixed(2)),
        cleanSheetsPct: 35 + (aVal % 20),
        possessionAvg: 48 + (aVal % 12),
      },
      injuries: [],
    },
    date: dateStr,
    time: timeStr,
    status,
    minute,
    displayClock,
    score,
    stadium: comp.venue?.fullName ? `${comp.venue.fullName}${comp.venue.address?.city ? ', ' + comp.venue.address.city : ''}` : 'Estadio Oficial',
    referee: comp.officials?.[0]?.displayName || 'Árbitro Oficial Designado',
    odds: {
      home: Number((1.80 + (aVal / 100)).toFixed(2)),
      draw: Number((3.20 + ((hVal + aVal) % 30) / 100).toFixed(2)),
      away: Number((2.10 + (hVal / 100)).toFixed(2)),
      over25: Number((1.60 + (hVal % 30) / 100).toFixed(2)),
      under25: Number((2.10 + (aVal % 30) / 100).toFixed(2)),
      bttsYes: Number((1.65 + ((hVal + aVal) % 25) / 100).toFixed(2)),
      bttsNo: Number((2.05 + ((hVal * 2) % 25) / 100).toFixed(2)),
    },
    sourceProvider: 'espn',
  };
}

async function fetchExternalMatches(leagueId?: string): Promise<Match[]> {
  const matchMap = new Map<string, Match>();

  // 1. Target ESPN Leagues
  const targetESPNLeagues = leagueId && leagueId !== 'all' && ESPN_LEAGUES[leagueId]
    ? [{ key: leagueId, ...ESPN_LEAGUES[leagueId] }]
    : Object.entries(ESPN_LEAGUES).map(([key, val]) => ({ key, ...val }));

  // Calculate yesterday date string (YYYYMMDD) for full round coverage
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yStr = `${yesterday.getUTCFullYear()}${String(yesterday.getUTCMonth() + 1).padStart(2, '0')}${String(yesterday.getUTCDate()).padStart(2, '0')}`;

  await Promise.allSettled(
    targetESPNLeagues.map(async (l) => {
      // 1. Current Scoreboard (Today + Live)
      try {
        const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${l.slug}/scoreboard`;
        const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.events)) {
            for (const ev of data.events) {
              const parsed = parseESPNEvent(ev, l.key);
              matchMap.set(parsed.id, parsed);
            }
          }
        }
      } catch {
        // Continue gracefully
      }

      // 2. Yesterday's Scoreboard (Recent completed round results)
      try {
        const urlYesterday = `https://site.api.espn.com/apis/site/v2/sports/soccer/${l.slug}/scoreboard?dates=${yStr}`;
        const resY = await fetch(urlYesterday, { signal: AbortSignal.timeout(4500) });
        if (resY.ok) {
          const dataY = await resY.json();
          if (dataY && Array.isArray(dataY.events)) {
            for (const ev of dataY.events) {
              const parsed = parseESPNEvent(ev, l.key);
              if (!matchMap.has(parsed.id)) {
                matchMap.set(parsed.id, parsed);
              }
            }
          }
        }
      } catch {
        // Continue gracefully
      }
    })
  );

  return Array.from(matchMap.values());
}

async function fetchESPNMatchSummary(
  eventId: string,
  leagueSlug = 'esp.1'
): Promise<{ matchUpdate: Partial<Match>; lineups: { home: Lineup; away: Lineup } } | null> {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueSlug}/summary?event=${eventId}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const sum = await res.json();

    const events: MatchEvent[] = [];
    if (sum.keyEvents && Array.isArray(sum.keyEvents)) {
      for (const k of sum.keyEvents) {
        const typeText = k.type?.text || '';
        const min = k.clock?.displayValue || '';
        const text = k.text || '';
        let type: MatchEvent['type'] | null = null;
        if (typeText === 'Goal') type = 'GOAL';
        else if (typeText.includes('Yellow')) type = 'YELLOW_CARD';
        else if (typeText.includes('Red')) type = 'RED_CARD';
        else if (typeText === 'Substitution') type = 'SUBSTITUTION';
        else if (typeText.includes('Penalty')) type = 'PENALTY';

        if (type) {
          let pName = '';
          let secName = '';
          if (type === 'SUBSTITUTION') {
            const m = text.match(/([A-ZÀ-ÿa-z\s]+)\s+replaces\s+([A-ZÀ-ÿa-z\s]+)/);
            if (m) {
              pName = m[1].trim();
              secName = m[2].trim();
            }
          } else {
            const m = text.match(/^([A-ZÀ-ÿa-z\s]+?)\s*\(/);
            if (m) pName = m[1].trim();
            else pName = text.split(' ')[0] || '';
          }
          events.push({
            id: `evt-${events.length + 1}`,
            minute: min,
            type,
            text,
            player: pName,
            secondaryPlayer: secName,
          });
        }
      }
    }

    let liveStats: MatchLiveStats | undefined = undefined;
    if (sum.boxscore?.teams && sum.boxscore.teams.length >= 2) {
      const getStat = (teamIdx: number, statName: string) => {
        const stat = sum.boxscore.teams[teamIdx]?.statistics?.find((s: any) => s.name === statName);
        return stat ? parseFloat(stat.displayValue) || 0 : 0;
      };
      liveStats = {
        possession: {
          home: Math.round(getStat(0, 'possessionPct') || 50),
          away: Math.round(getStat(1, 'possessionPct') || 50),
        },
        shotsOnTarget: { home: getStat(0, 'shotsOnTarget'), away: getStat(1, 'shotsOnTarget') },
        totalShots: { home: getStat(0, 'totalShots'), away: getStat(1, 'totalShots') },
        corners: { home: getStat(0, 'wonCorners'), away: getStat(1, 'wonCorners') },
        fouls: { home: getStat(0, 'foulsCommitted'), away: getStat(1, 'foulsCommitted') },
        yellowCards: { home: getStat(0, 'yellowCards'), away: getStat(1, 'yellowCards') },
        redCards: { home: getStat(0, 'redCards'), away: getStat(1, 'redCards') },
        saves: { home: getStat(0, 'saves'), away: getStat(1, 'saves') },
      };
    }

    const formatLineup = (rosterData: any): Lineup => {
      if (!rosterData || !rosterData.roster) {
        return { formation: '4-3-3', coach: 'Director Técnico', startingXI: [], substitutes: [] };
      }
      const starters: LineupPlayer[] = [];
      const subs: LineupPlayer[] = [];

      for (const p of rosterData.roster) {
        const name = p.athlete?.displayName || 'Jugador';
        const num = parseInt(p.jersey || '0', 10);
        let pos: LineupPlayer['position'] = 'MID';
        const pName = (p.position?.name || '').toLowerCase();
        if (pName.includes('goal') || pName.includes('keeper')) pos = 'GK';
        else if (pName.includes('def') || pName.includes('back')) pos = 'DEF';
        else if (pName.includes('forw') || pName.includes('strik') || pName.includes('wing')) pos = 'FWD';

        const subOutEvent = events.find(
          (e) => e.type === 'SUBSTITUTION' && e.secondaryPlayer && e.secondaryPlayer.toLowerCase().includes(name.toLowerCase())
        );
        const subInEvent = events.find(
          (e) => e.type === 'SUBSTITUTION' && e.player && e.player.toLowerCase().includes(name.toLowerCase())
        );

        const isStarter = !!p.starter;
        const isOnPitch = isStarter ? !subOutEvent : !!subInEvent;
        const goalsCount = events.filter((e) => e.type === 'GOAL' && e.text.toLowerCase().includes(name.toLowerCase())).length;
        const yellow = events.some((e) => e.type === 'YELLOW_CARD' && e.text.toLowerCase().includes(name.toLowerCase()));
        const red = events.some((e) => e.type === 'RED_CARD' && e.text.toLowerCase().includes(name.toLowerCase()));

        const item: LineupPlayer = {
          number: num,
          name,
          position: pos,
          starter: isStarter,
          isOnPitch,
          subbedOutMinute: subOutEvent ? subOutEvent.minute : undefined,
          subbedInMinute: subInEvent ? subInEvent.minute : undefined,
          goals: goalsCount,
          yellowCard: yellow,
          redCard: red,
        };

        if (isStarter) starters.push(item);
        else subs.push(item);
      }

      return {
        formation: '4-3-3',
        coach: rosterData.team?.coach?.displayName || 'Director Técnico',
        startingXI: starters,
        substitutes: subs,
      };
    };

    const homeLineup = formatLineup(sum.rosters?.[0]);
    const awayLineup = formatLineup(sum.rosters?.[1]);

    const header = sum.header?.competitions?.[0] || {};
    const statusType = header.status?.type || {};
    let status: 'SCHEDULED' | 'LIVE' | 'FINISHED' = 'SCHEDULED';
    if (statusType.state === 'in') status = 'LIVE';
    else if (statusType.state === 'post' || statusType.completed) status = 'FINISHED';

    const homeComp = header.competitors?.find((c: any) => c.homeAway === 'home');
    const awayComp = header.competitors?.find((c: any) => c.homeAway === 'away');
    const score =
      homeComp?.score != null && awayComp?.score != null
        ? {
            home: parseInt(homeComp.score, 10),
            away: parseInt(awayComp.score, 10),
          }
        : undefined;

    return {
      matchUpdate: {
        events,
        liveStats,
        status,
        score,
        displayClock: statusType.shortDetail || statusType.detail,
      },
      lineups: { home: homeLineup, away: awayLineup },
    };
  } catch (err) {
    console.warn('Error fetching ESPN match summary:', err);
    return null;
  }
}

export const getDailyMatches = cache(async (leagueId?: string, forceFresh = false): Promise<Match[]> => {
  const cacheKey = `daily_matches_${leagueId || 'all'}`;
  if (!forceFresh) {
    const cached = getCached<Match[]>(cacheKey);
    if (cached && cached.length > 0) return cached;
  }

  // Fetch real-time live events from ESPN
  let liveEvents: Match[] = [];
  try {
    liveEvents = await fetchExternalMatches(leagueId);
  } catch (err) {
    console.warn('Error fetching live sports events, fallback:', err);
  }

  let finalMatches: Match[] = [];

  if (liveEvents.length > 0) {
    finalMatches = [...liveEvents];
  } else {
    // Only fall back to seed matches if network or API is completely unreachable
    let baseMatches = PREMIER_MATCHES;
    if (leagueId && leagueId !== 'all') {
      baseMatches = baseMatches.filter((m) => m.league.id === leagueId);
    }
    finalMatches = [...baseMatches];
  }

  // Sort: LIVE matches first, then SCHEDULED, then FINISHED
  finalMatches.sort((a, b) => {
    if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
    if (b.status === 'LIVE' && a.status !== 'LIVE') return 1;
    if (a.status === 'SCHEDULED' && b.status === 'FINISHED') return -1;
    if (b.status === 'SCHEDULED' && a.status === 'FINISHED') return 1;
    return 0;
  });

  setCached(cacheKey, finalMatches);
  return finalMatches;
});

export const getMatchById = cache(async (id: string): Promise<Match | null> => {
  const cacheKey = `match_${id}`;
  const cached = getCached<Match>(cacheKey);
  if (cached) return cached;

  const match = PREMIER_MATCHES.find((m) => m.id === id);
  if (match) {
    setCached(cacheKey, match);
    return match;
  }

  // Check if it is an ESPN live match
  if (id.startsWith('espn-')) {
    const rawId = id.replace('espn-', '');
    // Try to find in daily matches first to get basic team and league info
    const allMatches = await getDailyMatches();
    const existing = allMatches.find((m) => m.id === id);
    const leagueKey = existing?.league.id || 'laliga';
    const espnSlug = ESPN_LEAGUES[leagueKey]?.slug || 'esp.1';

    const summaryResult = await fetchESPNMatchSummary(rawId, espnSlug);
    if (summaryResult && existing) {
      const fullMatch: Match = {
        ...existing,
        ...summaryResult.matchUpdate,
      };
      setCached(cacheKey, fullMatch);
      // Cache the lineups so getLineups returns the active players on pitch
      setCached(`lineups_${id}`, summaryResult.lineups);
      return fullMatch;
    } else if (existing) {
      setCached(cacheKey, existing);
      return existing;
    }
  }

  // Check if it is an external TheSportsDB id
  if (id.startsWith('sdb-')) {
    const rawId = id.replace('sdb-', '');
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=${rawId}`, {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.events && data.events[0]) {
          const parsed = parseTheSportsDBEvent(data.events[0], 'laliga');
          setCached(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error lookup external event:', e);
    }
  }

  return null;
});

export const getHeadToHead = cache(
  async (team1Id: string, team2Id: string): Promise<HeadToHeadData> => {
    const cacheKey = `h2h_${team1Id}_${team2Id}`;
    const cached = getCached<HeadToHeadData>(cacheKey);
    if (cached) return cached;

    // Specific Real Madrid vs Man City data
    if ((team1Id.includes('madrid') && team2Id.includes('city')) || (team1Id.includes('city') && team2Id.includes('madrid'))) {
      const data: HeadToHeadData = {
        totalMatches: 8,
        homeWins: 4,
        draws: 2,
        awayWins: 2,
        avgGoals: 3.12,
        bothScoredPercentage: 75,
        recentMatches: [
          { id: 'h2h-1', date: '17/04/2024', competition: 'UEFA Champions League', homeTeamName: 'Manchester City', awayTeamName: 'Real Madrid', homeScore: 1, awayScore: 1, winner: 'DRAW' },
          { id: 'h2h-2', date: '09/04/2024', competition: 'UEFA Champions League', homeTeamName: 'Real Madrid', awayTeamName: 'Manchester City', homeScore: 3, awayScore: 3, winner: 'DRAW' },
          { id: 'h2h-3', date: '17/05/2023', competition: 'UEFA Champions League', homeTeamName: 'Manchester City', awayTeamName: 'Real Madrid', homeScore: 4, awayScore: 0, winner: 'HOME' },
          { id: 'h2h-4', date: '09/05/2023', competition: 'UEFA Champions League', homeTeamName: 'Real Madrid', awayTeamName: 'Manchester City', homeScore: 1, awayScore: 1, winner: 'DRAW' },
          { id: 'h2h-5', date: '04/05/2022', competition: 'UEFA Champions League', homeTeamName: 'Real Madrid', awayTeamName: 'Manchester City', homeScore: 3, awayScore: 1, winner: 'HOME' },
        ],
      };
      setCached(cacheKey, data);
      return data;
    }

    // Dynamic generation based on team identifiers
    const t1Name = team1Id.replace('team-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const t2Name = team2Id.replace('team-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const hash = (str: string) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
      }
      return Math.abs(h);
    };

    const seed = hash(team1Id + team2Id);
    const total = 6 + (seed % 5);
    const homeW = Math.max(1, Math.floor(total * 0.45));
    const awayW = Math.max(1, Math.floor(total * 0.3));
    const draws = Math.max(1, total - (homeW + awayW));
    const avgG = Number((2.4 + (seed % 12) / 10).toFixed(2));
    const bothScored = 55 + (seed % 35);

    const dates = ['14/11/2024', '18/03/2024', '28/10/2023', '05/02/2023', '19/09/2022'];
    const recentMatches: H2HMatch[] = dates.map((d, i) => {
      const hScore = (seed + i) % 3;
      const aScore = (seed * 2 + i) % 3;
      const winner: 'HOME' | 'AWAY' | 'DRAW' = hScore > aScore ? 'HOME' : (aScore > hScore ? 'AWAY' : 'DRAW');
      return {
        id: `h2h-${seed}-${i}`,
        date: d,
        competition: 'Competición Oficial',
        homeTeamName: i % 2 === 0 ? t1Name : t2Name,
        awayTeamName: i % 2 === 0 ? t2Name : t1Name,
        homeScore: hScore,
        awayScore: aScore,
        winner,
      };
    });

    const data: HeadToHeadData = {
      totalMatches: total,
      homeWins: homeW,
      draws: draws,
      awayWins: awayW,
      avgGoals: avgG,
      bothScoredPercentage: bothScored,
      recentMatches,
    };

    setCached(cacheKey, data);
    return data;
  }
);

export const getLineups = cache(
  async (matchId: string): Promise<{ home: Lineup; away: Lineup }> => {
    const cacheKey = `lineups_${matchId}`;
    const cached = getCached<{ home: Lineup; away: Lineup }>(cacheKey);
    if (cached) return cached;

    // Search if we have the match to get team names
    const match = await getMatchById(matchId);
    const cachedAfterFetch = getCached<{ home: Lineup; away: Lineup }>(cacheKey);
    if (cachedAfterFetch) return cachedAfterFetch;

    const homeName = match?.homeTeam.name || 'Equipo Local';
    const awayName = match?.awayTeam.name || 'Equipo Visitante';

    // Standard Real Madrid vs City custom rosters
    if (matchId === 'ucl-rm-mci') {
      const data = {
        home: {
          formation: '4-3-3',
          coach: 'Carlo Ancelotti',
          startingXI: [
            { number: 1, name: 'Thibaut Courtois', position: 'GK' as const, starter: true, isOnPitch: true },
            { number: 2, name: 'Dani Carvajal', position: 'DEF' as const, starter: true, isOnPitch: true },
            { number: 22, name: 'Antonio Rüdiger', position: 'DEF' as const, starter: true, isOnPitch: true },
            { number: 35, name: 'Raúl Asencio', position: 'DEF' as const, starter: true, isOnPitch: true },
            { number: 23, name: 'Ferland Mendy', position: 'DEF' as const, starter: true, isOnPitch: true },
            { number: 8, name: 'Federico Valverde', position: 'MID' as const, starter: true, isOnPitch: true },
            { number: 14, name: 'Aurélien Tchouaméni', position: 'MID' as const, starter: true, isOnPitch: true },
            { number: 5, name: 'Jude Bellingham', position: 'MID' as const, starter: true, isOnPitch: true },
            { number: 11, name: 'Rodrygo Goes', position: 'FWD' as const, starter: true, isOnPitch: true },
            { number: 9, name: 'Kylian Mbappé', position: 'FWD' as const, starter: true, isOnPitch: true },
            { number: 7, name: 'Vinícius Júnior', position: 'FWD' as const, starter: true, isOnPitch: true },
          ],
          substitutes: [
            { number: 13, name: 'Andriy Lunin', position: 'GK' as const, starter: false, isOnPitch: false },
            { number: 10, name: 'Luka Modrić', position: 'MID' as const, starter: false, isOnPitch: false },
            { number: 6, name: 'Eduardo Camavinga', position: 'MID' as const, starter: false, isOnPitch: false },
            { number: 15, name: 'Arda Güler', position: 'MID' as const, starter: false, isOnPitch: false },
            { number: 16, name: 'Endrick', position: 'FWD' as const, starter: false, isOnPitch: false },
          ],
        },
        away: {
          formation: '4-1-4-1',
          coach: 'Pep Guardiola',
          startingXI: [
            { number: 31, name: 'Ederson Moraes', position: 'GK' as const, starter: true, isOnPitch: true },
            { number: 2, name: 'Kyle Walker', position: 'DEF' as const, starter: true, isOnPitch: true },
            { number: 25, name: 'Manuel Akanji', position: 'DEF' as const, starter: true, isOnPitch: true },
            { number: 3, name: 'Rúben Dias', position: 'DEF' as const, starter: true, isOnPitch: true },
            { number: 24, name: 'Josko Gvardiol', position: 'DEF' as const, starter: true, isOnPitch: true },
            { number: 8, name: 'Mateo Kovačić', position: 'MID' as const, starter: true, isOnPitch: true },
            { number: 20, name: 'Bernardo Silva', position: 'MID' as const, starter: true, isOnPitch: true },
            { number: 17, name: 'Kevin De Bruyne', position: 'MID' as const, starter: true, isOnPitch: true },
            { number: 47, name: 'Phil Foden', position: 'MID' as const, starter: true, isOnPitch: true },
            { number: 11, name: 'Jérémy Doku', position: 'FWD' as const, starter: true, isOnPitch: true },
            { number: 9, name: 'Erling Haaland', position: 'FWD' as const, starter: true, isOnPitch: true },
          ],
          substitutes: [
            { number: 18, name: 'Stefan Ortega', position: 'GK' as const, starter: false, isOnPitch: false },
            { number: 5, name: 'John Stones', position: 'DEF' as const, starter: false, isOnPitch: false },
            { number: 10, name: 'Jack Grealish', position: 'FWD' as const, starter: false, isOnPitch: false },
            { number: 26, name: 'Savinho', position: 'FWD' as const, starter: false, isOnPitch: false },
          ],
        },
      };
      setCached(cacheKey, data);
      return data;
    }

    // Dynamic tactical setup for any match
    const data = {
      home: {
        formation: '4-3-3',
        coach: `Entrenador de ${homeName}`,
        startingXI: [
          { number: 1, name: 'Guardameta Titular', position: 'GK' as const, starter: true, isOnPitch: true },
          { number: 2, name: 'Lateral Derecho', position: 'DEF' as const, starter: true, isOnPitch: true },
          { number: 4, name: 'Central Diestro', position: 'DEF' as const, starter: true, isOnPitch: true },
          { number: 5, name: 'Central Zurdo', position: 'DEF' as const, starter: true, isOnPitch: true },
          { number: 3, name: 'Lateral Izquierdo', position: 'DEF' as const, starter: true, isOnPitch: true },
          { number: 6, name: 'Pivote Defensivo', position: 'MID' as const, starter: true, isOnPitch: true },
          { number: 8, name: 'Interior Mixto', position: 'MID' as const, starter: true, isOnPitch: true },
          { number: 10, name: 'Mediapunta Creativo', position: 'MID' as const, starter: true, isOnPitch: true },
          { number: 7, name: 'Extremo Derecho', position: 'FWD' as const, starter: true, isOnPitch: true },
          { number: 9, name: 'Delantero Centro', position: 'FWD' as const, starter: true, isOnPitch: true },
          { number: 11, name: 'Extremo Izquierdo', position: 'FWD' as const, starter: true, isOnPitch: true },
        ],
        substitutes: [
          { number: 13, name: 'Portero Suplente', position: 'GK' as const, starter: false, isOnPitch: false },
          { number: 14, name: 'Defensa Polivalente', position: 'DEF' as const, starter: false, isOnPitch: false },
          { number: 16, name: 'Mediocentro Suplente', position: 'MID' as const, starter: false, isOnPitch: false },
          { number: 19, name: 'Atacante Revulsivo', position: 'FWD' as const, starter: false, isOnPitch: false },
        ],
      },
      away: {
        formation: '4-2-3-1',
        coach: `Entrenador de ${awayName}`,
        startingXI: [
          { number: 1, name: 'Guardameta Visitante', position: 'GK' as const, starter: true, isOnPitch: true },
          { number: 2, name: 'Lateral Defensivo', position: 'DEF' as const, starter: true, isOnPitch: true },
          { number: 4, name: 'Líder de Zaga', position: 'DEF' as const, starter: true, isOnPitch: true },
          { number: 5, name: 'Segundo Central', position: 'DEF' as const, starter: true, isOnPitch: true },
          { number: 3, name: 'Carrilero Zurdo', position: 'DEF' as const, starter: true, isOnPitch: true },
          { number: 6, name: 'Contención Doble Pivote', position: 'MID' as const, starter: true, isOnPitch: true },
          { number: 8, name: 'Organizador', position: 'MID' as const, starter: true, isOnPitch: true },
          { number: 10, name: 'Enganche', position: 'MID' as const, starter: true, isOnPitch: true },
          { number: 7, name: 'Extremo Rápido', position: 'FWD' as const, starter: true, isOnPitch: true },
          { number: 9, name: 'Ariete Goleador', position: 'FWD' as const, starter: true, isOnPitch: true },
          { number: 11, name: 'Extremo Ofensivo', position: 'FWD' as const, starter: true, isOnPitch: true },
        ],
        substitutes: [
          { number: 12, name: 'Segundo Guardameta', position: 'GK' as const, starter: false, isOnPitch: false },
          { number: 15, name: 'Zaguero de Reserva', position: 'DEF' as const, starter: false, isOnPitch: false },
          { number: 17, name: 'Centrocampista Box-to-Box', position: 'MID' as const, starter: false, isOnPitch: false },
          { number: 20, name: 'Delantero de Área', position: 'FWD' as const, starter: false, isOnPitch: false },
        ],
      },
    };

    setCached(cacheKey, data);
    return data;
  }
);

const FALLBACK_STANDINGS_BY_LEAGUE: Record<string, StandingTeam[]> = {
  laliga: [
    { rank: 1, team: 'FC Barcelona', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png', played: 28, won: 20, drawn: 3, lost: 5, goalsFor: 71, goalsAgainst: 28, goalDiff: 43, points: 63, form: ['W', 'W', 'W', 'D', 'W'], zone: 'ucl' },
    { rank: 2, team: 'Real Madrid', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png', played: 28, won: 19, drawn: 4, lost: 5, goalsFor: 62, goalsAgainst: 26, goalDiff: 36, points: 61, form: ['W', 'W', 'L', 'W', 'W'], zone: 'ucl' },
    { rank: 3, team: 'Atlético de Madrid', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png', played: 28, won: 17, drawn: 6, lost: 5, goalsFor: 49, goalsAgainst: 22, goalDiff: 27, points: 57, form: ['W', 'D', 'W', 'W', 'W'], zone: 'ucl' },
    { rank: 4, team: 'Athletic Club', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/93.png', played: 28, won: 15, drawn: 7, lost: 6, goalsFor: 44, goalsAgainst: 25, goalDiff: 19, points: 52, form: ['W', 'W', 'D', 'D', 'W'], zone: 'ucl' },
    { rank: 5, team: 'Villarreal CF', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/102.png', played: 28, won: 14, drawn: 6, lost: 8, goalsFor: 52, goalsAgainst: 38, goalDiff: 14, points: 48, form: ['L', 'W', 'W', 'W', 'D'], zone: 'uel' },
    { rank: 6, team: 'Real Betis', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/244.png', played: 28, won: 12, drawn: 8, lost: 8, goalsFor: 38, goalsAgainst: 32, goalDiff: 6, points: 44, form: ['W', 'D', 'L', 'W', 'W'], zone: 'uecl' },
    { rank: 7, team: 'Real Sociedad', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/89.png', played: 28, won: 11, drawn: 8, lost: 9, goalsFor: 32, goalsAgainst: 29, goalDiff: 3, points: 41, form: ['D', 'W', 'L', 'W', 'L'], zone: 'normal' },
    { rank: 8, team: 'Girona FC', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/9812.png', played: 28, won: 10, drawn: 6, lost: 12, goalsFor: 39, goalsAgainst: 41, goalDiff: -2, points: 36, form: ['L', 'L', 'W', 'D', 'W'], zone: 'normal' },
    { rank: 9, team: 'RCD Mallorca', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/84.png', played: 28, won: 10, drawn: 6, lost: 12, goalsFor: 26, goalsAgainst: 33, goalDiff: -7, points: 36, form: ['W', 'L', 'D', 'L', 'W'], zone: 'normal' },
    { rank: 10, team: 'RC Celta de Vigo', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/85.png', played: 28, won: 10, drawn: 5, lost: 13, goalsFor: 39, goalsAgainst: 45, goalDiff: -6, points: 35, form: ['W', 'D', 'W', 'L', 'L'], zone: 'normal' },
    { rank: 11, team: 'Sevilla FC', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/243.png', played: 28, won: 9, drawn: 8, lost: 11, goalsFor: 33, goalsAgainst: 37, goalDiff: -4, points: 35, form: ['D', 'L', 'W', 'D', 'W'], zone: 'normal' },
    { rank: 12, team: 'Rayo Vallecano', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/101.png', played: 28, won: 8, drawn: 9, lost: 11, goalsFor: 28, goalsAgainst: 33, goalDiff: -5, points: 33, form: ['L', 'D', 'D', 'W', 'L'], zone: 'normal' },
    { rank: 18, team: 'RCD Espanyol', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/88.png', played: 28, won: 6, drawn: 6, lost: 16, goalsFor: 26, goalsAgainst: 47, goalDiff: -21, points: 24, form: ['L', 'L', 'W', 'L', 'D'], zone: 'relegation' },
    { rank: 19, team: 'Valencia CF', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/94.png', played: 28, won: 5, drawn: 8, lost: 15, goalsFor: 27, goalsAgainst: 48, goalDiff: -21, points: 23, form: ['L', 'D', 'L', 'L', 'W'], zone: 'relegation' },
    { rank: 20, team: 'Real Valladolid', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/95.png', played: 28, won: 4, drawn: 4, lost: 20, goalsFor: 18, goalsAgainst: 58, goalDiff: -40, points: 16, form: ['L', 'L', 'L', 'L', 'L'], zone: 'relegation' },
  ],
  premier: [
    { rank: 1, team: 'Liverpool', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png', played: 29, won: 21, drawn: 6, lost: 2, goalsFor: 68, goalsAgainst: 24, goalDiff: 44, points: 69, form: ['W', 'W', 'W', 'D', 'W'], zone: 'ucl' },
    { rank: 2, team: 'Arsenal', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png', played: 29, won: 18, drawn: 7, lost: 4, goalsFor: 56, goalsAgainst: 23, goalDiff: 33, points: 61, form: ['W', 'D', 'W', 'W', 'W'], zone: 'ucl' },
    { rank: 3, team: 'Nottingham Forest', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/393.png', played: 29, won: 16, drawn: 6, lost: 7, goalsFor: 47, goalsAgainst: 32, goalDiff: 15, points: 54, form: ['W', 'W', 'L', 'W', 'D'], zone: 'ucl' },
    { rank: 4, team: 'Chelsea', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png', played: 29, won: 15, drawn: 7, lost: 7, goalsFor: 55, goalsAgainst: 36, goalDiff: 19, points: 52, form: ['W', 'D', 'L', 'W', 'W'], zone: 'ucl' },
    { rank: 5, team: 'Manchester City', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png', played: 29, won: 15, drawn: 6, lost: 8, goalsFor: 57, goalsAgainst: 38, goalDiff: 19, points: 51, form: ['L', 'W', 'D', 'W', 'W'], zone: 'uel' },
    { rank: 6, team: 'Newcastle United', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/361.png', played: 29, won: 14, drawn: 6, lost: 9, goalsFor: 49, goalsAgainst: 39, goalDiff: 10, points: 48, form: ['W', 'L', 'W', 'W', 'L'], zone: 'uecl' },
    { rank: 7, team: 'Aston Villa', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/362.png', played: 29, won: 13, drawn: 7, lost: 9, goalsFor: 44, goalsAgainst: 42, goalDiff: 2, points: 46, form: ['D', 'W', 'L', 'D', 'W'], zone: 'normal' },
    { rank: 8, team: 'Brighton', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/331.png', played: 29, won: 12, drawn: 9, lost: 8, goalsFor: 45, goalsAgainst: 41, goalDiff: 4, points: 45, form: ['D', 'W', 'W', 'L', 'D'], zone: 'normal' },
    { rank: 9, team: 'Bournemouth', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/349.png', played: 29, won: 12, drawn: 8, lost: 9, goalsFor: 44, goalsAgainst: 35, goalDiff: 9, points: 44, form: ['W', 'L', 'D', 'W', 'D'], zone: 'normal' },
    { rank: 10, team: 'Fulham', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/370.png', played: 29, won: 12, drawn: 6, lost: 11, goalsFor: 43, goalsAgainst: 40, goalDiff: 3, points: 42, form: ['L', 'W', 'L', 'W', 'W'], zone: 'normal' },
    { rank: 18, team: 'Ipswich Town', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/373.png', played: 29, won: 4, drawn: 8, lost: 17, goalsFor: 29, goalsAgainst: 58, goalDiff: -29, points: 20, form: ['L', 'L', 'D', 'L', 'L'], zone: 'relegation' },
    { rank: 19, team: 'Leicester City', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/375.png', played: 29, won: 4, drawn: 6, lost: 19, goalsFor: 28, goalsAgainst: 63, goalDiff: -35, points: 18, form: ['L', 'L', 'L', 'D', 'L'], zone: 'relegation' },
    { rank: 20, team: 'Southampton', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/376.png', played: 29, won: 2, drawn: 4, lost: 23, goalsFor: 21, goalsAgainst: 69, goalDiff: -48, points: 10, form: ['L', 'L', 'L', 'L', 'L'], zone: 'relegation' },
  ],
  seriea: [
    { rank: 1, team: 'Inter de Milán', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png', played: 28, won: 19, drawn: 5, lost: 4, goalsFor: 64, goalsAgainst: 26, goalDiff: 38, points: 62, form: ['W', 'W', 'W', 'D', 'W'], zone: 'ucl' },
    { rank: 2, team: 'Napoli', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/114.png', played: 28, won: 18, drawn: 7, lost: 3, goalsFor: 46, goalsAgainst: 21, goalDiff: 25, points: 61, form: ['W', 'D', 'W', 'W', 'D'], zone: 'ucl' },
    { rank: 3, team: 'Atalanta', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/125.png', played: 28, won: 18, drawn: 4, lost: 6, goalsFor: 63, goalsAgainst: 30, goalDiff: 33, points: 58, form: ['W', 'W', 'L', 'W', 'W'], zone: 'ucl' },
    { rank: 4, team: 'Juventus', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/111.png', played: 28, won: 14, drawn: 13, lost: 1, goalsFor: 44, goalsAgainst: 19, goalDiff: 25, points: 55, form: ['W', 'W', 'D', 'W', 'D'], zone: 'ucl' },
    { rank: 5, team: 'Lazio', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/112.png', played: 28, won: 16, drawn: 3, lost: 9, goalsFor: 49, goalsAgainst: 37, goalDiff: 12, points: 51, form: ['L', 'W', 'W', 'L', 'W'], zone: 'uel' },
    { rank: 6, team: 'Fiorentina', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/109.png', played: 28, won: 13, drawn: 9, lost: 6, goalsFor: 45, goalsAgainst: 28, goalDiff: 17, points: 48, form: ['W', 'D', 'L', 'W', 'D'], zone: 'uecl' },
    { rank: 7, team: 'AC Milan', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png', played: 28, won: 13, drawn: 7, lost: 8, goalsFor: 45, goalsAgainst: 33, goalDiff: 12, points: 46, form: ['L', 'W', 'D', 'L', 'W'], zone: 'normal' },
    { rank: 18, team: 'Empoli', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/119.png', played: 28, won: 5, drawn: 10, lost: 13, goalsFor: 22, goalsAgainst: 40, goalDiff: -18, points: 25, form: ['L', 'D', 'L', 'L', 'D'], zone: 'relegation' },
    { rank: 19, team: 'Venezia', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png', played: 28, won: 4, drawn: 7, lost: 17, goalsFor: 23, goalsAgainst: 49, goalDiff: -26, points: 19, form: ['D', 'L', 'L', 'L', 'D'], zone: 'relegation' },
    { rank: 20, team: 'Monza', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/1886.png', played: 28, won: 2, drawn: 10, lost: 16, goalsFor: 22, goalsAgainst: 45, goalDiff: -23, points: 16, form: ['L', 'L', 'D', 'L', 'L'], zone: 'relegation' },
  ],
  bundesliga: [
    { rank: 1, team: 'Bayern München', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png', played: 25, won: 19, drawn: 4, lost: 2, goalsFor: 74, goalsAgainst: 22, goalDiff: 52, points: 61, form: ['W', 'W', 'W', 'D', 'W'], zone: 'ucl' },
    { rank: 2, team: 'Bayer Leverkusen', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/131.png', played: 25, won: 16, drawn: 6, lost: 3, goalsFor: 58, goalsAgainst: 31, goalDiff: 27, points: 54, form: ['W', 'W', 'D', 'W', 'L'], zone: 'ucl' },
    { rank: 3, team: 'Eintracht Frankfurt', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/127.png', played: 25, won: 13, drawn: 6, lost: 6, goalsFor: 52, goalsAgainst: 37, goalDiff: 15, points: 45, form: ['W', 'L', 'W', 'D', 'W'], zone: 'ucl' },
    { rank: 4, team: 'RB Leipzig', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/11420.png', played: 25, won: 12, drawn: 6, lost: 7, goalsFor: 40, goalsAgainst: 31, goalDiff: 9, points: 42, form: ['L', 'W', 'D', 'W', 'W'], zone: 'ucl' },
    { rank: 5, team: 'SC Freiburg', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/126.png', played: 25, won: 12, drawn: 4, lost: 9, goalsFor: 35, goalsAgainst: 37, goalDiff: -2, points: 40, form: ['W', 'L', 'W', 'L', 'D'], zone: 'uel' },
    { rank: 6, team: 'Borussia Dortmund', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png', played: 25, won: 11, drawn: 5, lost: 9, goalsFor: 45, goalsAgainst: 39, goalDiff: 6, points: 38, form: ['W', 'L', 'W', 'D', 'L'], zone: 'uecl' },
    { rank: 16, team: 'FC St. Pauli', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/138.png', played: 25, won: 5, drawn: 4, lost: 16, goalsFor: 18, goalsAgainst: 36, goalDiff: -18, points: 19, form: ['L', 'W', 'L', 'L', 'L'], zone: 'relegation' },
    { rank: 17, team: 'Holstein Kiel', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/8051.png', played: 25, won: 4, drawn: 4, lost: 17, goalsFor: 29, goalsAgainst: 58, goalDiff: -29, points: 16, form: ['L', 'L', 'L', 'D', 'L'], zone: 'relegation' },
    { rank: 18, team: 'VfL Bochum', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/121.png', played: 25, won: 2, drawn: 5, lost: 18, goalsFor: 20, goalsAgainst: 59, goalDiff: -39, points: 11, form: ['L', 'L', 'D', 'L', 'L'], zone: 'relegation' },
  ],
  ligue1: [
    { rank: 1, team: 'Paris Saint-Germain', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png', played: 25, won: 20, drawn: 5, lost: 0, goalsFor: 68, goalsAgainst: 23, goalDiff: 45, points: 65, form: ['W', 'W', 'W', 'W', 'W'], zone: 'ucl' },
    { rank: 2, team: 'Olympique de Marseille', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/166.png', played: 25, won: 15, drawn: 4, lost: 6, goalsFor: 51, goalsAgainst: 30, goalDiff: 21, points: 49, form: ['W', 'L', 'W', 'W', 'D'], zone: 'ucl' },
    { rank: 3, team: 'AS Monaco', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/174.png', played: 25, won: 14, drawn: 5, lost: 6, goalsFor: 46, goalsAgainst: 28, goalDiff: 18, points: 47, form: ['W', 'W', 'D', 'L', 'W'], zone: 'ucl' },
    { rank: 4, team: 'Lille OSC', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/167.png', played: 25, won: 13, drawn: 8, lost: 4, goalsFor: 42, goalsAgainst: 25, goalDiff: 17, points: 47, form: ['D', 'W', 'W', 'D', 'W'], zone: 'ucl' },
    { rank: 5, team: 'Olympique Lyonnais', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/165.png', played: 25, won: 13, drawn: 6, lost: 6, goalsFor: 44, goalsAgainst: 31, goalDiff: 13, points: 45, form: ['W', 'D', 'L', 'W', 'W'], zone: 'uel' },
    { rank: 6, team: 'OGC Nice', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/175.png', played: 25, won: 12, drawn: 7, lost: 6, goalsFor: 45, goalsAgainst: 29, goalDiff: 16, points: 43, form: ['D', 'W', 'W', 'D', 'L'], zone: 'uecl' },
    { rank: 16, team: 'Le Havre', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/282.png', played: 25, won: 5, drawn: 2, lost: 18, goalsFor: 19, goalsAgainst: 48, goalDiff: -29, points: 17, form: ['L', 'L', 'L', 'W', 'L'], zone: 'relegation' },
    { rank: 17, team: 'Saint-Étienne', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/177.png', played: 25, won: 5, drawn: 2, lost: 18, goalsFor: 22, goalsAgainst: 55, goalDiff: -33, points: 17, form: ['L', 'L', 'L', 'L', 'W'], zone: 'relegation' },
    { rank: 18, team: 'Montpellier HSC', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/274.png', played: 25, won: 4, drawn: 3, lost: 18, goalsFor: 22, goalsAgainst: 56, goalDiff: -34, points: 15, form: ['L', 'L', 'D', 'L', 'L'], zone: 'relegation' },
  ],
  ucl: [
    { rank: 1, team: 'Liverpool', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png', played: 8, won: 7, drawn: 1, lost: 0, goalsFor: 17, goalsAgainst: 3, goalDiff: 14, points: 22, form: ['W', 'W', 'W', 'W', 'D'], zone: 'ucl' },
    { rank: 2, team: 'FC Barcelona', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 28, goalsAgainst: 13, goalDiff: 15, points: 19, form: ['W', 'W', 'W', 'W', 'W'], zone: 'ucl' },
    { rank: 3, team: 'Arsenal', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 16, goalsAgainst: 3, goalDiff: 13, points: 19, form: ['W', 'W', 'W', 'L', 'W'], zone: 'ucl' },
    { rank: 4, team: 'Inter de Milán', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 12, goalsAgainst: 1, goalDiff: 11, points: 19, form: ['W', 'W', 'W', 'W', 'W'], zone: 'ucl' },
    { rank: 5, team: 'Atlético de Madrid', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png', played: 8, won: 6, drawn: 0, lost: 2, goalsFor: 20, goalsAgainst: 12, goalDiff: 8, points: 18, form: ['W', 'W', 'W', 'W', 'W'], zone: 'ucl' },
    { rank: 6, team: 'Bayer Leverkusen', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/131.png', played: 8, won: 5, drawn: 2, lost: 1, goalsFor: 15, goalsAgainst: 7, goalDiff: 8, points: 17, form: ['W', 'W', 'D', 'W', 'W'], zone: 'ucl' },
    { rank: 7, team: 'Aston Villa', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/362.png', played: 8, won: 5, drawn: 1, lost: 2, goalsFor: 13, goalsAgainst: 4, goalDiff: 9, points: 16, form: ['W', 'L', 'D', 'W', 'W'], zone: 'ucl' },
    { rank: 8, team: 'AS Monaco', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/174.png', played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 14, goalsAgainst: 11, goalDiff: 3, points: 14, form: ['L', 'W', 'L', 'W', 'D'], zone: 'ucl' },
    { rank: 9, team: 'Real Madrid', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png', played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 20, goalsAgainst: 12, goalDiff: 8, points: 15, form: ['W', 'L', 'W', 'W', 'L'], zone: 'uel' },
    { rank: 10, team: 'Bayern München', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png', played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 20, goalsAgainst: 12, goalDiff: 8, points: 15, form: ['W', 'W', 'L', 'W', 'W'], zone: 'uel' },
    { rank: 11, team: 'Borussia Dortmund', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png', played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 19, goalsAgainst: 12, goalDiff: 7, points: 15, form: ['L', 'W', 'L', 'W', 'W'], zone: 'uel' },
    { rank: 12, team: 'Manchester City', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png', played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 18, goalsAgainst: 9, goalDiff: 9, points: 14, form: ['W', 'L', 'D', 'L', 'W'], zone: 'uel' },
  ],
};

export const getLeagueStandings = cache(
  async (leagueId: string): Promise<StandingTeam[]> => {
    const validLeague = leagueId && FALLBACK_STANDINGS_BY_LEAGUE[leagueId] ? leagueId : 'laliga';
    const cacheKey = `standings_${validLeague}`;
    const cached = getCached<StandingTeam[]>(cacheKey);
    if (cached) return cached;

    const espnSlug = ESPN_LEAGUES[validLeague]?.slug || 'esp.1';
    try {
      const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${espnSlug}/standings`, {
        signal: AbortSignal.timeout(4500),
      });
      if (res.ok) {
        const j = await res.json();
        const entries = j.children?.[0]?.standings?.entries || j.standings?.[0]?.entries || j.entries || [];
        if (entries.length > 0) {
          const parsed: StandingTeam[] = entries.map((e: any, idx: number) => {
            const stats = e.stats || [];
            const getStat = (name: string) => {
              const item = stats.find((s: any) => s.name === name || s.type === name);
              return item ? item.value : 0;
            };
            const rank = getStat('rank') || idx + 1;
            const won = getStat('wins');
            const drawn = getStat('ties');
            const lost = getStat('losses');
            const played = getStat('gamesPlayed') || (won + drawn + lost);
            const goalsFor = getStat('pointsFor');
            const goalsAgainst = getStat('pointsAgainst');
            const goalDiff = getStat('pointDifferential') || (goalsFor - goalsAgainst);
            const points = getStat('points') || (won * 3 + drawn);

            let zone: 'ucl' | 'uel' | 'uecl' | 'relegation' | 'normal' = 'normal';
            if (rank <= 4) zone = 'ucl';
            else if (rank <= 6) zone = 'uel';
            else if (rank === 7) zone = 'uecl';
            else if (rank >= entries.length - 2) zone = 'relegation';

            return {
              rank,
              team: e.team?.displayName || e.team?.name || 'Equipo',
              logo: e.team?.logos?.[0]?.href || e.team?.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png`,
              played,
              won,
              drawn,
              lost,
              goalsFor,
              goalsAgainst,
              goalDiff,
              points,
              form: ['W', 'W', 'D', 'L', 'W'],
              zone,
            };
          });
          setCached(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`Error fetching live standings for ${validLeague} from ESPN, using fallback:`, e);
    }

    const fallbackData = FALLBACK_STANDINGS_BY_LEAGUE[validLeague] || FALLBACK_STANDINGS_BY_LEAGUE.laliga;
    setCached(cacheKey, fallbackData);
    return fallbackData;
  }
);
