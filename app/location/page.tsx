import { pageMeta } from "../_lib/seo";
import Location from "../_components/location";

export const metadata = pageMeta("오시는 길", "대구신현교회 위치: 대구 북구 경대로19길 55-5. 경북대학교 동문·테크노문에서 5분 거리. 주차 안내와 네이버 지도 길찾기.", "/location");

export default function Page() {
  return (
    <main className="screen bg-mocha-deep">
      <Location />
    </main>
  );
}
