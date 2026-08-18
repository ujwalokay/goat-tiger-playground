import { useCallback, useEffect, useState } from "react";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  goal: number;
  reward: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_game", title: "First Game", description: "Win your first game", goal: 1, reward: 100 },
  { id: "tiger_hunter", title: "Tiger Hunter", description: "Capture 5 goats in total", goal: 5, reward: 150 },
  { id: "strategist", title: "Strategist", description: "Win 3 games", goal: 3, reward: 250 },
  { id: "master", title: "Master Player", description: "Win 10 games", goal: 10, reward: 600 },
  { id: "perfect_defense", title: "Perfect Defense", description: "Win as goats losing 1 goat or fewer", goal: 1, reward: 400 },
];

export type ShopItem = {
  id: string;
  name: string;
  category: "board" | "goat" | "tiger" | "table" | "effect";
  price: number;
  color: string;
  accent?: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: "board-classic", name: "Classic Felt", category: "board", price: 0, color: "#1f7a45" },
  { id: "board-royal", name: "Royal Velvet", category: "board", price: 400, color: "#3b2a7a" },
  { id: "board-sand", name: "Desert Sand", category: "board", price: 600, color: "#b9873f" },
  { id: "goat-classic", name: "Classic Goat", category: "goat", price: 0, color: "#f4efe4" },
  { id: "goat-golden", name: "Golden Goat", category: "goat", price: 500, color: "#f0c352" },
  { id: "goat-frost", name: "Frost Goat", category: "goat", price: 700, color: "#bfe3ff" },
  { id: "tiger-classic", name: "Classic Tiger", category: "tiger", price: 0, color: "#c1622a" },
  { id: "tiger-jungle", name: "Jungle Tiger", category: "tiger", price: 750, color: "#4f7c33" },
  { id: "tiger-neon", name: "Neon Tiger", category: "tiger", price: 1000, color: "#e0347c" },
  { id: "table-oak", name: "Oak Table", category: "table", price: 0, color: "#6b3f22" },
  { id: "table-walnut", name: "Walnut Table", category: "table", price: 350, color: "#3c2415" },
  { id: "effect-none", name: "No Effect", category: "effect", price: 0, color: "#8892a6" },
  { id: "effect-glow", name: "Magic Glow", category: "effect", price: 450, color: "#7de2ff" },
];

export type Profile = {
  coins: number;
  wins: number;
  gamesPlayed: number;
  totalCaptures: number;
  achievements: Record<string, number>;
  unlocked: string[];
  equipped: Record<ShopItem["category"], string>;
  muted: boolean;
  lastPlayDay: string | null;
};

const KEY = "goat-tiger-profile-v1";

export const defaultProfile = (): Profile => ({
  coins: 250,
  wins: 0,
  gamesPlayed: 0,
  totalCaptures: 0,
  achievements: {},
  unlocked: SHOP_ITEMS.filter((i) => i.price === 0).map((i) => i.id),
  equipped: {
    board: "board-classic",
    goat: "goat-classic",
    tiger: "tiger-classic",
    table: "table-oak",
    effect: "effect-none",
  },
  muted: false,
  lastPlayDay: null,
});

export function loadProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultProfile();
    return { ...defaultProfile(), ...(JSON.parse(raw) as Partial<Profile>) };
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function itemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProfile(profile);
  }, [profile, hydrated]);

  const update = useCallback((fn: (p: Profile) => Profile) => setProfile((p) => fn(p)), []);

  return { profile, update, hydrated };
}

export function equippedColor(p: Profile, category: ShopItem["category"], fallback: string) {
  return itemById(p.equipped[category])?.color ?? fallback;
}