import { ArrowLeft } from "lucide-react";

import { ToyButton } from "@/components/game/ToyButton";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/game/ai";
import type { Side } from "@/game/engine";
import type { MatchConfig } from "@/game/types";

const difficulties: { id: Difficulty; label: string; hint: string }[] = [
  { id: "easy", label: "Easy", hint: "Random & playful" },
  { id: "medium", label: "Medium", hint: "Hunts captures" },
  { id: "hard", label: "Hard", hint: "Deep thinker" },
];

export function ModeScreen({
  match,
  onChange,
  onStart,
  onBack,
}: {
  match: MatchConfig;
  onChange: (m: MatchConfig) => void;
  onStart: () => void;
  onBack: () => void;
}) {
  const setMode = (mode: MatchConfig["mode"]) => onChange({ ...match, mode });
  const setSide = (playerSide: Side) => onChange({ ...match, playerSide });
  const setDiff = (difficulty: Difficulty) => onChange({ ...match, difficulty });

  return (
    <div className="flex flex-col gap-5 px-4 pt-3 pb-6">
      <header className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="toy-press glass-pill grid size-11 place-items-center"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="title-3d text-xl font-black uppercase">Choose a match</h1>
      </header>

      <section className="grid grid-cols-2 gap-3">
        {(["cpu", "local"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "toy-card toy-press p-4 text-left",
              match.mode === m && "ring-2 ring-gold",
            )}
          >
            <div className="text-sm font-black uppercase">
              {m === "cpu" ? "Vs Computer" : "2 Players"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {m === "cpu" ? "Play against the AI" : "Share one device"}
            </p>
          </button>
        ))}
      </section>

      {match.mode === "cpu" && (
        <>
          <section className="animate-pop">
            <h2 className="mb-2 text-xs font-black uppercase text-muted-foreground">Difficulty</h2>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDiff(d.id)}
                  className={cn(
                    "toy-card toy-press px-2 py-3",
                    match.difficulty === d.id && "ring-2 ring-gold",
                  )}
                >
                  <div className="text-sm font-black uppercase">{d.label}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{d.hint}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="animate-pop">
            <h2 className="mb-2 text-xs font-black uppercase text-muted-foreground">Play as</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["goat", "tiger"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={cn(
                    "toy-card toy-press flex items-center gap-2 p-4",
                    match.playerSide === s && "ring-2 ring-gold",
                  )}
                >
                  <span className="text-2xl">{s === "goat" ? "🐐" : "🐯"}</span>
                  <span className="text-sm font-black uppercase">{s}</span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      <ToyButton variant="play" className="h-16 text-xl" onClick={onStart}>
        Start Game
      </ToyButton>
    </div>
  );
}