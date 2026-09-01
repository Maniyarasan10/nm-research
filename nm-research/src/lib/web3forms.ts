"use client";

import { WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from "./config";

export interface FormResult {
  success: boolean;
  message: string;
}

export async function submitWeb3Form(
  fields: Record<string, string>,
  subject: string,
  fromName: string,
): Promise<FormResult> {
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject,
    from_name: fromName,
    ...fields,
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      return { success: true, message: "Submitted successfully" };
    }
    return { success: false, message: "Submission failed" };
  } catch {
    return { success: false, message: "Network error" };
  }
}
