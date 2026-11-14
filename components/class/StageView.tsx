"use client";
// 교실 화면 · 우리 반 다리 (담당: 신재우). 디자인 캔버스 "징검다리 · 디자인"의 Stage 아트보드를 자동 변환 (scratchpad/dc2jsx.py). 값은 props로 받는다. 손으로 고칠 때는 문구·구조만.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import "./stage.css";

export function StageView(v: Record<string, any>) {
  const { tideBanner, qText, qAns, qExplain, showNav, toRope, chain, clock, controls, isJeja, isOpen, isOpenB, isSplash, isTogether, line, nav, newFlag, next, notRevealed, oCls, ovCaption, ovKor, ovMath, ovName, pickO, pickX, prev, reveal, revealed, rootCls, rows, sections, showCrossing, showLine, showTideBanner, showWx, titleBridge, unitLabel, waterFill, xCls } = v;
  return (
    <>
<div className={rootCls} style={{fontFamily: "'Pretendard Variable', Pretendard, sans-serif"} as any}>
  <div className="sky" aria-hidden="true">
    {(sections as any[]).map((sec: any, __i: number) => (<Fragment key={__i}>
      <div className={sec.skyCls} style={{left: `${sec.skyX}px`, width: `${sec.skyW}px`} as any}>
        <div className="sl l-clear" style={{opacity: sec.oClear} as any}></div>
        <div className="sl l-cloud" style={{opacity: sec.oCloud} as any}>
          <i className="puff loop" style={{left: '14%', top: '54px', width: '300px', height: '96px'} as any}></i>
          <i className="puff loop" style={{left: '46%', top: '128px', width: '360px', height: '110px', animationDelay: '-12s'} as any}></i>
          <i className="puff loop" style={{left: '4%', top: '230px', width: '280px', height: '80px', animationDelay: '-20s'} as any}></i>
        </div>
        <div className="sl l-dark" style={{opacity: sec.oDark} as any}>
          <i className="ink loop" style={{left: '10%', top: '20px', width: '420px', height: '150px'} as any}></i>
          <i className="ink loop" style={{left: '40%', top: '120px', width: '460px', height: '160px', animationDelay: '-18s'} as any}></i>
          <i className="ink loop" style={{left: '0', top: '250px', width: '380px', height: '120px', animationDelay: '-30s'} as any}></i>
        </div>
        <div className="sl l-shower" style={{opacity: sec.oShower} as any}>
          <i className="ink loop" style={{left: '6%', top: '10px', width: '480px', height: '170px'} as any}></i>
          <i className="ink loop" style={{left: '36%', top: '110px', width: '500px', height: '180px', animationDelay: '-16s'} as any}></i>
        </div>
      </div>
    </Fragment>))}
    <svg className="mtn" width="1440" height="134" viewBox="0 0 1440 134">
      <path d="M0 100 C120 60 200 70 290 40 C360 20 420 60 500 55 C600 50 640 10 760 30 C860 46 900 80 1000 70 C1100 60 1160 20 1260 35 C1350 48 1400 70 1440 64 L1440 134 L0 134Z" fill="#1E2A30" fillOpacity=".14" />
      <path d="M0 116 C140 92 220 102 330 86 C430 72 520 98 640 94 C760 90 820 68 940 80 C1060 92 1140 106 1260 94 C1340 86 1400 98 1440 96 L1440 134 L0 134Z" fill="#1E2A30" fillOpacity=".24" />
    </svg>
    <div className="scrim"></div>
  </div>


  
  <div style={{position: 'absolute', left: '72px', right: '72px', top: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: '4'} as any}>
    <div className="hdr-l" style={{fontSize: '26px', fontWeight: '700'} as any}>{unitLabel}</div>
    <div className="chip t" style={{background: '#12171A', color: '#F4F2EC', boxShadow: '0 8px 24px rgba(0,0,0,.25)', padding: '12px 26px 12px 20px', fontSize: '32px', fontWeight: '800'} as any}>
      <span className="pulse" style={{width: '14px', height: '14px', borderRadius: '50%', background: '#F2C1CB'} as any}></span>
      <span className="num">{clock}</span>
    </div>
  </div>

  
  {(titleBridge) && (<>
    <h1 aria-label="우리 반 다리" style={{position: 'absolute', left: '72px', top: '92px', margin: '0', fontSize: '112px', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '1', color: '#1C1A18'} as any}>
      <span className="kin a" style={{animationDelay: '0ms'} as any}>우</span><span className="kin a" style={{animationDelay: '70ms'} as any}>리</span><span style={{display: 'inline-block', width: '.28em'} as any}></span><span className="kin a" style={{animationDelay: '160ms'} as any}>반</span><span style={{display: 'inline-block', width: '.28em'} as any}></span><span className="kin a" style={{animationDelay: '250ms', color: '#9B3A51'} as any}>다</span><span className="kin a" style={{animationDelay: '320ms', color: '#9B3A51'} as any}>리</span>
    </h1>
  </>)}
  {(isTogether) && (<>
    <h1 aria-label="함께 놓기" style={{position: 'absolute', left: '72px', top: '92px', margin: '0', fontSize: '104px', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '1'} as any}>
      <span className="kin a" style={{animationDelay: '0ms'} as any}>함</span><span className="kin a" style={{animationDelay: '70ms'} as any}>께</span><span style={{display: 'inline-block', width: '.28em'} as any}></span><span className="kin a" style={{animationDelay: '160ms', color: '#F2C1CB'} as any}>놓</span><span className="kin a" style={{animationDelay: '230ms', color: '#F2C1CB'} as any}>기</span>
    </h1>
  </>)}
  {(isJeja) && (<>
    <div style={{position: 'absolute', left: '72px', top: '92px'} as any}>
      <h1 aria-label="위에서 보기" style={{margin: '0', fontSize: '96px', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '1'} as any}>
        <span className="kin a" style={{animationDelay: '300ms'} as any}>위</span><span className="kin a" style={{animationDelay: '360ms'} as any}>에</span><span className="kin a" style={{animationDelay: '420ms'} as any}>서</span><span style={{display: 'inline-block', width: '.28em'} as any}></span><span className="kin a" style={{animationDelay: '520ms', color: '#F2C1CB'} as any}>보</span><span className="kin a" style={{animationDelay: '580ms', color: '#F2C1CB'} as any}>기</span>
      </h1>
    </div>
    <p className="serif a" style={{position: 'absolute', right: '72px', top: '112px', margin: '0', fontSize: '56px', fontWeight: '900', color: '#F4F2EC', animation: 'rise-in 900ms var(--ease-standard) 1100ms both'} as any}>{ovCaption}</p>
    <span className="a" style={{position: 'absolute', right: '72px', top: '190px', fontSize: '18px', fontWeight: '600', color: '#8D9A9F', animation: 'jg-fade 600ms var(--ease-standard) 1400ms both'} as any}>위에서 보기 · 교과별 교체 슬롯 — {ovName}</span>
  </>)}

  
  {(showLine) && (<>
    <div className="a" style={{position: 'absolute', left: '72px', top: '222px', display: 'flex', alignItems: 'center', gap: '28px', animation: 'rise-in 700ms var(--ease-standard) 400ms both'} as any}>
      <span style={{fontSize: '38px', fontWeight: '700', color: '#1C1A18', background: '#FAFAF7', borderRadius: '999px', padding: '8px 28px', boxShadow: '0 10px 30px rgba(20,30,34,.18)'} as any}>{line}</span>
      {(showCrossing) && (<>
        <span className="chip" style={{fontSize: '24px', fontWeight: '600', color: '#DDE5E7', background: '#12171A', padding: '10px 20px'} as any}><span className="pulse" style={{width: '10px', height: '10px', borderRadius: '50%', background: '#F2C1CB'} as any}></span>지금 친구들도 함께 건너는 중</span>
      </>)}
    </div>
  </>)}
  {(showTideBanner) && (<>
    <div className="chip a" style={{position: 'absolute', left: '72px', top: '214px', background: '#9B3A51', color: '#fff', padding: '12px 34px 12px 22px', fontSize: '46px', fontWeight: '800', animation: 'pop-in 800ms var(--ease-bouncy) 600ms both', boxShadow: '0 14px 40px rgba(155,58,81,.4)'} as any}>
      <svg width="58" height="58" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w1a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A3B0B9" /><stop offset=".45" stopColor="#5E6D78" /><stop offset="1" stopColor="#2C3741" /></linearGradient><linearGradient id="w1b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8695A0" /><stop offset="1" stopColor="#3A4651" /></linearGradient><linearGradient id="w1s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w1d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w1k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath><linearGradient id="w1w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6FFF7" /><stop offset=".5" stopColor="#5FD6B8" /><stop offset="1" stopColor="#1E9E87" /></linearGradient></defs><ellipse cx="64" cy="88" rx="46" ry="7" fill="url(#w1d)" /><g transform="translate(0 -12)"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w1b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w1a)" /><g clipPath="url(#w1k)" fill="#151C22" fillOpacity=".32"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.19" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w1s)" strokeWidth="1.8" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".22" transform="rotate(-18 54 44)" /><path d="M51 69 l6 0 M73 69 l6 0" stroke="#F1F4F6" strokeWidth="2.4" strokeLinecap="round" /><ellipse cx="65" cy="78" rx="3" ry="3.6" fill="none" stroke="#F1F4F6" strokeWidth="2" /><ellipse cx="47" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /><ellipse cx="83" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /></g><g transform="translate(38 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w1w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(56 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w1w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(74 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w1w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(92 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w1w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g></svg>
      <span>{tideBanner}</span>
    </div>
  </>)}

  
  {(showWx) && (<>
    {(sections as any[]).map((sec: any, __i: number) => (<Fragment key={__i}>
      <div className="wxcell" style={{left: `${sec.x}px`} as any}>
        {(sec.wxClear) && (<><span className="wxicon a"><svg width="104" height="104" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><radialGradient id="w2h" cx="60" cy="60" r="60" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFE3A0" stopOpacity=".8" /><stop offset=".42" stopColor="#FFD27A" stopOpacity=".28" /><stop offset="1" stopColor="#FFD27A" stopOpacity="0" /></radialGradient><linearGradient id="w2r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C98A24" /><stop offset="1" stopColor="#FFE7A6" /></linearGradient><radialGradient id="w2c" cx="49" cy="47" r="34" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFFCEC" /><stop offset=".32" stopColor="#FFE38E" /><stop offset=".78" stopColor="#F3AC3D" /><stop offset="1" stopColor="#D9862A" /></radialGradient></defs><circle cx="60" cy="60" r="60" fill="url(#w2h)" /><g fill="url(#w2r)"><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(0.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(22.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(45.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(67.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(90.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(112.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(135.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(157.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(180.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(202.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(225.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(247.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(270.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(292.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(315.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(337.5)" /></g><circle cx="60" cy="60" r="34.5" fill="none" stroke="#D9A441" strokeWidth=".8" strokeOpacity=".85" /><circle cx="60" cy="60" r="27" fill="url(#w2c)" /><circle cx="60" cy="60" r="22.5" fill="none" stroke="#FFF7DA" strokeWidth=".9" strokeOpacity=".8" /><ellipse cx="47" cy="45" rx="6" ry="3.6" fill="#fff" fillOpacity=".65" transform="rotate(-32 47 45)" /><ellipse cx="53" cy="59" rx="2.5" ry="3.3" fill="#6B3E0E" /><ellipse cx="67" cy="59" rx="2.5" ry="3.3" fill="#6B3E0E" /><circle cx="53.8" cy="57.8" r=".9" fill="#fff" /><circle cx="67.8" cy="57.8" r=".9" fill="#fff" /><path d="M55.5 66 q4.5 4.5 9 0" fill="none" stroke="#6B3E0E" strokeWidth="2.2" strokeLinecap="round" /><ellipse cx="46.5" cy="65.5" rx="4.6" ry="2.6" fill="#F27C6B" fillOpacity=".5" /><ellipse cx="73.5" cy="65.5" rx="4.6" ry="2.6" fill="#F27C6B" fillOpacity=".5" /></svg></span></>)}
        {(sec.wxCloud) && (<><span className="wxicon a"><svg width="104" height="104" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w3a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#EEF2F4" /><stop offset="1" stopColor="#C6D0D6" /></linearGradient><linearGradient id="w3b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6F8F9" /><stop offset="1" stopColor="#BAC6CD" /></linearGradient><linearGradient id="w3s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w3d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w3k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath></defs><ellipse cx="64" cy="100" rx="46" ry="7" fill="url(#w3d)" /><g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w3b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w3a)" /><g clipPath="url(#w3k)" fill="#6F8591" fillOpacity=".10"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.06" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w3s)" strokeWidth="1.8" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="#8C9DA7" strokeOpacity=".38" strokeWidth="1" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".75" transform="rotate(-18 54 44)" /><g fill="none" stroke="#5B6C76" strokeWidth="2.4" strokeLinecap="round"><path d="M50 69 q4.5 -5 9 0" /><path d="M71 69 q4.5 -5 9 0" /><path d="M61.5 76 q3.5 3.5 7 0" /></g><ellipse cx="46" cy="76" rx="5" ry="2.8" fill="#F4A0AA" fillOpacity=".6" /><ellipse cx="84" cy="76" rx="5" ry="2.8" fill="#F4A0AA" fillOpacity=".6" /></g></svg></span></>)}
        {(sec.wxDark) && (<><span className="wxicon a"><svg width="104" height="104" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w4a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A3B0B9" /><stop offset=".45" stopColor="#5E6D78" /><stop offset="1" stopColor="#2C3741" /></linearGradient><linearGradient id="w4b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8695A0" /><stop offset="1" stopColor="#3A4651" /></linearGradient><linearGradient id="w4s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w4d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w4k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath></defs><ellipse cx="64" cy="100" rx="46" ry="7" fill="url(#w4d)" /><g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w4b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w4a)" /><g clipPath="url(#w4k)" fill="#151C22" fillOpacity=".32"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.19" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w4s)" strokeWidth="1.8" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".22" transform="rotate(-18 54 44)" /><circle cx="55" cy="70" r="2.6" fill="#F1F4F6" /><circle cx="75" cy="70" r="2.6" fill="#F1F4F6" /><path d="M50 63 l8 3 M80 63 l-8 3" stroke="#F1F4F6" strokeWidth="2" strokeLinecap="round" /><path d="M59 79 q2.75 -2.4 5.5 0 q2.75 2.4 5.5 0" fill="none" stroke="#F1F4F6" strokeWidth="2" strokeLinecap="round" /><ellipse cx="47" cy="77" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".45" /><ellipse cx="83" cy="77" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".45" /></g></svg></span></>)}
        {(sec.wxShower) && (<><span className="wxicon a"><svg width="104" height="104" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w5a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A3B0B9" /><stop offset=".45" stopColor="#5E6D78" /><stop offset="1" stopColor="#2C3741" /></linearGradient><linearGradient id="w5b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8695A0" /><stop offset="1" stopColor="#3A4651" /></linearGradient><linearGradient id="w5s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w5d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w5k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath><linearGradient id="w5w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6FFF7" /><stop offset=".5" stopColor="#5FD6B8" /><stop offset="1" stopColor="#1E9E87" /></linearGradient></defs><ellipse cx="64" cy="88" rx="46" ry="7" fill="url(#w5d)" /><g transform="translate(0 -12)"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w5b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w5a)" /><g clipPath="url(#w5k)" fill="#151C22" fillOpacity=".32"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.19" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w5s)" strokeWidth="1.8" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".22" transform="rotate(-18 54 44)" /><path d="M51 69 l6 0 M73 69 l6 0" stroke="#F1F4F6" strokeWidth="2.4" strokeLinecap="round" /><ellipse cx="65" cy="78" rx="3" ry="3.6" fill="none" stroke="#F1F4F6" strokeWidth="2" /><ellipse cx="47" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /><ellipse cx="83" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /></g><g transform="translate(38 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w5w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(56 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w5w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(74 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w5w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(92 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w5w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g></svg></span></>)}
        <div style={{display: 'flex', flexDirection: 'column', gap: '2px'} as any}>
          <span className="t" style={{fontSize: '30px', fontWeight: '700', color: sec.nameColor, transition: 'color 600ms var(--ease-standard)'} as any}>{sec.name}</span>
          <span className="t" style={{fontSize: '60px', fontWeight: '800', lineHeight: '1', letterSpacing: '-0.02em', color: sec.wxColor, transition: 'color 600ms var(--ease-standard)'} as any}>{sec.wxWord}</span>
        </div>
      </div>
    </Fragment>))}
  </>)}

  
  <div className="river t" aria-hidden="true">
    <div className="water"></div>
    <div className="wave loop"><svg width="2880" height="44" viewBox="0 0 2880 44" preserveAspectRatio="none"><path d="M0 22 Q60 6 120 22 T240 22 T360 22 T480 22 T600 22 T720 22 T840 22 T960 22 T1080 22 T1200 22 T1320 22 T1440 22 T1560 22 T1680 22 T1800 22 T1920 22 T2040 22 T2160 22 T2280 22 T2400 22 T2520 22 T2640 22 T2760 22 T2880 22 L2880 44 L0 44Z" fill="#7FDFC6" fillOpacity=".55" /></svg></div>
    <div className="wave w2 loop"><svg width="2880" height="44" viewBox="0 0 2880 44" preserveAspectRatio="none"><path d="M0 22 Q60 6 120 22 T240 22 T360 22 T480 22 T600 22 T720 22 T840 22 T960 22 T1080 22 T1200 22 T1320 22 T1440 22 T1560 22 T1680 22 T1800 22 T1920 22 T2040 22 T2160 22 T2280 22 T2400 22 T2520 22 T2640 22 T2760 22 T2880 22 L2880 44 L0 44Z" fill="#F2FFFB" fillOpacity=".45" /></svg></div>
    
    <svg className="bank" width="250" height="230" viewBox="0 0 250 230" style={{position: 'absolute', left: '-92px', top: '-76px', overflow: 'visible', zIndex: '3'} as any} aria-hidden="true">
      <defs>
        <linearGradient id="bkR1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEE7D8" /><stop offset=".45" stopColor="#C3B8A2" /><stop offset="1" stopColor="#7E7461" /></linearGradient>
        <linearGradient id="bkR2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6F1E6" /><stop offset=".5" stopColor="#D2C8B4" /><stop offset="1" stopColor="#958A75" /></linearGradient>
        <linearGradient id="bkW" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5B412C" /><stop offset=".45" stopColor="#9C7A56" /><stop offset="1" stopColor="#4E3725" /></linearGradient>
        <radialGradient id="bkL" cx=".45" cy=".4" r=".6"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".55" stopColor="#FFE9B8" /><stop offset="1" stopColor="#E9C27A" /></radialGradient>
        <radialGradient id="bkG" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#FFE7A8" stopOpacity=".7" /><stop offset="1" stopColor="#FFE7A8" stopOpacity="0" /></radialGradient>
        <radialGradient id="bkS" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#06252A" stopOpacity=".55" /><stop offset="1" stopColor="#06252A" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="110" cy="214" rx="140" ry="20" fill="url(#bkS)" />
      <path d="M-20 214 C-18 160 18 124 64 116 C100 110 132 120 156 136 C182 154 200 182 206 214 Z" fill="url(#bkR1)" />
      <path d="M64 116 C100 110 132 120 156 136" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M-20 220 C-8 186 24 168 60 170 C96 172 122 190 134 220 Z" fill="url(#bkR2)" />
      <path d="M8 182 C26 172 46 170 62 171" fill="none" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="1.4" strokeLinecap="round" />
      <g fill="none" strokeLinecap="round">
        <path d="M44 119 q3 -13 9 -18 M50 118 q0 -11 -4 -16 M56 118 q4 -9 10 -11 M112 120 q2 -10 7 -14 M118 121 q-1 -9 -5 -13" stroke="#5E7A4E" strokeWidth="1.7" />
        <path d="M47 119 q6 -8 12 -9 M115 121 q5 -6 10 -6 M22 172 q2 -9 6 -12 M27 172 q-1 -8 -4 -11" stroke="#8EAB78" strokeWidth="1.4" />
      </g>
      <rect x="152" y="52" width="13" height="150" rx="3.5" fill="url(#bkW)" />
      <ellipse cx="158.5" cy="53" rx="7.5" ry="3" fill="#B8956C" />
      <path d="M150 112 c6 4 11 4 17 0 M150 120 c6 4 11 4 17 0" fill="none" stroke="#E6D5B2" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M166 120 C186 140 196 170 214 196" fill="none" stroke="#E6D5B2" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" />
      <path d="M160 62 L192 62" stroke="#4E3725" strokeWidth="3" strokeLinecap="round" />
      <path d="M190 62 v8" stroke="#2A2622" strokeWidth="1.2" />
      <circle cx="190" cy="86" r="26" fill="url(#bkG)" className="loop" style={{animation: 'jg-shimmer 3.2s ease-in-out infinite'} as any} />
      <rect x="183" y="70" width="14" height="3" rx="1" fill="#3A2C20" />
      <ellipse cx="190" cy="85" rx="10" ry="13" fill="url(#bkL)" />
      <path d="M181 81 h18 M180.5 88 h19" stroke="#C9A227" strokeOpacity=".55" strokeWidth=".8" />
      <rect x="183" y="97" width="14" height="3" rx="1" fill="#3A2C20" />
      <path d="M190 100 v7" stroke="#C9A227" strokeWidth="1.2" />
      <rect x="16" y="168" width="84" height="38" rx="19" fill="#FAFAF7" stroke="#C9A227" strokeWidth=".9" />
      <text x="58" y="193" textAnchor="middle" fontSize="21" fontWeight="800" fill="#1C1A18" fontFamily="Pretendard Variable, Pretendard, sans-serif" letterSpacing="1">출발</text>
    </svg>
    
    <svg className="bank" width="260" height="250" viewBox="0 0 260 250" style={{position: 'absolute', right: '-86px', top: '-116px', overflow: 'visible', zIndex: '3'} as any} aria-hidden="true">
      <defs>
        <linearGradient id="bkP1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEE7D8" /><stop offset=".45" stopColor="#C3B8A2" /><stop offset="1" stopColor="#7E7461" /></linearGradient>
        <linearGradient id="bkP2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A7279" /><stop offset=".6" stopColor="#343A40" /><stop offset="1" stopColor="#1F2327" /></linearGradient>
        <linearGradient id="bkP3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5E442F" /><stop offset=".5" stopColor="#A2805C" /><stop offset="1" stopColor="#5A402C" /></linearGradient>
        <linearGradient id="bkP4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F1EADB" /><stop offset="1" stopColor="#B9AE99" /></linearGradient>
        <radialGradient id="bkP5" cx=".5" cy=".6" r=".6"><stop offset="0" stopColor="#FFE6AE" stopOpacity=".85" /><stop offset="1" stopColor="#FFE6AE" stopOpacity="0" /></radialGradient>
        <radialGradient id="bkP6" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#06252A" stopOpacity=".55" /><stop offset="1" stopColor="#06252A" stopOpacity="0" /></radialGradient>
        <clipPath id="bkPc"><path d="M50 82 C76 78 96 68 110 48 L188 48 C202 68 222 78 248 82 C236 87 222 85 212 82 L88 82 C76 85 62 87 50 82Z" /></clipPath>
      </defs>
      <ellipse cx="140" cy="236" rx="150" ry="20" fill="url(#bkP6)" />
      <path d="M10 238 C22 190 70 166 128 162 C186 158 236 176 272 206 L272 238Z" fill="url(#bkP1)" />
      <path d="M50 178 C80 166 110 163 140 162" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="66" y="140" width="164" height="24" rx="3" fill="url(#bkP4)" />
      <path d="M66 141 h164" stroke="#fff" strokeOpacity=".8" strokeWidth="1" />
      <rect x="112" y="164" width="44" height="6" rx="1.5" fill="#E9E2D2" /><rect x="106" y="170" width="56" height="6" rx="1.5" fill="#DCD3C0" />
      <rect x="76" y="91" width="144" height="45" fill="url(#bkP5)" />
      <rect x="74" y="132" width="148" height="9" rx="1.5" fill="url(#bkP3)" />
      <g fill="url(#bkP3)"><rect x="82" y="82" width="7" height="52" rx="1.5" /><rect x="118" y="82" width="7" height="52" rx="1.5" /><rect x="171" y="82" width="7" height="52" rx="1.5" /><rect x="207" y="82" width="7" height="52" rx="1.5" /></g>
      <path d="M80 118 H216" stroke="#5A402C" strokeWidth="2.2" />
      <path d="M92 118 v14 M102 118 v14 M134 118 v14 M144 118 v14 M154 118 v14 M188 118 v14 M198 118 v14" stroke="#7A5A3E" strokeWidth="1.2" />
      <path d="M50 82 C76 78 96 68 110 48 L188 48 C202 68 222 78 248 82 C236 87 222 85 212 82 L88 82 C76 85 62 87 50 82Z" fill="url(#bkP2)" />
      <g clipPath="url(#bkPc)" stroke="#FFFFFF" strokeOpacity=".14" strokeWidth="1.1"><path d="M84 50 v34 M94 50 v34 M104 50 v34 M114 50 v34 M124 50 v34 M134 50 v34 M144 50 v34 M154 50 v34 M164 50 v34 M174 50 v34 M184 50 v34 M194 50 v34 M204 50 v34 M214 50 v34" /></g>
      <path d="M58 82 C80 79 98 70 111 52" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.2" />
      <path d="M104 48 C110 40 188 40 194 48" fill="none" stroke="#1C2024" strokeWidth="5" strokeLinecap="round" />
      <path d="M102 47 c-4 -1 -6 -4 -6 -8 M196 47 c4 -1 6 -4 6 -8" fill="none" stroke="#1C2024" strokeWidth="3" strokeLinecap="round" />
      <rect x="88" y="82" width="124" height="4" fill="#000" fillOpacity=".28" />
      <rect x="132" y="87" width="34" height="13" rx="1.5" fill="#1C1A18" stroke="#C9A227" strokeWidth=".8" />
      <text x="149" y="97" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#E3C35C" fontFamily="Noto Serif KR, serif" letterSpacing="1">學堂</text>
      <g strokeLinecap="round">
        <path d="M24 200 V120" stroke="#2A2622" strokeWidth="2.6" /><path d="M25.5 121 h22 l-5.5 7 5.5 7 h-22z" fill="#FAFAF7" stroke="#2A2622" strokeWidth="1" strokeLinejoin="round" />
        <path d="M38 198 V132" stroke="#2A2622" strokeWidth="2.6" /><path d="M39.5 133 h20 l-5 6.5 5 6.5 h-20z" fill="#E7E1D2" stroke="#2A2622" strokeWidth="1" strokeLinejoin="round" />
      </g>
      {(newFlag) && (<>
        <g className="flag a"><path d="M52 196 V110" stroke="#2A2622" strokeWidth="2.6" strokeLinecap="round" /><path d="M53.5 111 h24 l-6 7.5 6 7.5 h-24z" fill="#C9798A" stroke="#9B3A51" strokeWidth="1" strokeLinejoin="round" /></g>
      </>)}
      <rect x="160" y="190" width="84" height="38" rx="19" fill="#FAFAF7" stroke="#C9A227" strokeWidth=".9" />
      <text x="202" y="215" textAnchor="middle" fontSize="21" fontWeight="800" fill="#1C1A18" fontFamily="Pretendard Variable, Pretendard, sans-serif" letterSpacing="1">수업</text>
    </svg>
    {(isOpenB) && (<>
      <svg width="1440" height="200" viewBox="0 0 1440 200" style={{position: 'absolute', left: '0', top: '0'} as any} aria-hidden="true">
        <path d="M60 104 C 260 92, 420 112, 520 100 S 820 92, 948 104 S 1240 112, 1390 100" fill="none" stroke="#C9B58F" strokeWidth="16" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="a" style={{animation: 'draw 1400ms var(--ease-standard) both'} as any} />
        <path d="M60 104 C 260 92, 420 112, 520 100 S 820 92, 948 104 S 1240 112, 1390 100" fill="none" stroke="#FAFAF7" strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="a" style={{animation: 'draw 1400ms var(--ease-standard) 150ms both'} as any} />
      </svg>
      <i className="spark loop" style={{right: '40px', top: '-40px', animationDelay: '1.2s', zIndex: '3'} as any}></i>
      <i className="spark loop" style={{right: '92px', top: '-8px', animationDelay: '1.6s', zIndex: '3'} as any}></i>
      <i className="spark loop" style={{right: '20px', top: '20px', animationDelay: '2s', zIndex: '3'} as any}></i>
    </>)}
    {(sections as any[]).map((sec: any, __i: number) => (<Fragment key={__i}>
      <div className="sec" style={{left: `${sec.x}px`} as any}>
        <div className="stones">
          {(sec.stones as any[]).map((st: any, __i: number) => (<Fragment key={__i}>
            <div className={st.wcls}>
              <div className={st.cls}>{st.g}</div>
              {(st.ripple) && (<>
                <i className="ripple a"></i><i className="ripple r2 a"></i><i className="ripple r3 a"></i>
                <i className="dp" style={{'--dx': '-60px', '--dy': '-70px'} as any}></i><i className="dp" style={{'--dx': '54px', '--dy': '-84px'} as any}></i><i className="dp" style={{'--dx': '-24px', '--dy': '-104px'} as any}></i><i className="dp" style={{'--dx': '80px', '--dy': '-40px'} as any}></i><i className="dp" style={{'--dx': '-88px', '--dy': '-30px'} as any}></i>
              </>)}
            </div>
          </Fragment>))}
        </div>
        {(sec.glint) && (<>
          <i className="glint loop" style={{left: '40px', top: '96px'} as any}></i><i className="glint loop" style={{left: '78px', top: '122px', animationDelay: '.6s'} as any}></i><i className="glint loop" style={{left: '196px', top: '104px', animationDelay: '1.1s'} as any}></i><i className="glint loop" style={{left: '236px', top: '128px', animationDelay: '.3s'} as any}></i><i className="glint loop" style={{left: '320px', top: '110px', animationDelay: '1.4s'} as any}></i>
        </>)}
        {(sec.rope) && (<>
          <svg className="ropesvg" width="420" height="140" viewBox="0 0 420 140" style={{position: 'absolute', left: '-10px', top: '30px', overflow: 'visible'} as any}>
            <g className="a" style={{animation: 'jg-fade 900ms var(--ease-standard) both'} as any}><path d="M0 66 Q 105 98 210 74 T 420 66" fill="none" stroke="#5E432B" strokeOpacity=".35" strokeWidth="8" strokeLinecap="round" transform="translate(0 2)" /><path d="M0 66 Q 105 98 210 74 T 420 66" fill="none" stroke="#D9B98C" strokeWidth="6" strokeLinecap="round" /><path d="M0 66 Q 105 98 210 74 T 420 66" fill="none" stroke="#9A7149" strokeWidth="6" strokeDasharray="3 6" strokeLinecap="butt" /></g>
          </svg>
        </>)}
        {(sec.rain) && (<>
          <div className="rainbox a"><i className="rd loop" style={{left: '32.7%', top: '420px', height: '26px', animationDelay: '-0.18s', animationDuration: '0.96s'} as any}></i><i className="rd loop" style={{left: '53.5%', top: '109px', height: '40px', animationDelay: '-0.44s', animationDuration: '0.72s'} as any}></i><i className="rd loop" style={{left: '4.7%', top: '282px', height: '26px', animationDelay: '-0.52s', animationDuration: '0.73s'} as any}></i><i className="rd loop" style={{left: '42.6%', top: '322px', height: '31px', animationDelay: '-0.99s', animationDuration: '0.75s'} as any}></i><i className="rd loop" style={{left: '62.5%', top: '25px', height: '36px', animationDelay: '-1.14s', animationDuration: '0.93s'} as any}></i><i className="rd loop" style={{left: '96.7%', top: '214px', height: '33px', animationDelay: '-0.06s', animationDuration: '1.04s'} as any}></i><i className="rd loop" style={{left: '15.1%', top: '52px', height: '29px', animationDelay: '-0.14s', animationDuration: '0.82s'} as any}></i><i className="rd loop" style={{left: '58.0%', top: '364px', height: '41px', animationDelay: '-0.77s', animationDuration: '0.85s'} as any}></i><i className="rd loop" style={{left: '7.2%', top: '218px', height: '41px', animationDelay: '-0.07s', animationDuration: '0.78s'} as any}></i><i className="rd loop" style={{left: '77.2%', top: '153px', height: '35px', animationDelay: '-0.56s', animationDuration: '1.07s'} as any}></i><i className="rd loop" style={{left: '25.3%', top: '294px', height: '26px', animationDelay: '-0.22s', animationDuration: '1.01s'} as any}></i><i className="rd loop" style={{left: '30.4%', top: '147px', height: '38px', animationDelay: '-0.59s', animationDuration: '0.84s'} as any}></i><i className="rd loop" style={{left: '60.7%', top: '387px', height: '29px', animationDelay: '-0.09s', animationDuration: '0.90s'} as any}></i><i className="rd loop" style={{left: '34.5%', top: '391px', height: '26px', animationDelay: '-1.12s', animationDuration: '0.87s'} as any}></i><i className="rd loop" style={{left: '55.7%', top: '355px', height: '34px', animationDelay: '-0.95s', animationDuration: '1.03s'} as any}></i><i className="rd loop" style={{left: '35.3%', top: '47px', height: '26px', animationDelay: '-0.60s', animationDuration: '1.02s'} as any}></i><i className="rd loop" style={{left: '93.6%', top: '374px', height: '25px', animationDelay: '-0.57s', animationDuration: '0.97s'} as any}></i><i className="rd loop" style={{left: '69.7%', top: '145px', height: '38px', animationDelay: '-0.78s', animationDuration: '1.10s'} as any}></i><i className="rd loop" style={{left: '71.2%', top: '181px', height: '38px', animationDelay: '-1.06s', animationDuration: '0.84s'} as any}></i><i className="rd loop" style={{left: '17.5%', top: '66px', height: '33px', animationDelay: '-0.14s', animationDuration: '0.72s'} as any}></i><i className="rd loop" style={{left: '73.4%', top: '41px', height: '39px', animationDelay: '-0.48s', animationDuration: '1.07s'} as any}></i><i className="rd loop" style={{left: '17.3%', top: '419px', height: '28px', animationDelay: '-0.48s', animationDuration: '0.81s'} as any}></i><i className="rd loop" style={{left: '43.2%', top: '349px', height: '35px', animationDelay: '-0.66s', animationDuration: '0.98s'} as any}></i><i className="rd loop" style={{left: '87.7%', top: '77px', height: '29px', animationDelay: '-1.15s', animationDuration: '0.76s'} as any}></i><i className="rd loop" style={{left: '23.7%', top: '93px', height: '42px', animationDelay: '-0.28s', animationDuration: '0.89s'} as any}></i><i className="rd loop" style={{left: '26.7%', top: '312px', height: '35px', animationDelay: '-0.00s', animationDuration: '0.87s'} as any}></i><i className="rd loop" style={{left: '56.5%', top: '316px', height: '40px', animationDelay: '-1.14s', animationDuration: '0.98s'} as any}></i><i className="rd loop" style={{left: '65.2%', top: '200px', height: '41px', animationDelay: '-0.89s', animationDuration: '0.88s'} as any}></i><i className="rd loop" style={{left: '40.0%', top: '31px', height: '36px', animationDelay: '-0.47s', animationDuration: '0.89s'} as any}></i><i className="rd loop" style={{left: '19.7%', top: '174px', height: '27px', animationDelay: '-1.18s', animationDuration: '0.88s'} as any}></i><i className="rd loop" style={{left: '59.9%', top: '51px', height: '41px', animationDelay: '-0.12s', animationDuration: '0.93s'} as any}></i><i className="rd loop" style={{left: '94.0%', top: '314px', height: '30px', animationDelay: '-0.74s', animationDuration: '0.73s'} as any}></i><i className="rd loop" style={{left: '37.9%', top: '186px', height: '43px', animationDelay: '-0.76s', animationDuration: '1.08s'} as any}></i><i className="rd loop" style={{left: '47.5%', top: '245px', height: '38px', animationDelay: '-0.14s', animationDuration: '0.90s'} as any}></i></div>
        </>)}
      </div>
    </Fragment>))}
    <svg className="wfront" width="1440" height="340" viewBox="0 0 1440 340">
      <defs><linearGradient id="wfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#63D6B9" stopOpacity=".5" /><stop offset=".2" stopColor="#18977F" stopOpacity=".78" /><stop offset="1" stopColor="#075247" stopOpacity=".96" /></linearGradient></defs>
      <path d={waterFill} style={{d: `path('${waterFill}')`} as any} fill="url(#wfg)" />
    </svg>
    
    <div className="boat" style={{left: '318px', top: '170px', zIndex: '3'} as any}><svg width="96" height="74" viewBox="0 0 120 94" aria-hidden="true" style={{overflow: 'visible'} as any}><defs><linearGradient id="b8h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8BC82" /><stop offset=".45" stopColor="#B98349" /><stop offset="1" stopColor="#7F5330" /></linearGradient><linearGradient id="b8s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F3E9D6" /></linearGradient><radialGradient id="b8l" cx=".45" cy=".4" r=".6"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".6" stopColor="#FFE7B0" /><stop offset="1" stopColor="#EDC27A" /></radialGradient></defs><ellipse cx="60" cy="80" rx="56" ry="7" fill="#073F37" fillOpacity=".28" /><path d="M14 78 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#E8FFF8" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" /><rect x="57.5" y="8" width="4.5" height="48" rx="2.2" fill="#6E4A2C" /><path d="M63 13 C82 22 92 36 94 50 L63 50Z" fill="url(#b8s)" stroke="#E2D3B8" strokeWidth="1" /><path d="M63 33 C74 35 86 38 92 42" stroke="#E8A1B0" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M56 18 C46 26 40 38 38 50 L56 50Z" fill="url(#b8s)" stroke="#E2D3B8" strokeWidth="1" opacity=".92" /><path d="M61 8 L76 12 L61 16Z" fill="#C9798A" /><path d="M8 54 Q60 64 112 54 Q108 64 98 72 Q60 84 22 72 Q12 64 8 54Z" fill="url(#b8h)" /><path d="M10 55.5 Q60 65.5 110 55.5" fill="none" stroke="#FCE3BE" strokeWidth="2.6" strokeLinecap="round" /><path d="M17 64 Q60 73 103 64" fill="none" stroke="#C9798A" strokeWidth="3.2" strokeLinecap="round" /><path d="M30 70 q4 1.6 8 1.8 M80 71.6 q4 -.2 8 -1.8" stroke="#6B4426" strokeOpacity=".45" strokeWidth="1.4" strokeLinecap="round" /></svg></div>
    <div className="boat" style={{left: '780px', top: '184px', zIndex: '3'} as any}><svg width="90" height="70" viewBox="0 0 120 94" aria-hidden="true" style={{overflow: 'visible'} as any}><defs><linearGradient id="b9h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8BC82" /><stop offset=".45" stopColor="#B98349" /><stop offset="1" stopColor="#7F5330" /></linearGradient><linearGradient id="b9s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F3E9D6" /></linearGradient><radialGradient id="b9l" cx=".45" cy=".4" r=".6"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".6" stopColor="#FFE7B0" /><stop offset="1" stopColor="#EDC27A" /></radialGradient></defs><ellipse cx="60" cy="80" rx="56" ry="7" fill="#073F37" fillOpacity=".28" /><path d="M14 78 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#E8FFF8" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" /><path d="M30 54 V24" stroke="#6E4A2C" strokeWidth="3.5" strokeLinecap="round" /><path d="M30 25 Q40 22 46 28" stroke="#6E4A2C" strokeWidth="2.5" fill="none" strokeLinecap="round" /><circle cx="46" cy="41" r="15" fill="#FFE9B8" fillOpacity=".35" className="loop" style={{animation: 'jg-shimmer 3s ease-in-out infinite'} as any} /><rect x="40" y="29" width="12" height="2.5" rx="1" fill="#5A3A22" /><ellipse cx="46" cy="40" rx="8" ry="10" fill="url(#b9l)" /><path d="M38.5 37 h15 M38.5 43 h15" stroke="#C9798A" strokeWidth="1.6" /><rect x="40" y="49" width="12" height="2.5" rx="1" fill="#5A3A22" /><circle cx="72" cy="47" r="8" fill="#F6E1C3" /><path d="M64 47 a8 8 0 0 1 16 0z" fill="#9B3A51" /><path d="M8 54 Q60 64 112 54 Q108 64 98 72 Q60 84 22 72 Q12 64 8 54Z" fill="url(#b9h)" /><path d="M10 55.5 Q60 65.5 110 55.5" fill="none" stroke="#FCE3BE" strokeWidth="2.6" strokeLinecap="round" /><path d="M17 64 Q60 73 103 64" fill="none" stroke="#C9798A" strokeWidth="3.2" strokeLinecap="round" /><path d="M30 70 q4 1.6 8 1.8 M80 71.6 q4 -.2 8 -1.8" stroke="#6B4426" strokeOpacity=".45" strokeWidth="1.4" strokeLinecap="round" /></svg></div>
    <div className="boat cross" style={{left: '80px', top: '248px', zIndex: '3', '--bx': '1180px', '--bd': '52s'} as any}><svg width="66" height="51" viewBox="0 0 120 94" aria-hidden="true" style={{overflow: 'visible'} as any}><defs><linearGradient id="b10h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8BC82" /><stop offset=".45" stopColor="#B98349" /><stop offset="1" stopColor="#7F5330" /></linearGradient><linearGradient id="b10s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F3E9D6" /></linearGradient><radialGradient id="b10l" cx=".45" cy=".4" r=".6"><stop offset="0" stopColor="#FFFDF4" /><stop offset=".6" stopColor="#FFE7B0" /><stop offset="1" stopColor="#EDC27A" /></radialGradient></defs><ellipse cx="60" cy="80" rx="56" ry="7" fill="#073F37" fillOpacity=".28" /><path d="M14 78 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#E8FFF8" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" /><rect x="57.5" y="8" width="4.5" height="48" rx="2.2" fill="#6E4A2C" /><path d="M63 13 C82 22 92 36 94 50 L63 50Z" fill="url(#b10s)" stroke="#E2D3B8" strokeWidth="1" /><path d="M63 33 C74 35 86 38 92 42" stroke="#E8A1B0" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M56 18 C46 26 40 38 38 50 L56 50Z" fill="url(#b10s)" stroke="#E2D3B8" strokeWidth="1" opacity=".92" /><path d="M61 8 L76 12 L61 16Z" fill="#C9798A" /><path d="M8 54 Q60 64 112 54 Q108 64 98 72 Q60 84 22 72 Q12 64 8 54Z" fill="url(#b10h)" /><path d="M10 55.5 Q60 65.5 110 55.5" fill="none" stroke="#FCE3BE" strokeWidth="2.6" strokeLinecap="round" /><path d="M17 64 Q60 73 103 64" fill="none" stroke="#C9798A" strokeWidth="3.2" strokeLinecap="round" /><path d="M30 70 q4 1.6 8 1.8 M80 71.6 q4 -.2 8 -1.8" stroke="#6B4426" strokeOpacity=".45" strokeWidth="1.4" strokeLinecap="round" /></svg></div>

  </div>

  
  {(isSplash) && (<>
    <div className="toast a" role="status">첨벙! 한 칸 놓였어요</div>
  </>)}

  
  {(isTogether) && (<>
    <div className="chip a" style={{position: 'absolute', right: '72px', top: '112px', background: '#1F2C31', padding: '10px 24px 10px 14px', fontSize: '28px', fontWeight: '700', color: '#F2C1CB', animation: 'rise-in 600ms var(--ease-standard) 200ms both'} as any}>
      <svg width="44" height="44" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w6a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A3B0B9" /><stop offset=".45" stopColor="#5E6D78" /><stop offset="1" stopColor="#2C3741" /></linearGradient><linearGradient id="w6b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8695A0" /><stop offset="1" stopColor="#3A4651" /></linearGradient><linearGradient id="w6s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w6d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w6k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath><linearGradient id="w6w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6FFF7" /><stop offset=".5" stopColor="#5FD6B8" /><stop offset="1" stopColor="#1E9E87" /></linearGradient></defs><ellipse cx="64" cy="88" rx="46" ry="7" fill="url(#w6d)" /><g transform="translate(0 -12)"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w6b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w6a)" /><g clipPath="url(#w6k)" fill="#151C22" fillOpacity=".32"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.19" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w6s)" strokeWidth="1.8" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".22" transform="rotate(-18 54 44)" /><path d="M51 69 l6 0 M73 69 l6 0" stroke="#F1F4F6" strokeWidth="2.4" strokeLinecap="round" /><ellipse cx="65" cy="78" rx="3" ry="3.6" fill="none" stroke="#F1F4F6" strokeWidth="2" /><ellipse cx="47" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /><ellipse cx="83" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /></g><g transform="translate(38 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w6w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(56 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w6w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(74 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w6w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(92 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w6w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g></svg>병서 소나기 · 첫 8분
    </div>
    <p className="a" style={{position: 'absolute', left: '72px', top: '222px', margin: '0', fontSize: '62px', fontWeight: '800', letterSpacing: '-0.02em', animation: 'rise-in 800ms var(--ease-standard) 300ms both'} as any}>
      {qText}
    </p>
    <div style={{position: 'absolute', left: '72px', top: '330px', display: 'flex', gap: '40px'} as any}>
      <button type="button" className={oCls} onClick={pickO} aria-label="O">O</button>
      <button type="button" className={xCls} onClick={pickX} aria-label="X">X</button>
    </div>
    {(notRevealed) && (<>
      <div className="a" style={{position: 'absolute', left: '640px', top: '318px', display: 'flex', alignItems: 'center', gap: '36px', animation: 'rise-in 700ms var(--ease-standard) 500ms both'} as any}>
        <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="84" fill="none" stroke="#26333A" strokeWidth="18" />
          <circle cx="100" cy="100" r="84" fill="none" stroke="#F2C1CB" strokeWidth="18" strokeLinecap="round" pathLength="1" strokeDasharray="1" transform="rotate(-90 100 100)" className="loop" style={{animation: 'ring-fill 30s linear both'} as any} />
          <text x="100" y="114" textAnchor="middle" fontSize="44" fontWeight="800" fill="#F4F2EC" fontFamily="Pretendard Variable, sans-serif">30초</text>
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', gap: '18px'} as any}>
          <span style={{fontSize: '44px', fontWeight: '800'} as any}>모둠끼리 상의해요</span>
          <span style={{fontSize: '28px', color: '#B4C0C4'} as any}>답을 고르면 선생님이 공개해요</span>
          {(controls) && (<>
            <button type="button" className="pillbtn" onClick={reveal} style={{alignSelf: 'flex-start', background: '#F4F2EC', color: '#12171A', fontSize: '24px', padding: '14px 28px', minHeight: '52px'} as any}>정답 공개</button>
          </>)}
        </div>
      </div>
    </>)}
    {(revealed) && (<>
      <div className="a" style={{position: 'absolute', left: '600px', top: '312px', width: '768px', display: 'flex', flexDirection: 'column', gap: '18px', animation: 'rise-in 800ms var(--ease-standard) both'} as any}>
        <div style={{fontSize: '52px', fontWeight: '800', color: '#F2C1CB'} as any}>정답은 {qAns}</div>
        <div style={{fontSize: '36px', fontWeight: '600', lineHeight: '1.4', color: '#F4F2EC'} as any}>{qExplain}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: '28px', marginTop: '6px'} as any}>
          <span className="chip a" style={{fontSize: '34px', fontWeight: '800', color: '#D5DADD', animation: 'pop-in 700ms var(--ease-bouncy) 500ms both'} as any}><svg width="56" height="56" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w7a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#EEF2F4" /><stop offset="1" stopColor="#C6D0D6" /></linearGradient><linearGradient id="w7b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6F8F9" /><stop offset="1" stopColor="#BAC6CD" /></linearGradient><linearGradient id="w7s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w7d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w7k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath></defs><ellipse cx="64" cy="100" rx="46" ry="7" fill="url(#w7d)" /><g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w7b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w7a)" /><g clipPath="url(#w7k)" fill="#6F8591" fillOpacity=".10"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.06" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w7s)" strokeWidth="1.8" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="#8C9DA7" strokeOpacity=".38" strokeWidth="1" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".75" transform="rotate(-18 54 44)" /><g fill="none" stroke="#5B6C76" strokeWidth="2.4" strokeLinecap="round"><path d="M50 69 q4.5 -5 9 0" /><path d="M71 69 q4.5 -5 9 0" /><path d="M61.5 76 q3.5 3.5 7 0" /></g><ellipse cx="46" cy="76" rx="5" ry="2.8" fill="#F4A0AA" fillOpacity=".6" /><ellipse cx="84" cy="76" rx="5" ry="2.8" fill="#F4A0AA" fillOpacity=".6" /></g></svg>구름이 걷혔어요</span>
          <button type="button" className="pillbtn a" onClick={toRope} style={{background: '#9B3A51', color: '#fff', fontSize: '34px', padding: '18px 36px', minHeight: '72px', animation: 'pop-in 700ms var(--ease-bouncy) 900ms both'} as any}>이제 밧줄을 내려요 →</button>
        </div>
      </div>
    </>)}
  </>)}

  
  {(isOpen) && (<>
    <div className="banner a" role="status">
      <div style={{flex: '1', display: 'flex', flexDirection: 'column', gap: '10px'} as any}>
        <div className="serif" style={{fontSize: '76px', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: '1.05'} as any}>우리 반 다리가 수업에 닿았노라</div>
        <div style={{fontSize: '38px', fontWeight: '700', color: '#D9D2C3'} as any}>— 한 사람도 빠짐없이</div>
      </div>
      <div className="seal a"><span className="serif" style={{fontSize: '50px', fontWeight: '900', lineHeight: '1.05', textAlign: 'center'} as any}>開<br />通</span></div>
    </div>
  </>)}

  
  {(ovKor) && (<>
    <div className="jg-grid">
      <div style={{display: 'grid', gridTemplateColumns: '170px repeat(3, minmax(0, 1fr))', alignItems: 'end', height: '48px'} as any}>
        <span></span>
        <span className="a" style={{textAlign: 'center', fontSize: '30px', fontWeight: '800', animation: 'jg-fade 600ms var(--ease-standard) 900ms both'} as any}>상형 <span style={{fontWeight: '500', color: '#B4C0C4'} as any}>· 본뜸</span></span>
        <span className="a" style={{textAlign: 'center', fontSize: '30px', fontWeight: '800', animation: 'jg-fade 600ms var(--ease-standard) 1000ms both'} as any}>가획 <span style={{fontWeight: '500', color: '#B4C0C4'} as any}>· 획 더함</span></span>
        <span className="a" style={{textAlign: 'center', fontSize: '30px', fontWeight: '800', animation: 'jg-fade 600ms var(--ease-standard) 1100ms both'} as any}>병서 <span style={{fontWeight: '500', color: '#B4C0C4'} as any}>· 나란히</span></span>
      </div>
      {(rows as any[]).map((row: any, __i: number) => (<Fragment key={__i}>
        <div style={{display: 'grid', gridTemplateColumns: '170px repeat(3, minmax(0, 1fr))', alignItems: 'center', background: row.bg, borderRadius: '16px'} as any}>
          <span className="a" style={{fontSize: '28px', fontWeight: '700', color: '#DDE5E7', paddingLeft: '20px', animation: 'jg-fade 600ms var(--ease-standard) 900ms both'} as any}>{row.name}</span>
          {(row.cells as any[]).map((cell: any, __i: number) => (<Fragment key={__i}>
            <div className="gcell">
              {(cell as any[]).map((gl: any, __i: number) => (<Fragment key={__i}>
                <div className="stone gs a" style={{'--s': '74px', animationDelay: gl.delay} as any}>{gl.g}</div>
              </Fragment>))}
            </div>
          </Fragment>))}
        </div>
      </Fragment>))}
      <div className="a" style={{display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '10px', fontSize: '24px', color: '#B4C0C4', animation: 'jg-fade 800ms var(--ease-standard) 2600ms both'} as any}>
        <span>획 하나 = 소리가 조금 세짐 <span className="serif" style={{color: '#F4F2EC', fontWeight: '700'} as any}>「聲出稍厲」</span></span>
      </div>
    </div>
  </>)}


  
  {(ovMath) && (<>
    <div style={{position: 'absolute', left: '72px', right: '72px', top: '270px', height: '470px'} as any}>
      <div style={{position: 'absolute', left: '0', right: '0', top: '0', display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '24px'} as any}>
        <span className="a" style={{fontSize: '28px', fontWeight: '800', color: '#B4C0C4', borderTop: '4px solid #26333A', paddingTop: '12px', animation: 'jg-fade 600ms var(--ease-standard) 900ms both'} as any}>기초 <span style={{fontWeight: '500'} as any}>· 수와 식</span></span>
        <span className="a" style={{fontSize: '28px', fontWeight: '800', color: '#B4C0C4', borderTop: '4px solid #26333A', paddingTop: '12px', animation: 'jg-fade 600ms var(--ease-standard) 1000ms both'} as any}>도구 <span style={{fontWeight: '500'} as any}>· 등식의 성질</span></span>
        <span className="a" style={{fontSize: '28px', fontWeight: '800', color: '#F2C1CB', borderTop: '4px solid #9B3A51', paddingTop: '12px', animation: 'jg-fade 600ms var(--ease-standard) 1100ms both'} as any}>도착</span>
      </div>
      <svg width="1296" height="300" viewBox="0 0 1296 300" style={{position: 'absolute', left: '0', top: '110px', overflow: 'visible'} as any} aria-hidden="true">
        <path d="M110 131 C 200 40, 280 0, 370 11 S 540 160, 630 151 S 800 10, 890 21 S 1080 120, 1146 111" fill="none" stroke="#F2C1CB" strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="a" style={{animation: 'draw 1600ms var(--ease-standard) 900ms both'} as any} />
      </svg>
      {(chain as any[]).map((c: any, __i: number) => (<Fragment key={__i}>
        <div style={{position: 'absolute', left: `${c.x}px`, top: `${c.y}px`, width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px'} as any}>
          <div className="stone gs a" style={{'--s': '128px', fontFamily: "'Pretendard Variable', sans-serif", fontSize: '40px', fontWeight: '800', animationDelay: c.delay} as any}>{c.g}</div>
          <span className="a" style={{fontSize: '28px', fontWeight: '700', color: '#F4F2EC', whiteSpace: 'nowrap', animation: 'jg-fade 600ms var(--ease-standard) both', animationDelay: c.delay} as any}>{c.label}</span>
        </div>
      </Fragment>))}
    </div>
    <div className="a" style={{position: 'absolute', left: '0', right: '0', bottom: '48px', textAlign: 'center', fontSize: '24px', color: '#B4C0C4', animation: 'jg-fade 800ms var(--ease-standard) 2400ms both'} as any}>앞 돌을 디뎌야 다음 돌에 닿아요 · 다리 칸 = 이 단원의 개념 지도</div>
  </>)}

  
  <div style={{position: 'absolute', right: '20px', bottom: '16px', fontSize: '14px', color: '#8D9A9F', zIndex: '8'} as any}>시연용 가상 학생 데이터 · 모의 인증</div>
  {(showNav) && (<>
    <nav className="nav" aria-label="장면 이동 (시연 조작)">
      <button type="button" onClick={prev} aria-label="이전 장면">‹</button>
      {(nav as any[]).map((n: any, __i: number) => (<Fragment key={__i}>
        <button type="button" className={n.cls} onClick={n.go}>{n.label}</button>
      </Fragment>))}
      <button type="button" onClick={next} aria-label="다음 장면">›</button>
    </nav>
  </>)}
</div>
    </>
  );
}
