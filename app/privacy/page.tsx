import { pageMeta } from "../_lib/seo";
import LegalDoc from "../_components/legal-doc";
import { getContent } from "../_lib/content";

export const metadata = pageMeta("개인정보 처리방침", "대구신현교회 홈페이지 개인정보 처리방침", "/privacy");

// Written to match what the site actually does: Supabase (Seoul region) auth/DB/storage,
// Vercel hosting, optional Google login, YouTube nocookie embeds on click, Google Maps embed.
export default async function Page() {
  const { church } = await getContent();
  const n = church.name;
  return (
    <LegalDoc
      title="개인정보 처리방침"
      effective="2026년 11월 25일"
      intro={<p>{n}(이하 &ldquo;교회&rdquo;)는 「개인정보 보호법」에 따라 홈페이지 이용자의 개인정보를 보호하고, 관련 고충을 신속하게 처리하기 위해 다음과 같이 개인정보 처리방침을 둡니다.</p>}
      sections={[
        {
          title: "1. 처리하는 개인정보와 수집 방법",
          body: (
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>항목</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>이메일 회원가입 (필수)</td>
                  <td>이메일, 비밀번호(암호화하여 저장), 이름</td>
                </tr>
                <tr>
                  <td>Google 로그인 (필수)</td>
                  <td>Google 계정의 이메일, 이름, 프로필 사진 주소</td>
                </tr>
                <tr>
                  <td>내 정보 입력 (선택)</td>
                  <td>휴대폰 번호, 생년월일, 주소, 프로필 사진</td>
                </tr>
                <tr>
                  <td>댓글 작성</td>
                  <td>댓글 내용, 작성자 이름, 작성 시각</td>
                </tr>
                <tr>
                  <td>자동 수집</td>
                  <td>로그인 유지를 위한 쿠키, 접속 기록(IP 주소, 접속 시각, 브라우저 정보)</td>
                </tr>
              </tbody>
            </table>
          ),
        },
        {
          title: "2. 처리 목적",
          body: (
            <ul>
              <li>회원 식별, 로그인 유지, 부정 이용 방지</li>
              <li>댓글 작성자 표시</li>
              <li>교회 소식 안내와 성도 연락 (선택 정보를 입력한 경우)</li>
              <li>서비스 운영과 장애 대응</li>
            </ul>
          ),
        },
        {
          title: "3. 보유 및 이용 기간",
          body: <p>회원 탈퇴 시까지 보유하며, 탈퇴하면 지체 없이 파기합니다. 탈퇴한 회원이 남긴 댓글도 함께 삭제됩니다. 접속 기록은 호스팅 사업자의 기록 보관 기간 동안 보관된 뒤 삭제됩니다. 법령에 따로 보존 의무가 있으면 그 기간 동안 보관합니다.</p>,
        },
        {
          title: "4. 제3자 제공",
          body: <p>교회는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 근거가 있거나 수사기관이 법령에 정한 절차에 따라 요청하는 경우는 예외로 합니다.</p>,
        },
        {
          title: "5. 처리 위탁과 국외 이전",
          body: (
            <>
              <p>교회는 홈페이지 운영을 위해 다음 업체에 개인정보 처리를 맡기고 있습니다. 해당 업체들은 국외 사업자이며, 아래 정보는 홈페이지 이용 시 네트워크를 통해 전송됩니다.</p>
              <table>
                <thead>
                  <tr>
                    <th>업체 (소재 국가)</th>
                    <th>맡기는 일</th>
                    <th>이전 항목과 보관 위치</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Supabase Inc. (미국)</td>
                    <td>회원 인증, 데이터베이스, 프로필 사진 저장</td>
                    <td>1항의 회원 정보 전체. 서버는 대한민국(서울) 리전에 있습니다.</td>
                  </tr>
                  <tr>
                    <td>Vercel Inc. (미국)</td>
                    <td>홈페이지 호스팅</td>
                    <td>접속 기록. 전 세계 서버를 통해 처리됩니다.</td>
                  </tr>
                  <tr>
                    <td>Google LLC (미국)</td>
                    <td>Google 로그인 (선택한 경우)</td>
                    <td>Google 계정 인증 정보</td>
                  </tr>
                </tbody>
              </table>
              <p>보유 기간은 회원 탈퇴 또는 위탁 계약 종료 시까지입니다. 국외 이전을 원하지 않으면 회원가입을 하지 않고 공개 내용만 이용할 수 있습니다.</p>
            </>
          ),
        },
        {
          title: "6. 외부 서비스와 쿠키",
          body: (
            <ul>
              <li>홈페이지는 로그인 유지에 필요한 쿠키만 사용하며, 광고·분석용 쿠키는 쓰지 않습니다.</li>
              <li>온라인 예배 영상은 재생 버튼을 누를 때 YouTube(개인정보 보호 강화 모드)에서 불러옵니다.</li>
              <li>오시는 길의 지도는 Google 지도에서 불러오며, 이때 Google이 자체 쿠키를 사용할 수 있습니다.</li>
              <li>브라우저 설정에서 쿠키를 거부할 수 있지만, 그러면 로그인이 필요한 기능을 쓸 수 없습니다.</li>
            </ul>
          ),
        },
        {
          title: "7. 개인정보를 볼 수 있는 사람",
          body: <p>휴대폰 번호, 생년월일, 주소는 본인만 볼 수 있습니다. 다만 교회 관리자는 성도 연락을 위해 회원의 이름, 이메일, 휴대폰 번호를 볼 수 있습니다.</p>,
        },
        {
          title: "8. 파기 절차와 방법",
          body: <p>보유 기간이 끝나거나 처리 목적을 이룬 개인정보는 지체 없이 파기합니다. 전자 파일은 복구할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.</p>,
        },
        {
          title: "9. 이용자의 권리와 행사 방법",
          body: (
            <ul>
              <li>회원은 &lsquo;내 정보&rsquo; 페이지에서 언제든 자신의 정보를 열람하고 고칠 수 있습니다.</li>
              <li>개인정보의 삭제, 처리 정지, 회원 탈퇴는 아래 연락처로 요청하면 본인 확인 후 지체 없이 처리합니다.</li>
              <li>법정대리인이나 위임받은 사람을 통해서도 권리를 행사할 수 있습니다.</li>
            </ul>
          ),
        },
        {
          title: "10. 안전성 확보 조치",
          body: (
            <ul>
              <li>비밀번호는 복호화할 수 없는 방식으로 암호화하여 저장합니다.</li>
              <li>모든 통신은 HTTPS로 암호화합니다.</li>
              <li>데이터베이스 접근 권한 규칙으로 본인 정보만 조회·수정되도록 제한합니다.</li>
              <li>관리자 권한은 교회가 지정한 사람에게만 부여합니다.</li>
            </ul>
          ),
        },
        {
          title: "11. 만 14세 미만 아동",
          body: <p>홈페이지는 만 14세 미만 아동의 회원가입을 받지 않습니다.</p>,
        },
        {
          title: "12. 개인정보 보호 담당",
          body: (
            <p>
              {n} 사무실
              <br />
              전화 {church.phone}
              <br />
              주소 {church.address}
            </p>
          ),
        },
        {
          title: "13. 권익침해 구제 방법",
          body: (
            <ul>
              <li>개인정보침해신고센터: privacy.kisa.or.kr, 국번 없이 118</li>
              <li>개인정보분쟁조정위원회: www.kopico.go.kr, 1833-6972</li>
              <li>대검찰청: www.spo.go.kr, 국번 없이 1301</li>
              <li>경찰청: ecrm.police.go.kr, 국번 없이 182</li>
            </ul>
          ),
        },
        { title: "14. 처리방침의 변경", body: <p>이 개인정보 처리방침은 2026년 11월 25일부터 적용됩니다. 내용이 바뀌면 시행 7일 전부터 홈페이지에 알립니다.</p> },
      ]}
    />
  );
}
