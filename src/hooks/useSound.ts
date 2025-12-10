const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

type SoundType = 'pickup' | 'drop' | 'success' | 'remove';

const soundConfigs: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; volume: number }> = {
  pickup: { frequency: 600, duration: 0.1, type: 'sine', volume: 0.15 },
  drop: { frequency: 400, duration: 0.15, type: 'sine', volume: 0.2 },
  success: { frequency: 800, duration: 0.2, type: 'sine', volume: 0.15 },
  remove: { frequency: 300, duration: 0.1, type: 'triangle', volume: 0.1 },
};

export function playSound(type: SoundType) {
  if (!audioContext) return;

  // Resume audio context if suspended (required for user gesture on mobile)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const config = soundConfigs[type];
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);

  // Add a pleasant pitch bend for more character
  if (type === 'success') {
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
  } else if (type === 'drop') {
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
  }

  // Fade in/out for smoother sound
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(config.volume, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + config.duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + config.duration);
}

export function useSound() {
  return { playSound };
}
