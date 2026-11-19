// Tela plisada (SVG) de fondo en la sección de contacto.
(() => {
  const svg = document.getElementById('drape'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', D = Math.PI / 180;
  const O = { x: 1120, y: 1010 }, N = 58, a0 = 172, a1 = 8, STEPS = 28;
  const R = t => 980 + 120 * Math.sin(3.2 * t) + 55 * Math.sin(7 * t + 1.3);
  const ray = i => {
    const th = (a0 + (a1 - a0) * i / N) * D, Rt = R(th), pts = [];
    for (let s = 0; s <= STEPS; s++) {
      const r = 30 + (Rt - 30) * s / STEPS, k = r / Rt;
      const phi = th + 0.2 * Math.sin(Math.PI * k) * Math.cos(th) * k + 0.05 * Math.sin(k * 9 + i * .7);
      const w = 2.4 * Math.sin(r * .045 + i * 1.7);
      pts.push([O.x + (r + w) * Math.cos(phi), O.y - (r + w) * Math.sin(phi)]);
    }
    return pts;
  };
  const rays = Array.from({ length: N + 1 }, (_, i) => ray(i));
  let html = `<defs><linearGradient id="dpg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".48" stop-color="#fff" stop-opacity=".2"/><stop offset=".72" stop-color="#fff" stop-opacity=".55"/><stop offset=".9" stop-color="#fff" stop-opacity="1"/></linearGradient><mask id="dpm"><rect width="1600" height="1000" fill="url(#dpg)"/></mask><radialGradient id="dps" cx="${O.x}" cy="${O.y}" r="900" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1a0806" stop-opacity=".75"/><stop offset=".45" stop-color="#1a0806" stop-opacity=".15"/><stop offset="1" stop-color="#1a0806" stop-opacity="0"/></radialGradient></defs><g>`;
  const f = p => p.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join(' L');
  let edge = '';
  for (let i = 0; i < N; i++) {
    const A = rays[i], B = rays[i + 1].slice().reverse();
    const cream = i % 2 === 0;
    html += `<path d="M${f(A)} L${f(B)}Z" fill="${cream ? '#6b2e27' : '#36150f'}"${cream ? ` fill-opacity="${(.8 + .2 * Math.abs(Math.sin(i * 2.3))).toFixed(2)}"` : ''}/>`;
  }
  rays.forEach(r => edge += (edge ? ' L' : 'M') + r[r.length - 1].map(v => v.toFixed(1)).join(' '));
  html += `<path d="M${O.x} ${O.y} L${f(rays[0])} L${f(rays[N].slice().reverse())}Z" fill="url(#dps)"/></g>`;
  svg.innerHTML = html;
})();
