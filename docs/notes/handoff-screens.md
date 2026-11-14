# 화면 인수인계: 환희 → 재우 (11/14 11:55)

화면 파일은 지금부터 전부 재우가 주인이에요(README 작업 분할 참고). 환희는 `lib/`(규칙·AI·store·types), `app/api/*`, `data/*`, 문서만 맡아요.
아래 화면은 5인 전문가 검토(UI·프론트·기획·법률윤리·보안)를 세 번 받아 고친 상태라, **"지키는 원칙"은 디자인을 바꿔도 남겨 주세요.** 심사 윤리 10점과 차별점이 여기서 나와요.

## 1. 화면별 요약

| 라우트 | 파일 | 하는 일 | 읽는 것 | 남기는 이벤트 |
|---|---|---|---|---|
| `/teacher` | `app/teacher/page.tsx` + `components/teacher/*` | T1 예보(헤드라인·구간 3개·TOP 3·AI 근거·8유형·예외·체크인), T2 [AI 분석 다시 실행], T4 원문 펼치기 | `bridgeState(events)`, `lib/rules/forecast.ts`, `data/analysis.saved.json` | `class_started`(수업 시작 버튼 = T), `info_viewed` |
| `/teacher/approve` | `app/teacher/approve/page.tsx` | T3 결재: 규칙 안 27명 자동, 예외 3건, 돌 빼기·더하기, 붉은 도장 | `lib/rules/exceptions.ts`(`proposalFor`, `TYPE_DEFS`) | `approved {count, edited, changes}` |
| (공통) | `app/teacher/layout.tsx`, `components/teacher/InfoLock.tsx` | T7 학생 정보 잠금: 얼굴 또는 비밀번호로 10분, 교사 화면을 떠나면 다시 잠김, 내 열람 기록 | — | `info_opened`, `info_viewed` |
| `/checkin` | `app/checkin/page.tsx` | S4 아침 키오스크: QR·바코드·얼굴 → 1초 모의 → "15번 여울 맞나요?"(10초) → 돌 1개 → ㅇ O/X → 첨벙 → 30초 무입력 자동 로그아웃 | `STUDENTS`(s15) | `checked_in`, `stone_placed(s15, st-o)` |
| `/student/welcome` | `app/student/welcome/page.tsx` | S5 카드 3장 + 분리 동의 | `lib/student/me.ts` | 없음(저장 안 함) |
| `/student/river` | `app/student/river/page.tsx` | S8 나의 강 지도: 제자표 위 내 돌·숙달 단계·이해한 개념, 지도 저장(인쇄) | `lib/student/me.ts`, 내 이벤트, `opened` 여부 | 없음 |

단축키(`components/DemoKeys.tsx`): N 다음 · T 수업 시작 · A 승인 · O 오프라인 · Shift+R 처음부터 · 1/2/3 학생/교실/교사.

## 2. 지키는 원칙 (지우면 감점 위험)

1. **숫자는 교사 화면에만.** 교사 화면에서도 학생이 드러나는 것(번호·이름·원문·근거·예외 사유)은 `LockGate` 안에. 반 단위 숫자(구간 17/26, TOP 3 인원, 29/30)는 밖에.
2. **AI 결과 바로 옆에 `VerifyNotice`**("꼭 교사 본인이 직접 확인하시길 바랍니다" — SPEC 문구 그대로)와 출처.
3. **과장 금지:** "키워드만으로 틀린 답 10개 중 AI가 라벨대로 바로잡은 답 9개 · 예시 3개", "가상 답 30개 · 파일럿에서 다시 재요"를 그대로.
4. **이름은 기본 가림**(번호+가명). 프로젝터에 비칠 수 있어서. 잠긴 동안 8유형 표의 1~2명 칸은 "1~2"로 묶음.
5. **얼굴과 비밀번호, QR·바코드·얼굴은 같은 무게**(색·크기·순서로 한쪽을 밀지 않기). 키오스크엔 실명 대신 번호+가명.
6. **8유형 표기는 SPEC 8-1-1**: "참여 신호 있음/낮음/낮아 보임"(의욕이라고 쓰지 않음). 학생 카드에는 ID 꼬리표 대신 지원 문구만.
7. **동의 화면**: 처음엔 모두 꺼짐, 얼굴은 서비스 동의 뒤에만, 동의마다 왜·무엇을·언제까지·안 하면, 만 14세 미만 보호자.
8. **학생 화면은 반 전체 명단을 import하지 않음**(`lib/student/me.ts`만). `STUDENTS`를 학생 화면에 다시 들이지 말아 주세요.

## 3. 주의점 (버그로 이미 한 번 밟은 것)

- **단축키 A**: 교사 화면에서는 잠겨 있으면 승인 대신 열기 창이 떠요(`InfoLock`·결재 화면이 capture 단계에서 먼저 받음). DemoKeys를 고칠 때 이 흐름을 깨지 않게.
- **키오스크가 돌을 놓아도** N은 옛이응 ㅌ을 그대로 놓아요(store가 학생·돌까지 비교). store를 고칠 땐 환희에게.
- **`lib/student/me.ts`는 `data/class-2-3.json`의 s07과 같아야** 해요. 김나희가 s07을 바꾸면 같이 고쳐 주세요(환희에게 말해도 됨).
- **[AI 분석 다시 실행]**은 로컬(`npm run dev`)에서만 실제 호출, 배포 주소는 403 → 저장본 유지 문구가 떠요. 약 12초, 약 1만 3천 토큰.
- 새 라우트를 만든 직후 dev 서버가 404를 내면 파일을 한 번 저장(touch)하면 잡혀요.
- 발표 노트북은 `npm run demo:local`(127.0.0.1에만 열림).

## 4. 디자인 캔버스로 옮길 때

- 교사 화면 문구 중 규칙에서 나오는 것(헤드라인 `headline()`, 예외 근거 `proposalFor()`, 8유형 `TYPE_DEFS`)은 `lib/rules/*`라 환희 파일이에요. 문구를 바꾸고 싶으면 말로 요청 → 환희가 바로 push.
- 검토 기록과 근거: SPEC 6장·10장, `docs/notes/token-fit.md`, `docs/notes/pitch-differentiators.md`(차별점·시연 장면·예상 질문).
