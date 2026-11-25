import AdminTable from "../../_components/admin-table";

export const metadata = { title: "예배 시간" };

export default function Page() {
  return <AdminTable table="worship_times" note="같은 구분 안에서는 순서 숫자가 작을수록 위에 나옵니다." />;
}
