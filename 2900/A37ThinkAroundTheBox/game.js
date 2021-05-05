/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-24 (BM)
*/

/* globals PS : true */

"use strict";

const G = (function () {

	// Color constants.
	const GRID_COLOR = 0xE1E1E1;
	const HIGHLIGHT_COLOR = 0xBFBFBF;
	const CLICK_COLOR = 0x737373;
	const BORDER_COLOR = 0x404040;

	// Variables for grid creation.
	let GRID_X;
	let GRID_Y;

	// Variables for handling level progression.
	let level;
	let next_level;
	let menu_active;
	let click_order = [];

	// Variables for handling level selection.
	let victory = 0;
	let level_select_active;
	let win_list = [];

	let level_select = {
		width: 9,
		height: 3,
		pixelSize: 1,
		data: [
			'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9',
			'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
			'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'
		]
	}

	// Function to compare click orders to check if player solved a level correctly.
	let compare_clicks = function(correct_order) {
		return ((click_order.toString()).indexOf(correct_order.toString()) > -1 )
	}

	// Converts value of a glyph to its numerical equivalent.
	let glyph_convert = function(x, y) {
		return (PS.glyph(x, y)) - 48;
	}

	// Loaded between levels, allows user to either load the next level or return to level selection.
	let load_menu = function(next) {

		// Customize grid appearance.
		PS.gridSize(2, 1);
		PS.border(PS.ALL, PS.ALL, 5);
		PS.radius(PS.ALL, PS.ALL, 0);
		PS.gridColor(GRID_COLOR);
		PS.glyph(0,0,'<');
		PS.glyph(1,0,'>');
		PS.statusText("Level Select | Next Level");

		// Information allowing player to proceed to the next level.
		next_level = next;
		menu_active = true;
	}

	// load_level_select - Loads and configures the level selection screen.
	let load_level_select = function() {
		level_select_active = true;
		menu_active = false;

		if (win_list.includes(27)) {
			if (victory === 0) {
				PS.audioPlay("fx_tada");
				victory = 1;
			}
			PS.statusText("All Levels Complete!");
		} else {
			PS.statusText("Select a Level");
		}

		PS.gridSize(9, 3);
		PS.gridColor(GRID_COLOR);

		let i, x, y, data, color, glyph, glyph_color, radius;
		let map = level_select;

		i = 0;
		for (y = 0; y < map.height; y += 1) {
			for (x = 0; x < map.width; x += 1) {
				data = map.data[i];
				switch(data) {
					case 0:
						glyph = '';
						PS.border(x,y,0);
						color = GRID_COLOR;
						break;
					case 'T1':
						glyph = '1';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						break;
					case 'T2':
						glyph = '2';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						if (win_list.includes(1)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T3':
						glyph = '3';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						if (win_list.includes(2)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T4':
						glyph = '4';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						if (win_list.includes(3)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T5':
						glyph = '5';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						if (win_list.includes(4)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T6':
						glyph = '6';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						if (win_list.includes(5)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T7':
						glyph = '7';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						if (win_list.includes(6)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T8':
						glyph = '8';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						if (win_list.includes(7)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T9':
						glyph = '9';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 0;
						if (win_list.includes(8)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C1':
						glyph = '1';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(9)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C2':
						glyph = '2';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(10)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C3':
						glyph = '3';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(11)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C4':
						glyph = '4';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(12)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C5':
						glyph = '5';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(13)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C6':
						glyph = '6';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(14)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C7':
						glyph = '7';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(15)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C8':
						glyph = '8';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(16)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'C9':
						glyph = '9';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 50;
						if (win_list.includes(17)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E1':
						glyph = '1';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(18)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E2':
						glyph = '2';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(19)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E3':
						glyph = '3';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(20)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E4':
						glyph = '4';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(21)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E5':
						glyph = '5';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(22)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E6':
						glyph = '6';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(23)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E7':
						glyph = '7';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(24)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E8':
						glyph = '8';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(25)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'E9':
						glyph = '9';
						glyph_color = PS.COLOR_BLACK;
						color = PS.COLOR_WHITE;
						radius = 25;
						if (win_list.includes(26)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					default:
						color = PS.COLOR_RED;
						break;
				}
				PS.color(x, y, color);
				PS.radius(x, y, radius);
				PS.glyph(x, y, glyph);
				PS.glyphColor(x, y, glyph_color);
				i += 1;
			}
		}
	};

	// Set the size of the grid based on the level number.
	let set_grid = function(x, y) {
		GRID_X = x;
		GRID_Y = y;
		PS.gridSize(GRID_X, GRID_Y);
	}

	// Load level information (glyphs, radius data, etc.) based on the level number.
	let load_level = function(num) {
		level_select_active = false;
		menu_active = false;
		click_order = [];

		// Generate levels.
		switch(num) {
			case 1:
				PS.statusText("Each level has one solution.");
				level = 1;
				set_grid(1,1);
				PS.glyph(0, 0, '1');
				break;
			case 2:
				PS.statusText("Click in the correct order to continue.");
				level = 2;
				set_grid(3,1);
				PS.glyph(0, 0, '3');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '1');
				break;
			case 3:
				PS.statusText("The correct order may not be obvious.")
				level = 3;
				set_grid(3,1);
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '3');
				PS.glyph(2, 0, '2');
				break;
			case 4:
				PS.statusText("All rules are consistent.");
				level = 4;
				set_grid(5,1);
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '5');
				PS.glyph(2, 0, '3');
				PS.glyph(3, 0, '2');
				PS.glyph(4, 0, '4');
				break;
			case 5:
				PS.statusText("Your goal? Figure out the rules.");
				level = 5;
				set_grid(5,1);
				PS.glyph(0, 0, '6');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '9');
				PS.glyph(3, 0, '0');
				PS.glyph(4, 0, '1');
				break;
			case 6:
				PS.statusText("Even when things seem new...");
				level = 6;
				set_grid(3,2);
				PS.glyph(0, 1, '1');
				PS.glyph(0, 0, '4');
				PS.glyph(1, 0, '3');
				PS.glyph(2, 0, '2');
				break;
			case 7:
				PS.statusText("The rules you learn will never change.");
				level = 7;
				set_grid(3,2);
				PS.glyph(0, 1, '3');
				PS.glyph(0, 0, '9');
				PS.glyph(1, 0, '0');
				PS.glyph(2, 0, '6');
				break;
			case 8:
				PS.statusText("Mistakes don't matter.");
				level = 8;
				set_grid(2,2);
				PS.glyph(0, 1, '4');
				PS.glyph(1, 1, '2');
				PS.glyph(0, 0, '8');
				PS.glyph(1, 0, '1');
				break;
			case 9:
				PS.statusText("Once the answer is right, you can proceed.");
				level = 9;
				set_grid(2,3);
				PS.glyph(0, 2, '1');
				PS.glyph(1, 2, '0');
				PS.glyph(0, 1, '6');
				PS.glyph(1, 1, '3');
				PS.glyph(0, 0, '2');
				PS.glyph(1, 0, '4');
				break;
			case 10:
				PS.statusText("New shape, new rule.");
				level = 10;
				set_grid(3,1);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '3');
				break;
			case 11:
				PS.statusText("");
				level = 11;
				set_grid(3,1);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '2');
				PS.glyph(1, 0, '1');
				PS.glyph(2, 0, '3');
				break;
			case 12:
				PS.statusText("We all need order in our lives.");
				level = 12;
				set_grid(6,1);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '6');
				PS.glyph(1, 0, '3');
				PS.glyph(2, 0, '1');
				PS.glyph(3, 0, '2');
				PS.glyph(4, 0, '4');
				PS.glyph(5, 0, '5');
				break;
			case 13:
				PS.statusText("Even if things look weird...");
				level = 13;
				set_grid(4,1);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '2');
				PS.glyph(1, 0, '9');
				PS.glyph(2, 0, '5');
				PS.glyph(3, 0, '0');
				break;
			case 14:
				PS.statusText("The rules don't change.");
				level = 14;
				set_grid(6,1);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '0');
				PS.glyph(1, 0, '9');
				PS.glyph(2, 0, '5');
				PS.glyph(3, 0, '7');
				PS.glyph(4, 0, '3');
				PS.glyph(5, 0, '1');
				break;
			case 15:
				PS.statusText("Old rules don't change either.");
				level = 15;
				set_grid(3,2);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '4');
				PS.glyph(1, 0, '6');
				PS.glyph(2, 0, '5');
				PS.glyph(0, 1, '1');
				PS.glyph(1, 1, '3');
				PS.glyph(2, 1, '2');
				break;
			case 16:
				PS.statusText("All rules are always in place.");
				level = 16;
				set_grid(3,2);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '3');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '1');
				PS.glyph(0, 1, '7');
				PS.glyph(1, 1, '9');
				PS.glyph(2, 1, '8');
				break;
			case 17:
				PS.statusText("");
				level = 17;
				set_grid(3,3);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '3');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '1');
				PS.glyph(0, 1, '5');
				PS.glyph(1, 1, '6');
				PS.glyph(2, 1, '4');
				PS.glyph(0, 2, '7');
				PS.glyph(1, 2, '9');
				PS.glyph(2, 2, '8');
				break;
			case 18:
				PS.statusText("");
				level = 18;
				set_grid(3,3);
				PS.radius(PS.ALL, PS.ALL, 50);
				PS.glyph(0, 0, '4');
				PS.glyph(1, 0, '5');
				PS.glyph(2, 0, '2');
				PS.glyph(0, 1, '8');
				PS.glyph(1, 1, '3');
				PS.glyph(2, 1, '7');
				PS.glyph(0, 2, '9');
				PS.glyph(1, 2, '6');
				PS.glyph(2, 2, '1');
				break;
			case 19:
				PS.statusText("Which comes first, circles or squares?");
				level = 19;
				set_grid(3,2);
				PS.glyph(0, 0, '6');
				PS.glyph(1, 0, '5');
				PS.glyph(2, 0, '4');
				PS.radius(PS.ALL, 1, 50);
				PS.glyph(0, 1, '1');
				PS.glyph(1, 1, '2');
				PS.glyph(2, 1, '3');
				break;
			case 20:
				PS.statusText("You've seen all the rules now.");
				level = 20;
				set_grid(6,1);
				PS.radius(0, 0, 50);
				PS.radius(1, 0, 50);
				PS.radius(2, 0, 50);
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '3');
				PS.glyph(3, 0, '6');
				PS.glyph(4, 0, '5');
				PS.glyph(5, 0, '4');
				break;
			case 21:
				PS.statusText("Have fun with the rest.");
				level = 21;
				set_grid(6,1);
				PS.radius(0, 0, 50);
				PS.radius(2, 0, 50);
				PS.radius(4, 0, 50);
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '3');
				PS.glyph(3, 0, '4');
				PS.glyph(4, 0, '5');
				PS.glyph(5, 0, '6');
				break;
			case 22:
				PS.statusText("");
				level = 22;
				set_grid(4,2);
				PS.radius(0, 1, 50);
				PS.radius(1, 1, 50);
				PS.radius(2, 1, 50);
				PS.glyph(0, 0, '2');
				PS.glyph(1, 0, '5');
				PS.glyph(2, 0, '4');
				PS.glyph(3, 0, '8');
				PS.glyph(0, 1, '1');
				PS.glyph(1, 1, '9');
				PS.glyph(2, 1, '0');
				PS.glyph(3, 1, '3');
				break;
			case 23:
				PS.statusText("");
				level = 23;
				set_grid(4,2);
				PS.radius(0, 1, 50);
				PS.radius(1, 1, 50);
				PS.radius(2, 1, 50);
				PS.radius(3, 0, 50);
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '6');
				PS.glyph(2, 0, '3');
				PS.glyph(3, 0, '9');
				PS.glyph(0, 1, '7');
				PS.glyph(1, 1, '0');
				PS.glyph(2, 1, '2');
				PS.glyph(3, 1, '4');
				break;
			case 24:
				PS.statusText("");
				level = 24;
				set_grid(4,2);
				PS.radius(0, 1, 50);
				PS.radius(1, 0, 50);
				PS.radius(2, 1, 50);
				PS.radius(3, 0, 50);
				PS.glyph(0, 0, '8');
				PS.glyph(1, 0, '5');
				PS.glyph(2, 0, '7');
				PS.glyph(3, 0, '0');
				PS.glyph(0, 1, '2');
				PS.glyph(1, 1, '1');
				PS.glyph(2, 1, '4');
				PS.glyph(3, 1, '3');
				break;
			case 25:
				PS.statusText("");
				level = 25;
				set_grid(3,3);
				PS.radius(0, PS.ALL, 50);
				PS.radius(2, PS.ALL, 50);
				PS.radius(PS.ALL, 0, 50);
				PS.radius(PS.ALL, 2, 50);
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '3');
				PS.glyph(2, 0, '0');
				PS.glyph(0, 1, '2');
				PS.glyph(1, 1, '9');
				PS.glyph(2, 1, '4');
				PS.glyph(0, 2, '5');
				PS.glyph(1, 2, '6');
				PS.glyph(2, 2, '7');
				break;
			case 26:
				PS.statusText("");
				level = 26;
				set_grid(3,3);
				PS.radius(1, 1, 50);
				PS.glyph(0, 0, '2');
				PS.glyph(1, 0, '0');
				PS.glyph(2, 0, '9');
				PS.glyph(0, 1, '7');
				PS.glyph(1, 1, '8');
				PS.glyph(2, 1, '4');
				PS.glyph(0, 2, '5');
				PS.glyph(1, 2, '1');
				PS.glyph(2, 2, '6');
				break;
			case 27:
				PS.statusText("");
				level = 27;
				set_grid(3,3);
				PS.radius(0, 0, 50);
				PS.radius(0, 2, 50);
				PS.radius(1, 2, 50);
				PS.radius(2, 0, 50);
				PS.radius(2, 1, 50);
				PS.glyph(0, 0, '7');
				PS.glyph(1, 0, '4');
				PS.glyph(2, 0, '5');
				PS.glyph(0, 1, '9');
				PS.glyph(1, 1, '0');
				PS.glyph(2, 1, '1');
				PS.glyph(0, 2, '2');
				PS.glyph(1, 2, '3');
				PS.glyph(2, 2, '6');
				break;
		}

		// Customize grid appearance.
		PS.border(PS.ALL, PS.ALL, 0);
		PS.gridColor(GRID_COLOR);
		for (let i = 0; i < GRID_X; i++) {
			for (let j = 0; j < GRID_Y; j++) {

				// Hide inactive beads.
				if (PS.glyph(i, j) === 0) {
					PS.color(i, j, GRID_COLOR);
				}

				// Add border to active beads.
				if (PS.glyph(i, j) > 0) {
					PS.border(i, j, 4);
					PS.borderColor(PS.ALL, PS.ALL, BORDER_COLOR);
				}
			}
		}
	}

	return {
		// Most of the initialization is done per level, so this just loads the level selection screen.
		init: function() {
			// Initialize Level Selection.
			load_level_select();
		},

		// Handles win conditions for each level.
		touch: function(x, y) {
			if (PS.color(x, y) !== GRID_COLOR) { PS.audioPlay("fx_click"); }

			// Touch functionality for levels.
			if (!level_select_active && !menu_active) {
				// Don't do anything if the bead is inactive.
				if (PS.glyph(x, y) === 0) {
					return;
				}

				// Keep track of each click in an array.
				click_order.push(glyph_convert(x, y));
				PS.color(x, y, CLICK_COLOR);

				// Check if the player won a level.
				switch (level) {
					case 1:
						if (compare_clicks([1])) {
							win_list.push(level);
							load_menu(2);
						}
						break;
					case 2:
						if (compare_clicks([1, 2, 3])) {
							win_list.push(level);
							load_menu(3);
						}
						break;
					case 3:
						if (compare_clicks([2, 3, 1])) {
							win_list.push(level);
							load_menu(4);
						}
						break;
					case 4:
						if (compare_clicks([4, 2, 3, 5, 1])) {
							win_list.push(level);
							load_menu(5);
						}
						break;
					case 5:
						if (compare_clicks([1, 0, 9, 2, 6])) {
							win_list.push(level);
							load_menu(6);
						}
						break;
					case 6:
						if (compare_clicks([1, 2, 3, 4])) {
							win_list.push(level);
							load_menu(7);
						}
						break;
					case 7:
						if (compare_clicks([3, 6, 0, 9])) {
							win_list.push(level);
							load_menu(8);
						}
						break;
					case 8:
						if (compare_clicks([2, 4, 1, 8])) {
							win_list.push(level);
							load_menu(9);
						}
						break;
					case 9:
						if (compare_clicks([0, 1, 3, 6, 4, 2])) {
							win_list.push(level);
							load_menu(10);
						}
						break;
					case 10:
						if (compare_clicks([1, 2, 3])) {
							win_list.push(level);
							load_menu(11);
						}
						break;
					case 11:
						if (compare_clicks([1, 2, 3])) {
							win_list.push(level);
							load_menu(12);
						}
						break;
					case 12:
						if (compare_clicks([1, 2, 3, 4, 5, 6])) {
							win_list.push(level);
							load_menu(13);
						}
						break;
					case 13:
						if (compare_clicks([0, 2, 5, 9])) {
							win_list.push(level);
							load_menu(14);
						}
						break;
					case 14:
						if (compare_clicks([0, 1, 3, 5, 7, 9])) {
							win_list.push(level);
							load_menu(15);
						}
						break;
					case 15:
						if (compare_clicks([1, 2, 3, 4, 5, 6])) {
							win_list.push(level);
							load_menu(16);
						}
						break;
					case 16:
						if (compare_clicks([7, 8, 9, 1, 2, 3])) {
							win_list.push(level);
							load_menu(17);
						}
						break;
					case 17:
						if (compare_clicks([7, 8, 9, 4, 5, 6, 1, 2, 3])) {
							win_list.push(level);
							load_menu(18);
						}
						break;
					case 18:
						if (compare_clicks([1, 6, 9, 3, 7, 8, 2, 4, 5])) {
							win_list.push(level);
							load_menu(19);
						}
						break;
					case 19:
						if (compare_clicks([1, 2, 3, 4, 5, 6])) {
							win_list.push(level);
							load_menu(20);
						}
						break;
					case 20:
						if (compare_clicks([1, 2, 3, 4, 5, 6])) {
							win_list.push(level);
							load_menu(21);
						}
						break;
					case 21:
						if (compare_clicks([1, 3, 5, 6, 4, 2])) {
							win_list.push(level);
							load_menu(22);
						}
						break;
					case 22:
						if (compare_clicks([0, 1, 9, 3, 8, 4, 5, 2])) {
							win_list.push(level);
							load_menu(23);
						}
						break;
					case 23:
						if (compare_clicks([0, 2, 7, 9, 4, 3, 6, 1])) {
							win_list.push(level);
							load_menu(24);
						}
						break;
					case 24:
						if (compare_clicks([2, 4, 0, 5, 3, 1, 7, 8])) {
							win_list.push(level);
							load_menu(25);
						}
						break;
					case 25:
						if (compare_clicks([5, 6, 7, 2, 4, 0, 1, 3, 9])) {
							win_list.push(level);
							load_menu(26);
						}
						break;
					case 26:
						if (compare_clicks([8, 6, 1, 5, 4, 7, 9, 0, 2])) {
							win_list.push(level);
							load_menu(27);
						}
						break;
					case 27:
						if (compare_clicks([2, 3, 1, 5, 7, 6, 0, 9, 4])) {
							win_list.push(level);
							load_level_select();
						}
						break;
				}
			} else if (level_select_active) {

				// Touch functionality for level selection.
				if (PS.color(x, y) !== PS.glyphColor(x, y)) {
					switch (y) {
						case 0:
							// First row of levels.
							load_level(glyph_convert(x, y));
							break;
						case 1:
							// Second row of levels.
							load_level(glyph_convert(x, y) + 9)
							break;
						case 2:
							// Third row of levels.
							load_level(glyph_convert(x, y) + 18)
							break;
					}
				}
			} else if (menu_active) {

				// Touch functionality for menu progression.
				if (x === 0) {
					load_level_select();
				} else if (x === 1) {
					load_level(next_level);
				}
			}
		},

		// Reverts color after click.
		release: function(x, y) {
			if (level_select_active) {
				return;
			}

			if (PS.glyph(x, y) === 0) {
				return;
			}
			PS.color(x, y, HIGHLIGHT_COLOR);
		},

		// Highlights active beads.
		enter: function(x, y) {
			if (level_select_active) {
				return;
			}

			if (PS.glyph(x, y) !== 0) {
				PS.color(x, y, HIGHLIGHT_COLOR);
			}
		},

		// Removes highlight from active beads.
		exit: function(x, y) {
			if (level_select_active) {
				return;
			}

			if (PS.glyph(x, y) !== 0) {
				PS.color(x, y, PS.COLOR_WHITE);
			}
		}
	};

} () );

PS.init = G.init;
PS.touch = G.touch;
PS.release = G.release;
PS.enter = G.enter;
PS.exit = G.exit;