import type { Difficulty } from "./ai";
import type { Side } from "./engine";

export type Screen =
  | "HOME"
  | "MODE_SELECT"
  | "GAME"
  | "RULES"
  | "SHOP"
  | "ACHIEVEMENTS";

export type MatchConfig = {
  mode: "cpu" | "local";
  difficulty: Difficulty;
  playerSide: Side;
};

export const defaultMatch: MatchConfig = {
  mode: "cpu",
  difficulty: "medium",
  playerSide: "goat",
};