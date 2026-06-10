# MONT MVP

AI 영상 기획을 빠르게 구조화하는 React/Vite 기반 과제용 MVP입니다.

## 주요 구조

- Landing
- Sign Up
- Login
- Dashboard
- New Project
- Workspace
- Templates
- Archive
- Pricing

## 환경 변수

`.env.local`에 OpenAI API 키를 설정합니다.

```bash
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
APP_URL="http://localhost:3000"
```

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 접속이 안 될 때

`http://localhost:3000`은 dev 서버가 실행 중일 때만 열립니다.

1. `node_modules`가 없으면 먼저 `npm install`을 실행합니다.
2. `.env.local`의 `OPENAI_API_KEY`를 실제 키로 바꿉니다.
3. `npm run dev`를 실행한 터미널을 켜 둔 상태로 브라우저를 엽니다.
4. 터미널에 다른 포트가 표시되면 해당 포트 주소로 접속합니다.

## 이미지 생성

Workspace의 "생성 설명" textarea에 현재 장면 설명을 입력한 뒤 "촬영 레퍼런스 생성"을 누르면 `/api/generate-ref-image`가 OpenAI Image API를 호출합니다.

## Vercel 배포

Vercel 프로젝트 환경 변수에 `OPENAI_API_KEY`를 추가한 뒤 배포합니다.

```bash
npm install
npm run build
npx vercel --prod
```

배포 후 Vercel이 출력하는 `https://...vercel.app` 주소를 사용합니다.
