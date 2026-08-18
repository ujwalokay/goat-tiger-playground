import { ArrowLeft, ArrowRight, Hand, Play, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Board3D, type BoardColors, type PieceView } from "@/components/game/Board3D";
import { ToyButton } from "@/components/game/ToyButton";
import { playSound } from "@/game/sound";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  title: string;
  text: string;
  emoji: string;
  pieces: PieceView[];
  highlights?: number[];
  /** Node the learner must tap to continue. */
  tapNode?: number;
  tapHint?: string;
  /** Board state shown after a correct tap (or after the auto delay). */
  after?: { pieces: PieceView[]; sound?: "move" | "capture"; burst?: number };
  spin?: boolean;
};

const T = (id: string, node: number): PieceView => ({ id, side: "tiger", node });
const G = (id: string, node: number): PieceView => ({ id, side: "goat", node });

const corners = [T("t1", 0), T("t2", 4), T("t3", 20), T("t4", 24)];

const STEPS: Step[] = [
  {
    id: "board",
    emoji: "🎲",
    title: "The board",
    text: "25 dots joined by lines. Pieces travel only along a line to the next dot.",
    pieces: corners,
    spin: true,
  },
  {
    id: "tigers",
    emoji: "🐯",
    title: "Four tigers",
    text: "Tigers begin on the four corners. They hunt goats.",
    pieces: corners,
    highlights: [0, 4, 20, 24],
  },
  {
    id: "place",
    emoji: "🐐",
    title: "Place a goat",
    text: "Goats are dropped one at a time on any empty dot — 20 of them in total.",
    pieces: corners,
    highlights: [12],
    tapNode: 12,
    tapHint: "Tap the glowing centre dot",
    after: { pieces: [...corners, G("g1", 12)], sound: "move" },
  },
  {
    id: "tigermove",
    emoji: "➡️",
    title: "Tigers move",
    text: "After every goat placement a tiger slides one step along a line.",
    pieces: [...corners, G("g1", 12)],
    highlights: [1],
    tapNode: 1,
    tapHint: "Tap the dot to slide the tiger",
    after: {
      pieces: [T("t1", 1), T("t2", 4), T("t3", 20), T("t4", 24), G("g1", 12)],
      sound: "move",
    },
  },
  {
    id: "jump",
    emoji: "🍽️",
    title: "Tigers jump to eat",
    text: "A tiger leaps straight over one goat into the empty dot right behind it.",
    pieces: [T("t1", 1), T("t2", 4), T("t3", 20), T("t4", 24), G("g1", 6), G("g2", 12)],
    highlights: [11],
    tapNode: 11,
    tapHint: "Tap the empty dot behind the goat",
    after: {
      pieces: [T("t1", 11), T("t2", 4), T("t3", 20), T("t4", 24), G("g2", 12)],
      sound: "capture",
      burst: 6,
    },
  },
  {
    id: "trap",
    emoji: "🚧",
    title: "Goats build walls",
    text: "Crowd the tiger so every line out of its dot is blocked. This tiger cannot move.",
    pieces: [T("t1", 0), T("t2", 4), T("t3", 20), T("t4", 24), G("g1", 1), G("g2", 5), G("g3", 6)],
    highlights: [0],
    spin: true,
  },
  {
    id: "win",
    emoji: "🏆",
    title: "How you win",
    text: "Tigers win after eating 5 goats. Goats win the moment all four tigers are stuck.",
    pieces: [
      T("t1", 0),
      T("t2", 4),
      T("t3", 20),
      T("t4", 24),
      G("g1", 1),
      G("g2", 5),
      G("g3", 6),
      G("g4", 3),
      G("g5", 9),
      G("g6", 8),
      G("g7", 15),
      G("g8", 16),
      G("g9", 21),
      G("g10", 18),
      G("g11", 19),
      G("g12", 23),
    ],
    spin: true,
  },
];

export function TutorialScreen({
  colors,
  onFinish,
  onSkip,
}: {
  colors: BoardColors;
  onFinish: () => void;
  onSkip: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState<{ node: number; stamp: number } | null>(null);
  const [wrong, setWrong] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = STEPS[index]!;
  const last = index === STEPS.length - 1;

  useEffect(() => {
    setDone(false);
    setBurst(null);
    if (timer.current) clearTimeout(timer.current);
    if (!step.tapNode && step.after) {
      timer.current = setTimeout(() => {
        setDone(true);
        if (step.after?.sound) playSound(step.after.sound);
      }, 1100);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, step]);

  const pieces = done && step.after ? step.after.pieces : step.pieces;
  const highlights = useMemo(() => (done ? [] : (step.highlights ?? [])), [done, step]);

  const handleNode = (node: number) => {
    if (done || step.tapNode === undefined) return;
    if (node !== step.tapNode) {
      playSound("invalid");
      setWrong((w) => w + 1);
      return;
    }
    setDone(true);
    if (step.after?.sound) playSound(step.after.sound);
    if (step.after?.burst !== undefined) setBurst({ node: step.after.burst, stamp: Date.now() });
  };

  const next = () => {
    playSound("click");
    if (last) return onFinish();
    setIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const back = () => {
    playSound("click");
    setIndex((i) => Math.max(0, i - 1));
  };

  const waiting = step.tapNode !== undefined && !done;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <button
          onClick={back}
          disabled={index === 0}
          aria-label="Previous step"
          className="toy-press glass-pill grid size-11 place-items-center disabled:opacity-40"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 text-center">
          <div className="text-[10px] font-black tracking-widest text-gold uppercase">
            Guided 3D tour
          </div>
          <div className="truncate text-sm font-black uppercase">
            Step {index + 1} of {STEPS.length}
          </div>
        </div>
        <button
          onClick={() => {
            playSound("click");
            onSkip();
          }}
          className="toy-press glass-pill px-3 py-2 text-[11px] font-black uppercase"
        >
          Skip
        </button>
      </header>

      <div className="flex gap-1.5 px-4">
        {STEPS.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= index ? "bg-[image:var(--gradient-gold)]" : "bg-border/70",
            )}
          />
        ))}
      </div>

      <div className="relative flex-1">
        <Board3D
          pieces={pieces}
          colors={colors}
          highlights={highlights}
          burst={burst}
          resetSignal={resetSignal}
          onNode={handleNode}
          className="h-full w-full"
          {...(step.spin ? { autoRotate: true } : {})}
        />
        <button
          onClick={() => setResetSignal((s) => s + 1)}
          aria-label="Reset camera"
          className="toy-press glass-pill absolute top-3 right-3 grid size-10 place-items-center"
        >
          <RotateCcw className="size-4" />
        </button>
        {waiting && (
          <div
            key={wrong}
            className="glass-pill animate-pop pointer-events-none absolute inset-x-0 bottom-3 mx-auto flex w-fit items-center gap-2 px-4 py-2 text-[11px] font-black uppercase"
          >
            <Hand className="size-4 text-gold" />
            {step.tapHint}
          </div>
        )}
      </div>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div key={step.id} className="toy-card animate-rise flex gap-3 p-4">
          <span className="text-2xl">{step.emoji}</span>
          <div className="min-w-0">
            <div className="text-sm font-black uppercase">{step.title}</div>
            <p className="mt-1 text-xs text-muted-foreground">{step.text}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <ToyButton variant={last ? "play" : "gold"} onClick={next} disabled={waiting}>
            {last ? (
              <>
                <Play className="size-4" /> Start playing
              </>
            ) : (
              <>
                Next <ArrowRight className="size-4" />
              </>
            )}
          </ToyButton>
          <ToyButton variant="ghost" onClick={() => setIndex(0)} aria-label="Restart tour">
            <Sparkles className="size-4" />
          </ToyButton>
        </div>
      </div>
    </div>
  );
}
