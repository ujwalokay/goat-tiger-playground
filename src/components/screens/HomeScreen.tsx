import { Brain, Coins, Plus, Settings, Target, Users, Baby, Volume2, VolumeX } from "lucide-react";

import { Board3D, type PieceView } from "@/components/game/Board3D";
import { ToyButton } from "@/components/game/ToyButton";
import type { BoardColors } from "@/components/game/Board3D";
import type { Profile } from "@/game/profile";

const previewPieces: PieceView[] = [
  { id: "t1", side: "tiger", node: 0 },
  { id: "t2", side: "tiger", node: 4 },
  { id: "t3", side: "tiger", node: 20 },
  { id: "t4", side: "tiger", node: 24 },
  { id: "g1", side: "goat", node: 7 },
  { id: "g2", side: "goat", node: 11 },
  { id: "g3", side: "goat", node: 12 },
  { id: "g4", side: "goat", node: 13 },
  { id: "g5", side: "goat", node: 17 },
];

const cards = [
  { icon: Brain, title: "Boost Mind", text: "Improve decision making abilities" },
  { icon: Target, title: "Focus", text: "Stimulate mental performance" },
  { icon: Users, title: "Social Fun", text: "Improve social & emotional connection" },
  { icon: Baby, title: "For Kids", text: "Ages 6+ years" },
];

export function HomeScreen({
  profile,
  colors,
  onPlay,
  onQuickMode,
  onAddCoins,
  onToggleMute,
}: {
  profile: Profile;
  colors: BoardColors;
  onPlay: () => void;
  onQuickMode: (mode: "cpu" | "local") => void;
  onAddCoins: () => void;
  onToggleMute: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-3 pb-4">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="glass-pill flex min-w-0 items-center gap-2 px-3 py-2">
          <Coins className="size-5 shrink-0 text-gold" />
          <span className="truncate text-base font-black">{profile.coins}</span>
          <button
            onClick={onAddCoins}
            aria-label="Add coins"
            className="toy-press ml-1 grid size-8 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-play)]"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-label="Toggle sound"
            className="toy-press glass-pill grid size-11 place-items-center"
          >
            {profile.muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <button
            aria-label="Settings"
            onClick={onToggleMute}
            className="toy-press glass-pill grid size-11 place-items-center"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </header>

      <h1 className="title-3d text-center text-4xl font-black tracking-tight">
        <span className="rounded-2xl bg-[image:var(--gradient-card)] px-3 py-1">GOAT</span>{" "}
        <span className="text-muted-foreground">&</span>{" "}
        <span className="rounded-2xl bg-[image:var(--gradient-gold)] px-3 py-1 text-accent-foreground">
          TIGER
        </span>
      </h1>

      <Board3D
        pieces={previewPieces}
        colors={colors}
        autoRotate
        className="h-[42vh] min-h-64 w-full overflow-hidden rounded-3xl shadow-[var(--shadow-soft)]"
      />

      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.title} className="toy-card animate-rise p-3">
            <div className="flex items-center gap-2">
              <c.icon className="size-4 shrink-0 text-gold" />
              <span className="truncate text-xs font-black uppercase">{c.title}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>

      <ToyButton variant="play" className="h-16 text-2xl" onClick={onPlay}>
        Play
      </ToyButton>

      <div className="grid grid-cols-2 gap-3">
        <ToyButton onClick={() => onQuickMode("cpu")}>Vs Computer</ToyButton>
        <ToyButton onClick={() => onQuickMode("local")}>2 Players</ToyButton>
      </div>
    </div>
  );
}