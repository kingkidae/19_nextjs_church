import { RoleButton } from "../../_components/admin-forms";
import { createClient, formatDate, getUser } from "../../_lib/supabase";

export const metadata = { title: "회원" };

type Member = { id: string; email: string; name: string | null; phone: string | null; is_admin: boolean; created_at: string };

export default async function Page() {
  const supabase = await createClient();
  const [{ data, error }, me] = await Promise.all([supabase.rpc("admin_members"), getUser()]);
  const members = (data ?? []) as Member[];
  return (
    <div>
      <h1 className="font-serif text-[clamp(1.6rem,4.5svh,2.6rem)]">회원 {members.length}명</h1>
      <p className="mt-2 text-sm text-mocha/75">관리자 지정·해제는 그 회원의 로그인 정보가 갱신될 때(늦어도 1시간 안에) 적용됩니다. 바로 적용하려면 다시 로그인하면 됩니다.</p>
      {error && <p className="mt-4 text-sm text-amber">회원 목록을 불러오지 못했습니다.</p>}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-mocha/30 text-xs text-mocha/60">
            <tr>
              <th className="py-2 font-normal">이름</th>
              <th className="py-2 font-normal">이메일</th>
              <th className="py-2 font-normal">휴대폰</th>
              <th className="py-2 font-normal">가입일</th>
              <th className="py-2 font-normal">역할</th>
              <th className="py-2 font-normal">
                <span className="sr-only">권한 변경</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-mocha/15">
                <td className="py-2.5 font-serif text-base">{m.name ?? "이름 없음"}</td>
                <td className="py-2.5">{m.email}</td>
                <td className="py-2.5 tabular-nums">{m.phone ?? ""}</td>
                <td className="py-2.5 tabular-nums text-mocha/70">{formatDate(m.created_at)}</td>
                <td className="py-2.5">{m.is_admin ? <span className="text-amber">관리자</span> : "회원"}</td>
                <td className="py-2.5 text-right">
                  <RoleButton userId={m.id} isAdmin={m.is_admin} self={m.id === me?.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
