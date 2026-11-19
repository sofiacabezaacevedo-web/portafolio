// Case study overlay — horizontal scroll of project deep-dives.
// Add data-cs="<key>" to any element to open the matching project.
// Los datos vienen de src/data/projects.js, serializados en <script id="cs-data">.

(function () {
  const projects = JSON.parse(document.getElementById('cs-data').textContent);

  // ——— Build overlay DOM (once) ———
  const overlay = document.createElement('div');
  overlay.className = 'cs-overlay';
  overlay.innerHTML = `
    <div class="cs-bar">
      <div class="cs-title"><span class="cs-name"></span><span class="cs-tag"></span></div>
      <div class="cs-progress"></div>
      <button class="cs-close" aria-label="Cerrar">×</button>
    </div>
    <div class="cs-stage">
      <button class="cs-nav prev" aria-label="Anterior">‹</button>
      <button class="cs-nav next" aria-label="Siguiente">›</button>
      <div class="cs-track"></div>
    </div>
    <nav class="cs-dock" aria-label="Navegación del proyecto">
      <button class="cs-dock-btn prev" type="button" aria-label="Anterior">‹</button>
      <span class="cs-count"></span>
      <button class="cs-dock-btn next" type="button" aria-label="Siguiente">›</button>
    </nav>
  `;
  document.body.appendChild(overlay);

  const $name = overlay.querySelector('.cs-name');
  const $tag = overlay.querySelector('.cs-tag');
  const $progress = overlay.querySelector('.cs-progress');
  const $track = overlay.querySelector('.cs-track');
  const $prev = overlay.querySelector('.cs-nav.prev');
  const $next = overlay.querySelector('.cs-nav.next');
  const $stage = overlay.querySelector('.cs-stage');
  const $dockPrev = overlay.querySelector('.cs-dock-btn.prev');
  const $dockNext = overlay.querySelector('.cs-dock-btn.next');
  const $count = overlay.querySelector('.cs-count');
  const pad2 = (n) => String(n).padStart(2, '0');

  let current = 0;
  let totalSlides = 0;

  function renderProject(key) {
    const p = projects[key];
    if (!p) return false;
    $name.textContent = p.title;
    $tag.textContent = p.tag || '';
    $track.innerHTML = '';

    // Cover slide
    const coverSlide = document.createElement('div');
    coverSlide.className = 'cs-slide cover' + (p.coverStyle ? ' ' + p.coverStyle : '');
    const splashes = p.coverStyle === 'playful' ? `
      <svg class="splash s1" viewBox="0 0 140 140" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M65,18 C90,14 116,30 122,54 C128,78 114,102 90,112 C66,122 38,114 24,94 C10,74 14,46 32,30 C42,22 52,20 65,18 Z" fill="#e25a2a" opacity="0.92"/>
        <circle cx="124" cy="34" r="4.5" fill="#e25a2a" opacity="0.9"/>
        <circle cx="16" cy="22" r="6" fill="#e25a2a" opacity="0.9"/>
        <circle cx="132" cy="90" r="3.5" fill="#e25a2a" opacity="0.9"/>
        <circle cx="8" cy="116" r="5" fill="#e25a2a" opacity="0.9"/>
      </svg>
      <svg class="splash s2" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M52,22 C72,16 92,28 100,46 C108,64 96,86 76,92 C56,98 36,86 28,68 C20,50 30,30 48,24 C50,22 51,22 52,22 Z" fill="#8fb83a" opacity="0.92"/>
        <circle cx="106" cy="22" r="4" fill="#8fb83a" opacity="0.9"/>
        <circle cx="14" cy="100" r="5" fill="#8fb83a" opacity="0.9"/>
        <circle cx="100" cy="108" r="3" fill="#8fb83a" opacity="0.9"/>
      </svg>
      <svg class="splash s3" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M44,18 C62,14 80,26 84,42 C88,58 74,76 56,78 C38,80 22,68 18,52 C14,36 26,22 44,18 Z" fill="#2f5cc7" opacity="0.9"/>
        <circle cx="90" cy="40" r="3" fill="#2f5cc7" opacity="0.88"/>
        <circle cx="10" cy="78" r="4" fill="#2f5cc7" opacity="0.88"/>
      </svg>
      <svg class="splash s4" viewBox="0 0 110 110" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M58,24 C76,20 92,32 96,48 C100,64 88,82 70,86 C52,90 34,80 28,64 C22,48 36,30 54,26 C56,24 57,24 58,24 Z" fill="#f0b338" opacity="0.92"/>
        <circle cx="100" cy="30" r="3" fill="#f0b338" opacity="0.9"/>
        <circle cx="14" cy="40" r="4" fill="#f0b338" opacity="0.9"/>
        <circle cx="92" cy="92" r="2.5" fill="#f0b338" opacity="0.9"/>
      </svg>
      <svg class="splash s5" viewBox="0 0 90 90" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="M40,16 C56,12 70,22 74,36 C78,50 66,66 50,68 C34,70 20,58 18,42 C16,26 26,18 40,16 Z" fill="#d23a8a" opacity="0.9"/>
        <circle cx="80" cy="58" r="3" fill="#d23a8a" opacity="0.88"/>
        <circle cx="10" cy="72" r="3.5" fill="#d23a8a" opacity="0.88"/>
      </svg>
    ` : '';
    coverSlide.innerHTML = `
      ${splashes}
      <div class="cs-cover-img" style="background-image:url('${p.cover}')${p.coverFit === 'contain' ? ';background-size:contain;background-repeat:no-repeat;background-color:transparent;mix-blend-mode:multiply' : ''}"></div>
      <div class="cs-cover-meta">
        <div class="cs-cover-sub"> </div>
        <h2>${escapeHtmlButKeepIt(p.title)}</h2>
        <div class="cs-meta-grid">
          ${Object.entries(p.meta || {}).map(([k,v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('')}
        </div>
      </div>
    `;
    $track.appendChild(coverSlide);

    // Section slides
    p.slides.forEach((s) => {
      const slide = document.createElement('div');
      let cls = 'cs-slide ' + s.type;
      if (s.type === 'editorial-spread') {
        if (s.layout) cls += ' ' + s.layout;
        if (s.even) cls += ' even';
        if (s.bg) cls += ' ' + s.bg;
      }
      slide.className = cls;
      slide.innerHTML = renderSlide(s);
      $track.appendChild(slide);
    });

    totalSlides = $track.children.length;

    // progress dots
    $progress.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const s = document.createElement('span');
      $progress.appendChild(s);
    }

    current = 0;
    update();
    return true;
  }

  function escapeHtmlButKeepIt(s) {
    // simple: allow only <span class="it"> in titles
    return s;
  }

  function renderSlide(s) {
    switch (s.type) {
      case 'concepto':
        if (s.imgLayout === 'wide') {
          return `
            <div class="cnpt-wide">
              <div class="cnpt-head">
                <div class="head">— Concepto</div>
                <h3>${s.heading}</h3>
              </div>
              <div class="cnpt-cols">
                <p class="body">${s.body}</p>
                <div class="cnpt-wide-img" style="background-image:url('${s.img}')"></div>
              </div>
            </div>
          `;
        }
        return `
          <div>
            <div class="head">— ${s.eyebrow || 'Concepto'}</div>
            <h3>${s.heading}</h3>
            <p class="body">${s.body}</p>
            ${s.facts ? `<dl class="cnpt-facts">${s.facts.map(f => `<div><dt>${f.k}</dt><dd>${f.v}</dd></div>`).join('')}</dl>` : ''}
          </div>
          ${s.typeList ? `<div class="cnpt-type">${s.typeList.figure ? `<img class="cnpt-type-fig" src="${s.typeList.figure}" alt="" draggable="false" />` : ''}<div class="cnpt-type-k">${s.typeList.label}</div><ul>${s.typeList.items.map(t => `<li>${t}</li>`).join('')}</ul></div>` : `<div class="img" style="background-image:url('${s.img}');${s.imgFit === 'contain' ? 'background-size:contain;background-repeat:no-repeat;background-color:transparent;' : ''}${s.imgBlend ? `mix-blend-mode:${s.imgBlend};` : ''}"></div>`}
        `;
      case 'lineup':
        return `
          <div class="head">— Ilustraciones</div>
          <h3>${s.heading}</h3>
          <div class="looks${s.looks.length > 6 ? ' big' : ''}">
            ${s.looks.map((it, i) => { const url = typeof it === 'string' ? it : it.src; const num = typeof it === 'string' ? ('L0' + (i + 1)) : it.num; if (typeof it === 'object' && it.back) { return `<div class="look has-back" style="background-image:url('${it.src}')" data-front="${it.src}" data-back="${it.back}"><button class="lk-flip" type="button" aria-label="Ver espalda"><span class="lk-flip-ico">⟳</span> Espalda</button><span class="lk-num">${num}<span class="lk-sub" data-face>Frente</span></span></div>`; } const sub = (typeof it === 'object' && it.sub) ? `<span class="lk-sub">${it.sub}</span>` : ''; return `<div class="look" style="background-image:url('${url}')"><span class="lk-num">${num}${sub}</span></div>`; }).join('')}
          </div>
        `;
      case 'movimiento':
        return `
          <div class="mv-grid">
            <figure class="mv-media">
              <div class="mv-frame">${s.badge ? `<span class="mv-badge">${s.badge}</span>` : ''}<img src="${s.gif}" alt="${s.alt || ''}" loading="lazy"></div>
              <figcaption class="mv-cap">${s.caption || ''}</figcaption>
            </figure>
            <div class="mv-text">
              <h3>${s.heading}</h3>
              <p class="body">${s.body}</p>
              ${s.specs ? `<dl class="mv-specs">${s.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
            </div>
          </div>
        `;
      case 'lineup-pair':
        return `
          <div class="head">— Ilustraciones</div>
          <h3>${s.heading}</h3>
          <div class="looks-pair">
            ${s.looks.map((lk, idx) => `
              <figure class="pair-card${lk.extra ? ' has-extra' : ''}" data-idx="${idx}">
                <div class="pair-figures">
                  <div class="pair-fig front" style="background-image:url('${lk.front}')"></div>
                  <div class="pair-fig back" style="background-image:url('${lk.back}')"></div>
                </div>
                <figcaption>
                  <span class="lk-num">${lk.label || ''}</span>
                  <span class="lk-faces">Front · Back</span>
                </figcaption>
                ${lk.extra ? `
                  <button class="pair-chip" type="button" data-extra="open" aria-label="Mostrar ${lk.extra.label || 'capa exterior'}">
                    <span class="chip-thumb" style="background-image:url('${lk.extra.front}')"></span>
                    <span class="chip-label">${lk.extra.chipLabel || 'Chaqueta'}</span>
                  </button>
                  <div class="pair-extra-panel" data-extra-panel>
                    <button class="extra-close" type="button" aria-label="Cerrar">×</button>
                    <div class="extra-head">— ${lk.extra.label || 'Capa exterior'}</div>
                    <div class="extra-figures">
                      <div class="pair-fig front" style="background-image:url('${lk.extra.front}')"></div>
                      <div class="pair-fig back" style="background-image:url('${lk.extra.back}')"></div>
                    </div>
                  </div>
                ` : ''}
              </figure>
            `).join('')}
          </div>
          <div class="pair-more-wrap"><button class="pair-more" type="button">Más ilustraciones <span>↓</span></button></div>
        `;
      case 'details': {
        // Document variant — academic / editorial style (LITTLE DREAMS look)
        const sections = s.sections;
        if (sections) {
          const renderSection = (sec) => {
            const inner = `
              ${sec.label ? `<div class="doc-label">${sec.label}</div>` : ''}
              ${sec.text ? `<p class="doc-text">${sec.text}</p>` : ''}
              ${sec.bullets ? `<ul class="doc-bullets">${sec.bullets.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            `;
            if (sec.photo) {
              const side = sec.photoSide === 'right' ? 'photo-right' : 'photo-left';
              return `
                <div class="doc-section paired ${side}">
                  <div class="doc-photo" style="background-image:url('${sec.photo}')${sec.photoFit === 'contain' ? ';background-size:contain;background-repeat:no-repeat' : ''}${sec.photoPos ? `;background-position:${sec.photoPos}` : ''}${sec.photoOpacity ? `;opacity:${sec.photoOpacity}` : ''}"></div>
                  <div class="doc-pair-text">${inner}</div>
                </div>
              `;
            }
            return `<div class="doc-section">${inner}</div>`;
          };
          return `
            <div class="details-doc">
              <header class="doc-head">
                <h2 class="doc-title">${s.title || ''}</h2>
                ${s.subtitle ? `<p class="doc-subtitle">${s.subtitle}</p>` : ''}
              </header>
              <div class="doc-body">
                ${sections.map(renderSection).join('')}
              </div>
            </div>
          `;
        }

        // Bento variant (legacy)
        const imgAlign = s.imgAlign === 'left' ? 'img-left' : 'img-right';
        const imgEl = `<div class="details-img" data-caption="${s.imgCaption || s.title || ''}" style="background-image:url('${s.img}')"></div>`;
        let textContent = '';
        if (s.intro || s.bullets) {
          textContent = `
            ${s.intro ? `<p class="d-intro">${s.intro}</p>` : ''}
            ${s.bullets ? `<ul class="d-bullets">${s.bullets.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
          `;
        } else if (s.blocks) {
          textContent = s.blocks.map(b => `
            <div class="details-block">
              ${b.label ? `<div class="d-label">— ${b.label}</div>` : ''}
              ${b.text ? `<p class="d-text">${b.text}</p>` : ''}
              ${b.bullets ? `<ul class="d-bullets">${b.bullets.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
            </div>
          `).join('');
        }
        const textEl = `
          <div class="details-text">
            <div class="head">— ${s.title || 'Detalles'}</div>
            <h3>${s.heading || ''}</h3>
            ${s.subtitle ? `<p class="details-subtitle">${s.subtitle}</p>` : ''}
            ${textContent}
          </div>
        `;
        return `
          <div class="details-wrap bento ${imgAlign}">
            ${imgAlign === 'img-left' ? imgEl + textEl : imgEl + textEl}
          </div>
        `;
      }
      case 'qr-sheets':
        return `
          <header class="qr-head">
            <div class="head">— ${s.title || 'Fichas técnicas'}</div>
            <h3>${s.heading || ''}</h3>
            ${s.subtitle ? `<p class="qr-subtitle">${s.subtitle}</p>` : ''}
          </header>
          <div class="qr-grid">
            ${(s.items || []).map((it) => `
              <article class="qr-card">
                <div class="qr-look">
                  <div class="qr-thumb" style="background-image:url('${it.thumb}')"></div>
                  <div class="qr-meta">
                    <span class="qr-label">${it.label || ''}</span>
                    <span class="qr-name">${it.name || ''}</span>
                  </div>
                </div>
                <div class="qr-divider"></div>
                <div class="qr-code-wrap">
                  ${it.url
                    ? `<a class="qr-code qr-link" href="${it.url}" target="_blank" rel="noopener noreferrer" style="background-image:url('${it.qr}')" aria-label="Abrir ficha técnica ${it.label || ''} en Behance"></a>`
                    : `<div class="qr-code" style="background-image:url('${it.qr}')"></div>`}
                  <span class="qr-scan">${it.url ? 'Escanea o haz clic' : 'Escanea · ficha técnica'}</span>
                </div>
              </article>
            `).join('')}
          </div>
        `;
      case 'palette':
        return `
          <div class="pal-head">
            <div class="head">— ${s.subhead || 'Carta de color'}</div>
            <h3>${s.heading || ''}</h3>
          </div>
          <div class="pal-grid">
            ${(s.colors || []).map(([hex, name, code]) => `
              <figure class="pal-chip">
                <div class="pal-sw" style="background:${hex}"></div>
                <figcaption><span class="pal-name">${name}</span><span class="pal-code">${code}</span></figcaption>
              </figure>
            `).join('')}
          </div>
        `;
      case 'editorial':
        return `
          <div class="hero-img" style="background-image:url('${s.img}')${s.imgFit === 'contain' ? ';background-size:contain;background-repeat:no-repeat' : ''}${s.imgBg ? `;background-color:${s.imgBg}` : ''}"></div>
          <div class="caption">
            <div class="left">${s.captionLeft || ''}</div>
            <div class="right">${s.captionRight || ''}</div>
          </div>
        `;
      case 'editorial-spread':
        return `
          <header class="es-header">
            <span>— Editorial${s.no ? ' · ' + s.no : ''}</span>
            <span>${s.brand || 'Apollo 22 · F/W 22'}</span>
          </header>
          <div class="es-stage">
            ${(s.photos || []).map((p, i) => `
              <figure class="es-photo" data-i="${i+1}"${p.note ? ` data-note="${p.note}"` : ''}${p.rot ? ` style="transform:rotate(${p.rot}deg)"` : ''}>
                <img src="${p.src}" alt="" draggable="false" onerror="this.closest('figure').classList.add('missing')" />
              </figure>
            `).join('')}
          </div>
          <footer class="es-footer">
            <div class="es-caption">${s.captionLeft || ''}</div>
            <div class="es-meta">${s.captionRight || ''}</div>
          </footer>
        `;
      case 'look-desarrollado': {
        const renderPhoto = (p) => {
          const bgStyle = p.bg ? `background-color:${p.bg};` : '';
          const containCls = p.contain ? 'contain' : '';
          const darkCls = p.bg ? 'dark' : '';
          if (!p.back) {
            return `
              <div class="ld-photo ${containCls} ${darkCls}" style="background-image:url('${p.src}');${bgStyle}">
                <span class="ld-cap">${p.caption || ''}</span>
              </div>
            `;
          }
          return `
            <div class="ld-flip">
              <div class="ld-flip-inner">
                <div class="ld-photo ld-face ld-front ${containCls} ${darkCls}" style="background-image:url('${p.src}');${bgStyle}">
                  <span class="ld-cap">${p.caption || ''}</span>
                </div>
                <div class="ld-photo ld-face ld-back ${containCls} ${darkCls}" style="background-image:url('${p.back}');${bgStyle}">
                  <span class="ld-cap">${p.backCaption || p.caption || ''}</span>
                </div>
              </div>
            </div>
          `;
        };
        return `
          <div class="ld-photos">
            ${renderPhoto(s.photos[0])}
            ${renderPhoto(s.photos[1])}
          </div>
          <div class="ld-text">
            <div class="head">— Look desarrollado</div>
            <h3>${s.heading}</h3>
            <p class="sub">${s.subhead || ''}</p>
            <p class="intro">${s.intro || ''}</p>
            <ul class="bullets">
              ${(s.bullets || []).map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `;
      }
      case 'moodboard':
        return `
          <div class="mb-head">
            <div class="head">— Moodboard</div>
            <h3>${s.heading}</h3>
            <p style="color:var(--muted);font-size:14px;line-height:1.6;">${s.subhead || ''}</p>
          </div>
          <div class="mb m1" style="background-image:url('${s.images[0]}')"></div>
          <div class="mb m2" style="background-image:url('${s.images[1]}')"></div>
          <div class="mb m3" style="background-image:url('${s.images[2]}')"></div>
          <div class="mb m4" style="background-image:url('${s.images[3]}')"></div>
          <div class="mb m5" style="background-image:url('${s.images[4]}')"></div>
          <div class="swatch-row">
            ${(s.swatches || []).map(c => `<div class="sw" style="background:${c}"></div>`).join('')}
          </div>
        `;
      case 'planos-resumen':
        return `
          <div class="pr-head">
            <div class="head">— Resto de la colección</div>
            <h3>${s.heading}</h3>
            ${s.note ? `<p class="pr-note">${s.note}</p>` : ''}
          </div>
          <div class="pr-grid">
            ${(s.items || []).map(it => `
              <article class="pr-card">
                <div class="pr-card-top">
                  <span class="pr-num">${it.num}</span>
                  <span class="pr-name">${it.name}</span>
                </div>
                <div class="pr-views">
                  <figure><img src="${it.frente}" alt="${it.num} frente" draggable="false" /><figcaption>Frente</figcaption></figure>
                  <figure><img src="${it.espalda}" alt="${it.num} espalda" draggable="false" /><figcaption>Espalda</figcaption></figure>
                </div>
                <dl class="pr-specs">
                  ${(it.specs || []).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
                </dl>
              </article>
            `).join('')}
          </div>
        `;
      case 'ficha':
        if (s.variant === 'proceso') {
          return `<div class="ficha-wrap"><header class="ficha-header"><div><div class="head">— Ficha técnica${s.no ? ' · ' + s.no : ''}</div><h3>${s.name}</h3></div><div class="ficha-meta">${(s.metaTags || []).map(t => `<div><span class="k">${t.label}</span><span class="v">${t.value}</span></div>`).join('')}</div></header><div class="ficha-body fp-body${(s.images || []).length ? '' : ' fp-noimg'}">${(s.images || []).length ? `<div class="fp-visual">${s.images.map(im => `<figure><img src="${im.src}" alt="" draggable="false" /><figcaption>${im.label}</figcaption></figure>`).join('')}</div>` : ''}<aside class="ficha-side">${(s.blocks || []).map(bl => `<div class="ficha-side-block"><div class="head">— ${bl.head}</div>${bl.ordered ? `<ol class="fp-list">${bl.items.map(q => `<li>${q}</li>`).join('')}</ol>` : `<ul class="insumos">${bl.items.map(q => `<li>${q}</li>`).join('')}</ul>`}</div>`).join('')}</aside></div>${(s.steps || []).length ? `<div class="fo-block"><div class="head">— ${s.stepsHead}</div><ol class="fo-grid fo-compact">${s.steps.map((t,i) => `<li><span class="n">${String(i+1).padStart(2,'0')}</span><span class="t">${t}</span></li>`).join('')}</ol></div>` : ''}</div>`;
        }
        if (s.variant === 'escena') {
          return `<div class="ficha-wrap esc-wrap"><div class="esc-text"><div class="head">— ${s.no}</div><h3>${s.name}</h3><p class="fm-note">${s.note}</p><div class="esc-cap">${s.label}</div><div class="esc-hint esc-hint-mouse">${s.video ? 'Animación del mecanismo del catálogo' : s.noLens ? 'Clic en la ilustración para verla en pantalla completa' : 'Pasa el cursor sobre la ilustración para ver el detalle · clic para pantalla completa'}</div><div class="esc-hint esc-hint-touch">Toca la ilustración para verla en pantalla completa y acercarte</div></div><figure class="esc-stage"><div class="esc-frame${s.plain ? ' is-plain' : ''}">${s.video ? `<video class="esc-video" src="${s.video}" poster="${s.img}" autoplay muted loop playsinline></video>` : `<img src="${s.img}" alt="" draggable="false" />${s.noLens ? '' : `<span class="esc-lens" style="background-image:url('${s.img}')"></span>`}<span class="esc-open" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26"><g transform="rotate(40 12 12)"><path d="M12 1.2c1.3 1.6 1.9 3.4 1.7 5.6H10.3C10.1 4.6 10.8 2.7 12 1.2z" fill="#5b6670"/><rect x="10.4" y="6.8" width="3.2" height="4.4" fill="#f4b88f"/><rect x="10.4" y="10.6" width="3.2" height=".5" fill="#5b6670"/><rect x="10.4" y="11.4" width="3.2" height=".4" fill="#5b6670"/><path d="M10.4 11.8h3.2l-.9 10.6c-.1.6-1.3.6-1.4 0z" fill="#e0873c"/></g></svg></span>`}</div></figure></div>`;
        }
        if (s.variant === 'galeria') {
          return `<div class="ficha-wrap"><header class="ficha-header"><div><div class="head">— Ficha técnica${s.no ? ' · ' + s.no : ''}</div><h3>${s.name}</h3></div><p class="fm-note">${s.note}</p></header><div class="fg-row" data-n="${s.images.length}">${s.images.map(im => `<figure><div class="fg-img"><img src="${im.src}" alt="" draggable="false" /></div><figcaption>${im.label}</figcaption></figure>`).join('')}</div>${(s.chips || []).length ? `<div class="fg-chips">${s.chips.map(c => `<div class="fg-chip">${c.line ? `<span class="fg-line" style="background:${c.line}"></span>` : `<span class="sw-chip" style="background:${c.color}"></span>`}<span class="sw-info"><span class="sw-name">${c.name}</span><span class="sw-ref">${c.ref}</span></span></div>`).join('')}</div>` : ''}</div>`;
        }
        if (s.variant === 'operacional') {
          return `<div class="ficha-wrap"><header class="ficha-header"><div><div class="head">— Ficha técnica${s.no ? ' · ' + s.no : ''}</div><h3>${s.name}</h3></div><p class="fm-note">${s.note}</p></header><ol class="fo-grid">${s.steps.map((t,i) => `<li><span class="n">${String(i+1).padStart(2,'0')}</span><span class="t">${t}</span></li>`).join('')}</ol></div>`;
        }
        if (s.variant === 'medidas') {
          return `<div class="ficha-wrap"><header class="ficha-header"><div><div class="head">— Ficha técnica${s.no ? ' · ' + s.no : ''}</div><h3>${s.name}</h3></div><p class="fm-note">${s.note}</p></header><div class="ficha-body fm-body"><div class="fm-table-wrap"><table class="fm-table"><thead><tr><th>N°</th><th>Medida</th><th>Tol.</th>${s.sizes.map((z,i) => `<th${i === s.base ? ' class="is-base"' : ''}>${z}${i === s.base ? '<span>base</span>' : ''}</th>`).join('')}</tr></thead><tbody>${s.rows.map((r,ri) => `<tr><td>${String(ri+1).padStart(2,'0')}</td><td>${r[0]}</td><td>${r[1]}</td>${r[2].map((v,i) => `<td${i === s.base ? ' class="is-base"' : ''}>${String(v).replace('.', ',')}</td>`).join('')}</tr>`).join('')}</tbody></table></div><aside class="ficha-side fm-side"><div class="ficha-side-block"><div class="head">— Tiras y sesgos</div><div class="fm-extra">${(s.extra || []).map(e => `<div><span class="k">${e[0]}</span><span class="v">${e[1]}</span></div>`).join('')}</div></div></aside></div></div>`;
        }
        if (s.flatViews || s.flat) {
          // Rich ficha — full tech sheet with header, meta, flat drawing(s) with annotations, description, insumos
          const views = s.flatViews || [{ src: s.flat, anchors: s.anchors || [] }];
          return `
            <div class="ficha-wrap">
              <header class="ficha-header">
                <div>
                  <div class="head">— Ficha técnica${s.no ? ' · ' + s.no : ''}</div>
                  <h3>${s.name}</h3>
                </div>
                <div class="ficha-meta">
                  ${(s.metaTags || []).map(t => `
                    <div>
                      <span class="k">${t.label}</span>
                      <span class="v">${t.value}</span>
                    </div>
                  `).join('')}
                </div>
              </header>
              <div class="ficha-body${s.wideFlat ? ' is-wide' : ''}">
                <div class="ficha-flat">
                  <div class="flat-label">${s.flatLabel || '— Dibujo plano'}</div>
                  <div class="flat-views" data-views="${views.length}"${s.stackFlats ? ' data-stack="1"' : ''}>
                    ${views.map(v => `
                      <figure class="flat-view">
                        <div class="flat-img-box"${v.photo ? ' data-photo="1"' : ''}${v.fit ? ' data-fit="1"' : ''}${v.eq ? ' data-eq="1"' : ''}>
                          <img src="${v.src}"${v.photo ? ' class="is-photo"' : ''} alt="${v.label || ''}" draggable="false" onload="this.parentNode.style.setProperty('--ar', this.naturalWidth + '/' + this.naturalHeight)" />
                          <svg class="flat-anno-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            ${(v.anchors || []).map(a => `
                              <line x1="${a.x}" y1="${a.y}" x2="${a.lx}" y2="${a.ly}"
                                    stroke="rgb(160,133,98)" stroke-width="0.7"
                                    vector-effect="non-scaling-stroke"
                                    stroke-linecap="round" stroke-dasharray="2 3" opacity="0.55" />
                            `).join('')}
                          </svg>
                          ${(v.anchors || []).map(a => `
                            <span class="flat-anno-dot" style="left:${a.x}%;top:${a.y}%;"></span>
                            <span class="flat-anno-label" data-align="${a.align || 'right'}" style="left:${a.lx}%;top:${a.ly}%;${a.w ? `width:${a.w}px;max-width:none;` : ''}">${a.label}</span>
                          `).join('')}
                        </div>
                        ${v.label ? `<figcaption>${v.label}</figcaption>` : ''}
                        ${(v.anchors || []).length ? `<ol class="flat-legend">${v.anchors.map(a => `<li>${a.label}</li>`).join('')}</ol>` : ''}
                      </figure>
                    `).join('')}
                  </div>
                </div>
                <aside class="ficha-side">
                  <div class="ficha-side-block">
                    <div class="head">— Descripción</div>
                    <p class="desc">${s.description || ''}</p>
                  </div>
                  <div class="ficha-side-block">
                    <div class="head">— Insumos</div>
                    <ul class="insumos">
                      ${(s.insumos || []).map(i => `<li>${i}</li>`).join('')}
                    </ul>
                  </div>
                  ${(s.swatches && s.swatches.length) ? `
                  <div class="ficha-side-block">
                    <div class="head">— Telas & color</div>
                    <div class="ficha-swatches">
                      ${s.swatches.map(sw => `
                        <div class="swatch">
                          <span class="sw-chip" style="background:${sw.color};"></span>
                          <span class="sw-info"><span class="sw-name">${sw.name}</span>${sw.ref ? `<span class="sw-ref">${sw.ref}</span>` : ''}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  ` : ''}
                </aside>
              </div>
            </div>
          `;
        }
        return `
          <div>
            <div class="head">— Ficha técnica</div>
            <h3>${s.heading}</h3>
            <div class="sketch"><div class="sketch-bg" style="background-image:url('${s.sketch}')"></div></div>
          </div>
          <div>
            <div class="specs">
              ${s.specs.map(row => {
                if (row[0] === '__note') return `<div class="row note">${row[1]}</div>`;
                return `<div class="row"><span class="k">${row[0]}</span><span class="v">${row[1]}</span></div>`;
              }).join('')}
            </div>
          </div>
        `;
      default:
        return '';
    }
  }

  function update() {
    $track.style.transform = `translateX(${-current * 100}%)`;
    [...$progress.children].forEach((c, i) => c.classList.toggle('active', i === current));
    $prev.toggleAttribute('disabled', current === 0);
    $next.toggleAttribute('disabled', current === totalSlides - 1);
    $dockPrev.toggleAttribute('disabled', current === 0);
    $dockNext.toggleAttribute('disabled', current === totalSlides - 1);
    $count.textContent = `${pad2(current + 1)} / ${pad2(totalSlides)}`;
    bindFlips();
  }

  // attach per-element flip handlers — independent for each card,
  // works on desktop (hover) and touch (tap toggle)
  function bindFlips() {
    const flips = $track.querySelectorAll('.ld-flip');
    flips.forEach((flip) => {
      if (flip.dataset.bound === '1') return;
      flip.dataset.bound = '1';
      const isTouch = window.matchMedia('(hover: none)').matches;
      if (isTouch) {
        flip.addEventListener('click', () => {
          flip.classList.toggle('flipped');
        });
      } else {
        flip.addEventListener('mouseenter', () => flip.classList.add('flipped'));
        flip.addEventListener('mouseleave', () => flip.classList.remove('flipped'));
      }
    });

    // ——— Click-to-expand "+ Capa exterior" panels on lineup-pair cards ———
    const chips = $track.querySelectorAll('.pair-card .pair-chip');
    chips.forEach((chip) => {
      if (chip.dataset.bound === '1') return;
      chip.dataset.bound = '1';
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = chip.closest('.pair-card');
        const wasOpen = card.classList.contains('extra-open');
        // close any other open extras in the same slide
        card.parentElement.querySelectorAll('.pair-card.extra-open').forEach(c => c.classList.remove('extra-open'));
        if (!wasOpen) card.classList.add('extra-open');
      });
    });
    const closes = $track.querySelectorAll('.pair-card .extra-close');
    closes.forEach((btn) => {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.closest('.pair-card').classList.remove('extra-open');
      });
    });
    // ——— Indicador "más ilustraciones" en los lineups que hacen scroll ———
    $track.querySelectorAll('.cs-slide.lineup-pair').forEach((slide) => {
      const wrap = slide.querySelector('.pair-more-wrap');
      if (!wrap || wrap.dataset.bound === '1') return;
      wrap.dataset.bound = '1';
      const btn = wrap.querySelector('.pair-more');
      const sync = () => {
        const more = slide.scrollHeight - slide.clientHeight - slide.scrollTop;
        wrap.classList.toggle('is-hidden', more < 40);
      };
      btn.addEventListener('click', () => {
        slide.scrollTo({ top: slide.scrollTop + slide.clientHeight * 0.8, behavior: 'smooth' });
      });
      slide.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      setTimeout(sync, 60);
      setTimeout(sync, 600);
    });
    // ——— Flip frente/dorso en looks del lineup con vista trasera ———
    $track.querySelectorAll('.cs-slide.lineup .look.has-back').forEach((card) => {
      if (card.dataset.bound === '1') return;
      card.dataset.bound = '1';
      const btn = card.querySelector('.lk-flip');
      const face = card.querySelector('[data-face]');
      let back = false;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        back = !back;
        card.style.backgroundImage = `url('${back ? card.dataset.back : card.dataset.front}')`;
        if (face) face.textContent = back ? 'Espalda' : 'Frente';
        btn.lastChild.textContent = back ? ' Frente' : ' Espalda';
      });
    });
  }

  function open(key) {
    if (!renderProject(key)) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Una entrada en el historial para que el botón "atrás" del celular cierre el proyecto.
    if (!(history.state && history.state.cs)) history.pushState({ cs: key }, '');
  }
  function close(fromHistory) {
    if (!overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (fromHistory !== true && history.state && history.state.cs) history.back();
  }
  window.addEventListener('popstate', () => close(true));

  function go(i) {
    current = Math.max(0, Math.min(totalSlides - 1, i));
    update();
  }

  $prev.addEventListener('click', () => go(current - 1));
  $next.addEventListener('click', () => go(current + 1));
  $dockPrev.addEventListener('click', () => go(current - 1));
  $dockNext.addEventListener('click', () => go(current + 1));
  overlay.querySelector('.cs-close').addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'ArrowRight') go(current + 1);
    if (e.key === 'ArrowLeft') go(current - 1);
    if (e.key === 'Escape') close();
  });

  // Deslizar a los lados cambia de lámina. Se ignora si el gesto empieza dentro de algo
  // que se desplaza horizontalmente (una tabla, por ejemplo) y aún no llegó a su borde.
  function scrollsSideways(el, dx) {
    for (; el && el !== $stage; el = el.parentElement) {
      const ox = getComputedStyle(el).overflowX;
      if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 2) {
        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
        if (dx < 0 ? !atEnd : !atStart) return true;
      }
    }
    return false;
  }
  let touch0 = null;
  $stage.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touch0 = e.touches.length === 1 ? { x: t.clientX, y: t.clientY, el: e.target } : null;
  }, { passive: true });
  $stage.addEventListener('touchend', (e) => {
    if (!touch0) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch0.x;
    const dy = t.clientY - touch0.y;
    const start = touch0.el;
    touch0 = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (scrollsSideways(start, dx)) return;
    go(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // bind triggers
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cs]');
    if (!t) return;
    e.preventDefault();
    open(t.getAttribute('data-cs'));
  });

  (() => {
    let lb, img, z = 1, ox = .5, oy = .5, down = null, moved = false;
    const Z = 2.6;
    const apply = () => { img.style.transformOrigin = (ox * 100) + '% ' + (oy * 100) + '%'; img.style.transform = 'scale(' + z + ')'; lb.classList.toggle('zoomed', z > 1); };
    const rel = (e) => ({ x: Math.min(1, Math.max(0, (e.clientX - img.offsetLeft - img.offsetParent.getBoundingClientRect().left) / img.offsetWidth)), y: Math.min(1, Math.max(0, (e.clientY - img.offsetTop - img.offsetParent.getBoundingClientRect().top) / img.offsetHeight)) });
    const build = () => {
      lb = document.createElement('div'); lb.className = 'esc-lb';
      lb.innerHTML = '<button class="esc-lb-x" aria-label="Cerrar">×</button><div class="esc-lb-stage"><img alt="" draggable="false" /></div><div class="esc-lb-hint"></div>';
      document.body.appendChild(lb); img = lb.querySelector('img');
      const stage = lb.querySelector('.esc-lb-stage');
      lb.querySelector('.esc-lb-x').addEventListener('click', close);
      stage.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: e.pointerType }; moved = false; });
      stage.addEventListener('pointermove', (e) => {
        if (z === 1) return;
        if (e.pointerType === 'mouse') { const p = rel(e); ox = p.x; oy = p.y; apply(); return; }
        if (!down) return;
        const dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        ox = Math.min(1, Math.max(0, ox - dx / (img.offsetWidth * (z - 1))));
        oy = Math.min(1, Math.max(0, oy - dy / (img.offsetHeight * (z - 1))));
        down.x = e.clientX; down.y = e.clientY; apply();
      });
      stage.addEventListener('pointerup', (e) => {
        const wasMoved = moved; down = null;
        if (wasMoved) return;
        if (e.target !== img && z === 1) { close(); return; }
        if (z === 1) { const p = rel(e); ox = p.x; oy = p.y; z = Z; } else z = 1;
        apply(); hint();
      });
      document.addEventListener('keydown', (e) => { if (!lb.classList.contains('open')) return; e.stopPropagation(); e.preventDefault(); if (e.key === 'Escape') close(); }, true);
    };
    const touch = () => matchMedia('(hover:none)').matches;
    const hint = () => { lb.querySelector('.esc-lb-hint').textContent = z > 1 ? (touch() ? 'Arrastra para recorrer · toca para alejar' : 'Mueve el cursor para recorrer · clic para alejar') : (touch() ? 'Toca para acercar' : 'Clic para acercar'); };
    function close() { lb.classList.remove('open'); z = 1; apply(); }
    document.addEventListener('click', (e) => {
      const f = e.target.closest && e.target.closest('.esc-frame');
      if (!f || !f.querySelector('img')) return;
      if (!lb) build();
      img.src = f.querySelector('img').src; z = 1; ox = oy = .5; apply(); hint();
      lb.classList.add('open');
    });
  })();

  document.addEventListener('mousemove', (e) => {
    const f = e.target.closest && e.target.closest('.esc-frame');
    document.querySelectorAll('.esc-frame.on').forEach(x => { if (x !== f) x.classList.remove('on'); });
    if (!f || matchMedia('(hover:none)').matches) return;
    const img = f.querySelector('img'), lens = f.querySelector('.esc-lens');
    if (!lens) return;
    const r = img.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) { f.classList.remove('on'); return; }
    const Z = 2.6, L = lens.offsetWidth / 2;
    f.classList.add('on');
    lens.style.left = (x + img.offsetLeft) + 'px'; lens.style.top = (y + img.offsetTop) + 'px';
    lens.style.backgroundSize = (r.width * Z) + 'px ' + (r.height * Z) + 'px';
    lens.style.backgroundPosition = (L - x * Z) + 'px ' + (L - y * Z) + 'px';
  });

  window.openCaseStudy = open;
})();
