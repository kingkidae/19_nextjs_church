export type FormState = { error?: string; notice?: string; values?: Record<string, string> } | undefined;

// React 19 resets a form after its action runs. On an error we send the typed values back
// so the form can show them again instead of wiping the user's input. Passwords are never echoed.
export function fail(form: FormData, error: string): FormState {
  const values: Record<string, string> = {};
  for (const [k, v] of form) if (typeof v === "string" && !k.startsWith("$") && !k.startsWith("password")) values[k] = v;
  return { error, values };
}
