import { useEffect, useId, useRef, useState } from 'react';
import Icon from '../layout/Icon.jsx';

/**
 * An accessible glassmorphic dropdown select component.
 *
 * Replaces native <select> so that:
 * 1. The trigger's active/accent border strictly reflects its open state
 *    (via `aria-expanded="true"` / `isOpen`).
 * 2. Clicking outside explicitly closes the menu and blurs the trigger,
 *    returning it to the default inactive border.
 * 3. Full keyboard accessibility (Tab, Enter, Space, Arrows, Escape).
 *
 * @param {{
 *   id?: string,
 *   value: string,
 *   onChange: (value: string) => void,
 *   options: Array<{ value: string, label: string }>,
 *   ariaLabel?: string,
 *   className?: string
 * }} props
 */
export default function CustomSelect({
  id: customId,
  value,
  onChange,
  options = [],
  ariaLabel,
  className = '',
}) {
  const generatedId = useId();
  const id = customId || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const selectedLabel = selectedOption ? selectedOption.label : '';

  const openMenu = () => {
    setIsClosing(false);
    setIsOpen(true);
    const curIdx = options.findIndex((opt) => opt.value === value);
    setHighlightedIndex(curIdx >= 0 ? curIdx : 0);
  };

  const closeMenu = (shouldBlur = false) => {
    if (isOpen) {
      setIsOpen(false);
      setIsClosing(true);
      if (shouldBlur) {
        triggerRef.current?.blur();
      }
    }
  };

  // Close and blur trigger when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeMenu(true);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  // Safety fallback to unmount if animationend is missed
  useEffect(() => {
    if (!isClosing) return;

    const timer = setTimeout(() => {
      setIsClosing(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [isClosing]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  const handleToggle = () => {
    if (isOpen) {
      closeMenu(true);
    } else {
      openMenu();
    }
  };

  const handleSelect = (val) => {
    onChange(val);
    closeMenu(true);
  };

  const handleAnimationEnd = (e) => {
    if (e.target === listRef.current && isClosing && e.animationName === 'dropdown-fade-out') {
      setIsClosing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu(true);
        break;
      case 'Tab':
        closeMenu(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`glass-select-wrapper ${isOpen ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''} ${className}`.trim()}
      ref={containerRef}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`form-select glass-select glass-select-trigger ${isOpen ? 'is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-controls={`${id}-listbox`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span className="glass-select-label">{selectedLabel}</span>
        <Icon
          name="chevron-down"
          size={16}
          className={`glass-select-arrow ${isOpen ? 'is-open' : ''}`}
        />
      </button>

      {(isOpen || isClosing) && (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={ariaLabel || selectedLabel}
          aria-hidden={isClosing ? 'true' : undefined}
          className={`glass-select-menu ${isClosing ? 'is-closing' : ''}`.trim()}
          onAnimationEnd={handleAnimationEnd}
        >
          {options.map((option, idx) => {
            const isSelected = option.value === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={`glass-select-option ${isSelected ? 'is-selected' : ''} ${
                  isHighlighted ? 'is-highlighted' : ''
                }`.trim()}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <span className="glass-select-check-slot" aria-hidden="true">
                  {isSelected && <Icon name="check" size={14} className="glass-select-check" />}
                </span>
                <span className="glass-select-option-text">{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
