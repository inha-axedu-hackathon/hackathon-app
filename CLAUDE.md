# 징검다리 저장소 규칙 (AI 코딩 도구용)

## 기준 문서
- 기획은 `docs/SPEC.md`가 기준이다. 기능을 만들기 전에 해당 장을 읽는다.
- 게임 규칙, 화면 문구, 근거는 `docs/GAMIFICATION.md`를 따른다. 두 문서가 다르면 `docs/SPEC.md`가 우선이다.

## 기술
- Next.js App Router + TypeScript + Tailwind.
- 타입은 `lib/types.ts`에 있는 것만 쓴다. 새 타입이 필요하면 거기에 추가한다.
- 시연 상태는 `lib/store.ts`의 `useDemo()`만 쓴다. localStorage는 `"use client"` 컴포넌트의 `useEffect` 안에서만 읽는다.
- API 키는 서버(`app/api`)에서만 `process.env`로 읽는다. `NEXT_PUBLIC_`에 넣지 않는다. `.env*` 파일은 커밋하지 않는다.
- LLM 호출은 `lib/llm.ts`의 `callLLM()`만 쓴다. 4초 타임아웃과 대체 결과를 항상 둔다.
- 시각은 `Date.now()`가 아니라 store의 가상 시계를 쓴다.

## 제품 원칙
- 학생 화면에 점수, 순위, 연속 기록을 만들지 않는다. 진행은 확인된 학습 증거로만 바뀐다.
- 얼굴 이미지나 특징값을 다루는 코드를 만들지 않는다. 체크인은 결과(본인 맞음, 방법, 장소, 시각)만 다룬다.
- 모든 AI 결과 화면에 "꼭 교사 본인이 직접 확인하시길 바랍니다"를 띄운다.
- 화면 문구는 문서에 적힌 문구를 그대로 쓴다.

## 협업
- 폴더 담당은 `README.md`의 표를 따른다. 담당이 아닌 폴더의 파일은 고치지 않는다.
- 공용 파일(`lib/types.ts`, `lib/store.ts`, `package.json`의 의존성)은 정환희가 관리한다.
- 한 번에 한 기능만 고치고, 끝나면 `npm run build`가 통과하는지 확인한다.
- 커밋 메시지 앞에 `[환희]` 또는 `[재우]`를 붙인다.
