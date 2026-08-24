"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/db";
import { assertAdminAllowed } from "@/src/server/admin/access";

// ---------------------------------------------------------------------------
// Public — contact form submission (NO admin gate)
// ---------------------------------------------------------------------------

const COUNTRY_CODES = ["EG", "SA", "AE", "KW", "QA", "BH", "OM", "JO"];

const submitContactSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  countryCode: z.string().refine((c) => COUNTRY_CODES.includes(c), "Invalid country"),
  dialCode: z.string().regex(/^\+\d{1,4}$/, "Invalid dial code"),
  phone: z.string().regex(/^\d{7,12}$/, "Invalid phone number"),
  email: z.string().email().max(200).optional().or(z.literal("")),
  businessType: z.string().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
  sourcePage: z.string().max(120).optional().or(z.literal("")),
});

export type ContactSubmitInput = z.infer<typeof submitContactSchema>;

export async function submitContact(input: unknown) {
  const parsed = submitContactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }
  const d = parsed.data;

  await prisma.contactSubmission.create({
    data: {
      fullName: d.fullName,
      countryCode: d.countryCode,
      dialCode: d.dialCode,
      phone: d.phone,
      email: d.email || null,
      businessType: d.businessType || null,
      message: d.message,
      status: "NEW",
      sourcePage: d.sourcePage || null,
    },
  });
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Admin inbox
// ---------------------------------------------------------------------------

export async function setSubmissionStatus(id: number, status: string) {
  await assertAdminAllowed();
  if (!["NEW", "CONTACTED", "QUALIFIED", "CLOSED"].includes(status)) {
    return { ok: false as const, error: "Invalid status" };
  }
  await prisma.contactSubmission.update({ where: { id }, data: { status } });
  revalidatePath("/admin/contact");
  return { ok: true as const };
}

export async function deleteSubmission(id: number) {
  await assertAdminAllowed();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/contact");
  return { ok: true as const };
}
