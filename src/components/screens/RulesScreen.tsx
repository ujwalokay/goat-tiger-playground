import { ArrowLeft } from "lucide-react";

import { Board3D, type BoardColors, type PieceView } from "@/components/game/Board3D";

const demo: PieceView[] = [
  { id: "t1", side: "tiger", node: 6 },
  { id: "t2", side: "tiger", node: 24 },
  { id: "g1", side: "goat", node: 12 },
  { id: "g2", side: "goat", node: 7 },
  { id: "g3", side: "goat", node: 11 },
];

const rules = [
  { emoji: "🐯", title: "Tigers start on the board", text: "Four tigers sit on the four corners." },
  { emoji: "🐐", title: "Goats are placed", text: "Place your 20 goats one by one on empty dots." },
  { emoji: "🚧", title: "Goats block", text: "Goats win by trapping every tiger so none can move." },
  { emoji: "🍽️", title: "Tigers jump", text: "A tiger jumps straight over a goat into an empty dot behind it." },
  { emoji: "🏆", title: "Winning", text: "Tigers win after eating 5 goats. Goats win when all tigers are stuck." },
];

export function RulesScreen({ colors, onBack }: { colors: BoardColors; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-3 pb-6">
      <header className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="toy-press glass-pill grid size-11 place-items-center"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="title-3d text-xl font-black uppercase">How to play</h1>
      </header>

      <Board3D
        pieces={demo}
        colors={colors}
        highlights={[18]}
        autoRotate
        className="h-56 w-full overflow-hidden rounded-3xl"
      />

      <div className="flex flex-col gap-3">
        {rules.map((r) => (
          <div key={r.title} className="toy-card animate-rise flex gap-3 p-4">
            <span className="text-2xl">{r.emoji}</span>
            <div className="min-w-0">
              <div className="text-sm font-black uppercase">{r.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}