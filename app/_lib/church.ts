// Default site content (from the previous site, shinhyunchurch.creatorlink.net).
// Live content comes from Supabase (see content.ts); these are the seed values and the fallback.

export const defaults = {
  church: {
    name: "대구신현교회",
    denomination: "대한예수교장로회 합동 동대구노회",
    founded: "1971",
    address: "대구 북구 경대로19길 55-5",
    phone: "053-939-1004",
    directions: "경북대학교 동문, 테크노문에서 5분 거리입니다.",
    parking:
      "주차장이 협소하여 주일에는 복잡할 수 있습니다. 어울림쉼터 주차장 또는 경북대 테크노문 담벼락(경대로17길)을 이용해 주세요.",
    naverDirections:
      "https://map.naver.com/p/directions/-/14317586.227653164,4285657.959234277,%EB%8C%80%EA%B5%AC%EC%8B%A0%ED%98%84%EA%B5%90%ED%9A%8C,,/-/transit?c=15.00,0,0,0,dh",
    naverPlace: "https://map.naver.com/p/entry/place/16137640?c=19.76,0,0,0,dh",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3232.276762330749!2d128.61453957643002!3d35.89123677252033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565e198a4e3eeef%3A0x296ba0d78b00c491!2z7Iug7ZiE6rWQ7ZqM!5e0!3m2!1sko!2skr!4v1769062504154!5m2!1sko!2skr",
  },
  theme: {
    title: "Revival 2026",
    sub: "신현 부흥역사, 네 번째 해",
    line1: "일어나라",
    line2: "빛을 발하라",
    rest1: "이는 네 빛이 이르렀고",
    rest2: "여호와의 영광이 네 위에 임하였음이니라",
    ref: "이사야 60:1",
  },
  about: {
    vision: "하나님의 임재가 나타나는 교회가 되기를 소망합니다.",
    homeTitle: "하나님의 임재가\n나타나는 교회",
    summary: "하나님의 열심에 집중하고, 성화와 사명으로 때가 차기까지 지금도 달려갑니다.",
    healthy: "하나님을 예배의 중심에, 성경을 삶의 기준에, 교회를 신앙의 터전에 둡니다. 세 가지 중심이 서로를 붙들어 주는 교회를 꿈꿉니다.",
    centers: "하나님 중심, 성경 중심, 교회 중심",
    spirit: "대구와 한국 땅에 복음과 사랑으로 하나님 나라를 이루는 데 이바지하기를 열망합니다.",
    spiritShort: "대구와 한국 땅에 복음과 사랑으로",
    history: "하나님의 열심에 집중하고 성화와 사명으로, 때가 차기까지 지금도 달려갑니다.",
  },
  social: {
    youtube: "https://www.youtube.com/@shinhyunchurch",
    instagram: "",
    threads: "",
    kakao: "",
  },
  worship: [
    { grp: "주일 예배", name: "새벽기도회", ampm: "오전", time: "5:30" },
    { grp: "주일 예배", name: "1부 전통예배", ampm: "오전", time: "10:30" },
    { grp: "주일 예배", name: "오후예배", ampm: "오후", time: "12:50" },
    { grp: "주일 예배", name: "2부 찬양예배", ampm: "오후", time: "2:00" },
    { grp: "주중 예배", name: "새벽기도회 (월–금)", ampm: "오전", time: "5:30" },
    { grp: "주중 예배", name: "수요예배", ampm: "오후", time: "8:00" },
    { grp: "주중 예배", name: "금요예배", ampm: "오후", time: "8:00" },
    // the old site says "오후 11:30" — almost certainly a typo for 오전
    { grp: "주일학교", name: "영유치부", ampm: "오전", time: "11:30" },
    { grp: "주일학교", name: "유초등부", ampm: "오전", time: "11:30" },
    { grp: "주일학교", name: "중고등부", ampm: "오전", time: "9:00" },
    { grp: "주일학교", name: "대학청년부", ampm: "오후", time: "2:00" },
  ],
  videos: [
    { youtube_id: "T8U15fYwoSM", title: "주일 1부 예배", grp: "주일" },
    { youtube_id: "dV6KEGT4UXc", title: "주일 2부 예배", grp: "주일" },
    { youtube_id: "yJRdfDXeaoI", title: "주일 오후 예배", grp: "주일" },
    { youtube_id: "QCivvp453do", title: "새벽기도회", grp: "주중" },
    { youtube_id: "aBQKooU4BpQ", title: "수요 예배", grp: "주중" },
    { youtube_id: "03Cvxf3CGx0", title: "금요 예배", grp: "주중" },
  ],
};

export type Content = {
  church: typeof defaults.church;
  theme: typeof defaults.theme;
  about: typeof defaults.about;
  social: typeof defaults.social;
  worship: { id?: number; grp: string; name: string; ampm: string; time: string; sort?: number }[];
  videos: { id?: number; youtube_id: string; title: string; grp: string; sort?: number }[];
};

export const WORSHIP_GROUPS = ["주일 예배", "주중 예배", "주일학교"] as const;
export const VIDEO_GROUPS = ["주일", "주중"] as const;

export const nav = [
  { href: "/about", label: "교회 소개" },
  { href: "/worship", label: "예배 안내" },
  { href: "/online", label: "온라인 예배" },
  { href: "/news", label: "교회 소식" },
  { href: "/bulletin", label: "교회 주보" },
  { href: "/location", label: "오시는 길" },
];

export const boards = {
  news: {
    label: "교회 소식",
    intro: "교회의 일정과 나눔, 성도들의 소식을 전합니다. 로그인하면 댓글을 남길 수 있습니다.",
    image: "/images/field.jpg",
  },
  bulletin: {
    label: "교회 주보",
    intro: "매주 주일 예배 순서와 광고를 올립니다. 로그인하면 댓글을 남길 수 있습니다.",
    image: "/images/bible.jpg",
  },
} as const;
export type Board = keyof typeof boards;
