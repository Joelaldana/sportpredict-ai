'use client';

import React from 'react';
import { ShieldAlert, BrainCircuit, HeartHandshake, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      {/* Responsible Gaming Notice Header */}
      <div className="bg-slate-950 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/30">
              +18
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-400">Juego Responsable:</strong> Las apuestas deportivas conllevan un alto riesgo de pérdida patrimonial y adicción. Juega únicamente con dinero que puedas permitirte perder. Si experimentas problemas con el juego, solicita ayuda profesional.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 text-xs">
            <a 
              href="https://www.juegabien.es" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-emerald-400 underline underline-offset-2"
            >
              JuegaBien.es
            </a>
            <span className="text-slate-700">•</span>
            <a 
              href="https://www.begambleaware.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-emerald-400 underline underline-offset-2"
            >
              BeGambleAware.org
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Stateless Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                SportPredict <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Plataforma analítica e imparcial de métricas deportivas de alto rendimiento. Diseñada con una arquitectura 100% Stateless (libre de bases de datos persistentes), garantizando privacidad absoluta conforme al RGPD europeo y máxima velocidad de respuesta.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-emerald-400 font-semibold">
              <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Sin Cookies Rastreadoras
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Cero Almacenamiento de Datos
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Revalidación ISR 300s
              </span>
            </div>
          </div>

          {/* Col 2: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Aviso Legal & Privacidad</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/privacidad"
                  onClick={(e) => handleLinkClick(e, '/privacidad')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Política de Privacidad</span>
                </a>
              </li>
              <li>
                <a
                  href="/terminos"
                  onClick={(e) => handleLinkClick(e, '/terminos')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Términos y Descargo de Responsabilidad</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Sólo Mayores de 18 Años</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Competiciones & Cobertura */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Competiciones Analizadas</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-emerald-400 transition-colors">
                  UEFA Champions League
                </a>
              </li>
              <li>
                <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-emerald-400 transition-colors">
                  LaLiga EA Sports
                </a>
              </li>
              <li>
                <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-emerald-400 transition-colors">
                  Premier League Inglesa
                </a>
              </li>
              <li>
                <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-emerald-400 transition-colors">
                  Serie A & Bundesliga
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bottom Line */}
        <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} SportPredict AI. Todos los derechos reservados. Los pronósticos estadísticos emitidos por los algoritmos de IA son de carácter estrictamente informativo y no constituyen asesoramiento financiero ni garantía de resultado.
          </p>
          <div className="flex items-center gap-2 text-slate-400 font-semibold">
            <span>RGPD Compliant</span>
            <span>•</span>
            <span>Google AdSense Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
