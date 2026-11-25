import { SettingsForm } from "../../_components/admin-forms";
import { defaults } from "../../_lib/church";
import { createClient } from "../../_lib/supabase";

export const metadata = { title: "표어·교회 소개" };

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value").in("key", ["theme", "about"]);
  const v = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return (
    <div className="grid gap-6">
      <SettingsForm k="theme" values={{ ...defaults.theme, ...v.theme }} />
      <SettingsForm k="about" values={{ ...defaults.about, ...v.about }} />
    </div>
  );
}
