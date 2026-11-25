import { SettingsForm } from "../../_components/admin-forms";
import { defaults } from "../../_lib/church";
import { createClient } from "../../_lib/supabase";

export const metadata = { title: "교회 정보" };

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value").in("key", ["church", "social"]);
  const v = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return (
    <div className="grid gap-6">
      <SettingsForm k="church" values={{ ...defaults.church, ...v.church }} />
      <SettingsForm k="social" values={{ ...defaults.social, ...v.social }} />
    </div>
  );
}
