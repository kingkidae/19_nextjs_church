import { VIDEO_GROUPS, WORSHIP_GROUPS } from "./church";

// Field definitions shared by the admin forms (client) and the save actions (server validation).
export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "select" | "number";
  max?: number;
  options?: readonly string[];
  pattern?: string; // checked on the server too
  hint?: string;
  optional?: boolean;
};

export const SETTINGS = {
  church: {
    title: "교회 정보·오시는 길",
    fields: [
      { name: "name", label: "교회 이름", max: 30 },
      { name: "denomination", label: "소속 교단·노회", max: 60 },
      { name: "founded", label: "설립 연도", max: 4, pattern: "^\\d{4}$", hint: "숫자 4자리" },
      { name: "phone", label: "전화번호", max: 20 },
      { name: "address", label: "주소", max: 120 },
      { name: "directions", label: "찾아오시는 길", type: "textarea", max: 500 },
      { name: "parking", label: "주차 안내", type: "textarea", max: 500 },
      { name: "naverDirections", label: "네이버 길찾기 링크", type: "url" },
      { name: "naverPlace", label: "네이버 지도 링크", type: "url" },
      { name: "mapEmbed", label: "구글 지도 퍼가기 주소", type: "url", hint: "구글 지도 > 공유 > 지도 퍼가기의 src 주소" },
    ],
  },
  theme: {
    title: "올해 표어 (첫 화면)",
    fields: [
      { name: "title", label: "표어 이름", max: 40, hint: "예: Revival 2026" },
      { name: "sub", label: "부제", max: 60 },
      { name: "line1", label: "큰 글씨 첫째 줄", max: 12, hint: "세로쓰기, 짧을수록 좋습니다" },
      { name: "line2", label: "큰 글씨 둘째 줄", max: 12, optional: true },
      { name: "rest1", label: "말씀 이어서 (1)", max: 40, optional: true },
      { name: "rest2", label: "말씀 이어서 (2)", max: 40, optional: true },
      { name: "ref", label: "성경 구절", max: 30, hint: "예: 이사야 60:1" },
    ],
  },
  about: {
    title: "교회 소개 문구",
    fields: [
      { name: "vision", label: "소개 첫 화면 문장", type: "textarea", max: 120 },
      { name: "homeTitle", label: "홈 소개 제목", type: "textarea", max: 40, hint: "줄바꿈이 그대로 보입니다" },
      { name: "summary", label: "홈 소개 문단 (교단 소개 뒤에 이어짐)", type: "textarea", max: 200 },
      { name: "centers", label: "건강한 교회: 세 가지 중심", max: 40, hint: "쉼표로 3개, 예: 하나님 중심, 성경 중심, 교회 중심" },
      { name: "healthy", label: "건강한 교회 설명", type: "textarea", max: 300 },
      { name: "spiritShort", label: "성령과 말씀: 짧은 문구 (홈)", max: 40 },
      { name: "spirit", label: "성령과 말씀 설명", type: "textarea", max: 300 },
      { name: "history", label: "역사와 전통 설명 (설립 연도 문장 뒤에 이어짐)", type: "textarea", max: 300 },
    ],
  },
  social: {
    title: "SNS 링크 (화면 오른쪽 아이콘)",
    fields: [
      { name: "youtube", label: "유튜브", type: "url", optional: true, hint: "비워 두면 아이콘이 숨겨집니다" },
      { name: "instagram", label: "인스타그램", type: "url", optional: true },
      { name: "threads", label: "쓰레드", type: "url", optional: true },
      { name: "kakao", label: "카카오톡 채널", type: "url", optional: true, hint: "예: https://pf.kakao.com/_xxxx" },
    ],
  },
} satisfies Record<string, { title: string; fields: Field[] }>;
export type SettingKey = keyof typeof SETTINGS;

export const TABLES = {
  worship_times: {
    title: "예배 시간",
    fields: [
      { name: "grp", label: "구분", type: "select", options: WORSHIP_GROUPS },
      { name: "name", label: "예배 이름", max: 40 },
      { name: "ampm", label: "오전/오후", type: "select", options: ["오전", "오후"] },
      { name: "time", label: "시간", max: 5, pattern: "^([1-9]|1[0-2]):[0-5][0-9]$", hint: "예: 10:30" },
      { name: "sort", label: "순서", type: "number" },
    ],
  },
  videos: {
    title: "온라인 예배 영상",
    fields: [
      { name: "grp", label: "구분", type: "select", options: VIDEO_GROUPS },
      { name: "title", label: "영상 제목", max: 60 },
      { name: "youtube_id", label: "YouTube 주소", max: 200, hint: "영상 주소를 그대로 붙여 넣으세요" },
      { name: "sort", label: "순서", type: "number" },
    ],
  },
} satisfies Record<string, { title: string; fields: Field[] }>;
export type TableKey = keyof typeof TABLES;

// Accepts a bare ID or any common YouTube URL form.
export function youtubeId(input: string) {
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return s.match(/(?:youtu\.be\/|[?&]v=|\/(?:embed|shorts|live)\/)([A-Za-z0-9_-]{11})/)?.[1] ?? null;
}
