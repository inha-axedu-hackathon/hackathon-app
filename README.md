# hackathon-app
2026 INHA AX-EDU 해커톤 팀 프로젝트

## 징검다리 · 팀 다이버
플립러닝 사전학습 결손을 수업 전에 찾아 메우는 교사 지원 서비스예요. 학생 게임 모드는 **징검런**이에요.

> 다리가 끊긴 곳에서 수업이 시작된다.

## 문서
| 파일 | 내용 |
|---|---|
| [docs/SPEC.md](docs/SPEC.md) | 총기획안. 무엇을, 왜, 어떻게 만드는지의 기준 문서 |
| [docs/GAMIFICATION.md](docs/GAMIFICATION.md) | 징검런 규칙, 화면 문구, 페이스패스, 근거, 예상 질문 |
| [CLAUDE.md](CLAUDE.md) | AI 코딩 도구가 지킬 규칙 |

## 폴더와 담당
코드 폴더는 Next.js 세팅 후에 생겨요. 담당이 아닌 폴더는 말하고 고쳐요.

| 폴더 | 내용 | 담당 |
|---|---|---|
| `docs/` | 기획 문서 (SPEC, GAMIFICATION) | 정환희 |
| `docs/design/` | 화면 시안, 캡처 | 신재우 |
| `docs/notes/` | 각자 메모 (`docs/notes/이름.md`) | 본인 |
| `lib/`, `data/`, `app/api/` | 타입, 시연 상태, 규칙, AI, 데이터, API | 정환희 |
| `app/teacher/`, `app/checkin/`, `app/student/welcome/` | 교사 화면, 교실 태블릿 체크인, 안내·동의 | 정환희 |
| `app/student/`(welcome 제외), `app/class/`, `app/demo/`, `components/`, `public/lab/` | 학생·교실·시연 화면, 공용 컴포넌트, 실험실 사본 | 신재우 |

## 작업 규칙
1. 작업 시작 전에 `git pull --rebase`
2. 내 담당 폴더만 고친다.
3. 공용 파일(`lib/types.ts`, `lib/store.ts`, `package.json`)은 정환희가 관리한다. 바꿀 일이 있으면 말한다.
4. 30~40분마다 작게 커밋하고, 메시지 앞에 `[환희]` 또는 `[재우]`를 붙인다.
5. push 전에 `npm run build`가 통과하는지 확인한다.
6. `.env.local`(API 키)은 절대 커밋하지 않는다.
