import { Pause, Play, RotateCcw, Home, Crosshair } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Board3D, type BoardColors, type PieceView } from "@/components/game/Board3D";
import { ToyButton } from "@/components/game/ToyButton";
import { chooseMove } from "@/game/ai";
import {
  applyMove,
  createGame,
  destinationsFor,
  goatsOnBoard,
  legalMoves,
  TOTAL_GOATS,
  type GameState,
  type Move,
  type Side,
} from "@/game/engine";
import { playSound } from "@/game/sound";
import type { MatchConfig } from "@/game/types";

export type MatchResult = {
  winner: Side;
  captured: number;
  moves: number;
  playerWon: boolean;
};

const initialPieces = (): PieceView[] => [
  { id: "t0", side: "tiger", node: 0 },
  { id: "t1", side: "tiger", node: 4 },
  { id: "t2", side: "tiger", node: 20 },
  { id: "t3", side: "tiger", node: 24 },
];

export function GameScreen({
  match,
  colors,
  onExit,
  onFinish,
}: {
  match: MatchConfig;
  colors: BoardColors;
  onExit: () => void;
  onFinish: (r: MatchResult) => void;
}) {
  const [game, setGame] = useState<GameState>(createGame);
  const [pieces, setPieces] = useState<PieceView[]>(initialPieces);
  const [selected, setSelected] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [burst, setBurst] = useState<{ node: number; stamp: number } | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const goatId = useRef(0);
  const reported = useRef(false);

  const humanSides: Side[] = useMemo(
    () => (match.mode === "local" ? ["goat", "tiger"] : [match.playerSide]),
    [match],
  );
  const isHumanTurn = humanSides.includes(game.turn);

  const flash = useCallback((text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice((n) => (n === text ? null : n)), 1800);
  }, []);

  const doMove = useCallback(
    (m: Move) => {
      setGame((prev) => {
        const next = applyMove(prev, m);
        setPieces((old) => {
          if (m.kind === "place") {
            goatId.current += 1;
            return [...old, { id: `g${goatId.current}`, side: "goat", node: m.to }];
          }
          return old
            .filter((p) => p.node !== m.capture)
            .map((p) => (p.node === m.from ? { ...p, node: m.to } : p));
        });
        if (m.kind === "move" && m.capture != null) {
          setBurst({ node: m.capture, stamp: performance.now() });
          playSound("capture");
          flash("Tiger captured a goat!");
        } else {
          playSound("move");
        }
        if (next.winner && !reported.current) {
          reported.current = true;
          playSound("victory");
          window.setTimeout(
            () =>
              onFinish({
                winner: next.winner!,
                captured: next.goatsCaptured,
                moves: next.moves,
                playerWon: humanSides.includes(next.winner!) && match.mode === "cpu",
              }),
            700,
          );
        }
        return next;
      });
      setSelected(null);
    },
    [flash, humanSides, match.mode, onFinish],
  );

  // AI turn
  useEffect(() => {
    if (match.mode !== "cpu" || paused || game.winner) return;
    if (humanSides.includes(game.turn)) return;
    setThinking(true);
    const id = window.setTimeout(() => {
      const move = chooseMove(game, game.turn, match.difficulty);
      setThinking(false);
      if (move) doMove(move);
    }, 650);
    return () => {
      window.clearTimeout(id);
      setThinking(false);
    };
  }, [game, match, paused, humanSides, doMove]);

  const highlights = useMemo(() => {
    if (paused || game.winner || !isHumanTurn) return [];
    if (selected != null)
      return destinationsFor(game, selected).map((m) => (m.kind === "move" ? m.to : -1));
    if (game.turn === "goat" && game.phase === "placement")
      return legalMoves(game).map((m) => (m.kind === "place" ? m.to : -1));
    return [];
  }, [game, selected, isHumanTurn, paused]);

  const handleNode = useCallback(
    (i: number) => {
      if (paused || game.winner || !isHumanTurn) return;
      if (game.turn === "goat" && game.phase === "placement") {
        if (!game.board[i]) doMove({ kind: "place", to: i });
        else playSound("invalid");
        return;
      }
      if (game.board[i] === game.turn) {
        playSound("click");
        setSelected((s) => (s === i ? null : i));
        return;
      }
      if (selected != null) {
        const move = destinationsFor(game, selected).find((m) => m.kind === "move" && m.to === i);
        if (move) doMove(move);
        else playSound("invalid");
        return;
      }
      playSound("invalid");
    },
    [game, selected, isHumanTurn, paused, doMove],
  );

  const restart = () => {
    reported.current = false;
    goatId.current = 0;
    setGame(createGame());
    setPieces(initialPieces());
    setSelected(null);
    setPaused(false);
    playSound("click");
  };

  const turnLabel = game.winner
    ? `${game.winner === "goat" ? "Goats" : "Tigers"} win!`
    : `${game.turn === "goat" ? "Goat's" : "Tiger's"} turn`;

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 pt-3">
        <div className="min-w-0">
          <div className="truncate text-[11px] font-black uppercase text-muted-foreground">
            Goat &amp; Tiger
          </div>
          <div className="truncate text-base font-black uppercase">{turnLabel}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Reset camera"
            onClick={() => setResetSignal((n) => n + 1)}
            className="toy-press glass-pill grid size-11 place-items-center"
          >
            <Crosshair className="size-5" />
          </button>
          <button
            aria-label={paused ? "Resume" : "Pause"}
            onClick={() => {
              playSound("click");
              setPaused((p) => !p);
            }}
            className="toy-press glass-pill grid size-11 place-items-center"
          >
            {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
          </button>
        </div>
      </header>

      <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-black">
        <span className="glass-pill px-3 py-1.5">🐐 Goats {goatsOnBoard(game)}</span>
        <span className="glass-pill px-3 py-1.5">
          To place {TOTAL_GOATS - game.goatsPlaced}
        </span>
        <span className="glass-pill px-3 py-1.5">🐯 Captured {game.goatsCaptured}</span>
      </div>

      <Board3D
        pieces={pieces}
        colors={colors}
        highlights={highlights}
        selected={selected}
        onNode={handleNode}
        burst={burst}
        resetSignal={resetSignal}
        className="min-h-0 flex-1 touch-none"
      />

      {notice && (
        <div className="animate-pop pointer-events-none absolute top-28 left-1/2 -translate-x-1/2 rounded-2xl bg-[image:var(--gradient-gold)] px-4 py-2 text-sm font-black text-accent-foreground shadow-[var(--shadow-toy)]">
          {notice}
        </div>
      )}

      {thinking && (
        <div className="glass-pill pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 text-xs font-black">
          <span className="animate-pulse">
            {game.turn === "tiger" ? "Tiger" : "Goat"} is thinking…
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 px-3 pb-4">
        <ToyButton onClick={restart}>
          <RotateCcw className="size-4" /> Restart
        </ToyButton>
        <ToyButton onClick={onExit}>
          <Home className="size-4" /> Home
        </ToyButton>
      </div>

      {paused && !game.winner && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-background/80 backdrop-blur-sm">
          <div className="toy-card animate-pop flex w-72 flex-col gap-3 p-6 text-center">
            <h2 className="title-3d text-2xl font-black uppercase">Paused</h2>
            <ToyButton variant="play" onClick={() => setPaused(false)}>
              Resume
            </ToyButton>
            <ToyButton onClick={restart}>Restart</ToyButton>
            <ToyButton onClick={onExit}>Quit to home</ToyButton>
          </div>
        </div>
      )}
    </div>
  );
}