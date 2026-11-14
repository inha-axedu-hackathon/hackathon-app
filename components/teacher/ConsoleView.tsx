"use client";
// 교사 화면 Console (담당: 신재우·정환희). 디자인 캔버스 "징검다리 · 디자인"의 Console 아트보드를 자동 변환, 동적 영역은 슬롯 (scratchpad/dc2jsx.py). 값은 props로 받는다. 손으로 고칠 때는 문구·구조만.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import "./console.css";

export function ConsoleView(v: Record<string, any>) {
  const { tab, tabsBar, aiSlot, checkinSlot, planLine, planQ, teams, secs, tide, headerLine, analyze, analyzing, analyzeLabel, startSlot, toolbarSlot, noticeMeta, tideTitle, tideSub, totalPlaced, totalAll, arrived, students, crossingText, top3Slot, exceptionSlot, typeSlot } = v;
  return (
    <>
<div className="on-light" style={{width: '100%', minHeight: '1040px', boxSizing: 'border-box', background: '#FFFFFF', color: '#1C1A18', fontFamily: "'Pretendard Variable', Pretendard, sans-serif"} as any}>
  
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', padding: '16px 40px', borderBottom: '1px solid #F1E9E9', background: '#fff', fontSize: '13px', color: '#8A7F80'} as any}>
    <span style={{display: 'flex', gap: '10px', alignItems: 'center'} as any}><b style={{color: '#9B3A51', fontSize: '18px', fontFamily: 'var(--g-font-title)', fontWeight: 400} as any}>징검다리</b><span style={{color: '#B9AEAF'} as any}>|</span><span>교사</span></span>
    <span style={{display: 'flex', gap: '14px', alignItems: 'center'} as any}><span style={{padding: '3px 10px', borderRadius: '999px', background: '#F7F6F2', color: '#6B665F'} as any}>슈퍼스쿨 수업활동과 연동</span><span>시연용 가상 학생 데이터 · 모의 인증</span><span style={{width: '28px', height: '28px', borderRadius: '50%', background: '#F8EAEE', display: 'grid', placeItems: 'center', color: '#9B3A51', fontWeight: '800'} as any}>교</span></span>
  </div>

  <div style={{maxWidth: '1376px', margin: '0 auto', padding: '36px 40px 48px', display: 'flex', flexDirection: 'column', gap: '22px'} as any}>
    
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px'} as any}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'} as any}>
        <h1 className="serif" style={{margin: '0', fontSize: '38px', fontWeight: '700', letterSpacing: '-0.02em'} as any}>오늘의 수업 예보</h1>
        <span className="num" style={{fontSize: '15px', color: '#4A4641'} as any}>{headerLine}</span>
      </div>
      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'} as any}>
        <button type="button" className="btn bs" onClick={analyze} disabled={analyzing}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 11-1.5-3.6M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>{analyzeLabel}</button>
        {startSlot}
      </div>
    </div>
    {toolbarSlot}

    <div role="note" style={{display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#FBF1F3', color: '#6E2536', border: '1px solid #F2DDE2', borderRadius: '14px', padding: '14px 18px', fontSize: '14px'} as any}>
      <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" style={{flex: 'none'} as any}><circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M10 9v5M10 6.2v.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      <span style={{flex: '1', minWidth: '280px'} as any}><b>꼭 교사 본인이 직접 확인하시길 바랍니다.</b> 막힌 지점과 예외는 AI가 학생 답을 읽은 결과예요.</span>
      <span className="num" style={{fontSize: '13px'} as any}>{noticeMeta}</span>
    </div>

    {(tide) && (<>
      <div role="status" style={{display: 'flex', gap: '12px', alignItems: 'center', background: '#9B3A51', color: '#fff', borderRadius: '14px', padding: '14px 20px', fontSize: '16px', fontWeight: '700', animation: 'rise-in 200ms var(--ease-standard) both'} as any}>
        <svg width="28" height="28" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w143a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A3B0B9" /><stop offset=".45" stopColor="#5E6D78" /><stop offset="1" stopColor="#2C3741" /></linearGradient><linearGradient id="w143b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8695A0" /><stop offset="1" stopColor="#3A4651" /></linearGradient><linearGradient id="w143s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w143d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w143k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath><linearGradient id="w143w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6FFF7" /><stop offset=".5" stopColor="#5FD6B8" /><stop offset="1" stopColor="#1E9E87" /></linearGradient></defs><ellipse cx="64" cy="88" rx="46" ry="7" fill="url(#w143d)" /><g transform="translate(0 -12)"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w143b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w143a)" /><g clipPath="url(#w143k)" fill="#151C22" fillOpacity=".32"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.19" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w143s)" strokeWidth="1.8" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".22" transform="rotate(-18 54 44)" /><path d="M51 69 l6 0 M73 69 l6 0" stroke="#F1F4F6" strokeWidth="2.4" strokeLinecap="round" /><ellipse cx="65" cy="78" rx="3" ry="3.6" fill="none" stroke="#F1F4F6" strokeWidth="2" /><ellipse cx="47" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /><ellipse cx="83" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /></g><g transform="translate(38 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w143w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(56 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w143w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(74 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w143w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(92 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w143w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g></svg> {tideTitle} <span style={{fontWeight: '500', opacity: '.85'} as any}>{tideSub}</span>
      </div>
    </>)}

    {tabsBar}

    
    {(tab === 'today') && (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px'} as any}>
      {(secs as any[]).map((s: any, __i: number) => (<Fragment key={__i}>
        <div className="bx" style={{display: 'flex', flexDirection: 'column', gap: '8px'} as any}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'} as any}><span style={{fontSize: '16px', fontWeight: '800'} as any}>{s.name}</span>
            {(s.clear) && (<><svg width="40" height="40" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><radialGradient id="w144h" cx="60" cy="60" r="60" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFE3A0" stopOpacity=".8" /><stop offset=".42" stopColor="#FFD27A" stopOpacity=".28" /><stop offset="1" stopColor="#FFD27A" stopOpacity="0" /></radialGradient><linearGradient id="w144r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C98A24" /><stop offset="1" stopColor="#FFE7A6" /></linearGradient><radialGradient id="w144c" cx="49" cy="47" r="34" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFFCEC" /><stop offset=".32" stopColor="#FFE38E" /><stop offset=".78" stopColor="#F3AC3D" /><stop offset="1" stopColor="#D9862A" /></radialGradient></defs><circle cx="60" cy="60" r="60" fill="url(#w144h)" /><g fill="url(#w144r)"><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(0.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(22.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(45.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(67.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(90.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(112.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(135.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(157.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(180.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(202.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(225.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(247.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(270.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(292.5)" /><path d="M0 -32 L2.6 -38 L0 -54 L-2.6 -38Z" transform="translate(60 60) rotate(315.0)" /><path d="M0 -32 L1.7 -38 L0 -45 L-1.7 -38Z" transform="translate(60 60) rotate(337.5)" /></g><circle cx="60" cy="60" r="34.5" fill="none" stroke="#D9A441" strokeWidth=".8" strokeOpacity=".85" /><circle cx="60" cy="60" r="27" fill="url(#w144c)" /><circle cx="60" cy="60" r="22.5" fill="none" stroke="#FFF7DA" strokeWidth=".9" strokeOpacity=".8" /><ellipse cx="47" cy="45" rx="6" ry="3.6" fill="#fff" fillOpacity=".65" transform="rotate(-32 47 45)" /><ellipse cx="53" cy="59" rx="2.5" ry="3.3" fill="#6B3E0E" /><ellipse cx="67" cy="59" rx="2.5" ry="3.3" fill="#6B3E0E" /><circle cx="53.8" cy="57.8" r=".9" fill="#fff" /><circle cx="67.8" cy="57.8" r=".9" fill="#fff" /><path d="M55.5 66 q4.5 4.5 9 0" fill="none" stroke="#6B3E0E" strokeWidth="2.2" strokeLinecap="round" /><ellipse cx="46.5" cy="65.5" rx="4.6" ry="2.6" fill="#F27C6B" fillOpacity=".5" /><ellipse cx="73.5" cy="65.5" rx="4.6" ry="2.6" fill="#F27C6B" fillOpacity=".5" /></svg></>)}
            {(s.cloud) && (<><svg width="40" height="40" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w145a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#EEF2F4" /><stop offset="1" stopColor="#C6D0D6" /></linearGradient><linearGradient id="w145b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6F8F9" /><stop offset="1" stopColor="#BAC6CD" /></linearGradient><linearGradient id="w145s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w145d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w145k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath></defs><ellipse cx="64" cy="100" rx="46" ry="7" fill="url(#w145d)" /><g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w145b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w145a)" /><g clipPath="url(#w145k)" fill="#6F8591" fillOpacity=".10"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.06" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w145s)" strokeWidth="1.8" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="#8C9DA7" strokeOpacity=".38" strokeWidth="1" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".75" transform="rotate(-18 54 44)" /><g fill="none" stroke="#5B6C76" strokeWidth="2.4" strokeLinecap="round"><path d="M50 69 q4.5 -5 9 0" /><path d="M71 69 q4.5 -5 9 0" /><path d="M61.5 76 q3.5 3.5 7 0" /></g><ellipse cx="46" cy="76" rx="5" ry="2.8" fill="#F4A0AA" fillOpacity=".6" /><ellipse cx="84" cy="76" rx="5" ry="2.8" fill="#F4A0AA" fillOpacity=".6" /></g></svg></>)}
            {(s.dark) && (<><svg width="40" height="40" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w146a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A3B0B9" /><stop offset=".45" stopColor="#5E6D78" /><stop offset="1" stopColor="#2C3741" /></linearGradient><linearGradient id="w146b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8695A0" /><stop offset="1" stopColor="#3A4651" /></linearGradient><linearGradient id="w146s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w146d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w146k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath></defs><ellipse cx="64" cy="100" rx="46" ry="7" fill="url(#w146d)" /><g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w146b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w146a)" /><g clipPath="url(#w146k)" fill="#151C22" fillOpacity=".32"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.19" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w146s)" strokeWidth="1.8" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".22" transform="rotate(-18 54 44)" /><circle cx="55" cy="70" r="2.6" fill="#F1F4F6" /><circle cx="75" cy="70" r="2.6" fill="#F1F4F6" /><path d="M50 63 l8 3 M80 63 l-8 3" stroke="#F1F4F6" strokeWidth="2" strokeLinecap="round" /><path d="M59 79 q2.75 -2.4 5.5 0 q2.75 2.4 5.5 0" fill="none" stroke="#F1F4F6" strokeWidth="2" strokeLinecap="round" /><ellipse cx="47" cy="77" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".45" /><ellipse cx="83" cy="77" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".45" /></g></svg></>)}
            {(s.shower) && (<><svg width="40" height="40" viewBox="0 0 120 120" aria-hidden="true" style={{flex: 'none', overflow: 'visible'} as any}><defs><linearGradient id="w147a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A3B0B9" /><stop offset=".45" stopColor="#5E6D78" /><stop offset="1" stopColor="#2C3741" /></linearGradient><linearGradient id="w147b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8695A0" /><stop offset="1" stopColor="#3A4651" /></linearGradient><linearGradient id="w147s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /></linearGradient><radialGradient id="w147d" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#14262C" stopOpacity=".28" /><stop offset="1" stopColor="#14262C" stopOpacity="0" /></radialGradient><clipPath id="w147k"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" /></clipPath><linearGradient id="w147w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6FFF7" /><stop offset=".5" stopColor="#5FD6B8" /><stop offset="1" stopColor="#1E9E87" /></linearGradient></defs><ellipse cx="64" cy="88" rx="46" ry="7" fill="url(#w147d)" /><g transform="translate(0 -12)"><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" transform="translate(16 -13) scale(.76)" fill="url(#w147b)" /><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="url(#w147a)" /><g clipPath="url(#w147k)" fill="#151C22" fillOpacity=".32"><ellipse cx="44" cy="92" rx="34" ry="12" /><ellipse cx="92" cy="94" rx="30" ry="11" /><ellipse cx="66" cy="78" rx="18" ry="5" fillOpacity="0.19" /></g><path d="M34 92 C20 92 12 83 12 72 C12 61 21 53 32 53 C34 38 46 28 61 28 C74 28 84 35 89 46 C92 45 95 44 98 44 C110 44 118 54 118 66 C118 80 108 92 96 92 Z" fill="none" stroke="url(#w147s)" strokeWidth="1.8" /><ellipse cx="54" cy="44" rx="13" ry="6" fill="#fff" fillOpacity=".22" transform="rotate(-18 54 44)" /><path d="M51 69 l6 0 M73 69 l6 0" stroke="#F1F4F6" strokeWidth="2.4" strokeLinecap="round" /><ellipse cx="65" cy="78" rx="3" ry="3.6" fill="none" stroke="#F1F4F6" strokeWidth="2" /><ellipse cx="47" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /><ellipse cx="83" cy="76" rx="4.5" ry="2.4" fill="#E58C98" fillOpacity=".5" /></g><g transform="translate(38 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w147w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(56 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w147w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(74 98) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w147w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g><g transform="translate(92 108) rotate(14)"><path d="M0 -10 C2.6 -4.6 5 -1.5 5 2.2 A5 5 0 0 1 -5 2.2 C-5 -1.5 -2.6 -4.6 0 -10Z" fill="url(#w147w)" /><ellipse cx="-1.6" cy="0" rx="1.1" ry="2" fill="#fff" fillOpacity=".8" /></g></svg></>)}
          </div>
          <div className="num" style={{fontSize: '40px', fontWeight: '800', lineHeight: '1'} as any}>{s.placed}<span style={{fontSize: '20px', color: '#6B665F', fontWeight: '500'} as any}>/{s.total}</span></div>
          <span className="num" style={{fontSize: '14px', fontWeight: '700', color: s.col} as any}>{s.word} · {s.pct}%</span>
          <div className="bar"><i style={{width: `${s.pct}%`} as any}></i></div>
          <span style={{fontSize: '12px', color: '#6B665F'} as any}>{s.note}</span>
        </div>
      </Fragment>))}
      <div className="bx" style={{display: 'flex', flexDirection: 'column', gap: '8px', background: 'linear-gradient(160deg, #FCF4F1 0%, #FBEDE6 100%)', borderColor: '#F6E3DA'} as any}>
        <span className="lb">반 전체</span>
        <div className="num" style={{fontSize: '40px', fontWeight: '800', lineHeight: '1'} as any}>{totalPlaced}<span style={{fontSize: '20px', color: '#6B665F', fontWeight: '500'} as any}>/{totalAll}</span></div>
        <span className="num" style={{fontSize: '14px', color: '#4A4641'} as any}>놓인 돌 · 도착 관문 {arrived}/{students}</span>
        <span className="num" style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#9B3A51', marginTop: 'auto'} as any}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#C76E7F', boxShadow: '0 0 0 4px #F8EAEE'} as any}></span>{crossingText}</span>
      </div>
    </div>
    )}

    
    {(tab === 'stuck') && (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'stretch'} as any}>
      <div className="bx" style={{flex: '7 1 520px'} as any}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px'} as any}><h2 style={{margin: '0', fontSize: '20px', fontWeight: '700'} as any}>막힌 지점 TOP 3</h2><span className="lb">오개념 단위 · 인원</span></div>
        {top3Slot}
      </div>
      <div className="bx" style={{flex: '6 1 460px', display: 'flex', flexDirection: 'column', gap: '8px'} as any}>{aiSlot}</div>
    </div>
    )}
    {(tab === 'except') && (
    <div className="panelgrid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', alignItems: 'start'} as any}>
      {exceptionSlot}
      {checkinSlot}
    </div>
    )}

    
    {(tab === 'plan') && (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'stretch'} as any}>
      <div className="bx" style={{flex: '5 1 380px', display: 'flex', flexDirection: 'column', gap: '12px'} as any}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'} as any}><h2 style={{margin: '0', fontSize: '20px', fontWeight: '700'} as any}>함께 놓기 계획</h2><span className="lb num">첫 8분 · 기준 80%</span></div>
        <span style={{fontSize: '14px', color: '#4A4641'} as any}>{planLine}</span>
        {(planQ) && (<div style={{background: '#FDF7F4', border: '1px solid #F6E6DE', borderRadius: '12px', padding: '12px 14px', fontSize: '15px'} as any}><b>O/X</b> {planQ.prompt} <span style={{color: '#9B3A51', fontWeight: '800'} as any}>정답 {planQ.answer}</span></div>)}
        {(teams) && (<span className="num" style={{fontSize: '15px', fontWeight: 700, color: '#0E6F61'} as any}>{teams}</span>)}

        <span style={{fontSize: '12px', color: '#6B665F'} as any}>정답 모둠 수는 이 화면에만 표시돼요. 교실 화면은 날씨로만 말해요.</span>
      </div>
      <div className="bx" style={{flex: '7 1 520px', display: 'flex', flexDirection: 'column', gap: '14px'} as any}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'} as any}><h2 style={{margin: '0', fontSize: '20px', fontWeight: '700'} as any}>유형 분포</h2><span className="lb">참여 × 준비 × 환경 · {students}명</span></div>
        {typeSlot}












      </div>
    </div>
    )}

    <footer style={{display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '18px', borderTop: '1px solid #F1E9E9', fontSize: '13px', color: '#4A4641'} as any}>
      <span>AI는 제안만 합니다. 선생님이 승인한 길만 학생에게 갑니다.</span>
      <span>이 화면에는 학생 순위가 없습니다.</span>
      <span>이 기록은 성적·학생부에 들어가지 않습니다.</span>
      <span>학생 답·AI 분석·8유형은 이 단원(약 4주)이 끝나면 지워요 · 외부 AI에는 가명과 답만 보내요 · 시연은 가상 학생 데이터</span>
    </footer>
  </div>
</div>
    </>
  );
}
