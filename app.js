const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reveals = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('.section');

if (!reducedMotion.matches) {
  document.documentElement.classList.add('motion-ready');
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  if ('IntersectionObserver' in window) {
    document.querySelectorAll('.services-grid .reveal, .process-grid .reveal, .locations-grid .reveal')
      .forEach((el, index) => el.style.setProperty('--i', index % 3));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach((el) => observer.observe(el));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });
    sections.forEach((el) => sectionObserver.observe(el));

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / 1400, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - progress, 4)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
    sections.forEach((el) => el.classList.add('visible'));
  }

  if (window.Lenis) new window.Lenis({ autoRaf: true, anchors: true, duration: 1.05, stopInertiaOnNavigate: true });

  if (finePointer.matches) {
    document.querySelectorAll('.service-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });

    const shell = document.querySelector('.hero-visual');
    const card = document.querySelector('.main-card');
    shell?.addEventListener('pointermove', (event) => {
      const rect = shell.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(1100px) rotateY(${-7 + x * 11}deg) rotateX(${3 - y * 9}deg) translateZ(14px)`;
    });
    shell?.addEventListener('pointerleave', () => { card.style.transform = ''; });

    document.querySelectorAll('.btn-primary, .nav-cta').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .16}px, ${(event.clientY - rect.top - rect.height / 2) * .2}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }
} else {
  sections.forEach((el) => el.classList.add('visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());
  const subject = `T3 IT Solutions enquiry: ${values.service}`;
  const body = [
    `Name: ${values.name}`,
    `Phone: ${values.phone || 'Not provided'}`,
    `Email: ${values.email || 'Not provided'}`,
    `Service: ${values.service}`,
    '',
    values.message
  ].join('\n');
  const emailUrl = `mailto:info@t3itsolutions.com.bd?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = 'Your email app should open with the enquiry ready to send.';
  window.location.href = emailUrl;
});
