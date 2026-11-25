"use client";

import { useActionState } from "react";
import { deleteRow, saveRow, saveSettings, setRole } from "../_lib/admin-actions";
import { SETTINGS, TABLES, type Field, type SettingKey, type TableKey } from "../_lib/admin-fields";
import type { FormState } from "../_lib/form-state";

function Input({ f, value, compact }: { f: Field; value?: string | number; compact?: boolean }) {
  const common = { name: f.name, defaultValue: value ?? "", required: !f.optional && f.type !== "number", "aria-label": compact ? f.label : undefined };
  if (f.type === "textarea") return <textarea {...common} maxLength={f.max} rows={3} className="field resize-y leading-relaxed" />;
  if (f.type === "select")
    return (
      <select {...common} className="field">
        {f.options?.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  if (f.type === "number") return <input {...common} type="number" min={0} max={9999} className="field" />;
  return <input {...common} type={f.type === "url" ? "url" : "text"} maxLength={f.type === "url" ? 2000 : f.max} pattern={f.pattern} placeholder={compact ? f.hint : undefined} className="field" />;
}

const Status = ({ state }: { state?: FormState }) => (
  <p role="status" className={state?.error ? "text-sm text-amber" : "text-sm text-mocha/70"}>
    {state?.error ?? state?.notice}
  </p>
);

export function SettingsForm({ k, values }: { k: SettingKey; values: Record<string, string> }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const { title } = SETTINGS[k];
  const fields: readonly Field[] = SETTINGS[k].fields;
  return (
    <form action={action} className="rounded-2xl border border-mocha/20 p-[clamp(1rem,2.4vw,1.75rem)]">
      <input type="hidden" name="_key" value={k} />
      <h2 className="mb-4 font-serif text-xl">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className={`grid content-start gap-1.5 text-sm ${f.type === "textarea" || f.type === "url" ? "md:col-span-2" : ""}`}>
            <span>
              {f.label}
              {f.hint && <span className="ml-2 text-xs text-mocha/55">{f.hint}</span>}
            </span>
            <Input f={f} value={state?.values?.[f.name] ?? values[f.name]} />
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button disabled={pending} className="rounded-full bg-mocha px-6 py-2.5 text-sm text-champagne transition-colors hover:bg-amber hover:text-mocha-night disabled:opacity-60">
          {pending ? "저장하는 중…" : "저장하기"}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}

// One table row as an inline form. Without `row` it is the "add new" form.
export function RowEditor({ table, row }: { table: TableKey; row?: Record<string, string | number> }) {
  const [state, action, pending] = useActionState(saveRow, undefined);
  const fields: readonly Field[] = TABLES[table].fields;
  const cols = table === "worship_times" ? "md:grid-cols-[7.5rem_minmax(10rem,1fr)_5.5rem_5.5rem_4.5rem_auto]" : "md:grid-cols-[5.5rem_minmax(9rem,1fr)_minmax(9rem,1fr)_4.5rem_auto]";
  return (
    <div className={row ? "border-b border-mocha/15 py-3" : "rounded-2xl bg-mocha/[0.07] p-4"}>
      <form action={action} className={`grid items-center gap-2 ${cols}`}>
        <input type="hidden" name="_table" value={table} />
        {row && <input type="hidden" name="_id" value={row.id} />}
        {fields.map((f) => (
          <Input key={f.name} f={f} value={state?.values?.[f.name] ?? row?.[f.name] ?? (f.type === "number" ? 0 : undefined)} compact />
        ))}
        <div className="flex gap-2">
          <button disabled={pending} className="rounded-full bg-mocha px-4 py-2 text-sm text-champagne hover:bg-amber hover:text-mocha-night disabled:opacity-60">
            {pending ? "…" : row ? "저장" : "추가"}
          </button>
          {row && (
            <button
              formAction={deleteRow}
              formNoValidate
              onClick={(e) => !confirm("이 항목을 삭제할까요?") && e.preventDefault()}
              className="rounded-full px-3 py-2 text-sm text-mocha/70 hover:bg-amber hover:text-mocha-night"
            >
              삭제
            </button>
          )}
        </div>
      </form>
      {(state?.error || state?.notice) && <div className="mt-1.5"><Status state={state} /></div>}
    </div>
  );
}

export function RoleButton({ userId, isAdmin, self }: { userId: string; isAdmin: boolean; self: boolean }) {
  if (self) return <span className="text-xs text-mocha/55">본인</span>;
  return (
    <form action={setRole} onSubmit={(e) => !confirm(isAdmin ? "관리자 권한을 해제할까요?" : "이 회원을 관리자로 지정할까요?") && e.preventDefault()}>
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="make_admin" value={isAdmin ? "0" : "1"} />
      <button className="rounded-full border border-mocha/30 px-3 py-1.5 text-xs hover:border-amber hover:text-amber">
        {isAdmin ? "관리자 해제" : "관리자로 지정"}
      </button>
    </form>
  );
}
