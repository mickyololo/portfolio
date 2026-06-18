/**
 * @jest-environment jsdom
 */

const {
  animateCardEffect,
  initInteractiveCard,
  DEFAULTS,
  MESSAGES,
} = require('../js/interactiveCard');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createCardDOM() {
  const card = document.createElement('div');
  card.id = 'interactiveCard';
  const msgDiv = document.createElement('div');
  msgDiv.id = 'statusMsg';
  document.body.appendChild(card);
  document.body.appendChild(msgDiv);
  return { card, msgDiv };
}

function teardownCardDOM({ card, msgDiv }) {
  card.remove();
  msgDiv.remove();
}

// ---------------------------------------------------------------------------
// animateCardEffect – hover
// ---------------------------------------------------------------------------

describe('animateCardEffect', () => {
  let els;

  beforeEach(() => {
    els = createCardDOM();
  });

  afterEach(() => {
    teardownCardDOM(els);
  });

  describe('hover effect', () => {
    it('applies scale and shadow to the card', () => {
      animateCardEffect('hover', els.card, els.msgDiv);
      expect(els.card.style.transform).toBe(DEFAULTS.hoverScale);
      expect(els.card.style.boxShadow).toBe(DEFAULTS.hoverShadow);
    });

    it('sets the hover message', () => {
      animateCardEffect('hover', els.card, els.msgDiv);
      expect(els.msgDiv.innerHTML).toBe(MESSAGES.hover);
    });
  });

  // ---------------------------------------------------------------------------
  // animateCardEffect – leave
  // ---------------------------------------------------------------------------

  describe('leave effect', () => {
    it('resets scale and shadow to rest values', () => {
      // Start from hover state
      animateCardEffect('hover', els.card, els.msgDiv);
      animateCardEffect('leave', els.card, els.msgDiv);
      expect(els.card.style.transform).toBe(DEFAULTS.restScale);
      expect(els.card.style.boxShadow).toBe(DEFAULTS.restShadow);
    });

    it('sets the rest message', () => {
      animateCardEffect('leave', els.card, els.msgDiv);
      expect(els.msgDiv.innerHTML).toBe(MESSAGES.rest);
    });
  });

  // ---------------------------------------------------------------------------
  // animateCardEffect – click
  // ---------------------------------------------------------------------------

  describe('click effect', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('sets the click background colour and message', () => {
      animateCardEffect('click', els.card, els.msgDiv);
      expect(els.card.style.backgroundColor).not.toBe('');
      expect(els.msgDiv.innerHTML).toBe(MESSAGES.click);
    });

    it('resets background after the configured delay', () => {
      animateCardEffect('click', els.card, els.msgDiv);
      jest.advanceTimersByTime(DEFAULTS.clickResetDelay);
      expect(els.card.style.backgroundColor).toBe(DEFAULTS.restBg);
    });

    it('shows rest message after timeout when card is not hovered', () => {
      animateCardEffect('click', els.card, els.msgDiv);
      jest.advanceTimersByTime(DEFAULTS.clickResetDelay);
      expect(els.msgDiv.innerHTML).toBe(MESSAGES.rest);
    });

    it('shows hover message after timeout when card is still hovered', () => {
      // Simulate :hover by mocking matches
      els.card.matches = jest.fn().mockReturnValue(true);

      animateCardEffect('click', els.card, els.msgDiv);
      jest.advanceTimersByTime(DEFAULTS.clickResetDelay);
      expect(els.card.matches).toHaveBeenCalledWith(':hover');
      expect(els.msgDiv.innerHTML).toBe(MESSAGES.hover);
    });

    it('uses the default 700ms delay', () => {
      animateCardEffect('click', els.card, els.msgDiv);
      const clickBg = els.card.style.backgroundColor;
      // Just before the delay – background unchanged
      jest.advanceTimersByTime(699);
      expect(els.card.style.backgroundColor).toBe(clickBg);
      // At the delay – background resets
      jest.advanceTimersByTime(1);
      expect(els.card.style.backgroundColor).not.toBe(clickBg);
    });

    it('accepts a custom clickResetDelay via opts', () => {
      animateCardEffect('click', els.card, els.msgDiv, { clickResetDelay: 300 });
      const clickBg = els.card.style.backgroundColor;
      jest.advanceTimersByTime(299);
      expect(els.card.style.backgroundColor).toBe(clickBg);
      jest.advanceTimersByTime(1);
      expect(els.card.style.backgroundColor).not.toBe(clickBg);
    });
  });

  // ---------------------------------------------------------------------------
  // animateCardEffect – unknown type (no-op)
  // ---------------------------------------------------------------------------

  describe('unknown type', () => {
    it('does not change card styles', () => {
      const origTransform = els.card.style.transform;
      animateCardEffect('unknown', els.card, els.msgDiv);
      expect(els.card.style.transform).toBe(origTransform);
    });
  });

  // ---------------------------------------------------------------------------
  // Custom opts override defaults
  // ---------------------------------------------------------------------------

  describe('custom options', () => {
    it('uses custom hoverScale and hoverShadow', () => {
      animateCardEffect('hover', els.card, els.msgDiv, {
        hoverScale: 'scale(1.1)',
        hoverShadow: '0 0 0 red',
      });
      expect(els.card.style.transform).toBe('scale(1.1)');
      expect(els.card.style.boxShadow).toBe('0 0 0 red');
    });

    it('uses custom restScale and restShadow', () => {
      animateCardEffect('leave', els.card, els.msgDiv, {
        restScale: 'scale(0.9)',
        restShadow: '0 0 0 blue',
      });
      expect(els.card.style.transform).toBe('scale(0.9)');
      expect(els.card.style.boxShadow).toBe('0 0 0 blue');
    });

    it('uses custom clickBg and restBg', () => {
      jest.useFakeTimers();
      animateCardEffect('click', els.card, els.msgDiv, {
        clickBg: 'red',
        restBg: 'green',
      });
      expect(els.card.style.backgroundColor).toBe('red');
      jest.advanceTimersByTime(DEFAULTS.clickResetDelay);
      expect(els.card.style.backgroundColor).toBe('green');
      jest.useRealTimers();
    });
  });
});

// ---------------------------------------------------------------------------
// initInteractiveCard
// ---------------------------------------------------------------------------

describe('initInteractiveCard', () => {
  let els;

  beforeEach(() => {
    els = createCardDOM();
  });

  afterEach(() => {
    teardownCardDOM(els);
  });

  it('returns handlers object when elements are provided', () => {
    const handlers = initInteractiveCard(els.card, els.msgDiv);
    expect(handlers).toHaveProperty('mouseenter');
    expect(handlers).toHaveProperty('mouseleave');
    expect(handlers).toHaveProperty('click');
    expect(typeof handlers.mouseenter).toBe('function');
    expect(typeof handlers.mouseleave).toBe('function');
    expect(typeof handlers.click).toBe('function');
  });

  it('returns null when card element is missing', () => {
    expect(initInteractiveCard(null, els.msgDiv)).toBeNull();
  });

  it('returns null when msgDiv element is missing', () => {
    expect(initInteractiveCard(els.card, null)).toBeNull();
  });

  it('applies hover effect on mouseenter event', () => {
    initInteractiveCard(els.card, els.msgDiv);
    els.card.dispatchEvent(new Event('mouseenter'));
    expect(els.card.style.transform).toBe(DEFAULTS.hoverScale);
    expect(els.msgDiv.innerHTML).toBe(MESSAGES.hover);
  });

  it('applies leave effect on mouseleave event', () => {
    initInteractiveCard(els.card, els.msgDiv);
    els.card.dispatchEvent(new Event('mouseenter'));
    els.card.dispatchEvent(new Event('mouseleave'));
    expect(els.card.style.transform).toBe(DEFAULTS.restScale);
    expect(els.msgDiv.innerHTML).toBe(MESSAGES.rest);
  });

  it('applies click effect on click event', () => {
    jest.useFakeTimers();
    initInteractiveCard(els.card, els.msgDiv);
    els.card.dispatchEvent(new Event('click'));
    expect(els.card.style.backgroundColor).not.toBe('');
    expect(els.msgDiv.innerHTML).toBe(MESSAGES.click);
    jest.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('exported constants', () => {
  it('DEFAULTS contains expected keys', () => {
    expect(DEFAULTS).toEqual(
      expect.objectContaining({
        hoverScale: expect.any(String),
        hoverShadow: expect.any(String),
        restScale: expect.any(String),
        restShadow: expect.any(String),
        clickBg: expect.any(String),
        restBg: expect.any(String),
        clickResetDelay: expect.any(Number),
      })
    );
  });

  it('MESSAGES contains expected keys', () => {
    expect(MESSAGES).toEqual(
      expect.objectContaining({
        hover: expect.any(String),
        rest: expect.any(String),
        click: expect.any(String),
      })
    );
  });
});
