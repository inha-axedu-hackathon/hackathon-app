# hackathon-app
2026 INHA AX-EDU 해커톤 팀 프로젝트

## 징검다리 · 팀 다이버
플립러닝 사전학습 결손을 수업 전에 찾아 메우는 교사 지원 서비스예요. 학생 게임 모드는 **징검런**이에요.

> 다리가 끊긴 곳에서 수업이 시작된다.

AI가 학생들의 '개념 말해보기' 답을 읽어 막힌 곳을 찾고(읽기만), 교사가 승인한 규칙이 학생마다 다른 개수의 징검돌을 고르고, 반 전체가 다리를 완성해 같은 수업에 도착해요. 슈퍼스쿨(수업활동·슈퍼패스) 안의 메뉴로 붙는 구조예요.

> **시연용 가상 학생 데이터 · 모의 인증**: 학생 30명(2학년 3반)은 모두 가상이고, 얼굴·QR·바코드 인증은 흉내만 내요(얼굴 정보를 받거나 저장하지 않음).

### 화면
| 주소 | 화면 |
|---|---|
| `/student` | 학생 징검런: 홈 → 돌 굳히기(실험실) → 도착 관문 |
| `/class` | 교실 프로젝터: 우리 반 다리(날씨로만) → 함께 놓기 → 개통 → 제자표 |
| `/teacher`, `/teacher/approve` | 교사: 오늘의 수업 예보(AI 근거·학생 정보 잠금), 아침 예외 결재 |
| `/checkin` | 슈퍼패스 운영 모드 "아침 징검다리" 교실 태블릿 체크인 |
| `/student/welcome`, `/student/river` | 첫 수업 안내·분리 동의, 나의 강 지도 |
| `/demo` | 시연 분할 화면 |

시연 단축키: `N` 다음 단계 · `T` 수업 시작 · `A` 승인 · `1`/`2`/`3` 학생/교실/교사 · `Shift+R` 처음부터 · 실험실 숨은 키 `K`

### 실행
```bash
npm install
cp .env.example .env.local   # LLM_API_KEY 등을 채운다(비우면 AI 없이 키워드·저장본으로 동작)
npm run dev                  # http://localhost:3000
```
- 발표 노트북: `npm run demo:local` (빌드 후 127.0.0.1에만 열림)
- 점검: `npm run check:secrets`(비밀값·번들 유출), `npm run check:api`(서버를 켠 뒤 API 점검, `AI=1`이면 실제 AI까지)
- 환경 변수: `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`(claude-haiku-5-5 권장), 선택 `LLM_DAILY_TOKENS`·`LLM_ANALYZE_TOKENS`·`LLM_DISABLED`·`ANALYZE_ENABLED` — 설명은 `.env.example`

### 백엔드 한눈에
- `POST /api/explain`: 도착 관문 판정(키워드 먼저 → 애매할 때만 AI, 근거가 학생 글에 있어야 인정, 학생에게는 미리 쓴 문장만)
- `POST /api/analyze`: 30명 말해보기 분석(5명씩 묶음, 저장본 `data/analysis.saved.json`, 배포 주소에서는 꺼짐)
- AI 호출은 `lib/llm.ts` 한 곳(안뇽GPT 게이트웨이의 Claude Haiku 5.5, 생각 끔·하루 토큰 상한·같은 질문 재사용). 측정: `docs/notes/token-fit.md`
- 학생·교실 화면은 공개 명단(`data/class-2-3.public.json`)만, 교사 화면만 전체 명단(`lib/rules/roster.ts`)

### 팀 다이버
정환희(데이터·AI·백엔드) · 신재우(화면·디자인) · 진선우(발표·학습 내용) · 김나희(학생 데이터·PPT)

### 출처·라이선스
- 실험실(`public/lab/`): 팀원이 실제 수업용으로 만든 한글 자음 실험실을 사용 동의를 받아 같은 출처 iframe으로 사용. 안에 포함된 외부 코드는 `NOTICE.md`
- 해례본 원문 「聲出稍厲 故加畫」은 공공 영역(1446). 교과서 지문·삽화는 옮기지 않고 팀이 쓴 요약만 사용
- 글꼴: Pretendard, Noto Serif KR, Black Han Sans(모두 SIL Open Font License)

## 문서
| 파일 | 내용 |
|---|---|
| [docs/SPEC.md](docs/SPEC.md) | 총기획안. 무엇을, 왜, 어떻게 만드는지의 기준 문서 |
| [docs/GAMIFICATION.md](docs/GAMIFICATION.md) | 징검런 규칙, 화면 문구, 페이스패스, 근거, 예상 질문 |
| [AGENTS.md](AGENTS.md) | AI 코딩 도구가 지킬 규칙 (CLAUDE.md는 이 파일을 불러옴) |

## 작업 분할 (11/14 10:15 확정 · 충돌 방지용)
**원칙: 한 파일의 주인은 한 명.** 남의 파일은 고치지 않고 말로 요청해요. 새 파일은 아래 표의 내 경로에만 만들어요.

### 신재우 — 학생·교실 화면 = 시그니처 90초
| 파일 | 할 일 |
|---|---|
| `app/layout.tsx`, `app/globals.css`, `app/page.tsx` | 글꼴·색 토큰, 시작 화면 (환희는 Tailwind 클래스만 씀) |
| `app/student/page.tsx` | S1 징검런 홈(진행 링, 1칸 남음, 오늘은 여기까지) |
| `app/student/stone/[id]/page.tsx` | S2 돌 굳히기(실험실 + 2문항 + 변형 + 첨벙) → 성공 시 `demo.reach(1)` |
| `app/student/explain/page.tsx` | S3 도착 관문 → `/api/explain` 호출, 통과 시 `demo.reach(2)` + 해례 |
| `app/class/page.tsx` | C1~C4 교실 다리, 물때, 함께 놓기 O/X(`demo.reach(4)`), 개통, 제자표 |
| `app/demo/page.tsx` | 분할 화면 배치 |
| `components/LabFrame.tsx` | `docs/notes/lab-integration.md` 코드 그대로 |
| `components/student/*`, `components/class/*`, `components/ProgressRing.tsx` | 학생·교실 전용 컴포넌트 |
| `components/StepBadge.tsx` | 13:15 전에는 지우지 않음(교사 화면이 씀) |
| `data/stones.json` | 돌 카드·굳히기 문항·함께 놓기 O/X·관문 질문과 문장 틀·해례 원문 (내용: 진선우) |
| `public/lab/`, `docs/design/*`(시안 제외), `docs/notes/재우.md` | 실험실 사본은 고치지 않음 |
| **11/14 11:55 환희에게서 넘겨받음** `app/teacher/*`(예보·결재·레이아웃), `app/checkin/page.tsx`, `app/student/welcome/page.tsx`, `app/student/river/page.tsx`, `components/teacher/*`, `components/DemoKeys.tsx`, `lib/student/me.ts` | 화면은 전부 재우. 화면별 설명·지키는 원칙·주의점은 `docs/notes/handoff-screens.md` |

### 정환희 — 데이터·AI·규칙·문서 (화면은 11/14 11:55부터 재우)
| 파일 | 할 일 |
|---|---|
| `lib/types.ts`, `lib/store.ts` | 주인. 재우가 필요한 필드·이벤트·시각 변경은 말로 요청 → 환희가 추가하고 바로 push |
| `lib/llm.ts`, `lib/prompts.ts`, `lib/content.ts`, `lib/rules/*` | AI 호출, 규칙(구간·예보·8유형·예외 제안). 화면 문구가 여기서 나오면 재우가 말로 요청 → 환희가 고침 |
| `app/api/*` | `/api/explain`, `/api/analyze` (예보·체크인은 API 없이 규칙·이벤트로) |
| `data/class-2-3.json`, `data/concepts.json`, `data/analysis.saved.json` | 30명, 개념·오개념·관문 키워드, AI 저장본 |
| `docs/SPEC.md`, `docs/GAMIFICATION.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `package.json` | 문서·설정은 환희만. 재우는 `docs/notes/재우.md`에 적고 알림 |

### 둘이 맞춘 약속 (바꾸려면 먼저 말하기)
- 라우트: `/`, `/student`, `/student/stone/[id]`, `/student/explain`, `/student/welcome`, `/student/river`, `/class`, `/teacher`, `/teacher/approve`, `/checkin`, `/demo`
- 단계 이동은 `demo.reach(n)`만 씀(1 ㅌ 완성 · 2 관문 통과 · 3 수업 시작 · 4 함께 놓기 · 5 개통). 시각은 `d.now`, `d.minutesToLesson`만 읽고 화면에 시각을 직접 쓰지 않음
- 돌 ID: `st-n`, `st-d`, `st-t`, `st-kk` · 시연 학생 `s07`
- `/api/explain`: 요청 `{ studentId, stoneId, text }` → 응답 `{ passed, ideas, misconception, feedback, source }`. 서버가 안 되면 화면은 "선생님이 확인할게요"로
- 오늘은 **새 패키지를 설치하지 않음**(애니메이션은 CSS로). 꼭 필요하면 환희가 설치하고 바로 push
- 다리 칸 숫자·개통 기준(80%)은 `data/` 값으로 계산해서 화면에 숫자를 직접 쓰지 않음

## 작업 규칙
1. 작업 시작 전과 push 직전에 `git pull --rebase`
2. 커밋할 때 `git add .` 대신 **내 파일 경로만** 적어서 add
3. 30분마다 작게 커밋·push, 메시지 앞에 `[환희]` 또는 `[재우]`
4. push 전에 `npm run build`와 `npm run check:secrets` 통과 확인
5. 남의 파일이 바뀌어 있으면(`git status`) 커밋하지 말고 `git restore 파일`로 되돌린 뒤 말하기. `next dev`가 `AGENTS.md`를 다시 쓰면 그대로 둠
6. 저장소 전체에 포맷터·`lint --fix`를 돌리지 않음
7. 충돌이 나면 상대 변경을 지우지 말고 같이 본다. AI 도구로 해결할 때도 상대 코드가 남아 있는지 확인한다
8. `.env.local`(API 키)은 절대 커밋하지 않는다. Vercel 환경 변수는 환희가 넣음
