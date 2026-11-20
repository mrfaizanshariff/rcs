import ScrollReveal from "@/components/ui/ScrollReveal";

export const DETAIL_LIST_SECTIONS = [
  "included",
  "deliverables",
  "tools",
  "response_targets",
  "reporting",
  "compliance",
] as const;

export type DetailListSection = (typeof DETAIL_LIST_SECTIONS)[number];

/**
 * Optional, approved content for a service page. Every field is optional:
 * a section renders only when it has content, so nothing is shown as a
 * placeholder. Content lives at `catalog.<service_key>.detail` in messages.
 */
export type ServiceDetailContent = Partial<Record<DetailListSection, string[]>> & {
  /** Intro paragraphs shown above the list sections. */
  body?: string[];
  /** One attributed track-record line from leadership-led programmes. */
  proof?: string;
  faq?: { q: string; a: string }[];
};

interface ServiceDetailsProps {
  detail: ServiceDetailContent;
  headings: Record<DetailListSection | "faq" | "proof", string>;
  proofNote: string;
}

export default function ServiceDetails({ detail, headings, proofNote }: ServiceDetailsProps) {
  const lists = DETAIL_LIST_SECTIONS.filter((key) => detail[key]?.length);
  const faq = detail.faq?.length ? detail.faq : undefined;
  const body = detail.body?.length ? detail.body : undefined;
  const proof = detail.proof || undefined;
  if (!lists.length && !faq && !body && !proof) return null;

  return (
    <section
      id="service-details"
      className="w-full max-w-[1360px] mx-auto px-6 md:px-6 py-6 lg:py-8"
    >
      {body && (
        <ScrollReveal className="mb-8 mx-auto text-center max-w-3xl space-y-4">
          {body.map((paragraph) => (
            <p key={paragraph} className="text-base text-text-secondary leading-relaxed">
              {paragraph}
            </p>
          ))}
        </ScrollReveal>
      )}

      {proof && (
        <ScrollReveal className="mb-8 flex flex-col items-center text-center">
          <div className="rcs-card rounded-xl p-6 max-w-3xl">
            <h2 className="font-display font-bold text-base text-text-primary mb-2">{headings.proof}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{proof}</p>
            <p className="text-xs text-text-muted mt-3">{proofNote}</p>
          </div>
        </ScrollReveal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lists.map((key) => (
          <ScrollReveal key={key}>
            <div className="rcs-card rounded-xl p-6 h-full">
              <h2 className="font-display font-bold text-base text-text-primary mb-4">{headings[key]}</h2>
              <ul className="space-y-2">
                {detail[key]!.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-link shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {faq && (
        <ScrollReveal className="mt-10">
          <h2 className="font-display font-bold text-xl text-text-primary mb-5">{headings.faq}</h2>
          <div className="flex flex-col gap-3">
            {faq.map(({ q, a }) => (
              <details key={q} className="rcs-card rounded-xl p-5 group">
                <summary className="cursor-pointer font-semibold text-sm text-text-primary">{q}</summary>
                <p className="text-sm text-text-secondary leading-relaxed mt-3">{a}</p>
              </details>
            ))}
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
