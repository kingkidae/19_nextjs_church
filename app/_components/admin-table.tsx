import { TABLES, type TableKey } from "../_lib/admin-fields";
import { createClient } from "../_lib/supabase";
import { RowEditor } from "./admin-forms";

// Shared page body for /admin/worship and /admin/videos.
export default async function AdminTable({ table, note }: { table: TableKey; note: string }) {
  const supabase = await createClient();
  const { data: rows } = await supabase.from(table).select("*").order("sort").order("id");
  const { title, fields } = TABLES[table];
  // same group order as the public page, not alphabetical
  const groups: readonly string[] = fields[0].options ?? [];
  const data = (rows ?? []).sort((a, b) => groups.indexOf(a.grp) - groups.indexOf(b.grp));
  return (
    <div>
      <h1 className="font-serif text-[clamp(1.6rem,4.5svh,2.6rem)]">{title}</h1>
      <p className="mt-2 text-sm text-mocha/75">{note}</p>
      <div className="mt-5">
        <p className="mb-2 text-sm font-medium">새로 추가</p>
        <RowEditor table={table} />
      </div>
      <p className="mt-6 hidden border-b border-mocha/30 pb-2 text-xs text-mocha/60 md:block">{fields.map((f) => f.label).join(" / ")}</p>
      {(data ?? []).length === 0 && <p className="py-4 text-sm text-mocha/60">아직 등록된 항목이 없습니다.</p>}
      {(data ?? []).map((row) => (
        <RowEditor key={row.id} table={table} row={row} />
      ))}
    </div>
  );
}
