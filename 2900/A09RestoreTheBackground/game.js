/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

Matthew Selva
Team Fishbowl

Mod 1: 	Changed background color to pure black
Mod 2: 	Removed all bead borders
Mod 3: 	Changed status text to "Click to restore the background!"
Mod 4: 	Changed the grid dimensions to 4 x 4.
Mod 5: 	Added a celebratory sound effect when the grid is entirely black
Mod 6: 	Added functionality that updates the status text when the entire grid is changed to black,
		and reverts it if beads are changed back to white.
 */

"use strict";

// Initialize game information.
PS.init = function(system, options) {

	// Establish grid dimensions
	PS.gridSize(4, 4);
	
	// Set background, grid colors, and set fade
	PS.gridColor(PS.COLOR_BLACK);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);
	PS.fade(PS.ALL, PS.ALL, 20);
	
	// Change status line color and text
	PS.statusColor(PS.COLOR_WHITE);
	PS.statusText("Click to restore the background!");
	PS.border(PS.ALL, PS.ALL, 0);
	
	// Preload sound effects
	PS.audioLoad("fx_click");
	PS.audioLoad("fx_tada");
};

// Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
PS.touch = function(x, y, data, options) {

	// Toggle color of touched bead from white to black and back again
	PS.color(x, y, data); // set color to current value of data
	
	// Decide what the next color should be.
	// If the current value was black, change it to white.
	// Otherwise change it to black.
	let next; // variable to save next color
	if (data === PS.COLOR_BLACK) {
		next = PS.COLOR_WHITE;
	}
	else {
		next = PS.COLOR_BLACK;
	}

	// Check if all beads are Black.
	// If all beads are black, update the status text.
	// Otherwise either keep the status text the same, or revert it to the original instruction.
	let check = 0; // variable to check if all beads are black

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (PS.color(i,j) === PS.COLOR_WHITE) {
				check = 1;
			}
		}
	}

	if (check === 0) {
		PS.audioPlay("fx_tada");
		PS.statusText("Good job!");
	} else {
		PS.statusText("Click to restore the background!");
	}

	// Remember the newly-changed color by storing it in the bead's data.
	PS.data(x, y, next);

	// Play click sound.
	PS.audioPlay("fx_click");
};