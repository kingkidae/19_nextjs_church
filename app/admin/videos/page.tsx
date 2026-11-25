import AdminTable from "../../_components/admin-table";

export const metadata = { title: "온라인 예배" };

export default function Page() {
  return <AdminTable table="videos" note="YouTube 영상 주소를 그대로 붙여 넣으면 됩니다. 순서 숫자가 작을수록 위에 나오고, 맨 위 영상이 처음에 보입니다." />;
}
