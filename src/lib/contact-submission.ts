import { Resend } from "resend";
import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);

/** Server-side validation for both site enquiry forms. */
export const enquirySchema = z.object({
  name: text(120).min(1),
  email: text(200).email(),
  company: text(160).optional().default(""),
  phone: text(40).optional().default(""),
  country: text(60).optional().default(""),
  timeline: text(80).optional().default(""),
  services: z.array(text(120)).max(10).default([]),
  details: text(4000).optional().default(""),
  source: z.enum(["contact-page", "home-cta"]),
});

export type Enquiry = z.infer<typeof enquirySchema>;

/** Strip CR/LF so user input can never inject mail headers. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

export async function sendEnquiryEmail(enquiry: Enquiry): Promise<void> {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;

  if (!RESEND_API_KEY) {
    throw new Error("Contact email is not configured (RESEND_API_KEY missing).");
  }

  const resend = new Resend(RESEND_API_KEY);

  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Organisation", enquiry.company],
    ["Phone", enquiry.phone],
    ["Country", enquiry.country],
    ["Timeline", enquiry.timeline],
    ["Areas of interest", enquiry.services.join(", ")],
    ["Source", enquiry.source],
  ];
  const body =
    rows
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") + (enquiry.details ? `\n\nDetails:\n${enquiry.details}` : "");

  const { error } = await resend.emails.send({
    from: CONTACT_FROM_EMAIL || "RCS Arabia Website <notifications@rcsarabia.sa>",
    to: CONTACT_TO_EMAIL || "info@rcsarabia.sa",
    replyTo: enquiry.email,
    subject: oneLine(`Website enquiry from ${enquiry.name}`),
    text: body,
  });

  if (error) {
    throw new Error(`Resend email delivery failed: ${error.message}`);
  }
}
