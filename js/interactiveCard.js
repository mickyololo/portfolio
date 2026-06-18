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

function isHovered(el) {
  try {
    return el.matches(':hover');
  } catch (e) {
    return false;
  }
}

function animateCardEffect(type, card, msgDiv, opts) {
  opts = Object.assign({}, DEFAULTS, opts);

  try {
    if (type === 'hover') {
      card.style.transform = opts.hoverScale;
      card.style.boxShadow = opts.hoverShadow;
      msgDiv.textContent = MESSAGES.hover;
    } else if (type === 'leave') {
      card.style.transform = opts.restScale;
      card.style.boxShadow = opts.restShadow;
      msgDiv.textContent = MESSAGES.rest;
    } else if (type === 'click') {
      card.style.backgroundColor = opts.clickBg;
      msgDiv.textContent = MESSAGES.click;
      setTimeout(function () {
        try {
          card.style.backgroundColor = opts.restBg;
          msgDiv.textContent = isHovered(card) ? MESSAGES.hover : MESSAGES.rest;
        } catch (err) {
          console.error('Error resetting card state:', err);
        }
      }, opts.clickResetDelay);
    }
  } catch (err) {
    console.error('Error in card animation (' + type + '):', err);
  }
}

function initInteractiveCard(card, msgDiv, opts) {
  if (!card || !msgDiv) {
    console.error('initInteractiveCard: missing required element(s) —' +
      (!card ? ' card' : '') + (!msgDiv ? ' msgDiv' : ''));
    return null;
  }

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
