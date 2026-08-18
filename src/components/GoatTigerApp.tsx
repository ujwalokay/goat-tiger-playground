import { Home as HomeIcon, BookOpen, ShoppingCart, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { BoardColors } from "@/components/game/Board3D";
import { ToyButton } from "@/components/game/ToyButton";
import { AchievementsScreen } from "@/components/screens/AchievementsScreen";
import { GameScreen, type MatchResult } from "@/components/screens/GameScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { ModeScreen } from "@/components/screens/ModeScreen";
import { RulesScreen } from "@/components/screens/RulesScreen";
import { ShopScreen } from "@/components/screens/ShopScreen";
import {
  ACHIEVEMENTS,
  equippedColor,
  useProfile,
  type Profile,
  type ShopItem,
} from "@/game/profile";
import { playSound, setMuted } from "@/game/sound";
import { defaultMatch, type MatchConfig, type Screen } from "@/game/types";
import { cn } from "@/lib/utils";

const tabs: { id: Screen; label: string; icon: typeof HomeIcon }[] = [
  { id: "HOME", label: "Home", icon: HomeIcon },
  { id: "RULES", label: "Rules", icon: BookOpen },
  { id: "SHOP", label: "Shop", icon: ShoppingCart },
  { id: "ACHIEVEMENTS", label: "Awards", icon: Trophy },
];

function grantAchievements(p: Profile, r: MatchResult, playerIsGoat: boolean): [Profile, string[]] {
  const a = { ...p.achievements };
  const unlockedNow: string[] = [];
  const bump = (id: string, value: number) => {
    const goal = ACHIEVEMENTS.find((x) => x.id === id)!.goal;
    const before = a[id] ?? 0;
    if (before >= goal) return;
    a[id] = Math.min(goal, value);
    if (a[id]! >= goal) unlockedNow.push(id);
  };
  const wins = p.wins + (r.playerWon ? 1 : 0);
  bump("first_game", wins);
  bump("strategist", wins);
  bump("master", wins);
  bump("tiger_hunter", p.totalCaptures + r.captured);
  if (r.playerWon && playerIsGoat && r.captured <= 1) bump("perfect_defense", 1);

  const reward = unlockedNow.reduce(
    (sum, id) => sum + (ACHIEVEMENTS.find((x) => x.id === id)?.reward ?? 0),
    0,
  );
  return [{ ...p, achievements: a, coins: p.coins + reward }, unlockedNow];
}

export function GoatTigerApp() {
  const { profile, update } = useProfile();
  const [screen, setScreen] = useState<Screen>("HOME");
  const [match, setMatch] = useState<MatchConfig>(defaultMatch);
  const [result, setResult] = useState<(MatchResult & { coins: number; unlocked: string[] }) | null>(
    null,
  );

  useEffect(() => setMuted(profile.muted), [profile.muted]);

  const colors: BoardColors = useMemo(
    () => ({
      felt: equippedColor(profile, "board", "#1f7a45"),
      table: equippedColor(profile, "table", "#6b3f22"),
      goat: equippedColor(profile, "goat", "#f4efe4"),
      tiger: equippedColor(profile, "tiger", "#c1622a"),
      glow: profile.equipped.effect === "effect-glow",
    }),
    [profile],
  );

  const go = useCallback((s: Screen) => {
    playSound("click");
    setScreen(s);
  }, []);

  const handleFinish = useCallback(
    (r: MatchResult) => {
      const coins = (r.playerWon ? 120 : 40) + r.captured * 8;
      let unlocked: string[] = [];
      update((p) => {
        const [withAch, newly] = grantAchievements(p, r, match.playerSide === "goat");
        unlocked = newly;
        return {
          ...withAch,
          coins: withAch.coins + coins,
          wins: p.wins + (r.playerWon ? 1 : 0),
          gamesPlayed: p.gamesPlayed + 1,
          totalCaptures: p.totalCaptures + r.captured,
          lastPlayDay: new Date().toDateString(),
        };
      });
      if (unlocked.length) playSound("achievement");
      playSound("coin");
      setResult({ ...r, coins, unlocked });
    },
    [update, match.playerSide],
  );

  const buy = (item: ShopItem) => {
    update((p) => {
      if (p.unlocked.includes(item.id) || p.coins < item.price) return p;
      return {
        ...p,
        coins: p.coins - item.price,
        unlocked: [...p.unlocked, item.id],
        equipped: { ...p.equipped, [item.category]: item.id },
      };
    });
    playSound("coin");
  };

  const equip = (item: ShopItem) => {
    playSound("click");
    update((p) => ({ ...p, equipped: { ...p.equipped, [item.category]: item.id } }));
  };

  const startMatch = () => {
    playSound("click");
    setResult(null);
    setScreen("GAME");
  };

  if (screen === "GAME") {
    return (
      <>
        <GameScreen
          key={result ? "post" : "live"}
          match={match}
          colors={colors}
          onExit={() => go("HOME")}
          onFinish={handleFinish}
        />
        {result && (
          <div className="fixed inset-0 z-30 grid place-items-center bg-background/85 p-4 backdrop-blur-sm">
            <div className="toy-card animate-pop w-full max-w-sm p-6 text-center">
              <div className="text-5xl">{result.winner === "goat" ? "🐐" : "🐯"}</div>
              <h2 className="title-3d mt-2 text-3xl font-black uppercase">
                {result.winner === "goat" ? "Goats win!" : "Tigers win!"}
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-black">
                <div className="glass-pill py-2">Captured {result.captured}</div>
                <div className="glass-pill py-2">Moves {result.moves}</div>
                <div className="glass-pill py-2 text-gold">+{result.coins} coins</div>
              </div>
              {result.unlocked.length > 0 && (
                <p className="mt-3 text-xs text-gold">
                  Achievement unlocked:{" "}
                  {result.unlocked
                    .map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.title)
                    .join(", ")}
                </p>
              )}
              <div className="mt-5 grid gap-3">
                <ToyButton variant="play" onClick={startMatch}>
                  Play again
                </ToyButton>
                <ToyButton
                  onClick={() => {
                    setResult(null);
                    go("HOME");
                  }}
                >
                  Home
                </ToyButton>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col pb-20">
      <main className="flex-1">
        {screen === "HOME" && (
          <HomeScreen
            profile={profile}
            colors={colors}
            onPlay={() => go("MODE_SELECT")}
            onQuickMode={(mode) => {
              setMatch((m) => ({ ...m, mode }));
              go("MODE_SELECT");
            }}
            onAddCoins={() => {
              playSound("coin");
              update((p) => ({ ...p, coins: p.coins + 50 }));
            }}
            onToggleMute={() => {
              update((p) => ({ ...p, muted: !p.muted }));
              playSound("click");
            }}
          />
        )}
        {screen === "MODE_SELECT" && (
          <ModeScreen
            match={match}
            onChange={setMatch}
            onStart={startMatch}
            onBack={() => go("HOME")}
          />
        )}
        {screen === "RULES" && <RulesScreen colors={colors} onBack={() => go("HOME")} />}
        {screen === "SHOP" && (
          <ShopScreen profile={profile} onBuy={buy} onEquip={equip} onBack={() => go("HOME")} />
        )}
        {screen === "ACHIEVEMENTS" && (
          <AchievementsScreen profile={profile} onBack={() => go("HOME")} />
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-lg items-stretch justify-around border-t border-border/60 bg-[image:var(--gradient-card)] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            className={cn(
              "toy-press flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase",
              screen === t.id ? "text-gold" : "text-muted-foreground",
            )}
          >
            <t.icon className="size-5" />
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}