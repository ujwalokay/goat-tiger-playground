import {
  ADJ,
  applyMove,
  goatMoves,
  legalMoves,
  tigerMoves,
  type GameState,
  type Move,
  type Side,
} from "./engine";

export type Difficulty = "easy" | "medium" | "hard";

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

/** Positive score favours tigers, negative favours goats. */
function evaluate(s: GameState): number {
  if (s.winner === "tiger") return 10000;
  if (s.winner === "goat") return -10000;
  const mobility = tigerMoves(s).length;
  const captures = s.goatsCaptured * 100;
  let trapped = 0;
  for (let i = 0; i < s.board.length; i++) {
    if (s.board[i] !== "tiger") continue;
    const free = ADJ[i]!.some((j) => !s.board[j]);
    if (!free) trapped += 1;
  }
  return captures + mobility * 4 - trapped * 60;
}

function search(s: GameState, depth: number, alpha: number, beta: number): number {
  if (depth === 0 || s.winner) return evaluate(s);
  const moves = legalMoves(s);
  if (moves.length === 0) return evaluate(s);
  const maximizing = s.turn === "tiger";
  let best = maximizing ? -Infinity : Infinity;
  const limited = moves.length > 18 ? moves.slice(0, 18) : moves;
  for (const m of limited) {
    const v = search(applyMove(s, m), depth - 1, alpha, beta);
    if (maximizing) {
      best = Math.max(best, v);
      alpha = Math.max(alpha, v);
    } else {
      best = Math.min(best, v);
      beta = Math.min(beta, v);
    }
    if (beta <= alpha) break;
  }
  return best;
}

function orderedMoves(s: GameState): Move[] {
  const moves = s.turn === "tiger" ? tigerMoves(s) : goatMoves(s);
  return moves.sort((a, b) => {
    const ca = a.kind === "move" && a.capture != null ? 1 : 0;
    const cb = b.kind === "move" && b.capture != null ? 1 : 0;
    return cb - ca;
  });
}

export function chooseMove(s: GameState, side: Side, difficulty: Difficulty): Move | null {
  const moves = orderedMoves(s);
  if (moves.length === 0) return null;

  if (difficulty === "easy") {
    const captures = moves.filter((m) => m.kind === "move" && m.capture != null);
    if (captures.length && Math.random() < 0.6) return pick(captures);
    return pick(moves);
  }

  const depth = difficulty === "medium" ? 2 : 4;
  const maximizing = side === "tiger";
  let best = moves[0]!;
  let bestScore = maximizing ? -Infinity : Infinity;
  const candidates = moves.slice(0, difficulty === "medium" ? 14 : 24);
  for (const m of candidates) {
    const score = search(applyMove(s, m), depth - 1, -Infinity, Infinity);
    const noise = difficulty === "medium" ? Math.random() * 8 : 0;
    const adjusted = maximizing ? score + noise : score - noise;
    if (maximizing ? adjusted > bestScore : adjusted < bestScore) {
      bestScore = adjusted;
      best = m;
    }
  }
  return best;
}