type SoundName =
  | "click"
  | "move"
  | "capture"
  | "invalid"
  | "victory"
  | "achievement"
  | "coin";

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(v: boolean) {
  muted = v;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, gain = 0.12, type: OscillatorType = "sine") {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  g.gain.setValueAtTime(0.0001, ac.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

export function playSound(name: SoundName) {
  if (muted) return;
  switch (name) {
    case "click":
      tone(520, 0, 0.08, 0.08, "triangle");
      break;
    case "move":
      tone(320, 0, 0.1, 0.09, "sine");
      tone(480, 0.05, 0.1, 0.05, "sine");
      break;
    case "capture":
      tone(180, 0, 0.18, 0.14, "sawtooth");
      tone(90, 0.07, 0.22, 0.1, "square");
      break;
    case "invalid":
      tone(140, 0, 0.14, 0.1, "square");
      break;
    case "victory":
      [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.12, 0.25, 0.12, "triangle"));
      break;
    case "achievement":
      [660, 880, 1320].forEach((f, i) => tone(f, i * 0.09, 0.2, 0.1, "sine"));
      break;
    case "coin":
      tone(980, 0, 0.08, 0.08, "square");
      tone(1320, 0.06, 0.12, 0.06, "square");
      break;
  }
}