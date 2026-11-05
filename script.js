// ---------- Highlight current section in the pill nav ----------
const navLinks = [...document.querySelectorAll('.pill a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

// ---------- Staggered reveal for the highlights grid ----------
const items = document.querySelectorAll('.hl article');
items.forEach((el, i) => el.style.setProperty('--i', i));
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
items.forEach(el => revealObserver.observe(el));

// ---------- Project filter ----------
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach(chip => chip.addEventListener('click', () => {
  chips.forEach(c => c.classList.toggle('on', c === chip));
  const f = chip.dataset.filter;
  cards.forEach(card => card.classList.toggle('hide', f !== 'all' && card.dataset.cat !== f));
}));

// ---------- Contact form ----------
const form = document.getElementById('form');
const result = document.getElementById('result');
const MY_EMAIL = 'saniyavs402@gmail.com'; // <-- replace with your email

function setError(field, msg) {
  form.querySelector(`[data-for="${field.id}"]`).textContent = msg;
  field.classList.toggle('invalid', Boolean(msg));
  field.setAttribute('aria-invalid', Boolean(msg));
}
function validate(field) {
  const v = field.value.trim();
  let msg = '';
  if (!v) msg = 'This field is required.';
  else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter an email like name@example.com.';
  else if (field.id === 'message' && v.length < 10) msg = 'Write at least 10 characters.';
  setError(field, msg);
  return !msg;
}
form.querySelectorAll('input, textarea').forEach(f => {
  f.addEventListener('blur', () => validate(f));
  f.addEventListener('input', () => f.classList.contains('invalid') && validate(f));
});
form.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  const ok = fields.map(validate).every(Boolean);
  if (!ok) {
    fields.find(f => f.classList.contains('invalid')).focus();
    result.textContent = '';
    return;
  }
  const { name, email, message } = Object.fromEntries(new FormData(form));
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
  result.textContent = `Thanks, ${name}. Your email app should open with the message ready to send.`;
  form.reset();
});