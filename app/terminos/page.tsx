import React from 'react';
import { ShieldAlert, AlertTriangle, Scale, HeartHandshake, CheckCircle, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Términos de Servicio y Descargo de Responsabilidad | SportPredict AI',
  description: 'Términos de uso legal, descargo de responsabilidad sobre pronósticos y aviso de juego responsable +18.',
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 pb-16">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>AVISO LEGAL OBLIGATORIO • SÓLO MAYORES DE 18 AÑOS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Términos de Servicio & Descargo de Responsabilidad (Disclaimer)
        </h1>
        <p className="text-xs text-slate-400">
          Última actualización: Septiembre de 2026 • Documento de obligado conocimiento antes de utilizar la plataforma.
        </p>
      </div>

      {/* Main Legal Content */}
      <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-normal">
        {/* Important Warning Banner */}
        <section className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-black text-base">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Descargo de Responsabilidad Fundamental (Disclaimer de Apuestas)</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            <strong>SportPredict AI no es una casa de apuestas ni un operador de juego.</strong> No aceptamos dinero, no procesamos apuestas ni actuamos como intermediarios financieros. Todo el contenido, métricas, proyecciones probabilísticas y análisis tácticos generados por nuestros algoritmos de Inteligencia Artificial tienen un fin <strong>exclusivamente informativo, estadístico y de entretenimiento deportivo</strong>.
          </p>
        </section>

        {/* Section 1: Nature of AI Predictions */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-slate-400" />
            <span>1. Naturaleza de los Pronósticos y Ausencia de Garantía</span>
          </h2>
          <p>
            Los modelos predictivos procesan datos empíricos de dominio público (goles a favor/en contra, histórico H2H, xG y forma reciente). Los resultados de cualquier evento deportivo están sujetos a variables impredecibles (condiciones meteorológicas, decisiones arbitrales, lesiones durante el encuentro, factores psicológicos, etc.).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>
              <strong>Cero Garantía de Éxito:</strong> Ninguna estimación porcentual (por ejemplo: "Probabilidad 65%") constituye una certeza de victoria.
            </li>
            <li>
              <strong>No Asesoramiento Financiero:</strong> La información contenida en esta plataforma jamás debe interpretarse como asesoramiento de inversión o estímulo al endeudamiento.
            </li>
            <li>
              <strong>Exención Total de Responsabilidad:</strong> SportPredict AI, sus desarrolladores y proveedores de datos quedan expresamente exonerados de cualquier pérdida económica, patrimonial o moral derivada de las decisiones individuales del usuario en casas de apuestas u operadores terceros.
            </li>
          </ul>
        </section>

        {/* Section 2: +18 & Responsible Gaming */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
            <span>2. Requisito de Mayoría de Edad (+18) y Juego Responsable</span>
          </h2>
          <p>
            El acceso a esta plataforma está estrictamente restringido a personas mayores de 18 años (o la edad mínima legal para apostar en su jurisdicción de residencia).
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <p className="font-bold text-white">Directrices de Juego Seguro:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>Apueste únicamente cantidades que pueda permitirse perder sin comprometer sus finanzas familiares.</li>
              <li>Nunca intente recuperar pérdidas inmediatas apostando sumas mayores por impulso.</li>
              <li>No apueste bajo los efectos de sustancias psicoactivas o en estados de estrés emocional agudo.</li>
            </ul>
          </div>
          <p className="text-xs text-slate-400">
            Si considera que el juego está interfiriendo negativamente en su vida o en la de sus allegados, contacte con las siguientes entidades de asistencia gratuitas y confidenciales:
          </p>
          <div className="flex flex-wrap gap-3 text-xs pt-1">
            <a
              href="https://www.juegabien.es"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold transition-colors"
            >
              JuegaBien.es (DGOJ España)
            </a>
            <a
              href="https://www.fejar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold transition-colors"
            >
              FEJAR (Federación Española de Jugadores Rehabilitados)
            </a>
            <a
              href="https://www.begambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold transition-colors"
            >
              BeGambleAware.org (Internacional)
            </a>
          </div>
        </section>

        {/* Section 3: Intellectual Property & Fair Use */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-400" />
            <span>3. Propiedad Intelectual y Uso Descriptivo de Marcas</span>
          </h2>
          <p>
            Los logotipos, nombres de equipos, competiciones y ligas exhibidos en esta plataforma son marcas registradas de sus respectivos titulares federativos y clubes deportivos. Su mención e imagen se realizan con fines estrictamente descriptivos, informativos y de identificación en virtud del principio de "uso legítimo" (Fair Use).
          </p>
        </section>

        {/* Section 4: Advertising Disclosure */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <span>4. Divulgación de Afiliación y Publicidad</span>
          </h2>
          <p>
            SportPredict AI puede percibir remuneraciones por colocación de anuncios publicitarios (vía Google AdSense) o a través de enlaces de afiliación comercial con operadores de juego con licencia oficial en las jurisdicciones autorizadas. Dicha relación comercial no condiciona en ningún momento la objetividad de los algoritmos matemáticos e imparciales de predicción.
          </p>
        </section>
      </div>
    </div>
  );
}
