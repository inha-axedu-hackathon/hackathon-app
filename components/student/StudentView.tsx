"use client";
// 학생 화면 (담당: 신재우). 디자인 캔버스 "징검다리 · 디자인"의 Student 아트보드를 자동 변환 (scratchpad/dc2jsx.py). 값은 props로 받는다. 손으로 고칠 때는 문구·구조만.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import "./student.css";

export function StudentView(v: Record<string, any>) {
  const { variantLabel, crossing, logout, words, answer, labSlot, freeText, setFree, gateMsg, busy, afterOk, b1, b2, controls, d1, d2, d3, fbNo, fbOk, finish, frameTab, freeTab, goConcept, goGate, goHome, goLab, goPass, goQuiz, heroLine, heroSub, inStone, isConcept, isGate, isHome, isLab, isPass, isQuiz, isSplash, liteCls, okLabel, opts, qExplain, qFix, qTag, qText, ringColor, ringDash, ringLabel, ringText, segA, segB, setB1, setB2, star2, star2c, star2w, stepName, tDone, tLabel, tNext, tOpen, tWet, tabFrame, tabFree, titleName, toVariant } = v;
  return (
    <>
<div className={`tab on-light ${liteCls}`} style={{fontFamily: "'Pretendard Variable', Pretendard, sans-serif"} as any}>

  
  <header style={{height: '64px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid #ECE9E1'} as any}>
    <div style={{display: 'flex', alignItems: 'center', gap: '14px'} as any}>
      <span className="stone" style={{'--s': '34px', fontSize: '0'} as any}></span>
      <span style={{fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em'} as any}>징검런</span>
      <span style={{width: '1px', height: '18px', background: '#DCD7CC'} as any}></span>
      <span style={{fontSize: '15px', color: '#4A4641'} as any}>국어의 문자 체계 · 3교시 전까지</span>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#6B665F'} as any}>
      <span style={{display: 'flex', alignItems: 'center', gap: '6px'} as any}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M6.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>교실 태블릿 · 슈퍼패스로 들어옴</span>
      <span style={{display: 'flex', alignItems: 'center', gap: '8px', background: '#F7F6F2', borderRadius: '999px', padding: '6px 14px 6px 8px', color: '#1C1A18', fontSize: '14px', fontWeight: '700'} as any}><span className="serif" style={{width: '26px', height: '26px', borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', fontWeight: '900', boxShadow: 'inset 0 0 0 1px #E3E0D6'} as any}>ㆁ</span>옛이응</span>
    </div>
  </header>

  <div style={{flex: '1', minHeight: '0', display: 'flex'} as any}>
    
    <aside style={{width: '340px', flex: 'none', borderRight: '1px solid #ECE9E1', padding: '36px 32px 28px', display: 'flex', flexDirection: 'column', gap: '22px', background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFAF7 100%)'} as any}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center'} as any}>
        <svg width="188" height="188" viewBox="0 0 188 188" role="img" aria-label={ringLabel}>
          <circle cx="94" cy="94" r="78" fill="none" stroke="#F6E9EC" strokeWidth="16" />
          <circle cx="94" cy="94" r="78" fill="none" stroke={ringColor} strokeWidth="16" strokeLinecap="round" pathLength="3" strokeDasharray={ringDash} transform="rotate(-90 94 94)" className="t" style={{transition: 'stroke-dasharray 600ms var(--ease-standard), stroke 600ms'} as any} />
          <circle cx="94" cy="94" r="62" fill="none" stroke="#ECE9E1" strokeWidth=".8" />
          <text x="94" y="104" textAnchor="middle" fontSize="40" fontWeight="800" fill="#1C1A18" fontFamily="Pretendard Variable, sans-serif" style={{fontVariantNumeric: 'tabular-nums'} as any}>{ringText}</text>
          <text x="94" y="128" textAnchor="middle" fontSize="13" fontWeight="600" fill="#6B665F" fontFamily="Pretendard Variable, sans-serif">오늘의 링</text>
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', gap: '6px'} as any}>
          <span style={{fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em'} as any}>{heroLine}</span>
          <span style={{fontSize: '17px', color: '#4A4641'} as any}>{heroSub}</span>
        </div>
      </div>
      <div className="hair"></div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'} as any}>
        <span style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#6B665F'} as any}>이번 단원 별 <span style={{fontWeight: '600'} as any}>나만 봐요</span></span>
        <span style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '700'} as any}><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="#C9A227" /></svg>굳힘</span>
        <span style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '700', color: star2c} as any}><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill={star2} stroke="#B5AFA4" strokeWidth={star2w} /></svg>설명</span>
        <span style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '700', color: '#6B665F'} as any}><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="none" stroke="#B5AFA4" strokeWidth="1.8" /></svg>일주일 뒤에도</span>
      </div>
      <div className="hair"></div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'} as any}>
        {(crossing) && (<span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4A4641'} as any}><span className="pulse" style={{width: '8px', height: '8px', borderRadius: '50%', background: '#9B3A51'} as any}></span>지금 친구들도 함께 건너는 중</span>)}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px'} as any}><span style={{color: '#6B665F'} as any}>칭호</span><b style={{color: '#B0371F'} as any}>{titleName}</b></div>
      <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'} as any}>
        <button type="button" className="btns" onClick={logout} style={{width: '100%'} as any}>오늘은 여기까지 · 로그아웃</button>
        <span style={{display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center', fontSize: '12px', color: '#6B665F', textAlign: 'center'} as any}><svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>놓은 칸은 안 사라져요 · 성적·학생부에 들어가지 않아요</span>
      </div>
    </aside>

    <main className="main">
      
      {(inStone) && (<>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '26px'} as any}>
          <button type="button" className="back" onClick={goHome} aria-label="내 돌로"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="#1C1A18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <span style={{fontSize: '18px', fontWeight: '800'} as any}>ㅌ 돌 굳히기</span>
          <span style={{fontSize: '16px', color: '#6B665F'} as any}>{stepName}</span>
          <span className="dots" aria-hidden="true" style={{marginLeft: 'auto'} as any}><i className={d1}></i><i className={d2}></i><i className={d3}></i></span>
        </div>
      </>)}

      
      {(isHome) && (<>
        <div className="scr">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'} as any}>
            <div><h1 style={{margin: '0', fontSize: '34px', fontWeight: '800', letterSpacing: '-0.03em'} as any}>내 돌</h1><p style={{margin: '6px 0 0', fontSize: '16px', color: '#4A4641'} as any}>ㄴ에서 ㅌ까지 · 선생님이 놓아 준 나만의 길</p></div>
          </div>
          <div style={{position: 'relative', height: '262px', borderRadius: '28px', overflow: 'hidden', background: 'linear-gradient(180deg, #FFFFFF 0%, #F1FBF7 100%)', boxShadow: 'inset 0 0 0 1px #E3F2EC'} as any}>
            <svg width="100%" height="262" viewBox="0 0 744 262" preserveAspectRatio="none" style={{position: 'absolute', inset: '0'} as any} aria-hidden="true">
              <defs>
                <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A9ECDA" /><stop offset=".3" stopColor="#5ED0B3" /><stop offset=".7" stopColor="#1FA88C" /><stop offset="1" stopColor="#0E7D6A" /></linearGradient>
                <radialGradient id="rvg" cx=".3" cy=".1" r=".6"><stop offset="0" stopColor="#E9FFF8" stopOpacity=".8" /><stop offset="1" stopColor="#E9FFF8" stopOpacity="0" /></radialGradient>
              </defs>
              <path d="M0 132 C120 112 220 152 372 134 S 620 112 744 128 L744 262 L0 262Z" fill="url(#rv)" />
              <path d="M0 132 C120 112 220 152 372 134 S 620 112 744 128 L744 262 L0 262Z" fill="url(#rvg)" />
              <path d="M0 132 C120 112 220 152 372 134 S 620 112 744 128" fill="none" stroke="#FFFFFF" strokeOpacity=".9" strokeWidth="3" />
              <g fill="#FFFFFF" fillOpacity=".35"><ellipse cx="150" cy="200" rx="46" ry="3" /><ellipse cx="420" cy="226" rx="60" ry="3" /><ellipse cx="640" cy="196" rx="40" ry="3" /></g>
            </svg>
            <div style={{position: 'absolute', left: '5%', top: '66px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px'} as any}><div className="stone start" style={{'--s': '96px'} as any}>ㄴ</div><span style={{fontSize: '13px', fontWeight: '700', color: '#fff', background: 'rgba(8,72,62,.35)', padding: '3px 10px', borderRadius: '999px'} as any}>출발 돌</span></div>
            <div style={{position: 'absolute', left: '31%', top: '76px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px'} as any}><div className="stone" style={{'--s': '96px'} as any}>ㄷ</div><span style={{fontSize: '13px', fontWeight: '700', color: '#fff', background: 'rgba(8,72,62,.35)', padding: '3px 10px', borderRadius: '999px'} as any}>놓인 돌</span></div>
            <div style={{position: 'absolute', left: '57%', top: '62px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px'} as any}>
              {(tNext) && (<><div className="stone next loop-bob" style={{'--s': '96px'} as any}>ㅌ</div></>)}
              {(tWet) && (<><div className="stone wet" style={{'--s': '96px'} as any}>ㅌ</div></>)}
              {(tDone) && (<><div className="stone gold" style={{'--s': '96px'} as any}>ㅌ</div></>)}
              <span style={{fontSize: '13px', fontWeight: '700', color: '#fff', background: 'rgba(8,72,62,.35)', padding: '3px 10px', borderRadius: '999px'} as any}>{tLabel}</span>
            </div>
            <div className="boat cross" style={{left: '2%', top: '176px', '--bx': '520px', '--bd': '22s'} as any}><svg width="70" height="54" viewBox="0 0 120 94" aria-hidden="true" style={{overflow: 'visible'} as any}><defs><linearGradient id="b109h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8BC82" /><stop offset=".45" stopColor="#B98349" /><stop offset="1" stopColor="#7F5330" /></linearGradient><linearGradient id="b109s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F3E9D6" /></linearGradient><radialGradient id="b109l" cx=".45" cy=".4" r=".6"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".6" stopColor="#FFE7B0" /><stop offset="1" stopColor="#EDC27A" /></radialGradient></defs><ellipse cx="60" cy="80" rx="56" ry="7" fill="#073F37" fillOpacity=".28" /><path d="M14 78 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#E8FFF8" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" /><rect x="57.5" y="8" width="4.5" height="48" rx="2.2" fill="#6E4A2C" /><path d="M63 13 C82 22 92 36 94 50 L63 50Z" fill="url(#b109s)" stroke="#E2D3B8" strokeWidth="1" /><path d="M63 33 C74 35 86 38 92 42" stroke="#E8A1B0" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M56 18 C46 26 40 38 38 50 L56 50Z" fill="url(#b109s)" stroke="#E2D3B8" strokeWidth="1" opacity=".92" /><path d="M61 8 L76 12 L61 16Z" fill="#C9798A" /><path d="M8 54 Q60 64 112 54 Q108 64 98 72 Q60 84 22 72 Q12 64 8 54Z" fill="url(#b109h)" /><path d="M10 55.5 Q60 65.5 110 55.5" fill="none" stroke="#FCE3BE" strokeWidth="2.6" strokeLinecap="round" /><path d="M17 64 Q60 73 103 64" fill="none" stroke="#C9798A" strokeWidth="3.2" strokeLinecap="round" /><path d="M30 70 q4 1.6 8 1.8 M80 71.6 q4 -.2 8 -1.8" stroke="#6B4426" strokeOpacity=".45" strokeWidth="1.4" strokeLinecap="round" /></svg></div>
            <div style={{position: 'absolute', right: '4%', top: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'} as any}>
              <svg width="118" height="94" viewBox="0 0 200 160" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="g110w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#EEE7D8" /></linearGradient><linearGradient id="g110s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B737A" /><stop offset=".6" stopColor="#363C42" /><stop offset="1" stopColor="#22262A" /></linearGradient><linearGradient id="g110d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7A5536" /><stop offset=".5" stopColor="#B48A5E" /><stop offset="1" stopColor="#7A5536" /></linearGradient><linearGradient id="g110v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF6DD" /><stop offset=".45" stopColor="#C5F3E5" /><stop offset="1" stopColor="#3EC2A2" /></linearGradient><radialGradient id="g110l" cx=".45" cy=".4" r=".6"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".6" stopColor="#FFE7B0" /><stop offset="1" stopColor="#EDC27A" /></radialGradient><clipPath id="g110c"><path d="M40 52 C62 48 76 38 84 24 L116 24 C124 38 138 48 160 52 C152 56 142 55 134 52 L66 52 C58 55 48 56 40 52Z" /></clipPath></defs><ellipse cx="100" cy="150" rx="96" ry="7" fill="#3C2814" fillOpacity=".12" /><rect x="8" y="80" width="52" height="66" rx="2" fill="url(#g110w)" stroke="#E4DCCB" /><rect x="8" y="126" width="52" height="20" fill="#D9CEB9" /><path d="M8 136 h52 M26 126 v10 M44 136 v10" stroke="#BFB29A" strokeWidth="1" /><rect x="140" y="80" width="52" height="66" rx="2" fill="url(#g110w)" stroke="#E4DCCB" /><rect x="140" y="126" width="52" height="20" fill="#D9CEB9" /><path d="M140 136 h52 M158 126 v10 M176 136 v10" stroke="#BFB29A" strokeWidth="1" /><path d="M0 82 Q32 72 64 82 L60 87 L4 87Z" fill="url(#g110s)" /><path d="M136 82 Q168 72 200 82 L196 87 L140 87Z" fill="url(#g110s)" /><rect x="71" y="58" width="58" height="88" fill="url(#g110v)" /><circle cx="100" cy="86" r="9" fill="#FFE9A8" fillOpacity=".9" /><path d="M71 118 C86 112 114 124 129 116 L129 146 L71 146Z" fill="#1FA88C" fillOpacity=".55" /><path d="M71 60 L88 65 L88 140 L71 146Z" fill="url(#g110d)" /><path d="M129 60 L112 65 L112 140 L129 146Z" fill="url(#g110d)" /><g fill="#E3C35C"><circle cx="79" cy="78" r="1.6" /><circle cx="79" cy="96" r="1.6" /><circle cx="79" cy="114" r="1.6" /><circle cx="121" cy="78" r="1.6" /><circle cx="121" cy="96" r="1.6" /><circle cx="121" cy="114" r="1.6" /></g><rect x="62" y="54" width="9" height="94" rx="2" fill="url(#g110d)" /><rect x="129" y="54" width="9" height="94" rx="2" fill="url(#g110d)" /><rect x="56" y="50" width="88" height="8" rx="2" fill="#5E412A" /><path d="M40 52 C62 48 76 38 84 24 L116 24 C124 38 138 48 160 52 C152 56 142 55 134 52 L66 52 C58 55 48 56 40 52Z" fill="url(#g110s)" /><g clipPath="url(#g110c)" stroke="#fff" strokeOpacity=".14" strokeWidth="1"><path d="M70 26v30M78 26v30M86 26v30M94 26v30M102 26v30M110 26v30M118 26v30M126 26v30M134 26v30" /></g><path d="M46 52 C64 49 77 41 85 27" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.1" /><path d="M80 24 C84 17 116 17 120 24" fill="none" stroke="#1C2024" strokeWidth="4.5" strokeLinecap="round" /><path d="M78 23 c-3 -1 -5 -4 -5 -7 M122 23 c3 -1 5 -4 5 -7" fill="none" stroke="#1C2024" strokeWidth="2.6" strokeLinecap="round" /><rect x="87" y="38" width="26" height="11" rx="1.5" fill="#1C1A18" stroke="#C9A227" strokeWidth=".7" /><text x="100" y="46.4" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#E3C35C" fontFamily="Noto Serif KR, serif" letterSpacing=".8">도착</text><path d="M48 54 v8" stroke="#3A2C20" strokeWidth="1.2" /><circle cx="48" cy="72" r="13" fill="#FFE7B0" fillOpacity=".35" className="loop" style={{animation: 'jg-shimmer 3s ease-in-out infinite'} as any} /><rect x="43" y="61" width="10" height="2.4" rx="1" fill="#5A3A22" /><ellipse cx="48" cy="71.5" rx="7" ry="8.8" fill="url(#g110l)" /><path d="M41.5 68.5 h13 M41.5 74.5 h13" stroke="#C9798A" strokeWidth="1.6" /><rect x="43" y="80" width="10" height="2.4" rx="1" fill="#5A3A22" /><path d="M48 82.4 v5" stroke="#C9798A" strokeWidth="1.4" strokeLinecap="round" /><path d="M152 54 v8" stroke="#3A2C20" strokeWidth="1.2" /><circle cx="152" cy="72" r="13" fill="#FFE7B0" fillOpacity=".35" className="loop" style={{animation: 'jg-shimmer 3s ease-in-out infinite'} as any} /><rect x="147" y="61" width="10" height="2.4" rx="1" fill="#5A3A22" /><ellipse cx="152" cy="71.5" rx="7" ry="8.8" fill="url(#g110l)" /><path d="M145.5 68.5 h13 M145.5 74.5 h13" stroke="#C9798A" strokeWidth="1.6" /><rect x="147" y="80" width="10" height="2.4" rx="1" fill="#5A3A22" /><path d="M152 82.4 v5" stroke="#C9798A" strokeWidth="1.4" strokeLinecap="round" /></svg>
              <span style={{fontSize: '13px', fontWeight: '800', color: '#9B3A51', background: '#fff', borderRadius: '999px', padding: '5px 12px', boxShadow: '0 4px 12px rgba(155,58,81,.15)'} as any}>도착 관문</span>
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px'} as any}>
            <div className="card" style={{padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px'} as any}><span style={{fontSize: '12px', fontWeight: '700', color: '#9B3A51'} as any}>출발 돌</span><b style={{fontSize: '18px'} as any}>ㄴ · 기본자</b><span style={{fontSize: '14px', color: '#6B665F', lineHeight: '1.5'} as any}>영상 질문을 첫 시도에 맞혀 켜져 있어요</span></div>
            <div className="card" style={{padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px'} as any}><span style={{fontSize: '12px', fontWeight: '700', color: '#9B3A51'} as any}>놓인 돌</span><b style={{fontSize: '18px'} as any}>ㄴ → ㄷ · 가획</b><span style={{fontSize: '14px', color: '#6B665F', lineHeight: '1.5'} as any}>첨벙! 한 칸 놓음</span></div>
            <div className="card" style={{padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 0 0 2px #9B3A51, 0 12px 28px rgba(155,58,81,.12)'} as any}>
              <span style={{fontSize: '12px', fontWeight: '700', color: '#9B3A51'} as any}>{tLabel}</span><b style={{fontSize: '18px'} as any}>ㄷ → ㅌ · 가획</b>
              {(tDone) && (<><span style={{fontSize: '14px', color: '#6B665F'} as any}>도착 관문까지 통과</span></>)}
              {(tOpen) && (<><button type="button" className="btnp" onClick={goConcept} style={{minHeight: '52px', fontSize: '17px'} as any}>밟기 · 4분</button></>)}
            </div>
          </div>
        </div>
      </>)}

      
      {(isConcept) && (<>
        <div className="scr" style={{flexDirection: 'row', gap: '40px', alignItems: 'stretch'} as any}>
          <div style={{flex: '1.1', borderRadius: '28px', background: 'radial-gradient(80% 70% at 50% 40%, #FFFFFF 0%, #F3F1EA 100%)', boxShadow: 'inset 0 0 0 1px #ECE9E1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '26px'} as any}>
            <div className="stone" style={{'--s': '120px'} as any}>ㄷ</div>
            <svg width="44" height="44" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 20h24M20 8v24" stroke="#9B3A51" strokeWidth="3.5" strokeLinecap="round" /></svg>
            <div className="stone next loop-bob" style={{'--s': '170px'} as any}>ㅌ</div>
          </div>
          <div style={{flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px'} as any}>
            <span style={{fontSize: '14px', fontWeight: '700', color: '#9B3A51'} as any}>개념 카드</span>
            <h2 style={{margin: '0', fontSize: '38px', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '1.25'} as any}>ㄷ에 획을 하나 더하면 ㅌ</h2>
            <p style={{margin: '0', fontSize: '19px', lineHeight: '1.7', color: '#4A4641'} as any}>소리가 조금 세게 나면 획을 하나 더해요.</p>
            <div className="serif" style={{fontSize: '26px', fontWeight: '700', color: '#6B665F', letterSpacing: '.08em'} as any}>聲出稍厲 故加畫</div>
            <button type="button" className="btnp" onClick={goLab} style={{alignSelf: 'flex-start', marginTop: '12px'} as any}>실험실에서 만들어 보기</button>
          </div>
        </div>
      </>)}

      
      {(isLab) && (<>
        <div className="scr" style={{gap: '16px'} as any}>
          <div style={{flex: '1', display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', boxShadow: 'inset 0 0 0 1.5px #DCD7CC', background: '#fff'} as any}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: '#F7F6F2', fontSize: '13px', color: '#6B665F'} as any}><span style={{fontWeight: '700', color: '#1C1A18'} as any}>실험실 · 목표 글자 ㅌ</span><span>한글 창제 원리 실험실 · 팀원 제작</span></div>
            <div style={{flex: '1', position: 'relative', display: 'flex'} as any}>{labSlot}</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'} as any}>
            <span style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#4A4641'} as any}><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="loop" style={{animation: 'spin 1.2s linear infinite'} as any}><circle cx="12" cy="12" r="9" fill="none" stroke="#F6E9EC" strokeWidth="3" /><path d="M21 12a9 9 0 00-9-9" fill="none" stroke="#9B3A51" strokeWidth="3" strokeLinecap="round" /></svg>ㅌ이 만들어지면 자동으로 넘어가요</span>
            {(controls) && (<><button type="button" className="btns" onClick={goQuiz} style={{color: '#6B665F', fontSize: '14px'} as any}>시연: 완성 처리 (숨은 키 K)</button></>)}
          </div>
        </div>
      </>)}

      
      {(isQuiz) && (<>
        <div className="scr" style={{maxWidth: '760px'} as any}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'} as any}><span className="num" style={{fontSize: '14px', fontWeight: '800', color: '#9B3A51'} as any}>{qTag}</span><h2 style={{margin: '0', fontSize: '32px', fontWeight: '800', lineHeight: '1.35', letterSpacing: '-0.02em'} as any}>{qText}</h2></div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'} as any}>
            {(opts as any[]).map((o: any, __i: number) => (<Fragment key={__i}>
              <button type="button" className={o.cls} onClick={o.pick}><span className="mk">{o.mark}</span><span className={o.font}>{o.text}</span></button>
            </Fragment>))}
          </div>
          {(fbOk) && (<>
            <div role="status" style={{display: 'flex', alignItems: 'center', gap: '16px', background: '#F9ECEF', borderRadius: '18px', padding: '18px 22px', animation: 'rise-in 320ms var(--ease-standard) both'} as any}>
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" style={{flex: 'none'} as any}><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#9B3A51" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{flex: '1', fontSize: '16px', lineHeight: '1.6'} as any}><b style={{color: '#7E2C42'} as any}>맞았어요.</b> {qExplain}</span>
              <button type="button" className="btnp" onClick={afterOk} style={{minHeight: '52px', padding: '0 24px', fontSize: '17px'} as any}>{okLabel}</button>
            </div>
          </>)}
          {(fbNo) && (<>
            <div role="status" style={{display: 'flex', alignItems: 'center', gap: '16px', background: '#F7F6F2', borderRadius: '18px', padding: '18px 22px', animation: 'rise-in 320ms var(--ease-standard) both'} as any}>
              <span style={{flex: '1', display: 'flex', flexDirection: 'column', gap: '4px'} as any}><b style={{fontSize: '19px'} as any}>아깝다, 한 번 더 두드려 봐</b><span style={{fontSize: '15px', lineHeight: '1.6', color: '#4A4641'} as any}>{qFix}</span></span>
              <button type="button" className="btnp" onClick={toVariant} style={{minHeight: '52px', padding: '0 24px', fontSize: '17px'} as any}>{variantLabel}</button>
            </div>
          </>)}
        </div>
      </>)}

      
      {(isSplash) && (<>
        <div className="scr" style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '22px'} as any}>
          <div style={{position: 'relative', width: '460px', height: '280px'} as any}>
            <div style={{position: 'absolute', left: '40px', right: '40px', bottom: '30px', height: '90px', borderRadius: '50%', background: 'radial-gradient(closest-side, #5ED0B3, #CDEFE4 78%, rgba(205,239,228,0))'} as any}></div>
            <i className="ripple a" style={{top: '205px'} as any}></i><i className="ripple r2 a" style={{top: '205px'} as any}></i><i className="ripple r3 a" style={{top: '205px'} as any}></i>
            <div className="stone a" style={{'--s': '150px', position: 'absolute', left: '155px', top: '100px', animation: 'drop-in 1000ms var(--ease-bouncy) both'} as any}>ㅌ</div>
          </div>
          <div className="a" style={{fontSize: '44px', fontWeight: '800', letterSpacing: '-0.03em', animation: 'pop-in 600ms var(--ease-bouncy) 900ms both'} as any}>첨벙! 한 칸 놓음</div>
          <div className="a" style={{fontSize: '17px', color: '#4A4641', animation: 'rise-in 600ms var(--ease-standard) 1200ms both'} as any}>교실 다리에도 한 칸 놓였어요 · <b style={{color: '#1C1A18'} as any}>도착 관문이 열렸어요</b></div>
          <button type="button" className="btnp a" onClick={goGate} style={{marginTop: '6px', animation: 'rise-in 600ms var(--ease-standard) 1400ms both'} as any}>도착 관문으로</button>
        </div>
      </>)}

      
      {(isGate) && (<>
        <div className="scr" style={{gap: '20px'} as any}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px'} as any}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '560px'} as any}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '800', color: '#9B3A51'} as any}><span style={{width: '22px', height: '2px', background: '#C9798A', borderRadius: '2px'} as any}></span>도착 관문 · 말해보기</span>
              <h2 style={{margin: '0', fontSize: '34px', fontWeight: '800', lineHeight: '1.32', letterSpacing: '-0.03em'} as any}>ㅌ은 왜 ㄷ에 획을<br />하나 더해 만들었을까?</h2>
              <p style={{margin: '0', fontSize: '17px', color: '#4A4641'} as any}>내 말로 설명하면 오늘의 길이 완성돼요.</p>
            </div>
            <svg width="176" height="140" viewBox="0 0 200 160" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="g111w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#EEE7D8" /></linearGradient><linearGradient id="g111s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B737A" /><stop offset=".6" stopColor="#363C42" /><stop offset="1" stopColor="#22262A" /></linearGradient><linearGradient id="g111d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7A5536" /><stop offset=".5" stopColor="#B48A5E" /><stop offset="1" stopColor="#7A5536" /></linearGradient><linearGradient id="g111v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF6DD" /><stop offset=".45" stopColor="#C5F3E5" /><stop offset="1" stopColor="#3EC2A2" /></linearGradient><radialGradient id="g111l" cx=".45" cy=".4" r=".6"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".6" stopColor="#FFE7B0" /><stop offset="1" stopColor="#EDC27A" /></radialGradient><clipPath id="g111c"><path d="M40 52 C62 48 76 38 84 24 L116 24 C124 38 138 48 160 52 C152 56 142 55 134 52 L66 52 C58 55 48 56 40 52Z" /></clipPath></defs><ellipse cx="100" cy="150" rx="96" ry="7" fill="#3C2814" fillOpacity=".12" /><rect x="8" y="80" width="52" height="66" rx="2" fill="url(#g111w)" stroke="#E4DCCB" /><rect x="8" y="126" width="52" height="20" fill="#D9CEB9" /><path d="M8 136 h52 M26 126 v10 M44 136 v10" stroke="#BFB29A" strokeWidth="1" /><rect x="140" y="80" width="52" height="66" rx="2" fill="url(#g111w)" stroke="#E4DCCB" /><rect x="140" y="126" width="52" height="20" fill="#D9CEB9" /><path d="M140 136 h52 M158 126 v10 M176 136 v10" stroke="#BFB29A" strokeWidth="1" /><path d="M0 82 Q32 72 64 82 L60 87 L4 87Z" fill="url(#g111s)" /><path d="M136 82 Q168 72 200 82 L196 87 L140 87Z" fill="url(#g111s)" /><rect x="71" y="58" width="58" height="88" fill="url(#g111v)" /><circle cx="100" cy="86" r="9" fill="#FFE9A8" fillOpacity=".9" /><path d="M71 118 C86 112 114 124 129 116 L129 146 L71 146Z" fill="#1FA88C" fillOpacity=".55" /><path d="M71 60 L88 65 L88 140 L71 146Z" fill="url(#g111d)" /><path d="M129 60 L112 65 L112 140 L129 146Z" fill="url(#g111d)" /><g fill="#E3C35C"><circle cx="79" cy="78" r="1.6" /><circle cx="79" cy="96" r="1.6" /><circle cx="79" cy="114" r="1.6" /><circle cx="121" cy="78" r="1.6" /><circle cx="121" cy="96" r="1.6" /><circle cx="121" cy="114" r="1.6" /></g><rect x="62" y="54" width="9" height="94" rx="2" fill="url(#g111d)" /><rect x="129" y="54" width="9" height="94" rx="2" fill="url(#g111d)" /><rect x="56" y="50" width="88" height="8" rx="2" fill="#5E412A" /><path d="M40 52 C62 48 76 38 84 24 L116 24 C124 38 138 48 160 52 C152 56 142 55 134 52 L66 52 C58 55 48 56 40 52Z" fill="url(#g111s)" /><g clipPath="url(#g111c)" stroke="#fff" strokeOpacity=".14" strokeWidth="1"><path d="M70 26v30M78 26v30M86 26v30M94 26v30M102 26v30M110 26v30M118 26v30M126 26v30M134 26v30" /></g><path d="M46 52 C64 49 77 41 85 27" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.1" /><path d="M80 24 C84 17 116 17 120 24" fill="none" stroke="#1C2024" strokeWidth="4.5" strokeLinecap="round" /><path d="M78 23 c-3 -1 -5 -4 -5 -7 M122 23 c3 -1 5 -4 5 -7" fill="none" stroke="#1C2024" strokeWidth="2.6" strokeLinecap="round" /><rect x="87" y="38" width="26" height="11" rx="1.5" fill="#1C1A18" stroke="#C9A227" strokeWidth=".7" /><text x="100" y="46.4" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#E3C35C" fontFamily="Noto Serif KR, serif" letterSpacing=".8">도착</text><path d="M48 54 v8" stroke="#3A2C20" strokeWidth="1.2" /><circle cx="48" cy="72" r="13" fill="#FFE7B0" fillOpacity=".35" className="loop" style={{animation: 'jg-shimmer 3s ease-in-out infinite'} as any} /><rect x="43" y="61" width="10" height="2.4" rx="1" fill="#5A3A22" /><ellipse cx="48" cy="71.5" rx="7" ry="8.8" fill="url(#g111l)" /><path d="M41.5 68.5 h13 M41.5 74.5 h13" stroke="#C9798A" strokeWidth="1.6" /><rect x="43" y="80" width="10" height="2.4" rx="1" fill="#5A3A22" /><path d="M48 82.4 v5" stroke="#C9798A" strokeWidth="1.4" strokeLinecap="round" /><path d="M152 54 v8" stroke="#3A2C20" strokeWidth="1.2" /><circle cx="152" cy="72" r="13" fill="#FFE7B0" fillOpacity=".35" className="loop" style={{animation: 'jg-shimmer 3s ease-in-out infinite'} as any} /><rect x="147" y="61" width="10" height="2.4" rx="1" fill="#5A3A22" /><ellipse cx="152" cy="71.5" rx="7" ry="8.8" fill="url(#g111l)" /><path d="M145.5 68.5 h13 M145.5 74.5 h13" stroke="#C9798A" strokeWidth="1.6" /><rect x="147" y="80" width="10" height="2.4" rx="1" fill="#5A3A22" /><path d="M152 82.4 v5" stroke="#C9798A" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'} as any}>
            <div className="seg" role="tablist"><button type="button" role="tab" className={segA} onClick={tabFrame}>문장 틀</button><button type="button" role="tab" className={segB} onClick={tabFree}>내 말로 쓰기</button></div>
            <span style={{display: 'flex', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#6B665F'} as any}>담아야 할 생각
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 11px', borderRadius: '999px', background: '#F9ECEF', color: '#7E2C42'} as any}>① 소리가 세짐</span>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 11px', borderRadius: '999px', background: '#F9ECEF', color: '#7E2C42'} as any}>② 획을 더함</span>
            </span>
          </div>
          {(frameTab) && (<>
            <div className="paper" style={{padding: '30px 36px 26px', display: 'flex', flexDirection: 'column', gap: '18px'} as any}>
              <div style={{fontSize: '28px', fontWeight: '600', lineHeight: '2.2', letterSpacing: '-0.01em'} as any}>ㅌ은 ㄷ보다 소리가<input maxLength={20} className="blank" aria-label="빈칸 1, 소리의 세기" value={b1} onChange={setB1} />나서<input maxLength={20} className="blank" aria-label="빈칸 2, 더한 것" value={b2} onChange={setB2} />하나 더했다.</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '14px', borderTop: '1px dashed #E7DDCB'} as any}>
                <span style={{fontSize: '13px', fontWeight: '700', color: '#8A7F70', marginRight: '4px'} as any}>낱말 상자</span>
                {(words as any[]).map((w: any) => (<button key={w.w} type="button" className={w.cls} onClick={w.fill}>{w.w}</button>))}
              </div>
            </div>
            <span style={{fontSize: '14px', color: '#6B665F'} as any}>빈칸 2개 · 다음 단원부터는 첫 낱말만 보여요</span>
          </>)}
          {(freeTab) && (<>
            <label className="paper" style={{display: 'flex', flexDirection: 'column', gap: '10px', padding: '24px 28px', fontSize: '14px', fontWeight: '700', color: '#8A7F70'} as any}>내 설명<textarea maxLength={300} rows={4} value={freeText} onChange={setFree} placeholder="예) ㅌ은 ㄷ보다…" style={{font: 'inherit', fontSize: '24px', fontWeight: '500', lineHeight: '1.6', color: '#1C1A18', border: 'none', background: 'transparent', resize: 'none', outline: 'none'} as any}></textarea></label>
          </>)}
          {(gateMsg) && (<p role="status" style={{margin: '0', padding: '12px 18px', borderRadius: '16px', background: '#F9ECEF', color: '#7E2C42', fontSize: '17px', fontWeight: 700} as any}>{gateMsg}</p>)}
          <div style={{marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px'} as any}>
            <span style={{display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#4A4641'} as any}><span style={{width: '30px', height: '30px', borderRadius: '50%', background: '#F9ECEF', display: 'grid', placeItems: 'center'} as any}><svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.2" fill="none" stroke="#9B3A51" strokeWidth="1.8" /><path d="M10 9v5M10 6.2v.1" stroke="#9B3A51" strokeWidth="2" strokeLinecap="round" /></svg></span>먼저 낱말로 확인하고, 애매하면 AI가 이름 없이 함께 읽어요 · 선생님이 확인해요 · 성적·학생부에 들어가지 않아요</span>
            <button type="button" className="btnp" onClick={goPass} disabled={busy}>{busy ? '확인하는 중…' : '제출하기'}<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          </div>
        </div>
      </>)}

      
      {(isPass) && (<>
        <div className="scr" style={{flexDirection: 'row', gap: '32px', alignItems: 'stretch'} as any}>
          <div style={{flex: '1', display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '4px', position: 'relative'} as any}>
            <i className="cf" style={{left: '140px', top: '70px', background: '#9B3A51', '--x': '71px', '--y': '23px', '--r': '176deg', animationDelay: '115ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#E8A1B0', '--x': '100px', '--y': '30px', '--r': '-106deg', animationDelay: '47ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#C9A227', '--x': '102px', '--y': '1px', '--r': '-110deg', animationDelay: '24ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#5ED0B3', '--x': '68px', '--y': '-43px', '--r': '-155deg', animationDelay: '23ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#F2C1CB', '--x': '115px', '--y': '57px', '--r': '-258deg', animationDelay: '152ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#E9A07C', '--x': '42px', '--y': '-5px', '--r': '-139deg', animationDelay: '159ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#9B3A51', '--x': '-153px', '--y': '15px', '--r': '-236deg', animationDelay: '15ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#E8A1B0', '--x': '-142px', '--y': '-72px', '--r': '-53deg', animationDelay: '153ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#C9A227', '--x': '-145px', '--y': '-2px', '--r': '34deg', animationDelay: '112ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#5ED0B3', '--x': '142px', '--y': '-70px', '--r': '231deg', animationDelay: '59ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#F2C1CB', '--x': '167px', '--y': '-45px', '--r': '211deg', animationDelay: '1ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#E9A07C', '--x': '179px', '--y': '-99px', '--r': '168deg', animationDelay: '167ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#9B3A51', '--x': '-18px', '--y': '-16px', '--r': '264deg', animationDelay: '238ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#E8A1B0', '--x': '-118px', '--y': '-55px', '--r': '22deg', animationDelay: '194ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#C9A227', '--x': '-43px', '--y': '11px', '--r': '-5deg', animationDelay: '7ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#5ED0B3', '--x': '-125px', '--y': '24px', '--r': '-190deg', animationDelay: '102ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#F2C1CB', '--x': '-105px', '--y': '-46px', '--r': '95deg', animationDelay: '17ms'} as any}></i><i className="cf" style={{left: '140px', top: '70px', background: '#E9A07C', '--x': '-152px', '--y': '55px', '--r': '-300deg', animationDelay: '54ms'} as any}></i>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '800', color: '#9B3A51'} as any}><span style={{width: '22px', height: '2px', background: '#C9798A', borderRadius: '2px'} as any}></span>도착 관문 통과</span>
            <div className="a" style={{fontSize: '40px', fontWeight: '800', letterSpacing: '-0.035em', lineHeight: '1.2', animation: 'pop-in 500ms var(--ease-bouncy) both'} as any}>집현전 학자들이랑<br />같은 답을 썼어요</div>
            <div className="paper" style={{padding: '20px 22px', fontSize: '20px', lineHeight: '1.7'} as any}>{answer}</div>
            <div style={{display: 'flex', gap: '8px'} as any}>
              <span className="okchip"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>소리가 세짐</span>
              <span className="okchip"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>획을 더함</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 18px', borderRadius: '20px', background: 'linear-gradient(135deg, #FCF5F6, #FFFFFF)', boxShadow: 'inset 0 0 0 1px #F2DFE3'} as any}>
              <div className="seal a"><span className="serif" style={{fontSize: '22px', fontWeight: '900', lineHeight: '1.05', textAlign: 'center'} as any}>稱<br />號</span></div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '4px'} as any}><span style={{fontSize: '13px', color: '#6B665F'} as any}>칭호가 올랐어요</span><span style={{fontSize: '19px', fontWeight: '800'} as any}><span style={{color: '#8A857D', fontWeight: '600', textDecoration: 'line-through'} as any}>첫걸음 학생</span> → <span style={{color: '#B0371F'} as any}>집현전 견습생</span></span></div>
            </div>
            <button type="button" className="btnp" onClick={finish} style={{marginTop: 'auto', alignSelf: 'flex-start'} as any}>내 징검런으로</button>
          </div>
          <div className="book a" style={{flex: '1.12', animation: 'rise-in 700ms var(--ease-standard) 150ms both'} as any}>
            <div className="frame">
              <div className="cols">
                <div className="col big"><span className="vb" style={{animationDelay: '300ms'} as any}>ㅋ比ㄱ</span></div>
                <div className="col big"><span className="vb" style={{animationDelay: '700ms'} as any}>聲出稍厲</span></div>
                <div className="col big"><span className="vb" style={{animationDelay: '1100ms'} as any}>故加畫</span></div>
                <div className="col sm"><span className="vb" style={{animationDelay: '1500ms'} as any}>ㄴ而ㄷ ㄷ而ㅌ</span></div>
                <div className="col sm"><span className="vb" style={{animationDelay: '1700ms'} as any}>其因聲加畫之義皆同</span></div>
              </div>
              <div className="bseal a"><span className="serif">訓民<br />正音</span></div>
            </div>
            <div className="a" style={{display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px 6px 0', animation: 'jg-fade 600ms var(--ease-standard) 2000ms both'} as any}>
              <span style={{fontSize: '15px', fontWeight: '700', letterSpacing: '.06em', color: '#8A7F70'} as any}>훈민정음 해례 · 제자해 (1446) · 오른쪽부터 세로로 읽어요</span>
              <span style={{fontSize: '19px', lineHeight: '1.6', color: '#3E3A35'} as any}>ㅋ은 ㄱ에 비해 소리가 조금 세게 나므로 획을 더했다. ㄷ에서 ㅌ도, 소리에 따라 획을 더한 뜻은 모두 같다.</span>
              <span style={{fontSize: '24px', fontWeight: '800', color: '#9B3A51'} as any}>집현전 학자들이랑 같은 답을 썼어요</span>
            </div>
          </div>
        </div>
      </>)}
    </main>
  </div>
  <div style={{position: 'absolute', right: '16px', bottom: '8px', fontSize: '11px', color: '#8A857D'} as any}>시연용 가상 학생 데이터 · 모의 인증</div>
</div>
    </>
  );
}
