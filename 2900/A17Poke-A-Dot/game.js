/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-24 (BM)
*/

"use strict"; // Do NOT delete this directive!

const D = ( function () {

	// Constants
	const GRID_SIZE = 5;
	const COLOR_BG = PS.COLOR_WHITE;
	const DOT_SOUND = "fx_pop";

	// Variables
	let clicks = 0;

	// initDot - Creates the initial dots.
	let initDot = function () {
		let dotColor = [PS.random( 200 ) + 20, PS.random( 200 ) + 20, PS.random( 200 ) + 20];
		let dotPosition = [(PS.random(GRID_SIZE) - 1), (PS.random(GRID_SIZE) - 1)]

		PS.color(dotPosition[0], dotPosition[1], dotColor);
	};

	// updateDot - Updates dot location & color after being clicked.
	let updateDot = function (oldX, oldY) {

		// Check to make sure the dot's position changes.
		let dotPosition = [0,0];
		let newX = (PS.random(GRID_SIZE) - 1);
		let newY = (PS.random(GRID_SIZE) - 1);

		if (newX !== oldX || newY !== oldY) {
			dotPosition[0] = newX;
			dotPosition[1] = newY;
		} else {
			// PS.debug("Dot tried to stay in place.\n");
			updateDot(oldX, oldY);
			return;
		}

		// Create a new dot if the location isn't already occupied by a dot.
		if (PS.color(newX, newY) === PS.COLOR_WHITE) {
			let dotColor = [PS.random(200) + 20, PS.random(200) + 20, PS.random(200) + 20];
			PS.color(dotPosition[0], dotPosition[1], dotColor);
		} else {
			// PS.debug("Dot tried to move to an occupied space.\n");
			updateDot(oldX, oldY);
		}
	};

	return {

		// init - Initializes the grid, status text, and dots.
		init: function () {

			// Initializing grid and bead properties.
			PS.gridSize(GRID_SIZE, GRID_SIZE);
			PS.color(PS.ALL, PS.ALL, COLOR_BG);
			PS.gridColor(COLOR_BG)
			PS.radius(PS.ALL, PS.ALL, 50);
			PS.border(PS.ALL, PS.ALL, 0);

			// Initializing specific attributes of inactive beads.
			for (let i = 0; i < GRID_SIZE; i++) {
				for (let j = 0; j < GRID_SIZE; j++) {
					// Set scales initially to prevent "flashing" on fade.
					PS.scale(i, j, PS.random(50) + 50);

					// White dots fade to color, fade doesn't go both ways.
					if (PS.color(i, j) === PS.COLOR_WHITE) {
						PS.fade(i, j, 30);
					}
				}
			}

			// Initialize dots.
			initDot();
			initDot();
			initDot();
			initDot();
			initDot();
			initDot();
			initDot();

			// Initialize empty status text.
			PS.statusColor(PS.COLOR_BLACK);
			PS.statusText("");
		},

		// touch - Handles touch events, updating dot position after a successful touch.
		touch: function (x, y) {

			// Clicked dots disappear instantly - no fading.
			if (PS.color(x, y) !== PS.COLOR_WHITE) {
				PS.fade(x, y, 0);
				PS.audioPlay(DOT_SOUND);
				PS.color(x, y, PS.COLOR_WHITE);
				clicks += 1;
				updateDot(x, y);
			}

			// Adjusting specific attributes of inactive beads.
			for (let i = 0; i < GRID_SIZE; i++) {
				for (let j = 0; j < GRID_SIZE; j++) {

					// Randomize scales on inactive dots.
					if (PS.color(i, j) === PS.COLOR_WHITE) {
						PS.scale(i, j, PS.random(50) + 50);
					}

					// Inactive dots fade to color.
					if (PS.color(i, j) === PS.COLOR_WHITE) {
						PS.fade(i, j, 30);
					}
				}
			}


			// Tells a small story to keep the user engaged for a period of time.
			switch (clicks) {
				case 10:
					PS.statusText("Keep going!");
					break;
				case 20:
					PS.statusText("You're doing better!");
					break;
				case 30:
					PS.statusText("Wait, those aren't dots...");
					PS.radius(PS.ALL, PS.ALL, 0);
					break;
				case 40:
					PS.statusText("I'll try to fix it.");
					PS.radius(PS.ALL, PS.ALL, 10);
					break;
				case 45:
					PS.statusText("Almost there...");
					PS.radius(PS.ALL, PS.ALL, 20);
					break;
				case 48:
					PS.statusText("Getting better...");
					PS.radius(PS.ALL, PS.ALL, 30);
					break;
				case 52:
					PS.statusText("Oops.");
					PS.radius(PS.ALL, PS.ALL, 0);
					break;
				case 58:
					PS.statusText("There we go.");
					PS.radius(PS.ALL, PS.ALL, 50);
					break;
				case 60:
					PS.statusText("");
					break;
				case 70:
					PS.statusText("Oh. They're squares again.");
					PS.radius(PS.ALL, PS.ALL, 0);
					break;
				case 80:
					PS.statusText("I'll try changing them back again.");
					break;
				case 86:
					PS.statusText("It was easy that time.");
					PS.radius(PS.ALL, PS.ALL, 50);
					break;
				case 88:
					PS.statusText("Oh.");
					PS.radius(PS.ALL, PS.ALL, 0);
					break;
				case 100:
					PS.statusText("Okay, I think it's all set now.");
					PS.radius(PS.ALL, PS.ALL, 50);
					break;
				case 102:
					PS.statusText("You've poked over 100 dots, by the way.");
					break;
				case 104:
					PS.statusText("I appreciate the dedication.");
					break;
				case 110:
					PS.statusText("");
					break;
				case 200:
					PS.statusText("I think you've poked enough.");
					break;
				case 500:
					PS.statusText("Seriously, you can stop whenever you want.");
					break;
			}
		}
	};
} () );

PS.init = D.init;
PS.touch = D.touch;