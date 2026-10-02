'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  BrainCircuit, 
  Flame, 
  ShieldCheck, 
  Menu, 
  X, 
  TrendingUp, 
  Sparkles,
  ListOrdered
} from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export default function Navbar({ currentPath = '/', onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Partidos de Hoy', href: '/', icon: Trophy },
    { label: 'Tablas', href: '/tablas', icon: ListOrdered },
    { label: 'Pronósticos IA', href: '/pronosticos', icon: BrainCircuit, badge: 'PRO' },
    { label: 'En Vivo', href: '/#envivo', icon: Flame, pulse: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <a 
              href="/" 
              onClick={(e) => handleLinkClick(e, '/')}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  SportPredict <span className="text-emerald-500 font-black">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  Estadísticas & Análisis Cuantitativo
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.pulse ? 'text-rose-500 animate-pulse' : ''}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-white tracking-wide">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right utility actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Responsible Gaming Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px]">
                +18
              </span>
              <span>Juego Responsable</span>
            </div>

            <a
              href="/pronosticos"
              onClick={(e) => handleLinkClick(e, '/pronosticos')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 text-xs font-bold transition-all shadow-sm shadow-slate-900/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 dark:text-white" />
              <span>Ver Picks del Día</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              +18
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.pulse ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <a
              href="/pronosticos"
              onClick={(e) => handleLinkClick(e, '/pronosticos')}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Explorar Todos los Pronósticos
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
