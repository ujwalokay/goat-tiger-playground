# Goat & Tiger Playground

Create a polished mobile-first 3D web game called “Goat & Tiger” based on the uploaded reference images.

The game should be a modern digital version of the traditional Goat & Tiger strategy/board game. It must be actually playable, not just a visual mockup.

1. Technology

Build the game using:

React + TypeScript

Three.js / React Three Fiber for the 3D board and pieces

Tailwind CSS for the UI

Responsive mobile-first design

Smooth animations and touch interactions

LocalStorage for saving game progress/settings

Component-based architecture

No unnecessary heavy dependencies

The game should work beautifully on mobile browsers and desktop browsers.

2. Visual Style

Use the uploaded Goat & Tiger images as the visual reference.

Create an original polished 3D toy-board-game aesthetic:

Green felt game board

Wooden table/background

Slightly rounded wooden board edges

Glossy 3D goat pieces

Orange/brown 3D tiger pieces

Soft shadows

Ambient lighting

Slight depth-of-field effect

Colorful decorative animal patterns around the board

Bright, friendly children's-game appearance

Premium mobile-game UI

Large rounded buttons

Subtle glass/3D effects

Smooth hover/tap animations

Do NOT simply copy the reference image as a flat image. Recreate the board, pieces, lighting and interface as interactive 3D elements.

3. Main Menu

Create a mobile game home screen.

Top:

Back/menu button

Coin counter

Add coins button

Settings button

Center:

Large title:

“GOAT & TIGER”

Below it show a beautiful animated 3D preview of the board with goats and tigers.

Add four information cards:

“BOOST MIND”
Improve decision making abilities

“FOCUS”
Stimulate mental performance

“SOCIAL FUN”
Improve social & emotional connection

“FOR KIDS”
Ages 6+ years

Main green button:

“PLAY”

Below:

“VS COMPUTER”
“2 PLAYERS”

Bottom navigation:

HOME
RULES
SHOP
ACHIEVEMENTS

4. Game Modes

When the user presses PLAY, show:

VS COMPUTER

Difficulty:

Easy

Medium

Hard

Allow the player to choose:

Play as Goat

Play as Tiger

2 PLAYERS

Allow two people to play on the same device.

Add a clear “START GAME” button.

5. Actual Goat & Tiger Gameplay

Implement the real game mechanics.

Use the traditional Goat & Tiger board structure shown in the reference.

The board should contain interactive nodes connected by lines.

There are:

4 Tigers

20 Goats

Tigers move between connected nodes.

Goats are placed onto available nodes.

Tigers can capture goats by jumping over an adjacent goat to an empty connected node.

Implement:

Valid move detection

Invalid move prevention

Goat placement

Tiger movement

Tiger captures

Turn switching

Win conditions

Capture counter

Remaining goat counter

Restart game

Pause game

The user must be able to tap/click a piece and then tap a valid destination.

Highlight valid destinations with glowing circles.

Highlight the currently selected piece.

Animate pieces smoothly from one node to another.

When a tiger captures a goat, animate the capture with a small bounce/particle effect.

6. 3D Board

Build the board in Three.js.

The board should be a real 3D object.

Create:

Wooden base

Green playing surface

Gold/yellow board lines

Circular board nodes

Raised edges

Soft shadows

Use an isometric/slightly top-down camera.

Allow:

Small camera rotation

Pinch zoom on mobile

Mouse drag on desktop

Reset camera button

Keep the camera controlled enough that the board never becomes difficult to play.

7. 3D Pieces

Create custom 3D-style pieces.

Goat:

Cute white/cream goat

Small horns

Friendly face

Rounded toy-like body

Tiger:

Orange/brown tiger

Dark stripes

Cute stylized face

Rounded toy-like body

The pieces should look like physical toy pieces sitting on the board.

Add subtle idle animations:

Very small floating/bobbing movement

Highlight/shine

Selected piece glow

Do not use flat 2D images for the actual pieces if a simple Three.js geometry/model can create the effect.

8. Game HUD

During gameplay display:

Top-left:

GOAT & TIGER

Top-center:

Current player's turn

Example:

“GOAT'S TURN”

Top-right:

Pause button

Side/bottom information:

🐐 Goats: 16
🐯 Captured: 4

On mobile, keep the HUD compact and never cover the board.

Add a move notification:

“Tiger captured a goat!”

9. Computer AI

Implement a basic but functional AI.

Easy:

Random valid moves

Simple capture preference

Medium:

Prefer captures

Avoid obvious traps

Basic scoring

Hard:

Minimax-style search or another lightweight strategy algorithm

Evaluate captures

Evaluate mobility

Evaluate board position

The AI should make its move automatically after a short delay.

Show:

“Tiger is thinking…”

with a subtle animation.

10. Rules Screen

Create an attractive 3D/card-based Rules screen.

Explain:

Tigers start on the board.

Goats are placed onto empty positions.

Goats try to block the tigers.

Tigers try to capture goats.

Tigers capture by jumping over a goat into an empty connected position.

The game ends when the goats successfully block the tigers or the tigers capture enough goats according to the configured rules.

Include a small animated board demonstration.

Use simple language suitable for children.

11. Achievements

Create an Achievements screen.

Examples:

First Game
Win your first game.

Tiger Hunter
Capture 5 goats.

Strategist
Win 3 games.

Master Player
Win 10 games.

Perfect Defense
Win without losing too many goats.

Display locked/unlocked achievement cards.

Save achievement progress with LocalStorage.

12. Shop

Create a cosmetic-only shop.

Do NOT make the core game pay-to-win.

Allow users to unlock:

Different board themes

Goat skins

Tiger skins

Piece effects

Table/background themes

Use in-game coins.

Example:

Classic Goat — FREE

Golden Goat — 500 coins

Jungle Tiger — 750 coins

Neon Tiger — 1000 coins

Coins should be earned through gameplay/achievements.

13. Coins and Progress

Create a simple local progression system.

Users earn coins for:

Winning

Completing games

Achievements

Daily play

Display the coin balance in the header.

Persist everything with LocalStorage.

Create sensible default values for a new player.

14. Mobile UX

This is extremely important.

Design primarily for:

360px wide phones

390px phones

412px phones

tablets

Use:

Large touch targets

No tiny buttons

Bottom navigation

Swipe-friendly menus

Tap-to-select gameplay

Responsive board sizing

The game board should occupy most of the screen during gameplay.

Prevent accidental page scrolling while playing.

Support portrait orientation first.

15. Animations

Use polished animations throughout:

Button press scale

Screen transitions

Piece movement

Capture animation

Turn indicator

Victory animation

Coin reward animation

Achievement unlock animation

Menu card hover/tap effects

Keep animations smooth and performant.

Use requestAnimationFrame / Three.js animation techniques appropriately.

16. Sound

Create a simple sound system with placeholder/generated procedural sounds if actual audio assets are unavailable.

Sounds:

Button click

Piece movement

Capture

Invalid move

Victory

Achievement unlock

Add a mute button.

Save sound preference.

17. Game States

Implement proper state management.

States should include:

HOME
MODE_SELECT
DIFFICULTY_SELECT
GAME
PAUSED
RULES
SHOP
ACHIEVEMENTS
GAME_OVER

Do not reload the page when changing screens.

18. Game Over

When somebody wins, show a polished game-over modal.

Example:

“GOATS WIN!”

or

“TIGERS WIN!”

Show:

Winner

Captured goats

Number of moves

Coins earned

Achievement progress

Buttons:

“PLAY AGAIN”
“HOME”

Add a small celebratory animation.

19. Performance

Optimize the Three.js scene for mobile.

Avoid unnecessarily complex models.

Use:

Low-poly stylized geometry

Efficient materials

Limited dynamic lights

Instancing where useful

Proper disposal of Three.js resources

Target smooth gameplay on normal mobile phones.

20. Important

Do NOT create a fake prototype where buttons do nothing.

Every major button should work.

The board must be playable.

Pieces must move according to valid connections.

Turns must work.

Captures must work.

Win conditions must work.

VS Computer must actually make moves.

2-player mode must work.

Shop, achievements, coins and settings should persist locally.

21. Final UI Direction

The final result should feel like:

“a premium children's mobile board game converted into an interactive Three.js game.”

Think:

3D toy board + colorful children's game + modern mobile UI + smooth animations.

Use the uploaded reference images for inspiration for the board proportions, goat/tiger appearance and overall concept, but create an original polished interface rather than simply placing the images into the website.

Start by building the complete functional game architecture and playable board first, then polish the visual design and animations.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/20f9a670-1890-48eb-b656-d4e1be2a7b8b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
