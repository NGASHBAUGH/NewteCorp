/* =========================================
   NATHAN ASHBAUGH — PORTFOLIO
   SPA Navigation + Interactions
   ========================================= */

// ---- Page registry ----
const pages = {
  home:     document.getElementById('page-home'),
  services: document.getElementById('page-services'),
  work:     document.getElementById('page-work'),
  about:    document.getElementById('page-about'),
  contact:  document.getElementById('page-contact'),
  game:     document.getElementById('page-game'),
};

let currentPage = 'home';

// ---- Navigate ----
function navigateTo(pageId, pushState = true) {
  if (!pages[pageId] || pageId === currentPage) return;

  const from = pages[currentPage];
  const to   = pages[pageId];

  // Exit current
  from.classList.add('exiting');
  from.classList.remove('active');
  setTimeout(() => from.classList.remove('exiting'), 250);

  // Enter new
  to.classList.add('active');

  // Scroll new page to top
  to.scrollTop = 0;

  currentPage = pageId;

  // Update nav links
  updateNavLinks(pageId);

  // Update browser title
  const title = to.dataset.title || 'Nathan Ashbaugh';
  document.title = title;

  // Push browser history
  if (pushState) {
    history.pushState({ page: pageId }, title, `#${pageId}`);
  }

  // Trigger stagger animations for newly visible page
  triggerStagger(to);

  // Trigger skill bars on about page
  if (pageId === 'about') triggerSkillBars();
}

// ---- Update active nav link ----
function updateNavLinks(pageId) {
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.tagName === 'A') {
      el.classList.toggle('active', el.dataset.page === pageId);
    }
  });
}

// ---- Stagger children of .stagger containers ----
function triggerStagger(pageEl) {
  pageEl.querySelectorAll('.stagger').forEach(container => {
    Array.from(container.children).forEach((child, i) => {
      child.classList.remove('in');
      // Re-trigger
      setTimeout(() => child.classList.add('in'), 80 + i * 90);
    });
  });
}

// ---- Skill bars ----
function triggerSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    bar.style.width = '0';
    // Allow reset to flush, then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = bar.dataset.w;
      });
    });
  });
}

// ---- Wire up all [data-page] triggers ----
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-page]');
  if (!trigger) return;
  e.preventDefault();
  navigateTo(trigger.dataset.page);

  // Close mobile nav
  document.getElementById('navLinks').classList.remove('open');
});

// ---- Mobile nav toggle ----
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// ---- Browser back/forward ----
window.addEventListener('popstate', e => {
  const pageId = e.state?.page || 'home';
  navigateTo(pageId, false);
});

// ---- Initial load: read hash ----
(function init() {
  const hash = location.hash.replace('#', '');
  if (hash && pages[hash]) {
    pages['home'].classList.remove('active');
    pages[hash].classList.add('active');
    currentPage = hash;
    updateNavLinks(hash);
    document.title = pages[hash].dataset.title || 'Nathan Ashbaugh';
    triggerStagger(pages[hash]);
    if (hash === 'about') triggerSkillBars();
  } else {
    updateNavLinks('home');
    triggerStagger(pages['home']);
  }

  history.replaceState({ page: currentPage }, document.title, `#${currentPage}`);
})();

// ---- Contact form ----
const form   = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const btn = form.querySelector('.btn-submit');
  const orig = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const data = Object.fromEntries(new FormData(form));

  // TODO: Replace YOUR_FORM_ID after signing up free at formspree.io
  const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      formMsg.className = 'form-message success';
      formMsg.textContent = "Message sent — I'll be in touch within one business day.";
      form.reset();
      showToast('Message sent!');
    } else {
      throw new Error();
    }
  } catch {
    // Fallback: open mail client
    const subject = encodeURIComponent(`Project Inquiry from ${data.name || 'Website'}`);
    const body    = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    formMsg.className = 'form-message success';
    formMsg.textContent = 'Opening your email app…';
  }

  btn.textContent = orig;
  btn.disabled = false;
});

// ---- Toast ----
const toast = document.getElementById('toast');

function showToast(msg, ms = 3500) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), ms);
}

// ---- Portfolio filter ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.transition = 'opacity 0.25s, transform 0.25s';
      if (match) {
        card.style.opacity = '1';
        card.style.transform = '';
        card.style.display = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.97)';
        setTimeout(() => {
          if (!match) card.style.display = 'none';
        }, 250);
      }
    });
  });
});

// ---- Subtle hero sun parallax ----
document.getElementById('page-home').addEventListener('scroll', () => {
  const sun = document.querySelector('.hero-sun');
  if (sun) sun.style.transform = `translateY(${document.getElementById('page-home').scrollTop * 0.1}px)`;
});
