import React, { useState, useEffect, useRef } from 'react';

const SuggestionsDropdown = ({ suggestions, onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
        case 'Tab':
          if (selectedIndex >= 0) {
            e.preventDefault();
            onSelect(suggestions[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, onSelect, onClose]);

  return (
    <ul className="suggestions-dropdown" ref={dropdownRef}>
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => onSelect(suggestion)}
          className={index === selectedIndex ? 'selected' : ''}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsDropdown;
