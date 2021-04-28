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
	let level_select_active;
	let win_list = [];

	let level_select = {
		width: 16,
		height: 16,
		pixelSize: 1,
		data: [
			'T1', 0, 'T2', 0, 'T3', 0, 'T4', 0, 'T5', 0, 'T6', 0, 'T7', 0, 'T8', 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]
	}

	// Function to compare click orders to check if player solved a level correctly.
	let compare_clicks = function(correct_order) {
		return ((click_order.toString()).indexOf(correct_order.toString()) > -1 )
	}

	// Loaded between levels, allows user to either load the next level or return to level selection.
	let load_menu = function(next) {

		// Customize grid appearance.
		PS.gridSize(2, 1);
		PS.border(PS.ALL, PS.ALL, 5);
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

		if (win_list.includes(8)) {
			PS.statusText("All Levels Complete!");
		} else {
			PS.statusText("Select a Level");
		}

		PS.gridSize(16, 16);
		PS.gridColor(GRID_COLOR);

		let i, x, y, data, color, glyph, glyph_color;
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
						break;
					case 'T2':
						glyph = '2';
						glyph_color = PS.COLOR_BLACK;
						if (win_list.includes(1)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T3':
						glyph = '3';
						glyph_color = PS.COLOR_BLACK;
						if (win_list.includes(2)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T4':
						glyph = '4';
						glyph_color = PS.COLOR_BLACK;
						if (win_list.includes(3)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T5':
						glyph = '5';
						glyph_color = PS.COLOR_BLACK;
						if (win_list.includes(4)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T6':
						glyph = '6';
						glyph_color = PS.COLOR_BLACK;
						if (win_list.includes(5)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T7':
						glyph = '7';
						glyph_color = PS.COLOR_BLACK;
						if (win_list.includes(6)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					case 'T8':
						glyph = '8';
						glyph_color = PS.COLOR_BLACK;
						if (win_list.includes(7)) { color = PS.COLOR_WHITE; } else { color = PS.COLOR_BLACK; }
						break;
					default:
						color = PS.COLOR_RED;
						break;
				}
				PS.color(x, y, color);
				PS.glyph(x, y, glyph);
				PS.glyphColor(x, y, glyph_color);
				i += 1;
			}
		}
	};

	// Set the size of the grid based on the level number.
	let set_grid = function(num) {
		switch(num) {
			case 1:
				GRID_X = 1;
				GRID_Y = 1;
				break;
			case 2:
				GRID_X = 3;
				GRID_Y = 1;
				break;
			case 3:
				GRID_X = 3;
				GRID_Y = 1;
				break;
			case 4:
				GRID_X = 5;
				GRID_Y = 1;
				break;
			case 5:
				GRID_X = 5;
				GRID_Y = 1;
				break;
			case 6:
				GRID_X = 3;
				GRID_Y = 2;
				break;
			case 7:
				GRID_X = 3;
				GRID_Y = 2;
				break;
			case 8:
				GRID_X = 2;
				GRID_Y = 2;
				break;
		}
		PS.gridSize(GRID_X, GRID_Y);
		PS.border(PS.ALL, PS.ALL, 0);
	}

	// Load level information (glyphs, radius data, etc.) based on the level number.
	let load_level = function(num) {
		level_select_active = false;
		menu_active = false;

		// Handle status text (brief instruction followed by the level number).
		if (num === 1) {
			PS.statusText("Click in the Correct Order to Proceed.");
		} else {
			PS.statusText("Level " + num);
		}

		// Set information used for each level.
		set_grid(num);
		click_order = [];

		// Load information based on level number.
		switch(num) {
			case 1:
				level = 1;
				PS.glyph(0, 0, '1');
				break;
			case 2:
				level = 2;
				PS.glyph(0, 0, '3');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '1');
				break;
			case 3:
				level = 3;
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '3');
				PS.glyph(2, 0, '2');
				break;
			case 4:
				level = 4;
				PS.glyph(0, 0, '1');
				PS.glyph(1, 0, '5');
				PS.glyph(2, 0, '3');
				PS.glyph(3, 0, '2');
				PS.glyph(4, 0, '4');
				break;
			case 5:
				level = 5
				PS.glyph(0, 0, '6');
				PS.glyph(1, 0, '2');
				PS.glyph(2, 0, '9');
				PS.glyph(3, 0, '0');
				PS.glyph(4, 0, '1');
				break;
			case 6:
				level = 6
				PS.glyph(0, 1, '1');
				PS.glyph(0, 0, '4');
				PS.glyph(1, 0, '3');
				PS.glyph(2, 0, '2');
				break;
			case 7:
				level = 7
				PS.glyph(1, 1, '3');
				PS.glyph(0, 0, '9');
				PS.glyph(1, 0, '0');
				PS.glyph(2, 0, '6');
				break;
			case 8:
				level = 8
				PS.glyph(0, 1, '4');
				PS.glyph(1, 1, '2');
				PS.glyph(0, 0, '8');
				PS.glyph(1, 0, '1');
				break;
		}

		// Customize grid appearance.
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
			const TEAM = "fishbowl";

			// Initialize Level Selection.
			load_level_select();

			// Login information for the PS database.
			PS.dbLogin("imgd2900", TEAM, function (id, user) {
				if (user === PS.ERROR) {
					return;
				}
				PS.dbEvent(TEAM, "startup", user);
				PS.dbSend(TEAM, PS.CURRENT, { discard: true });
			}, { active : false });
		},

		// Handles win conditions for each level.
		touch: function(x, y) {

			// Touch functionality for levels.
			if (!level_select_active && !menu_active) {
				// Don't do anything if the bead is inactive.
				if (PS.glyph(x, y) === 0) {
					return;
				}

				// Keep track of each click in an array.
				click_order.push((PS.glyph(x, y)) - 48);
				PS.color(x, y, CLICK_COLOR);
				PS.audioPlay("fx_click");

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
							load_level_select();
						}
						break;
				}
			} else if (level_select_active) {

				// Touch functionality for level selection.
				let data = level_select.data[(y * 16) + x];
				if (data !== 0 && PS.color(x, y) !== PS.glyphColor(x, y)) {
					switch (data) {
						case 'T1':
							load_level(1);
							break;
						case 'T2':
							load_level(2);
							break;
						case 'T3':
							load_level(3);
							break;
						case 'T4':
							load_level(4);
							break;
						case 'T5':
							load_level(5);
							break;
						case 'T6':
							load_level(6);
							break;
						case 'T7':
							load_level(7);
							break;
						case 'T8':
							load_level(8);
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