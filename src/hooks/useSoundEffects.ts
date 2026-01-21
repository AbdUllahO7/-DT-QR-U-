/**
 * Sound Effects Hook - Frontend Only
 * Plays notification sounds for various events in the app
 * Supports context isolation between Menu and OnlineMenu
 */

import { useCallback, useEffect, useState } from 'react';

export type SoundContext = 'menu' | 'onlineMenu' | 'tableQR' | 'global';

export type SoundType =
  | 'addToCart'
  | 'removeFromCart'
  | 'orderPlaced'
  | 'orderConfirmed'
  | 'orderReady'
  | 'newOrder'
  | 'notification'
  | 'success'
  | 'error'
  | 'click';

interface SoundSettings {
  enabled: boolean;
  volume: number; // 0-1
  mutedTypes: SoundType[];
}

const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.5,
  mutedTypes: [],
};

// Context-specific storage key to prevent session confusion
const getStorageKey = (context: SoundContext) =>
  context === 'global' ? 'qrmenu_sound_settings' : `qrmenu_sound_settings_${context}`;

// Sound frequencies and durations for different events
const SOUND_CONFIGS: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType }> = {
  addToCart: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 - pleasant ascending
    durations: [80, 80, 120],
    type: 'sine',
  },
  removeFromCart: {
    frequencies: [392, 349.23], // G4, F4 - descending
    durations: [100, 150],
    type: 'sine',
  },
  orderPlaced: {
    frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 - triumphant
    durations: [100, 100, 100, 200],
    type: 'sine',
  },
  orderConfirmed: {
    frequencies: [659.25, 783.99, 987.77], // E5, G5, B5
    durations: [120, 120, 200],
    type: 'sine',
  },
  orderReady: {
    frequencies: [783.99, 987.77, 1174.66, 1318.51], // G5, B5, D6, E6
    durations: [100, 100, 100, 300],
    type: 'sine',
  },
  newOrder: {
    frequencies: [440, 554.37, 659.25, 880], // A4, C#5, E5, A5 - attention-grabbing
    durations: [150, 150, 150, 300],
    type: 'square',
  },
  notification: {
    frequencies: [880, 1108.73], // A5, C#6
    durations: [100, 150],
    type: 'sine',
  },
  success: {
    frequencies: [523.25, 783.99], // C5, G5
    durations: [100, 200],
    type: 'sine',
  },
  error: {
    frequencies: [200, 150], // Low tones for error
    durations: [150, 200],
    type: 'sawtooth',
  },
  click: {
    frequencies: [1000],
    durations: [30],
    type: 'sine',
  },
};

export const useSoundEffects = (context: SoundContext = 'global') => {
  // Get context-specific storage key
  const storageKey = getStorageKey(context);

  const [settings, setSettings] = useState<SoundSettings>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize AudioContext on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      }
    };

    // Initialize on first click/touch
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, [audioContext]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings, storageKey]);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!settings.enabled || settings.mutedTypes.includes(type)) {
        return;
      }

      // Create audio context if not exists
      const ctx = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContext) {
        setAudioContext(ctx);
      }

      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const config = SOUND_CONFIGS[type];
      let startTime = ctx.currentTime;

      config.frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, startTime);

        // Apply volume with envelope
        const duration = config.durations[index] / 1000;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(settings.volume * 0.3, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        startTime += duration;
      });
    },
    [settings, audioContext]
  );

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setSettings((prev) => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const toggleSoundType = useCallback((type: SoundType) => {
    setSettings((prev) => ({
      ...prev,
      mutedTypes: prev.mutedTypes.includes(type)
        ? prev.mutedTypes.filter((t) => t !== type)
        : [...prev.mutedTypes, type],
    }));
  }, []);

  const isSoundTypeMuted = useCallback(
    (type: SoundType) => settings.mutedTypes.includes(type),
    [settings.mutedTypes]
  );

  return {
    playSound,
    toggleSound,
    setVolume,
    toggleSoundType,
    isSoundTypeMuted,
    isEnabled: settings.enabled,
    volume: settings.volume,
  };
};

export default useSoundEffects;
