import React from 'react';

function PreviewSvg({ geometryKey, color }) {
  const fill = color ?? '#485056';
  const accent = '#d9d1c5';
  const stroke = 'rgba(43, 36, 33, 0.18)';

  if (geometryKey?.startsWith('sofa-')) {
    const rounded = geometryKey === 'sofa-curved' ? 26 : 18;
    const arm = geometryKey === 'sofa-minimal' ? 0 : geometryKey === 'sofa-tuxedo' ? 12 : 9;
    return (
      <svg viewBox="0 0 160 90" className="item-variant-svg" aria-hidden="true">
        <rect x="24" y="38" width="112" height="26" rx={rounded} fill={fill} />
        <rect x="32" y="20" width="96" height="22" rx="16" fill={fill} />
        {arm > 0 && <rect x="16" y="28" width={arm} height="34" rx="8" fill={fill} />}
        {arm > 0 && <rect x={144 - arm} y="28" width={arm} height="34" rx="8" fill={fill} />}
      </svg>
    );
  }

  if (geometryKey?.startsWith('chair-')) {
    return (
      <svg viewBox="0 0 120 90" className="item-variant-svg" aria-hidden="true">
        <rect x="30" y="44" width="58" height="18" rx={geometryKey === 'chair-barrel' ? 12 : 6} fill={fill} />
        {geometryKey !== 'chair-slipper' && <rect x="34" y="24" width="50" height={geometryKey === 'chair-wingback' ? 28 : 20} rx={geometryKey === 'chair-barrel' ? 18 : 6} fill={fill} />}
        {geometryKey === 'chair-wingback' && (
          <>
            <rect x="26" y="24" width="10" height="24" rx="6" fill={fill} />
            <rect x="82" y="24" width="10" height="24" rx="6" fill={fill} />
          </>
        )}
        {geometryKey === 'chair-wishbone' && (
          <>
            <line x1="42" y1="62" x2="36" y2="82" stroke={fill} strokeWidth="4" strokeLinecap="round" />
            <line x1="76" y1="62" x2="82" y2="82" stroke={fill} strokeWidth="4" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  if (geometryKey?.startsWith('bed-')) {
    return (
      <svg viewBox="0 0 160 90" className="item-variant-svg" aria-hidden="true">
        <rect x="28" y="40" width="104" height="26" rx="8" fill={fill} />
        <rect x="34" y="34" width="92" height="20" rx="8" fill={accent} stroke={stroke} />
        {geometryKey !== 'bed-low' && <rect x="24" y="26" width="112" height={geometryKey === 'bed-sleigh' ? 18 : 12} rx="6" fill={fill} />}
        {geometryKey === 'bed-canopy' && (
          <>
            <line x1="30" y1="20" x2="30" y2="68" stroke={fill} strokeWidth="4" />
            <line x1="130" y1="20" x2="130" y2="68" stroke={fill} strokeWidth="4" />
            <line x1="30" y1="20" x2="130" y2="20" stroke={fill} strokeWidth="4" />
          </>
        )}
      </svg>
    );
  }

  if (geometryKey?.startsWith('table-') || geometryKey?.startsWith('desk-')) {
    return (
      <svg viewBox="0 0 160 90" className="item-variant-svg" aria-hidden="true">
        <rect x="24" y="24" width="112" height="12" rx="5" fill={fill} />
        {geometryKey?.includes('pedestal') ? (
          <rect x="74" y="36" width="12" height="28" rx="4" fill={fill} />
        ) : geometryKey?.includes('trestle') ? (
          <>
            <rect x="38" y="36" width="10" height="30" rx="4" fill={fill} />
            <rect x="112" y="36" width="10" height="30" rx="4" fill={fill} />
          </>
        ) : (
          <>
            <rect x="34" y="36" width="8" height="30" rx="4" fill={fill} />
            <rect x="118" y="36" width="8" height="30" rx="4" fill={fill} />
          </>
        )}
        {geometryKey?.includes('waterfall') && (
          <>
            <rect x="24" y="24" width="10" height="42" rx="5" fill={fill} />
            <rect x="126" y="24" width="10" height="42" rx="5" fill={fill} />
          </>
        )}
      </svg>
    );
  }

  if (geometryKey?.startsWith('cabinet-') || geometryKey?.startsWith('wardrobe-') || geometryKey?.startsWith('shelf-') || geometryKey?.startsWith('appliance-')) {
    return (
      <svg viewBox="0 0 120 90" className="item-variant-svg" aria-hidden="true">
        <rect x="24" y="16" width="72" height="58" rx={geometryKey?.includes('rounded') || geometryKey?.includes('arched') ? 14 : 8} fill={fill} />
        {(geometryKey?.startsWith('shelf-') || geometryKey?.includes('open')) && <rect x="32" y="24" width="56" height="42" rx="6" fill={accent} stroke={stroke} />}
        {geometryKey?.includes('arched') && <path d="M36 28 Q60 2 84 28" fill="none" stroke={fill} strokeWidth="8" strokeLinecap="round" />}
      </svg>
    );
  }

  if (geometryKey?.startsWith('lamp-') || geometryKey?.startsWith('ceiling-')) {
    return (
      <svg viewBox="0 0 120 90" className="item-variant-svg" aria-hidden="true">
        {!geometryKey?.startsWith('ceiling-') && <rect x="56" y="20" width="8" height="38" rx="4" fill={fill} />}
        <circle cx="60" cy={geometryKey?.startsWith('ceiling-') ? 38 : 30} r={geometryKey === 'lamp-globe' || geometryKey === 'ceiling-sputnik' ? 16 : 13} fill={fill} />
        {geometryKey === 'ceiling-sputnik' && (
          <>
            <line x1="28" y1="38" x2="92" y2="38" stroke={fill} strokeWidth="4" strokeLinecap="round" />
            <line x1="60" y1="10" x2="60" y2="66" stroke={fill} strokeWidth="4" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  if (geometryKey?.startsWith('mirror-') || geometryKey?.startsWith('wall-')) {
    return (
      <svg viewBox="0 0 120 90" className="item-variant-svg" aria-hidden="true">
        {geometryKey?.includes('round') ? (
          <circle cx="60" cy="44" r="24" fill="#dfe6ec" stroke={fill} strokeWidth="6" />
        ) : geometryKey?.includes('arch') ? (
          <path d="M36 70 V34 Q60 10 84 34 V70 Z" fill="#dfe6ec" stroke={fill} strokeWidth="6" />
        ) : (
          <rect x="34" y="18" width="52" height="52" rx="8" fill="#dfe6ec" stroke={fill} strokeWidth="6" />
        )}
      </svg>
    );
  }

  if (geometryKey?.startsWith('rug-') || geometryKey?.startsWith('textile-')) {
    return (
      <svg viewBox="0 0 160 90" className="item-variant-svg" aria-hidden="true">
        <rect x="24" y="34" width="112" height="20" rx={geometryKey?.includes('organic') ? 16 : 8} fill={fill} />
      </svg>
    );
  }

  if (geometryKey?.startsWith('plant-')) {
    return (
      <svg viewBox="0 0 120 90" className="item-variant-svg" aria-hidden="true">
        <rect x="46" y="48" width="28" height="18" rx="8" fill="#7d5e45" />
        <circle cx="60" cy="38" r={geometryKey === 'plant-palm' ? 18 : geometryKey === 'plant-olive' ? 14 : 16} fill={fill} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 160 90" className="item-variant-svg" aria-hidden="true">
      <rect x="30" y="24" width="100" height="42" rx="12" fill={fill} />
    </svg>
  );
}

export default function ItemVariantPreview({ variant, color, className = '' }) {
  return (
    <div className={`item-variant-preview ${className}`.trim()}>
      <PreviewSvg geometryKey={variant?.geometryKey} color={color} />
    </div>
  );
}
