import React from 'react';
import { Lock, ShieldCheck, Database, EyeOff, Globe, FileText } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad | SportPredict AI',
  description: 'Política de privacidad y compromiso de arquitectura stateless sin recopilación ni almacenamiento de datos personales.',
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 pb-16">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>CUMPLIMIENTO ESTRICTO RGPD / GDPR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Política de Privacidad & Arquitectura Stateless
        </h1>
        <p className="text-xs text-slate-400">
          Última actualización: Septiembre de 2026 • Versión 1.0 (Sin Almacenamiento Persistente)
        </p>
      </div>

      {/* Main Legal Content */}
      <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-normal">
        {/* Section 1: Stateless Commitment */}
        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>1. Declaración de Arquitectura Stateless (Sin Base de Datos)</span>
          </h2>
          <p>
            En <strong>SportPredict AI</strong> respetamos rigurosamente su derecho fundamental a la privacidad. Esta plataforma ha sido concebida, diseñada y desplegada bajo un modelo <strong>100% Stateless</strong> (sin estado de usuario). Esto significa que:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>
              <strong>No disponemos de bases de datos propias</strong> (como PostgreSQL, MySQL, MongoDB, Firebase o equivalentes) que almacenen información personal, perfiles, hábitos de navegación o identidades de los visitantes.
            </li>
            <li>
              <strong>No se requiere registro de usuario</strong>, creación de cuentas, contraseñas ni suministro de nombres o direcciones de correo electrónico para acceder al contenido estadístico o a los pronósticos asistidos por IA.
            </li>
            <li>
              Las solicitudes procesadas a través de nuestros endpoints se limitan a consultar métricas deportivas públicas y modelos estadísticos en memoria volátil sin persistencia de registros de usuario.
            </li>
          </ul>
        </section>

        {/* Section 2: Data We Do NOT Collect */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-slate-400" />
            <span>2. Datos que NO Recopilamos</span>
          </h2>
          <p>
            A diferencia de plataformas convencionales de apuestas o portales de suscripción, SportPredict AI <strong>NO recopila ni trata</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              ❌ Nombres, apellidos o identificadores fiscales.
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              ❌ Números de teléfono o correos electrónicos.
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              ❌ Datos bancarios, tarjetas de crédito o pasarelas de pago.
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              ❌ Direcciones postales ni geolocalización precisa por GPS.
            </div>
          </div>
        </section>

        {/* Section 3: Third-Party Advertising & Google AdSense */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-slate-400" />
            <span>3. Publicidad y Cookies de Terceros (Google AdSense)</span>
          </h2>
          <p>
            Para garantizar el acceso libre y gratuito a nuestras herramientas cuantitativas sin suscripciones de pago, SportPredict AI muestra anuncios publicitarios gestionados por <strong>Google AdSense</strong>.
          </p>
          <p className="text-xs text-slate-400">
            Google, como proveedor asociado externo, utiliza cookies para publicar anuncios en nuestro sitio web basándose en las visitas anteriores que el usuario haya realizado a este u otros sitios web.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>
              El uso de cookies de publicidad por parte de Google le permite a este y a sus socios mostrar anuncios a los usuarios según sus visitas a este sitio web y a otros sitios de Internet.
            </li>
            <li>
              Los usuarios pueden inhabilitar la publicidad personalizada a través de la{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline"
              >
                Configuración de Anuncios de Google
              </a>
              . Alternativamente, los usuarios pueden optar por no participar en el uso de cookies de terceros para publicidad personalizada visitando{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline"
              >
                www.aboutads.info
              </a>
              .
            </li>
          </ul>
        </section>

        {/* Section 4: External API Services */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            <span>4. APIs Externas y Revalidación en Servidor (ISR)</span>
          </h2>
          <p>
            Nuestros servidores consumen información deportiva pública provista por entidades proveedoras de datos de fútbol y ejecutan análisis mediante modelos de lenguaje (como Google Gemini). Estas llamadas se efectúan de forma centralizada y segura de servidor a servidor (Server-Side), sin transferir ningún dato identificativo del usuario a dichos proveedores.
          </p>
          <p>
            Implementamos mecanismos de caché incremental por tiempo (ISR a 300 segundos) para optimizar la velocidad de carga y minimizar el impacto energético y computacional.
          </p>
        </section>

        {/* Section 5: Exercise of RGPD Rights */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" />
            <span>5. Derechos del Interesado (RGPD)</span>
          </h2>
          <p>
            En virtud del Reglamento General de Protección de Datos (RGPD UE 2016/679), los usuarios gozan de los derechos de acceso, rectificación, supresión, limitación y oposición. Dado que SportPredict AI no recaba, almacena ni asocia datos personales a ningún identificador individual, no existe ningún registro que asociar a un visitante concreto.
          </p>
          <p>
            Para consultas de orden técnico relativas a esta política, puede comunicarse mediante nuestros canales oficiales en{' '}
            <code className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded font-mono">
              privacidad@sportpredict-ai.com
            </code>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
