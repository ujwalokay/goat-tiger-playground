import { ArrowLeft, Check, Coins, Lock } from "lucide-react";

import { SHOP_ITEMS, type Profile, type ShopItem } from "@/game/profile";
import { cn } from "@/lib/utils";

const groups: { key: ShopItem["category"]; label: string }[] = [
  { key: "goat", label: "Goat skins" },
  { key: "tiger", label: "Tiger skins" },
  { key: "board", label: "Board themes" },
  { key: "table", label: "Table themes" },
  { key: "effect", label: "Piece effects" },
];

export function ShopScreen({
  profile,
  onBuy,
  onEquip,
  onBack,
}: {
  profile: Profile;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-3 pb-6">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="toy-press glass-pill grid size-11 place-items-center"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="title-3d truncate text-xl font-black uppercase">Shop</h1>
        <div className="glass-pill flex items-center gap-2 px-3 py-2">
          <Coins className="size-4 text-gold" />
          <span className="text-sm font-black">{profile.coins}</span>
        </div>
      </header>

      {groups.map((g) => (
        <section key={g.key}>
          <h2 className="mb-2 text-xs font-black uppercase text-muted-foreground">{g.label}</h2>
          <div className="grid grid-cols-2 gap-3">
            {SHOP_ITEMS.filter((i) => i.category === g.key).map((item) => {
              const owned = profile.unlocked.includes(item.id);
              const equipped = profile.equipped[item.category] === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => (owned ? onEquip(item) : onBuy(item))}
                  disabled={!owned && profile.coins < item.price}
                  className={cn(
                    "toy-card toy-press flex flex-col gap-2 p-3 text-left disabled:opacity-50",
                    equipped && "ring-2 ring-gold",
                  )}
                >
                  <span
                    className="h-12 w-full rounded-xl"
                    style={{ backgroundColor: item.color }}
                    aria-hidden
                  />
                  <span className="truncate text-xs font-black uppercase">{item.name}</span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    {equipped ? (
                      <>
                        <Check className="size-3" /> Equipped
                      </>
                    ) : owned ? (
                      "Tap to equip"
                    ) : (
                      <>
                        <Lock className="size-3" /> {item.price} coins
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}