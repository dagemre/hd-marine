import { getTranslations } from "next-intl/server";

/* ---------- İkonlar (stroke, currentColor) ---------- */

function PinIcon() {
  return (
    <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 21s6.5-5.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7.8 4.5c.5 0 1 .3 1.2.8l1.1 2.4c.2.5.1 1.1-.3 1.5l-1 1a12.6 12.6 0 0 0 5 5l1-1c.4-.4 1-.5 1.5-.3l2.4 1.1c.5.2.8.7.8 1.2v2.1c0 .9-.7 1.6-1.6 1.5C10.6 19.1 4.9 13.4 4.3 6.1c-.1-.9.6-1.6 1.5-1.6h2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Kart ---------- */

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-lg shadow-deep-navy/5 sm:p-6">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-deep-navy sm:text-base">{title}</h3>
        <div className="mt-1.5 text-sm leading-relaxed text-ink-600">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Hero altına taşan 4 iletişim bilgisi kartı (Context/İletişim.png):
 * adres / telefon / e-posta / çalışma saatleri.
 * Değerler footer sözlüğünden okunur (tek kaynak).
 */
export async function ContactInfoCards() {
  const t = await getTranslations("contact");
  const tFooter = await getTranslations("footer");

  const phone = tFooter("phone");
  const email = tFooter("email");

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <InfoCard icon={<PinIcon />} title={t("cardAddressTitle")}>
        <p>{tFooter("trAddress")}</p>
      </InfoCard>

      <InfoCard icon={<PhoneIcon />} title={t("cardPhoneTitle")}>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="transition-colors hover:text-primary"
        >
          {phone}
        </a>
      </InfoCard>

      <InfoCard icon={<MailIcon />} title={t("cardEmailTitle")}>
        <a
          href={`mailto:${email}`}
          className="break-all transition-colors hover:text-primary"
        >
          {email}
        </a>
      </InfoCard>

      <InfoCard icon={<ClockIcon />} title={t("cardHoursTitle")}>
        <p>{tFooter("workingHours")}</p>
      </InfoCard>
    </div>
  );
}
