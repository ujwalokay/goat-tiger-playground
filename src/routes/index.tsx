import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const GoatTigerApp = lazy(() =>
  import("@/components/GoatTigerApp").then((m) => ({ default: m.GoatTigerApp })),
);

const title = "Goat & Tiger — 3D Board Game";
const description =
  "Play Goat & Tiger, the classic Bagh-Chal strategy board game, in polished 3D. Trap the tigers as goats or hunt goats as tigers, versus AI or a friend.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-[100dvh]">
      <h1 className="sr-only">Goat &amp; Tiger 3D board game</h1>
      {mounted ? (
        <Suspense fallback={<Loading />}>
          <GoatTigerApp />
        </Suspense>
      ) : (
        <Loading />
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="grid min-h-[100dvh] place-items-center">
      <div className="title-3d text-3xl font-black uppercase">Goat &amp; Tiger</div>
    </div>
  );
}
