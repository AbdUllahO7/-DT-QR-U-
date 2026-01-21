"use client"

import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Volume1,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useSoundEffects } from '../../../../hooks/useSoundEffects';

interface SoundSettingsButtonProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

const SoundSettingsButton: React.FC<SoundSettingsButtonProps> = ({
  className = '',
  showLabel = false,
  compact = false,
}) => {
  const { t, isRTL } = useLanguage();
  const {
    playSound,
    toggleSound,
    setVolume,
    isEnabled,
    volume,
  } = useSoundEffects();

  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    toggleSound();
    if (!isEnabled) {
      // Play a test sound when enabling
      setTimeout(() => playSound('success'), 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    playSound('click');
  };

  const VolumeIcon = !isEnabled ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (compact) {
    // Simple toggle button only
    return (
      <button
        onClick={handleToggle}
        className={`p-2 rounded-xl transition-all ${
          isEnabled
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        } hover:scale-105 ${className}`}
        title={isEnabled ? t('sound.disable') || 'Disable sounds' : t('sound.enable') || 'Enable sounds'}
      >
        <VolumeIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={settingsRef}>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
          isEnabled
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        } hover:scale-[1.02] ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <VolumeIcon className="w-5 h-5" />
        {showLabel && (
          <span className="text-sm font-medium">
            {isEnabled ? t('sound.on') || 'Sound On' : t('sound.off') || 'Sound Off'}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
      </button>

      {/* Settings Dropdown */}
      {showSettings && (
        <div
          className={`absolute top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Sound Toggle */}
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('sound.settings') || 'Sound Settings'}
                </span>
              </div>
              <button
                onClick={handleToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isEnabled ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')
                  }`}
                  style={{
                    transform: isEnabled
                      ? isRTL ? 'translateX(0)' : 'translateX(0)'
                      : isRTL ? 'translateX(0)' : 'translateX(0)',
                    [isRTL ? 'right' : 'left']: isEnabled ? '2px' : 'auto',
                    [isRTL ? 'left' : 'right']: isEnabled ? 'auto' : '2px',
                  }}
                />
              </button>
            </div>

            {/* Volume Slider */}
            {isEnabled && (
              <div className="space-y-2">
                <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-slate-600 dark:text-slate-400">
                    {t('sound.volume') || 'Volume'}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <input
                  title='Volume Control'
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                />
              </div>
            )}

            {/* Test Sound Button */}
            {isEnabled && (
              <button
                onClick={() => playSound('notification')}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Volume2 className="w-4 h-4" />
                {t('sound.test') || 'Test Sound'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundSettingsButton;
