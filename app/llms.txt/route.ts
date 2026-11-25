import { getContent, SITE_URL } from "../_lib/content";
import { WORSHIP_GROUPS } from "../_lib/church";

// /llms.txt: a plain-text fact sheet for AI search (GEO), built from the same content admins edit.
export async function GET() {
  const { church, theme, about, worship, social } = await getContent();
  const times = WORSHIP_GROUPS.map(
    (g) => `### ${g}\n${worship.filter((w) => w.grp === g).map((w) => `- ${w.name}: ${w.ampm} ${w.time}`).join("\n")}`,
  ).join("\n\n");
  const links = Object.entries({ 유튜브: social.youtube, 인스타그램: social.instagram, 쓰레드: social.threads, 카카오톡채널: social.kakao })
    .filter(([, v]) => v)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  const body = `# ${church.name}

> ${church.name}는 ${church.founded}년에 세워진 ${church.denomination} 소속 교회입니다. 대구광역시 북구, 경북대학교 근처에 있습니다. ${about.vision}

## 기본 정보
- 교회 이름: ${church.name}
- 소속: ${church.denomination}
- 설립: ${church.founded}년
- 주소: ${church.address}
- 전화: ${church.phone}
- 찾아오는 길: ${church.directions}
- 주차: ${church.parking}
- ${theme.title} 표어: ${theme.line1} ${theme.line2} (${theme.ref})

## 예배 시간
${times}

## 교회 소개
- ${about.centers}
- ${about.healthy}
- ${about.spirit}

## 페이지
- [교회 소개](${SITE_URL}/about)
- [예배 안내](${SITE_URL}/worship)
- [온라인 예배](${SITE_URL}/online)
- [교회 소식](${SITE_URL}/news)
- [교회 주보](${SITE_URL}/bulletin)
- [오시는 길](${SITE_URL}/location)
${links ? `\n## SNS\n${links}\n` : ""}`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
