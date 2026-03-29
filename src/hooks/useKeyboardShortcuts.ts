'use client';

import { useEffect } from 'react';

export function useKeyboardShortcuts(onMute: () => void, onPause?: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle mute
      if (e.key.toLowerCase() === 'm') {
        onMute();
      }
      // Pause
      if (e.key === 'Escape') {
        onPause?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMute, onPause]);
}
