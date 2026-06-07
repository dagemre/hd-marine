import { getTranslations } from "next-intl/server";

/* ---------- İkonlar (stroke, currentColor) ---------- */

function ClockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.5 5.9a3 3 0 1 1 1.3 5.8M16.8 14.6c2 .5 3.3 1.9 3.7 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m9 11.8 2.1 2.2L15 9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 4h7l9 9-7 7-9-9V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4.5 13v-2a7.5 7.5 0 0 1 15 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.5" y="12.5" width="4" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16.5" y="12.5" width="4" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18.5 18.5c0 1.8-1.6 2.8-4 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7.8 4.5c.5 0 1 .3 1.2.8l1.1 2.4c.2.5.1 1.1-.3 1.5l-1 1a12.6 12.6 0 0 0 5 5l1-1c.4-.4 1-.5 1.5-.3l2.4 1.1c.5.2.8.7.8 1.2v2.1c0 .9-.7 1.6-1.6 1.5C10.6 19.1 4.9 13.4 4.3 6.1c-.1-.9.6-1.6 1.5-1.6h2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 21s6.5-5.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- Bileşenler ---------- */

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
      <h2 className="border-b border-brand-100 bg-brand-50 px-6 py-4 text-base font-bold text-deep-navy">
        {title}
      </h2>
      <div className="px-6 py-2">{children}</div>
    </div>
  );
}

/**
 * Teklif Alın sol sütunu: "Neden HD Marine?" (5 madde) +
 * "İletişim Bilgilerimiz" kartları. İletişim değerleri footer
 * sözlüğünden okunur (tek kaynak).
 */
export async function QuoteSidebar() {
  const t = await getTranslations("quote");
  const tFooter = await getTranslations("footer");

  const reasons = [
    { icon: <ClockIcon />, no: 1 },
    { icon: <TeamIcon />, no: 2 },
    { icon: <ShieldCheckIcon />, no: 3 },
    { icon: <TagIcon />, no: 4 },
    { icon: <HeadsetIcon />, no: 5 },
  ] as const;

  const contact: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
  }[] = [
    {
      icon: <PhoneIcon />,
      label: t("contactPhone"),
      value: tFooter("phone"),
      href: `tel:${tFooter("phone").replace(/\s/g, "")}`,
    },
    {
      icon: <MailIcon />,
      label: t("contactEmail"),
      value: tFooter("email"),
      href: `mailto:${tFooter("email")}`,
    },
    {
      icon: <ClockIcon />,
      label: t("contactHours"),
      value: tFooter("workingHours"),
    },
    {
      icon: <PinIcon />,
      label: t("contactAddress"),
      value: tFooter("trAddress"),
    },
  ];

  return (
    <aside className="space-y-6">
      <SidebarCard title={t("whyTitle")}>
        <ul className="divide-y divide-brand-100/70">
          {reasons.map(({ icon, no }) => (
            <li key={no} className="flex items-start gap-3.5 py-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50/60 text-primary">
                {icon}
              </span>
              <div>
                <h3 className="text-sm font-bold text-ink-900">
                  {t(`why${no}Title`)}
                </h3>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-600">
                  {t(`why${no}Desc`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SidebarCard>

      <SidebarCard title={t("contactTitle")}>
        <ul className="divide-y divide-brand-100/70">
          {contact.map((item) => (
            <li key={item.label} className="flex items-start gap-3.5 py-4">
              <span className="mt-0.5 shrink-0 text-primary">{item.icon}</span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-ink-900">{item.label}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-0.5 block break-words text-[0.8125rem] leading-relaxed text-ink-600 transition-colors hover:text-primary"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-600">
                    {item.value}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </SidebarCard>
    </aside>
  );
}
