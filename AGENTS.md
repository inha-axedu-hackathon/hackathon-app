<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 징검다리 팀 규칙 (AI 코딩 도구용)

## 기준 문서
- 기획은 `docs/SPEC.md`가 기준이다. 기능을 만들기 전에 해당 장을 읽는다.
- 게임 규칙, 화면 문구, 근거는 `docs/GAMIFICATION.md`를 따른다. 두 문서가 다르면 `docs/SPEC.md`가 우선이다.

## 기술
- Next.js App Router + TypeScript + Tailwind.
- 타입은 `lib/types.ts`에 있는 것만 쓴다. 새 타입이 필요하면 거기에 추가한다.
- 시연 상태는 `lib/store.ts`의 `useDemo()`만 쓴다. localStorage는 `"use client"` 컴포넌트의 `useEffect` 안에서만 읽는다.
- API 키는 서버(`app/api`)에서만 `process.env`로 읽는다. `NEXT_PUBLIC_`에 넣지 않는다. `.env*` 파일은 커밋하지 않는다.
- LLM 호출은 `lib/llm.ts`의 `callLLM()`만 쓴다(server-only). 시간 제한·답 길이 상한·대체 결과를 항상 두고, 학생에게 보이는 문장은 AI가 쓰지 않는다(미리 쓴 문장만).
- 시각은 `Date.now()`가 아니라 store의 가상 시계를 쓴다.

## 보안 (백엔드)
- AI 결과는 허용된 ID만 받고, 근거 인용은 학생 글에 실제로 있을 때만 인정한다(`quoted()`). 위기 낱말은 `isCrisis()`로 먼저 걸러 AI에 보내지 않는다.
- 외부 AI에는 답 텍스트만 보낸다(학생 ID·이름 금지, `maskPII()` 거친 뒤). 서버 로그에는 토큰 수·이유만, 학생 글과 키는 남기지 않는다.
- API에는 입력 검사(형식·길이·본문 크기), 다른 사이트 요청 차단(`crossSite()`), 남용 상한(학생별·서버 전체·하루 토큰)을 둔다. 관리자용 `/api/analyze`는 배포 주소에서 꺼 둔다.
- 학생·교실 화면은 교사 전용 명단(`lib/rules/roster.ts`, `data/class-2-3.json`)을 import하지 않는다. 공개 필드는 `lib/rules/bridge.ts`의 `PUBLIC_STUDENTS`.
- push 전에 `npm run check:secrets`를 돌린다. 백엔드를 바꿨으면 `.claude/agents/security-reviewer.md` 기준으로 점검한다.

## 제품 원칙
- 학생 화면에 점수, 순위, 연속 기록을 만들지 않는다. 진행은 확인된 학습 증거로만 바뀐다.
- 얼굴 이미지나 특징값을 다루는 코드를 만들지 않는다. 체크인은 결과(본인 맞음, 방법, 장소, 시각)만 다룬다.
- 모든 AI 결과 화면에 "꼭 교사 본인이 직접 확인하시길 바랍니다"를 띄운다.
- 화면 문구는 문서에 적힌 문구를 그대로 쓴다.

## 협업
- 폴더 담당은 `README.md`의 표를 참고한다. 요청받은 기능과 관계없는 다른 폴더의 파일은 고치지 않는다.
- 같이 쓰는 파일(`lib/types.ts`, `lib/store.ts`, `package.json`)에서는 기존 타입·함수·필드의 이름을 지우거나 바꾸지 말고 추가만 한다. 꼭 바꿔야 하면 바꾸기 전에 사람에게 묻는다.
- 한 번에 한 기능만 고치고, 끝나면 `npm run build`가 통과하는지 확인한다.
- 병합 충돌을 해결할 때 상대 변경을 지우지 않는다.
- 커밋 메시지 앞에 `[환희]` 또는 `[재우]`를 붙인다.
