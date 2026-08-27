// Web Audio API sound effects synthesizer for the Biological Detective Lab

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (!enabled) {
    stopAlarmSound();
  }
}

export function playClueSelectSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // ignore audio failures
  }
}

export function playPlaceSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // ignore audio failures
  }
}

export function playCorrectSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chime
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.12, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.25);
    });
  } catch {
    // ignore
  }
}

export function playWrongSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // ignore
  }
}

export function playScanSound(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.15);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    // ignore
  }
}

// Emergency Biohazard Alarm Sound Synthesizer (Matches the uploaded siren clip)
interface AlarmHandle {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  masterGain: GainNode;
  intervalId?: number;
}

let activeAlarm: AlarmHandle | null = null;

export function startAlarmSound(volume = 0.12): void {
  if (activeAlarm) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Main dual oscillators for realistic emergency siren
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    // Base pitch
    osc1.frequency.setValueAtTime(560, now);
    osc2.frequency.setValueAtTime(565, now);

    // LFO frequency modulator for the two-tone siren sweep (1.1 Hz rhythm)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.9, now); // ~1 second siren cycle
    lfoGain.gain.setValueAtTime(240, now); // modulates between ~320Hz and 800Hz

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    // Lowpass filter for warm, authentic alarm sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(volume, now + 0.1);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);

    activeAlarm = {
      osc1,
      osc2,
      lfo,
      lfoGain,
      masterGain,
    };
  } catch {
    // ignore
  }
}

export function stopAlarmSound(): void {
  if (!activeAlarm) return;
  const ctx = getAudioContext();
  if (ctx && activeAlarm) {
    try {
      const now = ctx.currentTime;
      activeAlarm.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      setTimeout(() => {
        if (activeAlarm) {
          activeAlarm.osc1.stop();
          activeAlarm.osc2.stop();
          activeAlarm.lfo.stop();
          activeAlarm.osc1.disconnect();
          activeAlarm.osc2.disconnect();
          activeAlarm.lfo.disconnect();
          activeAlarm = null;
        }
      }, 120);
    } catch {
      activeAlarm = null;
    }
  } else {
    activeAlarm = null;
  }
}

export function isAlarmPlaying(): boolean {
  return activeAlarm !== null;
}
