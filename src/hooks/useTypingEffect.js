import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery.js';

const TYPE_SPEED = 100;
const DELETE_SPEED = 50;
const HOLD_AT_END = 2000;
const HOLD_BEFORE_NEXT = 500;

/**
 * Types phrases out one character at a time, then deletes them.
 *
 * The original implementation scheduled an unstoppable setTimeout chain; here
 * the timer is owned by the effect so it stops when the hero unmounts, and it
 * is skipped entirely for visitors who prefer reduced motion.
 *
 * @param {string[]} phrases
 * @returns {string} the text to render right now
 */
export function useTypingEffect(phrases) {
  const reducedMotion = usePrefersReducedMotion();
  const [text, setText] = useState('');

  useEffect(() => {
    if (!phrases?.length) return undefined;

    if (reducedMotion) {
      setText(phrases[0]);
      return undefined;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      setText(phrase.slice(0, charIndex));

      let delay = deleting ? DELETE_SPEED : TYPE_SPEED;
      if (!deleting && charIndex === phrase.length) {
        deleting = true;
        delay = HOLD_AT_END;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = HOLD_BEFORE_NEXT;
      }

      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, TYPE_SPEED);
    return () => clearTimeout(timer);
  }, [phrases, reducedMotion]);

  return text;
}
