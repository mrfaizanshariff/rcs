"use server";

import { enquirySchema, sendEnquiryEmail } from "@/lib/contact-submission";

export type ContactState = {
  success?: boolean;
  /** Machine-readable code; the client maps it to a translated message. */
  error?: "invalid" | "failed";
} | null;

const str = (formData: FormData, key: string) => {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
};

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = enquirySchema.safeParse({
    name: str(formData, "name"),
    email: str(formData, "email"),
    company: str(formData, "company"),
    phone: str(formData, "phone"),
    country: str(formData, "country"),
    timeline: str(formData, "timeline"),
    services: formData.getAll("services").filter((v): v is string => typeof v === "string"),
    details: str(formData, "details"),
    source: str(formData, "source"),
  });
  if (!parsed.success) return { error: "invalid" };

  try {
    await sendEnquiryEmail(parsed.data);
  } catch (err) {
    console.error("Contact email failed:", err instanceof Error ? err.message : "unknown error");
    return { error: "failed" };
  }

  return { success: true };
}
