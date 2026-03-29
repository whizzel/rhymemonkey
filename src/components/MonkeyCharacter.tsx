'use client';

export type MonkeyMood = 'idle' | 'happy' | 'sad' | 'excited';

interface MonkeyProps {
  mood?: MonkeyMood;
  size?: number;
}

export function MonkeyCharacter({ mood = 'idle', size = 120 }: MonkeyProps) {
  const eyeColor = mood === 'sad' ? '#ff4444' : mood === 'excited' ? '#ffffff' : '#00d4ff';
  const eyeGlow = mood === 'sad' ? '#ff0000' : mood === 'excited' ? '#00ffff' : '#00a8ff';
  const eyeOpacity = mood === 'sad' ? 0.6 : 1;

  return (
    <>
      <style>{`
        @keyframes robo-float   { 0%,100%{transform:translateY(0) rotate(-0.5deg)} 50%{transform:translateY(-6px) rotate(0.5deg)} }
        @keyframes robo-dance   { 0%{transform:rotate(-7deg) translateY(-2px)} 100%{transform:rotate(7deg) translateY(-2px)} }
        @keyframes robo-shake   { 0%,100%{transform:translateX(0)} 18%{transform:translateX(-8px) rotate(-2deg)} 36%{transform:translateX(8px) rotate(2deg)} 54%{transform:translateX(-5px)} 72%{transform:translateX(5px)} }
        @keyframes robo-jump    { 0%,100%{transform:translateY(0)} 45%{transform:translateY(-15px) scaleY(1.04)} }
        @keyframes eyeBlink     { 0%,90%,100%{scaleY:1} 95%{transform:scaleY(0.05)} }
        @keyframes antennaBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes scanline     { 0%{transform:translateY(-100%)} 100%{transform:translateY(200%)} }
        @keyframes excitedSpark { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }

        .mk-idle    { animation: robo-float 3s ease-in-out infinite; }
        .mk-happy   { animation: robo-dance 0.4s ease-in-out infinite alternate; }
        .mk-sad     { animation: robo-shake 0.65s ease-in-out 1 forwards; }
        .mk-excited { animation: robo-jump  0.5s ease-in-out infinite; }

        .antenna-blink { animation: antennaBlink 1.2s ease-in-out infinite; }
        .spark1 { animation: excitedSpark 0.4s ease-in-out 0.0s infinite; }
        .spark2 { animation: excitedSpark 0.4s ease-in-out 0.13s infinite; }
        .spark3 { animation: excitedSpark 0.4s ease-in-out 0.26s infinite; }
      `}</style>

      <svg
        width={size}
        height={Math.round(size * 1.18)}
        viewBox="0 0 120 142"
        className={`mk-${mood}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="headMetal" cx="38%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#4a6080" />
            <stop offset="50%" stopColor="#243248" />
            <stop offset="100%" stopColor="#0d1a2a" />
          </radialGradient>
          <radialGradient id="bodyMetal" cx="40%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#3a5070" />
            <stop offset="100%" stopColor="#0d1a2a" />
          </radialGradient>
          <radialGradient id="earMetal" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#3a5a78" />
            <stop offset="100%" stopColor="#152030" />
          </radialGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={eyeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={eyeGlow} stopOpacity="0.3" />
          </radialGradient>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="strongGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="metalSheen">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000814" floodOpacity="0.6" />
          </filter>
          <linearGradient id="panelEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6080a0" />
            <stop offset="100%" stopColor="#1a2a3a" />
          </linearGradient>
          <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2a4060" />
            <stop offset="50%" stopColor="#3a5a7a" />
            <stop offset="100%" stopColor="#1a3050" />
          </linearGradient>
          <clipPath id="headClip">
            <rect x="22" y="20" width="76" height="68" rx="12" />
          </clipPath>
        </defs>

        {/* ── Floor shadow ── */}
        <ellipse cx="60" cy="135" rx="22" ry="6" fill="#000814" opacity="0.5" />

        {/* ── Body ── */}
        <rect x="40" y="104" width="40" height="28" rx="8" fill="url(#bodyMetal)" filter="url(#metalSheen)" />
        {/* Body panel lines */}
        <rect x="40" y="104" width="40" height="28" rx="8" fill="none" stroke="#4a6a90" strokeWidth="1.5" opacity="0.6" />
        <line x1="60" y1="108" x2="60" y2="128" stroke="#2a4a6a" strokeWidth="1" opacity="0.5" />
        <line x1="44" y1="116" x2="76" y2="116" stroke="#2a4a6a" strokeWidth="1" opacity="0.4" />
        {/* Chest LED strip */}
        <rect x="48" y="119" width="24" height="4" rx="2" fill="#001428" stroke="#00a8ff" strokeWidth="0.8" />
        {['#ff2a2a', '#00d4ff', '#00d4ff', '#ff2a2a'].map((c, i) => (
          <circle key={i} cx={52 + i * 6} cy="121" r="1.2" fill={c} opacity={mood === 'sad' ? 0.3 : 0.9} />
        ))}
        {/* Belly bolt */}
        <circle cx="60" cy="111" r="2.5" fill="#1a2a3a" stroke="#4a6a90" strokeWidth="1" />
        <line x1="58.5" y1="111" x2="61.5" y2="111" stroke="#6a8aaa" strokeWidth="0.8" />
        <line x1="60" y1="109.5" x2="60" y2="112.5" stroke="#6a8aaa" strokeWidth="0.8" />

        {/* ── Arms ── */}
        {mood === 'idle' && <>
          <path d="M42 108 Q28 114 25 126" stroke="url(#armGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M78 108 Q92 114 95 126" stroke="url(#armGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          {/* Joint rings */}
          <circle cx="33" cy="118" r="5" fill="#1a3050" stroke="#3a6090" strokeWidth="1.5" />
          <circle cx="87" cy="118" r="5" fill="#1a3050" stroke="#3a6090" strokeWidth="1.5" />
          {/* Hands / clamps */}
          <rect x="18" y="124" width="14" height="8" rx="3" fill="#1a3050" stroke="#3a6090" strokeWidth="1.2" />
          <rect x="88" y="124" width="14" height="8" rx="3" fill="#1a3050" stroke="#3a6090" strokeWidth="1.2" />
          {/* Finger lines */}
          <line x1="23" y1="124" x2="23" y2="132" stroke="#4a6a90" strokeWidth="0.8" />
          <line x1="27" y1="124" x2="27" y2="132" stroke="#4a6a90" strokeWidth="0.8" />
          <line x1="93" y1="124" x2="93" y2="132" stroke="#4a6a90" strokeWidth="0.8" />
          <line x1="97" y1="124" x2="97" y2="132" stroke="#4a6a90" strokeWidth="0.8" />
        </>}

        {mood === 'happy' && <>
          <path d="M43 104 Q24 85 18 68" stroke="url(#armGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M77 104 Q96 85 102 68" stroke="url(#armGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="71" r="5" fill="#1a3050" stroke="#3a6090" strokeWidth="1.5" />
          <circle cx="98" cy="71" r="5" fill="#1a3050" stroke="#3a6090" strokeWidth="1.5" />
          <rect x="12" y="62" width="14" height="8" rx="3" fill="#1a3050" stroke="#3a6090" strokeWidth="1.2" transform="rotate(-30 19 66)" />
          <rect x="94" y="62" width="14" height="8" rx="3" fill="#1a3050" stroke="#3a6090" strokeWidth="1.2" transform="rotate(30 101 66)" />
        </>}

        {mood === 'sad' && <>
          <path d="M43 108 Q34 120 36 132" stroke="url(#armGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M77 108 Q86 120 84 132" stroke="url(#armGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <circle cx="35" cy="123" r="5" fill="#1a3050" stroke="#3a6090" strokeWidth="1.5" />
          <circle cx="85" cy="123" r="5" fill="#1a3050" stroke="#3a6090" strokeWidth="1.5" />
          <rect x="28" y="130" width="14" height="8" rx="3" fill="#1a3050" stroke="#2a4060" strokeWidth="1.2" />
          <rect x="78" y="130" width="14" height="8" rx="3" fill="#1a3050" stroke="#2a4060" strokeWidth="1.2" />
        </>}

        {mood === 'excited' && <>
          <path d="M42 106 Q14 88 6 64" stroke="url(#armGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M78 106 Q106 88 114 64" stroke="url(#armGrad)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="68" r="5" fill="#1a3050" stroke="#00d4ff" strokeWidth="1.5" />
          <circle cx="108" cy="68" r="5" fill="#1a3050" stroke="#00d4ff" strokeWidth="1.5" />
          {/* Sparks */}
          <g className="spark1"><path d="M4 58 L8 54 L5 60 L10 57" stroke="#00d4ff" strokeWidth="1.5" fill="none" strokeLinecap="round" /></g>
          <g className="spark2"><path d="M112 56 L116 52 L113 58 L118 55" stroke="#ff2a2a" strokeWidth="1.5" fill="none" strokeLinecap="round" /></g>
          <g className="spark3"><path d="M2 66 L-2 62 M6 70 L2 74" stroke="#00d4ff" strokeWidth="1.2" fill="none" strokeLinecap="round" /></g>
        </>}

        {/* ── Shoulder pads ── */}
        <ellipse cx="38" cy="107" rx="9" ry="6" fill="#1e3448" stroke="#3a6090" strokeWidth="1.2" />
        <ellipse cx="82" cy="107" rx="9" ry="6" fill="#1e3448" stroke="#3a6090" strokeWidth="1.2" />

        {/* ── Ear pods ── */}
        <rect x="8" y="36" width="18" height="28" rx="6" fill="url(#earMetal)" filter="url(#metalSheen)" />
        <rect x="94" y="36" width="18" height="28" rx="6" fill="url(#earMetal)" filter="url(#metalSheen)" />
        {/* Ear detail rings */}
        <circle cx="17" cy="50" r="7" fill="#0d1a2a" stroke="#2a5070" strokeWidth="1.5" />
        <circle cx="17" cy="50" r="4" fill="#0a1420" stroke={eyeColor} strokeWidth="1" opacity={eyeOpacity} />
        <circle cx="17" cy="50" r="1.5" fill={eyeColor} opacity={eyeOpacity} filter="url(#glow)" />
        <circle cx="103" cy="50" r="7" fill="#0d1a2a" stroke="#2a5070" strokeWidth="1.5" />
        <circle cx="103" cy="50" r="4" fill="#0a1420" stroke={eyeColor} strokeWidth="1" opacity={eyeOpacity} />
        <circle cx="103" cy="50" r="1.5" fill={eyeColor} opacity={eyeOpacity} filter="url(#glow)" />
        {/* Ear bolts */}
        <circle cx="10" cy="38" r="2" fill="#0d1a2a" stroke="#3a5a7a" strokeWidth="0.8" />
        <circle cx="24" cy="38" r="2" fill="#0d1a2a" stroke="#3a5a7a" strokeWidth="0.8" />
        <circle cx="98" cy="38" r="2" fill="#0d1a2a" stroke="#3a5a7a" strokeWidth="0.8" />
        <circle cx="112" cy="38" r="2" fill="#0d1a2a" stroke="#3a5a7a" strokeWidth="0.8" />

        {/* ── Head ── */}
        <rect x="22" y="20" width="76" height="70" rx="12" fill="url(#headMetal)" filter="url(#metalSheen)" />
        {/* Head panel border */}
        <rect x="22" y="20" width="76" height="70" rx="12" fill="none" stroke="url(#panelEdge)" strokeWidth="2" />
        {/* Panel line detail */}
        <rect x="26" y="24" width="68" height="62" rx="9" fill="none" stroke="#2a4060" strokeWidth="1" opacity="0.5" />

        {/* ── Antenna ── */}
        <line x1="60" y1="20" x2="60" y2="6" stroke="#3a5a7a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="54" y1="10" x2="66" y2="10" stroke="#3a5a7a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="5" r="3.5" fill={mood === 'sad' ? '#ff2a2a' : '#00d4ff'} className="antenna-blink" filter="url(#glow)" />
        <circle cx="54" cy="10" r="2" fill={mood === 'excited' ? '#ff2a2a' : '#00a8ff'} opacity="0.8" />
        <circle cx="66" cy="10" r="2" fill={mood === 'excited' ? '#00d4ff' : '#ff2a2a'} opacity="0.8" />

        {/* ── Head corner bolts ── */}
        {[[26, 24], [90, 24], [26, 84], [90, 84]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill="#0d1a2a" stroke="#3a6090" strokeWidth="1" />
            <line x1={x - 1.5} y1={y} x2={x + 1.5} y2={y} stroke="#4a6a90" strokeWidth="0.8" />
            <line x1={x} y1={y - 1.5} x2={x} y2={y + 1.5} stroke="#4a6a90" strokeWidth="0.8" />
          </g>
        ))}

        {/* ── Forehead panel ── */}
        <rect x="34" y="27" width="52" height="12" rx="4" fill="#0a1828" stroke="#2a4a6a" strokeWidth="1" />
        {/* Status lights on forehead */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={40 + i * 10} cy="33" r="1.8"
            fill={i % 2 === 0 ? '#00d4ff' : '#ff2a2a'}
            opacity={mood === 'sad' ? 0.2 : mood === 'excited' ? 1 : 0.7}
            filter={mood === 'excited' ? "url(#glow)" : undefined}
          />
        ))}

        {/* ── Eye sockets ── */}
        <rect x="31" y="44" width="24" height="20" rx="6" fill="#060e1a" stroke="#1a3a5a" strokeWidth="1.5" />
        <rect x="65" y="44" width="24" height="20" rx="6" fill="#060e1a" stroke="#1a3a5a" strokeWidth="1.5" />

        {/* Eye scanline (visor feel) */}
        {mood !== 'sad' && <>
          <rect x="31" y="44" width="24" height="20" rx="6" fill="none" clipPath="url(#headClip)"
            style={{ background: 'transparent' }} />
        </>}

        {/* ── Eyes (LED displays) ── */}
        {(mood === 'idle' || mood === 'happy' || mood === 'excited') && <>
          {/* Eye glow bloom */}
          <ellipse cx="43" cy="54" rx="14" ry="12" fill={eyeGlow} opacity="0.15" filter="url(#strongGlow)" />
          <ellipse cx="77" cy="54" rx="14" ry="12" fill={eyeGlow} opacity="0.15" filter="url(#strongGlow)" />
          {/* Main LED eye */}
          <circle cx="43" cy="54" r="8" fill="url(#eyeGlow)" opacity={eyeOpacity} filter="url(#glow)" />
          <circle cx="77" cy="54" r="8" fill="url(#eyeGlow)" opacity={eyeOpacity} filter="url(#glow)" />
          {/* Inner pupil ring */}
          <circle cx="43" cy="54" r="4" fill="#001428" />
          <circle cx="77" cy="54" r="4" fill="#001428" />
          <circle cx="43" cy="54" r="2.5" fill={eyeColor} filter="url(#strongGlow)" />
          <circle cx="77" cy="54" r="2.5" fill={eyeColor} filter="url(#strongGlow)" />
          {/* Scan line across eye */}
          <rect x="33" y={mood === 'excited' ? "52" : "53"} width="20" height="2" rx="1"
            fill={eyeColor} opacity="0.4" />
          <rect x="67" y={mood === 'excited' ? "52" : "53"} width="20" height="2" rx="1"
            fill={eyeColor} opacity="0.4" />
          {/* Reflection dot */}
          <circle cx="39" cy="50" r="1.5" fill="white" opacity="0.6" />
          <circle cx="73" cy="50" r="1.5" fill="white" opacity="0.6" />
        </>}

        {/* Sad eyes — X pattern */}
        {mood === 'sad' && <>
          <ellipse cx="43" cy="54" rx="8" ry="8" fill="#1a0010" opacity="0.8" />
          <ellipse cx="77" cy="54" rx="8" ry="8" fill="#1a0010" opacity="0.8" />
          <line x1="37" y1="48" x2="49" y2="60" stroke="#ff2a2a" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
          <line x1="49" y1="48" x2="37" y2="60" stroke="#ff2a2a" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
          <line x1="71" y1="48" x2="83" y2="60" stroke="#ff2a2a" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
          <line x1="83" y1="48" x2="71" y2="60" stroke="#ff2a2a" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
          {/* Dripping "tears" */}
          <rect x="40" y="64" width="4" height="8" rx="2" fill="#00a8ff" opacity="0.6" />
          <rect x="74" y="64" width="4" height="8" rx="2" fill="#00a8ff" opacity="0.6" />
        </>}

        {/* ── Nose sensor ── */}
        <rect x="54" y="66" width="12" height="7" rx="3" fill="#0a1828" stroke="#2a4060" strokeWidth="1" />
        <circle cx="58" cy="69.5" r="1.5" fill={eyeColor} opacity={eyeOpacity * 0.7} />
        <circle cx="62" cy="69.5" r="1.5" fill={eyeColor} opacity={eyeOpacity * 0.7} />

        {/* ── Mouth / speaker grill ── */}
        {mood === 'idle' && (
          <rect x="36" y="76" width="48" height="10" rx="4" fill="#0a1828" stroke="#2a4060" strokeWidth="1" />
        )}
        {mood !== 'idle' && (
          <rect x="36" y="75" width="48" height="12" rx="4" fill="#060e1a" stroke="#2a4a6a" strokeWidth="1.2" />
        )}

        {/* Grill lines (speaker) */}
        {mood === 'idle' && [0, 1, 2, 3, 4, 5].map(i => (
          <line key={i} x1={40 + i * 7} y1="78" x2={40 + i * 7} y2="84" stroke="#1a4060" strokeWidth="1.2" strokeLinecap="round" />
        ))}

        {/* Happy — LED smile display */}
        {mood === 'happy' && <>
          <rect x="36" y="75" width="48" height="12" rx="4" fill="#001428" />
          {/* Curved smile made of dots */}
          {[-12, -9, -6, -3, 0, 3, 6, 9, 12].map((x, i) => {
            const y = Math.abs(x) * 0.35;
            return <circle key={i} cx={60 + x} cy={82 + y} r="1.6" fill="#00d4ff" filter="url(#glow)" opacity="0.9" />;
          })}
        </>}

        {/* Sad — inverted LED frown */}
        {mood === 'sad' && <>
          <rect x="36" y="75" width="48" height="12" rx="4" fill="#1a0010" />
          {[-12, -9, -6, -3, 0, 3, 6, 9, 12].map((x, i) => {
            const y = -Math.abs(x) * 0.35;
            return <circle key={i} cx={60 + x} cy={82 + y} r="1.6" fill="#ff2a2a" filter="url(#glow)" opacity="0.7" />;
          })}
        </>}

        {/* Excited — open mouth with teeth + glow */}
        {mood === 'excited' && <>
          <rect x="36" y="74" width="48" height="14" rx="4" fill="#001428" />
          {/* Teeth */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <rect key={i} x={38 + i * 8} y="76" width="6" height="5" rx="1.5" fill="#c8e0ff" opacity="0.9" />
          ))}
          {/* Lower glow line */}
          <rect x="38" y="83" width="44" height="3" rx="1.5" fill="#00d4ff" opacity="0.7" filter="url(#glow)" />
        </>}

        {/* ── Cheek vents ── */}
        {[0, 1, 2].map(i => <g key={i}>
          <line key={`l${i}`} x1="25" y1={60 + i * 5} x2="31" y2={60 + i * 5} stroke="#2a5070" strokeWidth="1.2" strokeLinecap="round" />
          <line key={`r${i}`} x1="89" y1={60 + i * 5} x2="95" y2={60 + i * 5} stroke="#2a5070" strokeWidth="1.2" strokeLinecap="round" />
        </g>)}
      </svg>
    </>
  );
}