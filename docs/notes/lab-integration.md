> 검토 에이전트가 실험실 소스를 직접 읽고 실행해 확인한 연동 방법이에요(11/14 새벽). components/LabFrame.tsx를 만들 때 이대로 쓰면 돼요.


### 확인한 사실 (실험실 소스 + 같은 출처 iframe에서 실행)
- **window.__lab**
  - 실험실 스크립트 맨 끝에서 만들어져요(2583행).
  - 들어 있는 것: snapshot, boardEl, setCards, cardsOpen, draw.
  - snapshot().c 구조: { cur, made[], ach, tier, status, warn, title }
- **c.made 주의점**
  - made는 '만든 적 있는' 글자 전체예요(상형 제외). localStorage hg-cons에서 불러오기 때문에 지난 리허설 기록까지 들어 있어요.
  - 그래서 완성 판정은 c.cur === 목표로 해요. 작업판에 지금 그 글자가 있다는 뜻이에요.
- **solo 모드**
  - sessionStorage hg-class = {"role":"solo"}이면 head 스크립트가 data-role=solo를 붙여요. 그러면 참여 화면이 숨고, PeerJS도 불러오지 않아요.
  - 부모 페이지가 써 둔 값을 같은 출처 iframe이 그대로 읽어요(같은 탭은 sessionStorage를 공유해요).
- **localStorage 키**
  - solo에서는 접두어 없이 저장돼요: hg-cons(만든 글자), hg-cons-ach(달성한 과제), hg-cons-tries(틀린 획 횟수), hg-cons-solved(자음에서는 늘지 않아요).
  - hg-cards-gate는 solo에서 쓰지 않아요.
- **작업판 시작 상태**
  - 작업판은 항상 ㄱ에서 시작하고, 바깥에서 작업판 글자를 정하는 API가 없어요.
  - 대신 '#c-bases .tool[data-val="ㄴ"]'에 keydown Enter를 보내면 작업판이 ㄴ이 돼요(실행으로 확인).
  - 그다음 위 가로획을 그으면 ㄷ, 가운데 가로획을 그으면 ㅌ이 돼요. 즉 시연은 획 2번이에요.
- **승급 팝업**
  - 기록이 빈 상태에서 첫 가획을 만들면 승급 팝업(#rankup)이 떠서 작업판을 가려요.
  - 로드 전에 hg-cons-ach=["first"]를 써 두면 팝업이 뜨지 않아요(실행으로 확인).
- **리셋**
  - 키만 지우면 iframe 메모리는 그대로 남아요. 리셋은 반드시 새로고침까지 해야 해요(store의 demo.reset이 이렇게 해요).
- **외부 의존**
  - PeerJS는 교사·학생 역할에서만 불러와요.
  - 인터넷이 필요한 건 Google Fonts뿐이에요(오프라인이면 시스템 글꼴로 바뀌고 동작은 정상).
  - fetch, window.top, CSP가 없어서 iframe에 넣어도 문제없어요.
  - Netlify HUD 스크립트는 우리 서버에서 404가 나요(무해). 11-0에서 그 줄을 지워요.
- **동기화 대안:** iframe이 localStorage를 쓰면 부모 window에 storage 이벤트가 도착해요(폴링 대신 쓸 수도 있어요).

### components/LabFrame.tsx
```tsx
"use client";
// components/LabFrame.tsx — public/lab 실험실을 같은 출처 iframe으로 띄우고 목표 글자 완성을 감지
import { useEffect, useRef, useState } from "react";

type LabSnap = { tab: string; c: { cur: string | null; made: string[]; ach: number; tier: number } };
type LabWin = Window & { __lab?: { snapshot(): LabSnap } };
type Props = { target: string; seed?: string; onDone: () => void; onKey?: (e: KeyboardEvent) => void };

export function LabFrame({ target, seed, onDone, onKey }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const done = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("hg-class", JSON.stringify({ role: "solo" })); // 참여 화면 없이 '혼자 해 보기'
    localStorage.setItem("hg-cons-ach", JSON.stringify(["first"])); // 첫 가획 승급 팝업이 뜨지 않게
    setReady(true); // 두 값을 쓴 뒤에 iframe을 만든다(서버 HTML에는 iframe을 넣지 않음)
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      const snap = (ref.current?.contentWindow as LabWin | null | undefined)?.__lab?.snapshot();
      if (snap && !done.current && snap.c.cur === target) { done.current = true; onDone(); } // 작업판에 목표 글자
    }, 500);
    return () => clearInterval(timer);
  }, [ready, target, onDone]);

  const onLoad = () => {
    const doc = ref.current?.contentDocument, win = ref.current?.contentWindow;
    if (!doc || !win) return;
    const st = doc.createElement("style");
    st.textContent = "#solo-pill,#rankup,#toast{display:none!important}"; // '수업에 참여하기'·승급·알림 숨김
    doc.head.appendChild(st);
    // 작업판에 기본자를 미리 올린다(ㅌ은 seed="ㄴ" → 위 가로획 ㄷ → 가운데 가로획 ㅌ). ㄷ을 바로 올리는 방법은 없다
    if (seed) doc.querySelector(`#c-bases .tool[data-val="${seed}"]`)?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    if (onKey) win.addEventListener("keydown", onKey); // 포커스가 iframe 안에 있어도 K·N 키가 먹게
  };

  if (!ready) return null;
  return <iframe ref={ref} src="/lab/index.html#consonant" onLoad={onLoad} title="한글 창제 원리 실험실" className="h-[70vh] w-full rounded-xl border" />;
}
```

### 돌 굳히기 페이지에서 쓰는 법
- **ㅌ 돌:** <LabFrame target="ㅌ" seed="ㄴ" onDone={labDone} onKey={(e) => (e.code === "KeyK" ? labDone() : handleDemoKey(e, (p) => router.push(p)))} />
- **ㄲ 돌:** target="ㄲ", seed="ㄱ". 같은 글자 도구를 오른쪽 칸에 놓으면 ㄲ이 돼요.
- **params:** 서버 page.tsx에서 const { id } = await params;로 받아요(id는 ASCII, 예: st-t).
- **완성 뒤 흐름:** labDone이 불리면 굳히기 2문항 → 다 맞히면 demo.reach(1)
- **숨은 키 K:** labDone과 같은 일을 해요. LabFrame이 iframe 안에서 누른 키도 전달하기 때문에, 포커스가 실험실 안에 있어도 먹어요.
- **조작 순서(연습해 두기):** ㄴ이 올라간 상태에서 시작 → 가로획을 작업판 '위' 점선에 → 가로획을 '가운데' 점선에. 이렇게 2번이에요.