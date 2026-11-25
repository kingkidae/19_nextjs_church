# 대구신현교회 홈페이지

Next.js 16 + Tailwind CSS 4 + three.js + Supabase.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Supabase 연결 (로그인·게시판)

1. [supabase.com](https://supabase.com)에서 프로젝트를 만듭니다.
2. `.env.example`을 `.env.local`로 복사하고 Project Settings > API의 URL과 publishable(anon) 키를 넣습니다.
3. SQL Editor에서 `supabase/schema.sql`을 실행합니다. `posts` 테이블과 권한(RLS)이 만들어집니다.
4. Authentication > URL Configuration
   - Site URL: 배포 주소 (개발 중에는 `http://localhost:3000`)
   - Redirect URLs: `http://localhost:3000/auth/callback`, `https://<배포 주소>/auth/callback`
5. Google 로그인: Google Cloud Console에서 OAuth 클라이언트(웹)를 만들고, 승인된 리디렉션 URI에 `https://<프로젝트>.supabase.co/auth/v1/callback`을 넣습니다. 발급된 Client ID/Secret을 Supabase Authentication > Providers > Google에 입력합니다.
6. 서버를 다시 시작합니다.

### 권한

- 교회 소식(`/news`): 로그인한 회원 누구나 쓰기, 본인 글만 수정·삭제
- 교회 주보(`/bulletin`): 관리자만 쓰기. 관리자 지정은 `schema.sql` 맨 아래 주석의 SQL을 실행합니다.

## 페이지

| 경로 | 내용 |
|---|---|
| `/` | 메인 (표어, 소개, 예배 안내, 온라인 예배, 소식·주보, 오시는 길) |
| `/about` | 교회 소개 |
| `/worship` | 예배 안내 |
| `/online` | 온라인 예배 (YouTube) |
| `/news`, `/bulletin` | 게시판 목록 · `/new` 글쓰기 · `/[id]` 보기 · `/[id]/edit` 수정 |
| `/location` | 오시는 길 |
| `/login`, `/signup` | 로그인, 회원가입 (이메일, Google) |

## 내용 수정

교회 정보, 예배 시간, 예배 영상 목록은 `app/_lib/church.ts` 한 곳에서 고칩니다.

## 사용한 리소스

- 글꼴: [마루 부리](https://hangeul.naver.com/font) (네이버, OFL), [Pretendard](https://github.com/orioncactus/pretendard) (OFL) — `app/fonts/`
- 사진: [Unsplash](https://unsplash.com) (Unsplash License) — `public/images/` 의 door, candles, bible, pews, rays, field
- 교회 사진(praise, prayer-kids, sermon)과 로고 모양: 기존 홈페이지(shinhyunchurch.creatorlink.net)
