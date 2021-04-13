/*
game.js for Perlenspiel 3.3.xd
Last revision: 2021-04-08 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-21 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

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
			if (PS.color(x,y) === PS.COLOR_BLACK) {
				return;
			}

			if (PS.glyph(x,y) === GLYPH) {
				PS.statusText("Correct square! You win.");
			} else {
				PS.statusText("Wrong square. You lose.");
			}
		}

		// Round 1. Pick a square from the 100 available options.
		if (count === 0) {
			for (let i = 0; i < GRID; i++) {
				for (let j = 0; j < GRID; j++) {
					if (PS.glyph(i, j) !== GLYPH) {
						PS.color(i, j, PS.COLOR_BLACK);
					}
				}
			}
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

		// Handle keyboard input (Arrow Keys & WASD).
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