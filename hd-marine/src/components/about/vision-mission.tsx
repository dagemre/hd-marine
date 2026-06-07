import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

/** Vizyonumuz / Misyonumuz — açık zeminde iki beyaz kart. */
export async function VisionMission() {
  const t = await getTranslations("about");

  const cards = [
    {
      title: t("visionTitle"),
      text: t("visionText"),
      // Hedef (vizyon)
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: t("missionTitle"),
      text: t("missionText"),
      // Eller + kalp (misyon / değerler)
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 8.6c.9-1.8 3.4-1.9 4.3-.3.6 1.1.3 2.3-.7 3.3L12 14.8l-3.6-3.2c-1-1-1.3-2.2-.7-3.3.9-1.6 3.4-1.5 4.3.3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M3 16.5c1.6 2.7 4.9 4.5 9 4.5s7.4-1.8 9-4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-surface py-16 lg:py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white p-7 shadow-card lg:p-9"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                {card.icon}
              </span>
              <h2 className="mt-5 text-xl font-bold text-navy">{card.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-600">{card.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
