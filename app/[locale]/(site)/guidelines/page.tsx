import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader, Section, StarDivider } from "@/components/page-parts";

const sections = {
  en: [
    {
      title: "Format & Divisions",
      body: "Liga Natural runs a Premier Division and a Junior Division within its flagship league, alongside standalone tournaments like Copa Piston. Teams are placed in a division at registration; the organizer confirms format details (match length, roster size, substitution rules) for each season before it kicks off.",
    },
    {
      title: "Eligibility & Registration",
      body: "Teams and players register through the Join the League page. Registration is reviewed and confirmed directly by the organizer — you'll hear back with next steps, applicable fees, and start dates.",
    },
    {
      title: "Match Day",
      body: "Teams should arrive ready to play at least 15 minutes before kickoff. The referee assigned to a match has final authority over the result, conduct, and any decisions made during play. Fields, dates, and times are published on the Schedule & Results page and can change — always check there before heading to a match.",
    },
    {
      title: "Standings & Scoring",
      body: "Standings are calculated automatically from submitted results: 3 points for a win, 1 for a draw, 0 for a loss. Ties in the table are broken by goal difference, then goals scored, then alphabetically.",
    },
    {
      title: "Code of Conduct",
      body: "Liga Natural is a family competition. Players, coaches, and spectators are expected to treat referees, opponents, and staff with respect. Serious or repeated misconduct may result in disciplinary action at the organizer's discretion.",
    },
    {
      title: "Weather & Rescheduling",
      body: "Florida weather can force a match to be delayed or moved. Any changes are reflected on the Schedule & Results page as soon as they're confirmed.",
    },
  ],
  es: [
    {
      title: "Formato y Divisiones",
      body: "Liga Natural organiza una Division Premier y una Division Junior dentro de su liga insignia, junto con torneos independientes como Copa Piston. Los equipos se ubican en una division al registrarse; el organizador confirma los detalles del formato (duracion del partido, tamano de plantilla, reglas de sustitucion) de cada temporada antes de que comience.",
    },
    {
      title: "Elegibilidad e Inscripcion",
      body: "Los equipos y jugadores se inscriben a traves de la pagina Unete a la Liga. El organizador revisa y confirma cada inscripcion directamente — recibiras respuesta con los siguientes pasos, costos aplicables y fechas de inicio.",
    },
    {
      title: "Dia de Partido",
      body: "Los equipos deben llegar listos para jugar al menos 15 minutos antes del pitazo inicial. El arbitro asignado a un partido tiene la autoridad final sobre el resultado, la conducta y cualquier decision tomada durante el juego. Las canchas, fechas y horarios se publican en la pagina de Calendario y Resultados y pueden cambiar — siempre verifica ahi antes de ir a un partido.",
    },
    {
      title: "Tabla de Posiciones y Puntuacion",
      body: "La tabla se calcula automaticamente a partir de los resultados enviados: 3 puntos por victoria, 1 por empate, 0 por derrota. Los empates en la tabla se resuelven por diferencia de goles, luego goles anotados, y despues alfabeticamente.",
    },
    {
      title: "Codigo de Conducta",
      body: "Liga Natural es una competencia familiar. Se espera que jugadores, entrenadores y espectadores traten con respeto a los arbitros, rivales y personal. Las faltas graves o repetidas pueden resultar en accion disciplinaria a criterio del organizador.",
    },
    {
      title: "Clima y Reprogramaciones",
      body: "El clima de la Florida puede obligar a retrasar o mover un partido. Cualquier cambio se refleja en la pagina de Calendario y Resultados tan pronto como se confirme.",
    },
  ],
};

export default async function GuidelinesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const items = copyFor(locale);

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.guidelinesPage.heading} subtitle={dict.guidelinesPage.subheading} />
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl space-y-8">
          {items.map((s, i) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-gold-light">{s.title}</h2>
              <p className="mt-2 text-base leading-relaxed text-cream/85">{s.body}</p>
              {i < items.length - 1 && <StarDivider />}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function copyFor(locale: Locale) {
  return sections[locale];
}
