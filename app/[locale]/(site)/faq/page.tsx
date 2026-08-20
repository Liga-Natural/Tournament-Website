import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader, Section } from "@/components/page-parts";

const faqs = {
  en: [
    {
      q: "How do I register a team or a player?",
      a: "Head to the Join the League page and fill out the registration form. The organizer reviews every submission personally and follows up with next steps, fees, and start dates.",
    },
    {
      q: "What divisions does Liga Natural have?",
      a: "The flagship league runs a Premier Division and a Junior Division. Copa Piston is a separate 7-a-side tournament with its own format, still being finalized.",
    },
    {
      q: "Where are matches played?",
      a: "Venue changes from edition to edition. The two most recent Liga Natural seasons were played at Doral Legacy Park — check each event's page or the Schedule & Results page for the current venue and field.",
    },
    {
      q: "How does the standings table work?",
      a: "Teams earn 3 points for a win, 1 for a draw, and 0 for a loss. The table is sorted by points, then goal difference, then goals scored, then alphabetically — and it updates automatically the moment a referee submits a result.",
    },
    {
      q: "How do I become a referee?",
      a: "Apply through the Join the League page and select \"Apply to Referee.\" Once approved, the organizer issues you a personal access code to sign in and manage your assigned matches.",
    },
    {
      q: "I'm a referee — how do I submit a result?",
      a: "Sign in with your access code, open your match from the \"My Matches\" list, and enter the final score using the on-screen steppers. No typing required.",
    },
    {
      q: "How can my business sponsor Liga Natural?",
      a: "Visit the Partner With Us page for what's included and to send an enquiry — sponsorship for the upcoming season is open.",
    },
  ],
  es: [
    {
      q: "¿Cómo registro un equipo o un jugador?",
      a: "Ve a la página Únete a la Liga y completa el formulario de inscripción. El organizador revisa cada solicitud personalmente y te contacta con los siguientes pasos, costos y fechas de inicio.",
    },
    {
      q: "¿Qué divisiones tiene Liga Natural?",
      a: "La liga insignia tiene una Division Premier y una Division Junior. Copa Piston es un torneo independiente de 7 contra 7 con formato propio, aún en definición.",
    },
    {
      q: "¿Dónde se juegan los partidos?",
      a: "La sede cambia de edición en edición. Las dos temporadas más recientes de Liga Natural se jugaron en Doral Legacy Park — consulta la página de cada evento o el Calendario y Resultados para la sede y cancha actual.",
    },
    {
      q: "¿Cómo funciona la tabla de posiciones?",
      a: "Los equipos ganan 3 puntos por victoria, 1 por empate y 0 por derrota. La tabla se ordena por puntos, luego diferencia de gol, luego goles anotados, y después alfabéticamente — y se actualiza automáticamente en el momento en que un árbitro envía un resultado.",
    },
    {
      q: "¿Cómo puedo ser árbitro?",
      a: "Postúlate a través de la página Únete a la Liga y selecciona \"Postularme como Árbitro\". Una vez aprobado, el organizador te entrega un código de acceso personal para iniciar sesión y gestionar tus partidos asignados.",
    },
    {
      q: "Soy árbitro — ¿cómo envío un resultado?",
      a: "Inicia sesión con tu código de acceso, abre tu partido desde la lista \"Mis Partidos\" e ingresa el marcador final usando los controles en pantalla. No necesitas escribir números.",
    },
    {
      q: "¿Cómo puede mi negocio patrocinar Liga Natural?",
      a: "Visita la página Sé Patrocinador para ver qué incluye y enviar una consulta — el patrocinio para la próxima temporada está abierto.",
    },
  ],
};

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const items = faqs[locale];

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.faqPage.heading} subtitle={dict.faqPage.subheading} />
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl divide-y divide-gold/15 rounded-lg border border-gold/20">
          {items.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="cursor-pointer list-none font-display text-lg font-bold text-cream marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="shrink-0 text-gold transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-base leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
