import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminNav from "../_components/admin-nav";
import { getUser, isAdmin } from "../_lib/supabase";

export const metadata = { title: { default: "관리자", template: "%s | 관리자 | 대구신현교회" }, robots: { index: false, follow: false } };

async function Gate({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) redirect("/");
  return children;
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <main className="screen bg-champagne text-mocha-deep">
      <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-4 lg:grid-cols-[14rem_1fr] lg:grid-rows-1 lg:gap-10">
        <AdminNav />
        <div className="min-h-0 overflow-y-auto overscroll-contain pr-1 pb-6">
          <Suspense fallback={<p className="py-10 text-sm text-mocha/60">불러오는 중…</p>}>
            <Gate>{children}</Gate>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
