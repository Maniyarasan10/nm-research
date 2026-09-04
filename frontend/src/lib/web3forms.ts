// Web3Forms endpoint for delivering contact/registration forms by email.
// NOTE: The access key is a public client key — not a private secret.
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "21599b6c-3a36-4aee-94ae-75259250e9c4";

export type FormField = Record<string, string>;

export type SubmitResult =
  | { success: true }
  | { success: false; error: string };

export async function submitWeb3Form(
  data: FormField,
  subject: string,
  formName: string,
): Promise<SubmitResult> {
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject,
        from_name: formName,
        ...data,
      }),
    });
    const json = await res.json();
    if (res.ok && json.success) return { success: true };
    return { success: false, error: json.message ?? "Submission failed" };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}
