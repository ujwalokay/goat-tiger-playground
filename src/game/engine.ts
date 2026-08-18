export type Side = "goat" | "tiger";
export type Cell = Side | null;
export type Phase = "placement" | "movement";

export const SIZE = 5;
export const NODES = SIZE * SIZE;
export const TOTAL_GOATS = 20;
export const CAPTURES_TO_WIN = 5;

export const rowOf = (i: number) => Math.floor(i / SIZE);
export const colOf = (i: number) => i % SIZE;

/** World position of a node, board is centered on origin. */
export function nodePos(i: number, unit = 1): [number, number] {
  return [(colOf(i) - 2) * unit, (rowOf(i) - 2) * unit];
}

function buildAdjacency(): number[][] {
  const adj: number[][] = Array.from({ length: NODES }, () => []);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const i = r * SIZE + c;
      const dirs: [number, number][] = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
      if ((r + c) % 2 === 0) {
        dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
      }
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= SIZE || nc >= SIZE) continue;
        adj[i]!.push(nr * SIZE + nc);
      }
    }
  }
  return adj;
}

export const ADJ = buildAdjacency();

export type Jump = { over: number; to: number };

function buildJumps(): Jump[][] {
  const jumps: Jump[][] = Array.from({ length: NODES }, () => []);
  for (let i = 0; i < NODES; i++) {
    for (const mid of ADJ[i]!) {
      const dr = rowOf(mid) - rowOf(i);
      const dc = colOf(mid) - colOf(i);
      const tr = rowOf(mid) + dr;
      const tc = colOf(mid) + dc;
      if (tr < 0 || tc < 0 || tr >= SIZE || tc >= SIZE) continue;
      const to = tr * SIZE + tc;
      if (!ADJ[mid]!.includes(to)) continue;
      jumps[i]!.push({ over: mid, to });
    }
  }
  return jumps;
}

export const JUMPS = buildJumps();

/** Unique undirected edges for drawing the board lines. */
export const EDGES: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; i < NODES; i++) {
    for (const j of ADJ[i]!) if (j > i) out.push([i, j]);
  }
  return out;
})();

export type GameState = {
  board: Cell[];
  turn: Side;
  phase: Phase;
  goatsPlaced: number;
  goatsCaptured: number;
  moves: number;
  winner: Side | null;
};

export function createGame(): GameState {
  const board: Cell[] = Array(NODES).fill(null);
  // Tigers start on the four corners.
  [0, 4, 20, 24].forEach((i) => (board[i] = "tiger"));
  return {
    board,
    turn: "goat",
    phase: "placement",
    goatsPlaced: 0,
    goatsCaptured: 0,
    moves: 0,
    winner: null,
  };
}

export type Move =
  | { kind: "place"; to: number }
  | { kind: "move"; from: number; to: number; capture?: number };

export function tigerMoves(s: GameState): Move[] {
  const out: Move[] = [];
  for (let i = 0; i < NODES; i++) {
    if (s.board[i] !== "tiger") continue;
    for (const j of ADJ[i]!) if (!s.board[j]) out.push({ kind: "move", from: i, to: j });
    for (const { over, to } of JUMPS[i]!) {
      if (s.board[over] === "goat" && !s.board[to])
        out.push({ kind: "move", from: i, to, capture: over });
    }
  }
  return out;
}

export function goatMoves(s: GameState): Move[] {
  const out: Move[] = [];
  if (s.phase === "placement") {
    for (let i = 0; i < NODES; i++) if (!s.board[i]) out.push({ kind: "place", to: i });
    return out;
  }
  for (let i = 0; i < NODES; i++) {
    if (s.board[i] !== "goat") continue;
    for (const j of ADJ[i]!) if (!s.board[j]) out.push({ kind: "move", from: i, to: j });
  }
  return out;
}

export function legalMoves(s: GameState): Move[] {
  if (s.winner) return [];
  return s.turn === "tiger" ? tigerMoves(s) : goatMoves(s);
}

/** Destinations available for a given origin node (or -1 for placement). */
export function destinationsFor(s: GameState, from: number): Move[] {
  return legalMoves(s).filter((m) => (m.kind === "move" ? m.from === from : false));
}

export function applyMove(s: GameState, m: Move): GameState {
  const board = s.board.slice();
  let goatsPlaced = s.goatsPlaced;
  let goatsCaptured = s.goatsCaptured;

  if (m.kind === "place") {
    board[m.to] = "goat";
    goatsPlaced += 1;
  } else {
    board[m.to] = board[m.from]!;
    board[m.from] = null;
    if (m.capture != null) {
      board[m.capture] = null;
      goatsCaptured += 1;
    }
  }

  const phase: Phase = goatsPlaced >= TOTAL_GOATS ? "movement" : "placement";
  const next: GameState = {
    board,
    turn: s.turn === "goat" ? "tiger" : "goat",
    phase,
    goatsPlaced,
    goatsCaptured,
    moves: s.moves + 1,
    winner: null,
  };
  next.winner = computeWinner(next);
  return next;
}

export function computeWinner(s: GameState): Side | null {
  if (s.goatsCaptured >= CAPTURES_TO_WIN) return "tiger";
  if (tigerMoves(s).length === 0) return "goat";
  if (s.turn === "goat" && s.phase === "movement" && goatMoves(s).length === 0) return "tiger";
  return null;
}

export const goatsOnBoard = (s: GameState) => s.board.filter((c) => c === "goat").length;