# Feature Specification: Game Modes & Branded Theme

**Feature Branch**: `002-game-modes-theme`

**Created**: 2026-05-28

**Status**: Draft

**Input**: User description: "lets implement a computer mode, we'll have two modes, 2-player mode and against compute mode. implement the default theme like purple light and add the "purp" logo in public/purp.png"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play against the computer (Priority: P1)

A single player chooses a "Vs Computer" mode and plays Tic-Tac-Toe against an automated opponent.
The player makes a move and the computer responds automatically with its own move, continuing until
someone wins or the board is a draw. The player can also choose the existing "Two Player" mode to
play locally with another person on the same screen.

**Why this priority**: The computer opponent is the headline new capability — it lets a lone user
play without a second person. It delivers the core new value of this feature.

**Independent Test**: Select "Vs Computer", make a move, and confirm the computer automatically takes
a turn on an empty cell; play through to a win, loss, and a draw and confirm correct outcomes.

**Acceptance Scenarios**:

1. **Given** the game offers a mode selector, **When** the player views it, **Then** two options are
   available: "Two Player" and "Vs Computer".
2. **Given** "Vs Computer" mode is active and it is the player's turn, **When** the player marks an
   empty cell, **Then** the computer automatically marks one of the remaining empty cells as its
   move (unless the player's move already ended the game).
3. **Given** "Vs Computer" mode and the player can win on their next move, **When** play continues,
   **Then** the computer does not hand the player free wins by ignoring obvious threats (it blocks an
   imminent player win and takes its own winning move when available).
4. **Given** "Two Player" mode is active, **When** two people alternate selections, **Then** the game
   behaves as local hot-seat play with no automatic moves.
5. **Given** either mode, **When** a player completes a winning line or the board fills, **Then** the
   correct win or draw outcome is announced.
6. **Given** the player presses Reset in either mode, **When** the board clears, **Then** a fresh game
   begins in the currently selected mode.

---

### User Story 2 - Branded purple light theme with logo (Priority: P2)

The game presents a clean, light visual theme built around the brand's purple, and displays the
"purp" logo so the app is recognizably branded.

**Why this priority**: Visual identity and polish matter for a finished product, but the game is
fully playable without it. It builds on top of the core gameplay.

**Independent Test**: Load the app and confirm the default theme uses a light background with purple
accents and that the purp logo is visible and crisp.

**Acceptance Scenarios**:

1. **Given** the app loads with no prior preference, **When** it is displayed, **Then** the default
   theme is a light theme with purple as the primary accent color.
2. **Given** the app is displayed, **When** the player looks at the interface, **Then** the purp
   logo is shown prominently (e.g., near the title/header).
3. **Given** the purple theme is applied, **When** X and O marks, the status message, and the controls
   are shown, **Then** all text and interactive elements remain clearly legible against the theme.

### Edge Cases

- In "Vs Computer" mode, what happens if the player's move wins or fills the board? The game ends
  immediately and the computer does not move.
- In "Vs Computer" mode, what if only one empty cell remains after the player's move? The computer
  takes that last cell (which may produce a draw or a computer win).
- What happens when the player switches modes mid-game? The board resets to a fresh game in the newly
  selected mode (no partial state carries over).
- What happens if the logo image fails to load? The app remains fully functional; a text fallback or
  the title still identifies the app.
- In "Vs Computer" mode, the player cannot move during the computer's turn (input is ignored until the
  computer has responded).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a mode selector offering exactly two modes: "Two Player" and "Vs
  Computer".
- **FR-002**: System MUST default to "Two Player" mode on first load (preserving the existing local
  hot-seat experience) unless the player selects otherwise.
- **FR-003**: In "Two Player" mode, the system MUST behave as local hot-seat play with two human
  players alternating turns and no automatic moves.
- **FR-004**: In "Vs Computer" mode, the system MUST let the human play first as X and have the
  computer play as O.
- **FR-005**: In "Vs Computer" mode, after a valid human move that does not end the game, the system
  MUST automatically make a computer move on an empty cell.
- **FR-006**: The computer MUST play only legal moves (an empty cell) and MUST play competently: take
  an immediate winning move when available, otherwise block the human's immediate winning move when
  one exists, otherwise make a reasonable move.
- **FR-007**: In "Vs Computer" mode, the system MUST ignore human input while the computer's move is
  pending so the human cannot move on the computer's behalf.
- **FR-008**: Win and draw detection MUST work identically in both modes.
- **FR-009**: The status message MUST communicate the current state in a way appropriate to the mode
  (whose turn it is during play, and the winner or draw at the end).
- **FR-010**: The Reset control MUST start a fresh game in the currently selected mode, in both modes.
- **FR-011**: Switching the mode MUST start a fresh game in the newly selected mode.
- **FR-012**: The application MUST apply, by default, a light theme with purple as the primary accent
  color.
- **FR-013**: The application MUST display the "purp" logo (sourced from `public/purp.png`)
  prominently in the interface.
- **FR-014**: All text, marks, and controls MUST remain clearly legible against the purple light
  theme.
- **FR-015**: If the logo image cannot be displayed, the application MUST remain fully functional and
  still identify itself (e.g., via the title text).

### Key Entities *(include if feature involves data)*

- **Game Mode**: The selected play style — "Two Player" or "Vs Computer". Determines whether the
  second player's moves are made by a human or generated automatically.
- **Computer Opponent**: The automated player (plays as O in Vs Computer mode). Chooses a legal,
  competent move in response to the human's move.
- **Game**: (from feature 001) The board, current player, and status — unchanged in structure but now
  played within a selected mode.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A single player can complete a full game against the computer (to a win, loss, or draw)
  in 100% of attempts without reaching an invalid or stuck state.
- **SC-002**: In Vs Computer mode, the computer never ignores an immediate threat or a winning move:
  across test plays it always blocks a one-move player win and always takes a one-move win when one is
  available.
- **SC-003**: A player can switch between the two modes and start a fresh, correct game in a single
  action 100% of the time.
- **SC-004**: A first-time visitor recognizes the app as branded (purple theme + purp logo
  visible) within 5 seconds of the page loading.
- **SC-005**: All interface text and game marks meet a legibility standard of at least 4.5:1 contrast
  against their background in the default theme.
- **SC-006**: The computer responds to the player's move quickly enough to feel immediate (within a
  fraction of a second of the player's turn completing).

## Assumptions

- **Default mode**: "Two Player" is the default on load, preserving the behavior shipped in feature
  001; the player opts into "Vs Computer".
- **Player symbols in Vs Computer**: the human is X and moves first; the computer is O. (No option to
  switch sides in this iteration.)
- **Computer difficulty**: a single, competent difficulty level (win-if-possible, then block, then a
  reasonable move). No selectable difficulty levels and no separate "easy/hard" settings in this
  iteration; this can be revisited if a difficulty selector is later desired.
- **Theme scope**: a single default "purple light" theme is applied; no in-app theme switcher (light
  vs dark toggle) is in scope for this iteration.
- **Logo source**: the logo is the existing `public/purp.png` asset; no new artwork is created.
- **Persistence**: the selected mode is treated as session/UI state; persisting the chosen mode across
  reloads is optional and not required for acceptance.
- This feature builds on the existing Tic-Tac-Toe game (feature 001); core grid, turn, win, draw, and
  reset behaviors carry over unchanged.
