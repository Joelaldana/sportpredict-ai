import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDailyMatches, getMatchById, getHeadToHead, getLineups, getLeagueStandings } from './lib/sports-api';
import { generateMatchPrediction } from './lib/ai-service';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Seguridad HTTP y límites básicos sin introducir un servicio de estado externo.
  app.disable('x-powered-by');
  // Render sits behind one reverse proxy. This makes req.ip reflect the client IP.
  app.set('trust proxy', 1);
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (isProduction) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });
  app.use(express.json({ limit: '100kb' }));

  type RateBucket = { count: number; resetAt: number };
  const rateBuckets = new Map<string, RateBucket>();

  const createRateLimiter = (windowMs: number, maxRequests: number) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const now = Date.now();
      const key = `${req.ip}:${req.path}`;
      const current = rateBuckets.get(key);
      const bucket = !current || current.resetAt <= now
        ? { count: 0, resetAt: now + windowMs }
        : current;

      bucket.count += 1;
      rateBuckets.set(key, bucket);

      if (bucket.count > maxRequests) {
        return res.status(429).json({ error: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.' });
      }

      next();
    };
  };

  app.use('/api/sports', createRateLimiter(60_000, 120));
  app.use('/api/ai-predict', createRateLimiter(15 * 60_000, 20));

  // Evita que el mapa de límites crezca indefinidamente en procesos de larga duración.
  const cleanupRateBuckets = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(key);
    }
  }, 10 * 60_000);
  cleanupRateBuckets.unref();

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SportPredict AI Stateless Engine',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Google AdSense ads.txt. It is emitted only after a real publisher ID is configured.
  app.get('/ads.txt', (_req, res) => {
    const publisherId = process.env.VITE_ADSENSE_CLIENT_ID?.trim();
    if (!publisherId || !/^ca-pub-\d+$/.test(publisherId)) {
      return res.status(404).type('text/plain').send('Not configured');
    }

    return res
      .type('text/plain')
      .send(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`);
  });

  // Sports endpoint
  app.get('/api/sports', async (req, res) => {
    try {
      const matchId = req.query.matchId as string | undefined;
      const league = req.query.league as string | undefined;
      const type = req.query.type as string | undefined;

      if (matchId) {
        const match = await getMatchById(matchId);
        if (!match) {
          return res.status(404).json({ error: 'Partido no encontrado' });
        }

        if (type === 'h2h') {
          const h2h = await getHeadToHead(match.homeTeam.id, match.awayTeam.id);
          res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
          return res.json({ match, h2h });
        }

        if (type === 'lineups') {
          const lineups = await getLineups(matchId);
          res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
          return res.json({ match, lineups });
        }

        const [h2h, lineups] = await Promise.all([
          getHeadToHead(match.homeTeam.id, match.awayTeam.id),
          getLineups(matchId),
        ]);

        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
        return res.json({ match, h2h, lineups });
      }

      if (type === 'standings') {
        const targetLeague = (!league || league === 'all') ? 'laliga' : league;
        const standings = await getLeagueStandings(targetLeague);
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
        return res.json({ standings, league: targetLeague });
      }

      const matches = await getDailyMatches(league);
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
      return res.json({ matches });
    } catch (error) {
      console.error('Error en /api/sports:', error);
      return res.status(500).json({ error: 'Error procesando estadísticas' });
    }
  });

  // AI Prediction endpoint
  app.post('/api/ai-predict', async (req, res) => {
    try {
      const { matchId, matchData } = req.body || {};

      if (typeof matchId !== 'string' || matchId.length === 0 || matchId.length > 100) {
        return res.status(400).json({ error: 'matchId inválido' });
      }

      // El servidor usa los datos oficiales asociados al ID. El matchData enviado
      // por el navegador no se considera una fuente confiable para la predicción.
      const targetMatch = await getMatchById(matchId);

      if (!targetMatch) {
        return res.status(404).json({ error: 'Partido no encontrado' });
      }

      const [h2h, lineups] = await Promise.all([
        getHeadToHead(targetMatch.homeTeam.id, targetMatch.awayTeam.id),
        getLineups(targetMatch.id),
      ]);
      const prediction = await generateMatchPrediction(targetMatch, h2h, lineups);

      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
      return res.json({
        success: true,
        matchId: targetMatch.id,
        prediction,
      });
    } catch (error) {
      console.error('Error en /api/ai-predict:', error);
      return res.status(500).json({ error: 'Error generando predicción con IA' });
    }
  });

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SportPredict AI server running on http://localhost:${PORT}`);
    if (!isProduction) {
      console.log(`Development mode: http://localhost:${PORT}`);
    }
  });
}

startServer();
