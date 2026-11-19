// Barra superior, aparición al hacer scroll y parallax de las fotos a sangre.

const topbarEl = document.getElementById('topbar');
const films = [...document.querySelectorAll('.film')];
const atelier = document.getElementById('atelier');
const BAR_HEIGHT = 88;

// La barra se vuelve clara sobre las fotos y sobre la sección de contacto.
const onScroll = () => {
  topbarEl.classList.toggle('scrolled', window.scrollY > 8);
  let onDark = films.some((f) => {
    const r = f.getBoundingClientRect();
    return r.top < BAR_HEIGHT && r.bottom > 0;
  });
  if (atelier) {
    const r = atelier.getBoundingClientRect();
    if (r.top < BAR_HEIGHT && r.bottom > 0) onDark = true;
  }
  topbarEl.classList.toggle('on-dark', onDark);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal, .reveal-stagger, [data-film]').forEach((el) => io.observe(el));

const filmBgs = document.querySelectorAll('.film .bg');
let raf = null;
const tick = () => {
  const vh = window.innerHeight;
  filmBgs.forEach((bg) => {
    const r = bg.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const progress = (vh - r.top) / (vh + r.height); // 0..1 mientras cruza la pantalla
    bg.style.transform = `translateY(${(progress - 0.5) * 120}px) scale(1.08)`;
  });
  raf = null;
};
window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
tick();
