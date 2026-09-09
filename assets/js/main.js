/* Enrichissements progressifs. Le contenu du CV vit dans le HTML :
   si ce fichier ne se charge pas, la page reste complète et lisible. */

(function () {
  'use strict';

  /* Bouton « Enregistrer en PDF » */
  document.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });

  /* Adresse assemblée ici : le motif complet n'apparaît jamais dans le HTML servi,
     ce qui la met hors de portée des aspirateurs d'adresses. */
  var mail = document.querySelector('[data-mail]');
  if (mail) {
    var parts = mail.getAttribute('data-mail').split('|');
    var address = parts[0] + '@' + parts[1];
    mail.setAttribute('href', 'mailto:' + address);
    var label = mail.querySelector('[data-mail-text]');
    if (label) label.textContent = address;
  }

  /* Tant que le portrait n'est pas déposé, mieux vaut rien qu'une image cassée. */
  var photo = document.querySelector('.hero-photo img');
  if (photo) {
    var hidePhoto = function () { photo.parentNode.classList.add('is-missing'); };
    photo.addEventListener('error', hidePhoto);
    if (photo.complete && photo.naturalWidth === 0) hidePhoto();
  }

  /* Filet sous la barre de navigation une fois défilé */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Section courante dans la navigation */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* Apparition au défilement */
  if (reduced || !('IntersectionObserver' in window)) return;

  var animated = document.querySelectorAll(
    '.stat, .principle, .feature, .skill-group, .job, .cert-list li, .pull-quote'
  );

  var reveal = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  animated.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
    reveal.observe(el);
  });
})();

/* La suite de tests du profil : une vraie sortie Robot Framework, jouee ligne a ligne. */
(function () {
  'use strict';

  var openBtn = document.querySelector('[data-run-open]');
  var modal = document.querySelector('[data-console]');
  if (!openBtn || !modal) return;

  var body = modal.querySelector('[data-console-body]');
  var hint = modal.querySelector('[data-console-hint]');
  var replayBtn = modal.querySelector('[data-run-replay]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var RULE = new Array(79).join('=');
  var THIN = new Array(79).join('-');

  var script = [
    { cls: 'c-cmd', text: '> robot --include profil julien_becheny.robot', pause: 320 },
    { cls: 'c-blank' },
    { cls: 'c-rule', text: RULE },
    { cls: 'c-suite', text: 'Julien Becheny :: Ingenieur QA Automation / SDET' },
    { cls: 'c-rule', text: RULE, pause: 200 },
    { test: 'Couverture Multi Plateformes :: 5 OS cibles' },
    { test: 'Framework Robot Framework / Appium :: 380+ tests maintenables' },
    { test: 'Non Regression Complete :: 24 h contre 1 semaine' },
    { test: 'Plateforme D Orchestration :: React, Flask, Robot Framework' },
    { test: 'Generation De Tests Par IA :: agents, index, garde-fous' },
    { test: 'Banc De Test Multi OS :: 4 PC, 2 Mac, Android, iPhone, iPad' },
    { test: 'Diagnostic Et Performance :: temps d affichage, fuites memoire' },
    { test: 'Disponibilite :: CDI, Montpellier' },
    { cls: 'c-total', text: 'Julien Becheny', status: 'PASS' },
    { cls: 'c-total', text: '8 tests, 8 passed, 0 failed' },
    { cls: 'c-rule', text: RULE, pause: 180 },
    { cls: 'c-path', text: 'Output:  /profil/output.xml' },
    { cls: 'c-path', text: 'Log:     /profil/log.html' },
    { cls: 'c-path', text: 'Report:  /profil/report.html' },
    { cls: 'c-blank' },
    { cls: 'c-exit', text: 'Process finished with exit code 0', caret: true }
  ];

  /* Un test occupe deux lignes a l'ecran : son resultat, puis le trait de separation. */
  var steps = [];
  script.forEach(function (step) {
    if (!step.test) { steps.push(step); return; }
    steps.push({ text: step.test, status: 'PASS' });
    steps.push({ cls: 'c-rule', text: THIN });
  });

  var timers = [];
  var running = false;

  function makeLine(step) {
    var el = document.createElement('div');

    if (step.cls === 'c-blank') {
      el.className = 'c-blank';
      return el;
    }
    if (step.status) {
      el.className = 'c-test ' + (step.cls || '');
      var name = document.createElement('span');
      name.textContent = step.text;
      var status = document.createElement('span');
      status.className = 'c-pass';
      status.textContent = '| ' + step.status + ' |';
      el.appendChild(name);
      el.appendChild(status);
      return el;
    }
    el.className = step.cls || '';
    el.textContent = step.text;
    if (step.caret) el.classList.add('c-caret');
    return el;
  }

  function stop() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function finish() {
    running = false;
    hint.textContent = 'Echap pour fermer';
    replayBtn.hidden = false;
  }

  function showAll() {
    stop();
    body.textContent = '';
    steps.forEach(function (step) { body.appendChild(makeLine(step)); });
    finish();
  }

  function play() {
    stop();
    body.textContent = '';
    replayBtn.hidden = true;
    running = true;
    hint.textContent = 'Cliquez pour tout afficher';

    if (reduced) { showAll(); return; }

    var delay = 0;
    steps.forEach(function (step, i) {
      delay += step.pause || (step.cls === 'c-rule' ? 24 : 74);
      timers.push(setTimeout(function () {
        body.appendChild(makeLine(step));
        body.scrollTop = body.scrollHeight;
        if (i === steps.length - 1) finish();
      }, delay));
    });
  }

  function open() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    play();
    modal.querySelector('.console-close').focus();
  }

  function close() {
    stop();
    running = false;
    modal.hidden = true;
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.hidden = false;
  openBtn.addEventListener('click', open);
  replayBtn.addEventListener('click', play);
  body.addEventListener('click', function () { if (running) showAll(); });

  modal.querySelectorAll('[data-run-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();
