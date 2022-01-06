/*
game.js for Perlenspiel 3.3.xd
Last revision: 2021-04-08 (BM)
*/

"use strict";

const G = (function () {

	// Grid Constants.
	const GRID = 10;
	const GRID_COLOR = 0xA52A2A;
	const SELECT_COLOR = 0x6BBF60;
	const GLYPH = 0x2B24;

	// Keeping track of clicks.
	let count = 0;

	let montyHall = function(x, y) {

		// Round 2. Either keep your square or switch to the other.
		if (count === 1) {
			if (PS.color(x, y) === PS.COLOR_WHITE) {
				return;
			}

			if (PS.glyph(x,y) === GLYPH) {
				PS.statusText("Correct square! Restart with SPACEBAR.");
			} else {
				PS.statusText("Wrong square. Restart with SPACEBAR.");
			}
		}

		// Round 1. Pick a square from the 100 available options.
		if (count === 0) {
			for (let i = 0; i < GRID; i++) {
				for (let j = 0; j < GRID; j++) {
					if (PS.glyph(i, j) !== GLYPH && PS.glyphColor(i, j) !== SELECT_COLOR) {
						PS.color(i, j, PS.COLOR_WHITE);
					}
				}
			}

			// Color a random square if the player miraculously guesses correctly.
			if (PS.glyph(x, y) === GLYPH) {
				PS.color(PS.random(GRID) - 1, PS.random(GRID) - 1, GRID_COLOR);
			}

			// Select square and update count to continue the simulation.
			PS.color(x, y, SELECT_COLOR);
			PS.glyphColor(x, y, SELECT_COLOR);
			PS.statusText("Click your square, or switch.");
			count += 1;
		}
	}

	return {
		init: function () {

			// Initialize grid properties.
			PS.gridSize(GRID, GRID);
			PS.gridColor(PS.COLOR_BLACK);
			PS.color(PS.ALL, PS.ALL, GRID_COLOR);
			PS.border(PS.ALL, PS.ALL, 5);
			PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
			PS.statusText("Click a square! Only one is correct.");
			PS.statusColor(PS.COLOR_WHITE);

			// Randomize correct door.
			count = 0;
			PS.glyphColor(PS.ALL, PS.ALL, GRID_COLOR);
			PS.glyph(PS.random(GRID) - 1, PS.random(GRID) - 1, GLYPH);
		},

		// Clicks trigger the Monty Hall simulation.
		touch: function(x, y) {
			PS.audioPlay("fx_pop");
			montyHall(x, y);
		},

		// Handle keyboard input.
		keyDown: function(key) {

			// Allow user to restart if they press the spacebar.
			if (key === PS.KEY_SPACE) {
				PS.init();
			}
		}
	};

} () );

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;