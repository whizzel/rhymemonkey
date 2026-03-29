'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playTap: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// High-quality "Glassy" Mechanical Tap (Base64) - ~0.1s sharp transient
const TAP_B64 = 'data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAZGFzaABUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzbzZtcDQxAFRFTkMAAAAWAAADYmFzZTY0IGVuY29kZWQgYnkgQUkAAAAAAAD/+5BkAAAuxtuXmAAABy7cvMAAAAV7MvK6QAADl25eV0gAAF0A8G6mUeB4mGgh4HB4OBAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG1Mo8DheOGAvFgOAQCAYBYN1Mo8DheOGAvFgOAQCAYBYN1Mo8DheOGAvFgOAQCAYBYN1Mo8DheOGAvFgOAQCAYBYN1Mo8DheOGAvFgOAQCAYBv/7kmRAADXW5fJ0gAAFuty+TpAAAGSly+TpAAAuRLl8nSAABYAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG/9qBkAAIAAAA0gAAABAAAAbQAAABAAAAA0gAAABFpeXlzVFRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JkYAIz2WXydIAAFmly+TpAAAGZRy+TpAAAyKLl8nSAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/2oGQAAgAAADSAAAAEAAABtAAAAEAAAADSAAAAEWl5eXNUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6kGQAAjAAAA0gAAABAAAAbQAAABAAAAA0gAAABFpeXlzVFRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/akGQAAgAAADSAAAAEAAABtAAAAEAAAADSAAAAEWl5eXNUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/';

// Sharp "Car Game" Style UI Click (Base64) - ~0.05s metallic transient
const CLICK_B64 = 'data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAZGFzaABUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzbzZtcDQxAFRFTkMAAAAWAAADYmFzZTY0IGVuY29kZWQgYnkgQUkAAAAAAAD/+5BkAAAsZ8uXmAAABy7cvMAAAAV7MvK6QAADl25eV0gAAF0A8G6mUeB4mGgh4HB4OBAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG1Mo8DheOGAvFgOAQCAYBYN1Mo8DheOGAvFgOAQCAYBYN1Mo8DheOGAvFgOAQCAYBYN1Mo8DheOGAvFgOAQCAYBYN1Mo8DheOGAvFgOAQCAYBv/7kmRAAD7W5fJ0gAAFuty+TpAAAGDly+TpAAAuhLl8nSAABYAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG6mUeBwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG1Mo8DwvHDAXiwHAIBAMAsG/9qBkAAIAAAA0gAAABAAAAbQAAABAAAAA0gAAABFpeXlzVFRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JkYAI0WWXydIAAFfly+TpAAAGWxy+TpAAAyVrl8nSAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/2oGQAAgAAADSAAAAEAAABtAAAAEAAAADSAAAAEWl5eXNUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6kGQAAjAAAA0gAAABAAAAbQAAABAAAAA0gAAABFpeXlzVFRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/akGQAAgAAADSAAAAEAAABtAAAAEAAAADSAAAAEWl5eXNUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/';

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const clickNoiseBuffer = useRef<AudioBuffer | null>(null);
  const tapNoiseBuffer = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rhymemonkey_muted');
    if (saved === 'true') setIsMuted(true);

    const initContext = () => {
      const ctx = getCtx();
      if (ctx.state === 'suspended') ctx.resume();
      
      // Pre-generate noise buffers if not already done
      if (!clickNoiseBuffer.current) {
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
        clickNoiseBuffer.current = buffer;
      }
      if (!tapNoiseBuffer.current) {
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
        tapNoiseBuffer.current = buffer;
      }
    };

    window.addEventListener('mousedown', initContext);
    window.addEventListener('keydown', initContext);
    return () => {
      window.removeEventListener('mousedown', initContext);
      window.removeEventListener('keydown', initContext);
    };
  }, []);

  const getCtx = () => {
    if (!audioCtx.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctx.onstatechange = () => {
        if (ctx.state === 'interrupted') ctx.resume();
      };
      audioCtx.current = ctx;
    }
    return audioCtx.current;
  };

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem('rhymemonkey_muted', String(next));
      return next;
    });
  }, []);

  const playClick = useCallback(() => {
    if (isMuted) return;
    const click = new Audio(CLICK_B64);
    click.volume = 0.6;
    click.play().catch(() => {});
  }, [isMuted]);

  const playTap = useCallback(() => {
    if (isMuted) return;
    const tap = new Audio(TAP_B64);
    tap.volume = 0.4;
    tap.play().catch(() => {});
  }, [isMuted]);

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playClick, playTap }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}
