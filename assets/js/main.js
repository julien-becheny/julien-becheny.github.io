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
