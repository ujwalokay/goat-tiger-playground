import { ArrowLeft, Trophy } from "lucide-react";

import { ACHIEVEMENTS, type Profile } from "@/game/profile";
import { cn } from "@/lib/utils";

export function AchievementsScreen({
  profile,
  onBack,
}: {
  profile: Profile;
  onBack: () => void;
}) {
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
        <h1 className="title-3d text-xl font-black uppercase">Achievements</h1>
      </header>

      <div className="flex flex-col gap-3">
        {ACHIEVEMENTS.map((a) => {
          const progress = Math.min(profile.achievements[a.id] ?? 0, a.goal);
          const unlocked = progress >= a.goal;
          return (
            <div
              key={a.id}
              className={cn("toy-card animate-rise p-4", unlocked && "ring-2 ring-gold")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-2xl",
                    unlocked ? "bg-[image:var(--gradient-gold)]" : "bg-muted",
                  )}
                >
                  <Trophy className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black uppercase">{a.title}</div>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
                <span className="shrink-0 text-xs font-black text-gold">+{a.reward}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[image:var(--gradient-play)] transition-all"
                  style={{ width: `${(progress / a.goal) * 100}%` }}
                />
              </div>
              <div className="mt-1 text-right text-[10px] text-muted-foreground">
                {progress}/{a.goal}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}