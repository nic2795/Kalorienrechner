const DIAL = { cx: 120, cy: 120, r: 92, sweep: 270, start: 135 };
const SVG_NS = 'http://www.w3.org/2000/svg';

const MACRO_COLORS = {
  protein: 'var(--c-protein)',
  carbs: 'var(--c-carbs)',
  fat: 'var(--c-fat)'
};

function polar(radius, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return [DIAL.cx + radius * Math.cos(a), DIAL.cy + radius * Math.sin(a)];
}

function el(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function createDial(svg) {
  const ticks = el('g', { class: 'dial-ticks' });
  const count = 54;
  for (let i = 0; i <= count; i++) {
    const angle = DIAL.start + (DIAL.sweep / count) * i;
    const major = i % 9 === 0;
    const [x1, y1] = polar(major ? 102 : 105, angle);
    const [x2, y2] = polar(111, angle);
    ticks.appendChild(el('line', { x1, y1, x2, y2, class: major ? 'tick major' : 'tick' }));
  }
  svg.appendChild(ticks);

  const circumference = 2 * Math.PI * DIAL.r;
  const arcLength = circumference * (DIAL.sweep / 360);
  const rotate = `rotate(${DIAL.start} ${DIAL.cx} ${DIAL.cy})`;

  svg.appendChild(el('circle', {
    cx: DIAL.cx, cy: DIAL.cy, r: DIAL.r, class: 'dial-track', transform: rotate,
    'stroke-dasharray': `${arcLength} ${circumference}`
  }));

  const segmentLayer = el('g', { class: 'dial-segments' });
  svg.appendChild(segmentLayer);
  const markerLayer = el('g', { class: 'dial-marker' });
  svg.appendChild(markerLayer);

  function drawSegments(parts) {
    segmentLayer.innerHTML = '';
    const total = parts.reduce((sum, p) => sum + p.value, 0);
    if (!total) return;
    const gap = parts.length > 1 ? 3 : 0;
    let offset = 0;
    parts.forEach((part) => {
      const len = Math.max((part.value / total) * arcLength - gap, 0);
      segmentLayer.appendChild(el('circle', {
        cx: DIAL.cx, cy: DIAL.cy, r: DIAL.r, class: 'dial-segment', transform: rotate,
        stroke: part.color,
        'stroke-dasharray': `0 ${circumference}`,
        'stroke-dashoffset': -offset,
        'data-len': len
      }));
      offset += len + gap;
    });
    
    // Bogen im nächsten Frame aufziehen, damit die Transition greift
    requestAnimationFrame(() => requestAnimationFrame(() => {
      segmentLayer.querySelectorAll('.dial-segment').forEach((seg) => {
        seg.setAttribute('stroke-dasharray', `${seg.dataset.len} ${circumference}`);
      });
    }));
  }

  return {
    
    // Anteile, die zusammen den ganzen Bogen füllen
    setShares(parts) {
      markerLayer.innerHTML = '';
      drawSegments(parts);
    },
    
    // Füllstand gegenüber einem Zielwert; 1.0 liegt bei 2/3 des Bogens, damit Überschreitungen sichtbar bleiben
    setProgress(ratio, color) {
      const scaleMax = 1.5;
      const clamped = Math.min(Math.max(ratio, 0), scaleMax);
      drawSegments([{ value: clamped, color }, { value: scaleMax - clamped, color: 'transparent' }]);
      markerLayer.innerHTML = '';
      const angle = DIAL.start + DIAL.sweep * (1 / scaleMax);
      const [x1, y1] = polar(80, angle);
      const [x2, y2] = polar(116, angle);
      markerLayer.appendChild(el('line', { x1, y1, x2, y2, class: 'target-line' }));
    }
  };
}

function storedMacros() {
  try {
    return JSON.parse(localStorage.getItem('kalorienrechner-makros') || 'null');
  } catch (e) {
    return null;
  }
}

function macroShares(m) {
  return [
    { value: m.proteinKcal, color: MACRO_COLORS.protein },
    { value: m.carbsKcal, color: MACRO_COLORS.carbs },
    { value: m.fatKcal, color: MACRO_COLORS.fat }
  ];
}
