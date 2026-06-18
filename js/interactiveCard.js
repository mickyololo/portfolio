/**
 * Interactive card micro-interaction module.
 *
 * Handles hover, leave, and click effects on the demo card
 * shown in the portfolio's "Live Demo" section.
 */

const DEFAULTS = {
  hoverScale: 'scale(1.02)',
  hoverShadow: '0 25px 30px -12px rgba(37,99,235,0.2)',
  restScale: 'scale(1)',
  restShadow: '0 12px 20px rgba(0,0,0,0.05)',
  clickBg: '#fef9e3',
  restBg: 'white',
  clickResetDelay: 700,
};

const MESSAGES = {
  hover: '🎨 UI polish · micro interaction ready',
  rest: '✦ built with Flutter / React mindset ✦',
  click: '⚡ Click event: design system + state management ⚡',
};

function animateCardEffect(type, card, msgDiv, opts) {
  opts = Object.assign({}, DEFAULTS, opts);

  if (type === 'hover') {
    card.style.transform = opts.hoverScale;
    card.style.boxShadow = opts.hoverShadow;
    msgDiv.innerHTML = MESSAGES.hover;
  } else if (type === 'leave') {
    card.style.transform = opts.restScale;
    card.style.boxShadow = opts.restShadow;
    msgDiv.innerHTML = MESSAGES.rest;
  } else if (type === 'click') {
    card.style.backgroundColor = opts.clickBg;
    msgDiv.innerHTML = MESSAGES.click;
    setTimeout(function () {
      card.style.backgroundColor = opts.restBg;
      if (!card.matches(':hover')) {
        msgDiv.innerHTML = MESSAGES.rest;
      } else {
        msgDiv.innerHTML = MESSAGES.hover;
      }
    }, opts.clickResetDelay);
  }
}

function initInteractiveCard(card, msgDiv, opts) {
  if (!card || !msgDiv) return null;

  var handlers = {
    mouseenter: function () { animateCardEffect('hover', card, msgDiv, opts); },
    mouseleave: function () { animateCardEffect('leave', card, msgDiv, opts); },
    click:      function () { animateCardEffect('click', card, msgDiv, opts); },
  };

  card.addEventListener('mouseenter', handlers.mouseenter);
  card.addEventListener('mouseleave', handlers.mouseleave);
  card.addEventListener('click', handlers.click);

  return handlers;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { animateCardEffect, initInteractiveCard, DEFAULTS, MESSAGES };
}
