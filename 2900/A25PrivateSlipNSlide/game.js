/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-24 (BM)
*/

/* globals PS : true */

"use strict";

const G = (function () {

	// Grid Constants.
	const GRID_X = 15;
	const GRID_Y = 15;

	// Color Constants.
	const SPACE_COLOR = 0xF2F9F9;
	const BLOCK_COLOR = 0xF4FDFF;
	const GOAL_COLOR = 0x1C4147;
	const ICE_COLOR = 0xADF1FF;
	const WALL_COLOR = 0xD4D4D4;

	// Image Map Constants.
	const MAP_WALL = 0;
	const MAP_ICE = 1;
	const MAP_SPACE = 2;
	const MAP_UP_DIR = 3;
	const MAP_DOWN_DIR = 4;
	const MAP_LEFT_DIR = 5;
	const MAP_RIGHT_DIR = 6;
	const MAP_TELE = 7;

	// Plane Constants.
	const MAP_PLANE = 0;
	const GOAL_PLANE = 1;
	const BLOCK_PLANE = 1;

	// Variables for Color Variation.
	let ice_RGB;
	let wall_RGB;

	// Variables for handling Animation & Movement.
	let slide_path = null;
	let block_position;
	let is_sliding = false;

	// Variables for keeping track of IDs.
	let block_id;
	let goal_id;
	let timer_id;

	// Variables for block & goal starting positions, initialized for Level 1.
	let block_x = 3;
	let block_y = 7;
	let goal_x = 11;
	let goal_y = 7;

	// Variables for handling level information.
	let current_map;
	let level_num = 1;

	// Level Maps.
	let level1 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 1
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 2
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 3
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 4
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 5
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 6
		2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 7
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 8
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 9
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 10
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 11
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 12
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level2 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 1
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 2
		2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 3
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, // 4
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, // 5
		2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, // 6
		2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, // 7
		2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, // 8
		2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, // 9
		2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, // 10
		2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 11
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 12
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level3 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 1
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 2
		2, 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, // 3
		2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, // 4
		2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, // 5
		2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, // 6
		2, 2, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 2, 2, // 7
		2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, // 8
		2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 9
		2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 10
		2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 11
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 12
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level4 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 1
		2, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 2, // 2
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 3
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 4
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 2, // 5
		2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 6
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 7
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 8
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, // 9
		2, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2, // 10
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 11
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 12
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level5 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 1
		2, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 2, // 2
		2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 3
		2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 4
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 2, // 5
		2, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2, // 6
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 7
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 8
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, // 9
		2, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 10
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 11
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 12
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level6 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0
		0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, // 1
		0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 2
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 3
		0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, // 4
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 5
		0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, // 6
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // 7
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, // 8
		0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 9
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, // 10
		0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, // 11
		0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, // 12
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 13
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  // 14
	]
	let level7 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 1
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 2
		2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, // 3
		2, 2, 2, 0, 1, 1, 0, 1, 0, 1, 1, 0, 2, 2, 2, // 4
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 5
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 6
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 7
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 8
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 9
		2, 2, 2, 0, 1, 1, 1, 3, 1, 1, 1, 0, 2, 2, 2, // 10
		2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, // 11
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 12
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level8 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, // 1
		2, 2, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 2, // 2
		2, 2, 2, 0, 1, 1, 0, 1, 0, 1, 1, 0, 2, 2, 2, // 3
		2, 2, 2, 0, 1, 1, 0, 1, 0, 1, 1, 0, 2, 2, 2, // 4
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 5
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 6
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 7
		2, 2, 2, 0, 1, 1, 1, 3, 1, 1, 5, 0, 2, 2, 2, // 8
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 9
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 10
		2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, // 11
		2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, // 12
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level9 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 1
		2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, // 2
		2, 0, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 0, 2, // 3
		2, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 2, // 4
		2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 5
		2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 6
		2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 7
		2, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 2, // 8
		2, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 2, // 9
		2, 2, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 2, 2, // 10
		2, 2, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, // 11
		2, 2, 2, 0, 1, 1, 1, 0, 1, 1, 1, 0, 2, 2, 2, // 12
		2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level10 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, // 1
		2, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 2, 2, 2, // 2
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 2, // 3
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 2, // 4
		2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 5
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, // 6
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 2, // 7
		2, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 2, // 8
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, // 9
		2, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 10
		2, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 2, // 11
		2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 2, // 12
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level11 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 1
		2, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 2, // 2
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 3
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 4
		2, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 5, 0, 2, // 5
		2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 2, // 6
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 7
		2, 0, 6, 1, 3, 1, 4, 1, 1, 1, 1, 1, 1, 0, 2, // 8
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, // 9
		2, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2, // 10
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 11
		2, 0, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 0, 2, // 12
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level12 =  [
		//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 1
		2, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 2, // 2
		2, 0, 1, 1, 1, 4, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 3
		2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 5, 1, 1, 0, 2, // 4
		2, 0, 6, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 2, // 5
		2, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 2, // 6
		2, 0, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 7
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 8
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, // 9
		2, 0, 1, 1, 0, 1, 1, 1, 1, 5, 1, 4, 1, 0, 2, // 10
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 11
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 12
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level13 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 1
		2, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 2, // 2
		2, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 2, // 3
		2, 0, 1, 0, 1, 1, 0, 1, 1, 5, 1, 1, 1, 0, 2, // 4
		2, 0, 1, 0, 1, 6, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 5
		2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 5, 1, 0, 2, // 6
		2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 7
		2, 0, 1, 0, 1, 1, 1, 5, 0, 3, 1, 1, 1, 0, 2, // 8
		2, 0, 1, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 2, // 9
		2, 0, 1, 0, 1, 1, 1, 0, 3, 1, 1, 1, 1, 0, 2, // 10
		2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 11
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 12
		2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let level14 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0
		0, 1, 4, 1, 1, 4, 1, 1, 1, 0, 1, 1, 1, 5, 0, // 1
		0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 2
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 3
		0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, // 4
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 0, // 5
		0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, // 6
		0, 1, 1, 3, 1, 1, 0, 1, 1, 1, 4, 1, 1, 0, 0, // 7
		0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, // 8
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 9
		0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, // 10
		0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, // 11
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 12
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, // 13
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  // 14
	]

	// create_map - Handles creation of new image map information for levels.
	let create_map = function(data) {
		let imagemap = {
			width: GRID_X,
			height: GRID_Y,
			pixelSize: 1,
			data: data
		}
		// Update current map, used for level switching.
		current_map = imagemap;
		return imagemap;
	};

	// win_level - Handles Collision information between the Block & Goal.
	let win_level = function(s1, p1, s2, p2, type) {
		if (type === PS.SPRITE_OVERLAP) {
			switch(level_num + 1) {
				// Load level 2.
				case 2:
					level_num = 2;
					block_x = 3;
					block_y = 3;
					goal_x = 3;
					goal_y = 6;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level2));
					break;
				// Load level 3.
				case 3:
					level_num = 3;
					block_x = 3;
					block_y = 11;
					goal_x = 3;
					goal_y = 3;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level3));
					break;
				// Load level 4.
				case 4:
					level_num = 4;
					block_x = 8;
					block_y = 2;
					goal_x = 4;
					goal_y = 6;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level4));
					break;
				// Load level 5.
				case 5:
					level_num = 5;
					block_x = 4;
					block_y = 11;
					goal_x = 7;
					goal_y = 2;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level5));
					break;
				// Load level 6.
				case 6:
					level_num = 6;
					block_x = 13;
					block_y = 13;
					goal_x = 13;
					goal_y = 9;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level6));
					break;
				// Load level 7.
				case 7:
					level_num = 7;
					block_x = 4;
					block_y = 4;
					goal_x = 7;
					goal_y = 4;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level7));
					break;
				// Load level 8.
				case 8:
					level_num = 8;
					block_x = 4;
					block_y = 3;
					goal_x = 7;
					goal_y = 2;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level8));
					break;
				// Load level 9.
				case 9:
					level_num = 9;
					block_x = 7;
					block_y = 11;
					goal_x = 7;
					goal_y = 7;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level9));
					break;
				// Load level 10.
				case 10:
					level_num = 10;
					block_x = 9;
					block_y = 2;
					goal_x = 12;
					goal_y = 10;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level10));
					break;
				// Load level 11.
				case 11:
					level_num = 11;
					block_x = 8;
					block_y = 2;
					goal_x = 4;
					goal_y = 6;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level11));
					break;
				// Load level 12.
				case 12:
					level_num = 12;
					block_x = 4;
					block_y = 11;
					goal_x = 7;
					goal_y = 2;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level12));
					break;
				// Load level 13.
				case 13:
					level_num = 13;
					block_x = 2;
					block_y = 12;
					goal_x = 7;
					goal_y = 4;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level13));
					break;
				// Load level 14.
				case 14:
					level_num = 14;
					block_x = 1;
					block_y = 5;
					goal_x = 13;
					goal_y = 9;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level14));
					break;
				// Load level 1.
				default:
					level_num = 1;
					block_x = 3;
					block_y = 7;
					goal_x = 11;
					goal_y = 7;
					PS.spriteMove(block_id, block_x, block_y);
					PS.spriteMove(goal_id, goal_x, goal_y);
					draw_map(create_map(level1));
					break;
			}
		}
	};

	// director - Called from 'slide' and recursively builds paths involving directors.
	let director = function(x, y, dx, dy, path) {
		let nx = x;
		let ny = y;
		let wall_collide = false;
		let hit_director = false;
		let data = current_map.data[((ny + dy) * GRID_Y) + (nx + dx)];

		// Keeping track of the current path.
		let special_path = path;

		// Don't do anything if director points to a wall.
		if (data !== MAP_WALL) {
			block_x = nx;
			block_y = ny;

			// Build path until hitting a wall or director.
			while (!wall_collide && !hit_director) {
				is_sliding = true;
				nx += dx;
				ny += dy;
				// Continuously check if the next bead is a wall or director & act accordingly.
				data = current_map.data[((ny + dy) * GRID_Y) + (nx + dx)];
				// Break out of while loop if a wall or director is hit.
				if (data === MAP_WALL) {
					wall_collide = true;
				}
				if (data > 2 && data < 7) {
					hit_director = true;
					nx += dx;
					ny += dy;
				}
			}
		}
		// If another director is detected, continue building path recursively.
		if (hit_director === true) {
			Array.prototype.push.apply(special_path, PS.line(block_x, block_y, nx, ny))
			switch(data) {
				case MAP_DOWN_DIR:
					director(nx, ny, 0, 1, special_path);
					break;
				case MAP_UP_DIR:
					director(nx, ny, 0, -1, special_path);
					break;
				case MAP_LEFT_DIR:
					director(nx, ny, -1, 0, special_path);
					break;
				case MAP_RIGHT_DIR:
					director(nx, ny, 1, 0, special_path);
					break;
			}
		} else {
			// Put together the final part of the path and animate it.
			Array.prototype.push.apply(special_path, PS.line(x, y, nx, ny))
			if (special_path.length > 0) {
				block_position = 0;
				slide_path = special_path;
			}
			// Update block position to final location.
			block_x = nx;
			block_y = ny;
		}
	}

	// slide - Calculates the end location of a block slide and sends it to be animated.
	let slide = function(x, y) {
		let nx = block_x;
		let ny = block_y;
		let wall_collide = false;
		let hit_director = false;
		let data = current_map.data[((ny + y) * GRID_Y) + (nx + x)];
		// Check if a special bead is immediately next to the block.
		if(data > 2 && data < 7) {
			nx += x;
			ny += y;
			hit_director = true;
		}
		// Don't do anything if player attempts to move into a wall, or the block is already sliding.
		if (!is_sliding && data !== MAP_WALL) {
			// Build path until hitting a wall or director.
			while (!wall_collide && !hit_director) {
				is_sliding = true;
				nx += x;
				ny += y;
				// Continuously check if the next bead is a wall or director & act accordingly.
				data = current_map.data[((ny + y) * GRID_Y) + (nx + x)];
				// Break out of while loop if a wall or director is hit.
				if (data === MAP_WALL) {
					wall_collide = true;
				}
				if (data > 2 && data < 7) {
					hit_director = true;
					nx += x;
					ny += y;
				}
			}
		}
		// If a director is hit, send path construction to the director function.
		if (hit_director === true) {
			switch(data) {
				case MAP_DOWN_DIR:
					director(nx, ny, 0, 1, PS.line(block_x, block_y, nx, ny));
					break;
				case MAP_UP_DIR:
					director(nx, ny, 0, -1, PS.line(block_x, block_y, nx, ny));
					break;
				case MAP_LEFT_DIR:
					director(nx, ny, -1, 0, PS.line(block_x, block_y, nx, ny));
					break;
				case MAP_RIGHT_DIR:
					director(nx, ny, 1, 0, PS.line(block_x, block_y, nx, ny));
					break;
			}
		} else {
			// Put together the path & animate it.
			let path = PS.line(block_x, block_y, nx, ny);
			if (path.length > 0) {
				block_position = 0;
				slide_path = path;
			}
			// Update block position to final location.
			block_x = nx;
			block_y = ny;
		}
	};

	// block_animate - Animate block movement on a timer.
	let block_animate = function() {
		if (slide_path) {
			let point = slide_path[block_position];
			// Move block.
			PS.spriteMove(block_id, point[0], point[1]);
			// Play audio when block passes over a special glyph.
			if (PS.glyph(point[0], point[1]) > 0) {
				PS.audioPlay("fx_blip");
			}
			block_position += 1;
			// Check if the block is done moving.
			if (block_position >= slide_path.length) {
				slide_path = null;
				is_sliding = false;
				PS.audioPlay("fx_blast2", { volume: 0.05 });
			}
		}
	};

	// shade - Randomly assign shades to Walls & Ice.
	let shade = function(color) {
		let vary, r, g, b;
		const RANGE = 14;

		vary = function() {
			return(PS.random(RANGE) + RANGE);
		};

		r = color.r + vary();
		g = color.g + vary();
		b = color.b + vary();

		return PS.makeRGB(r, g, b);
	};

	// draw_map - Draw the map based on the given Image Map.
	let draw_map = function(map) {
		let oplane, i, x, y, data, color, glyph, glyph_color;
		// GLYPHS TO USE: ▲ ▶ ▼ ◀ ◉

		oplane = PS.gridPlane();
		PS.gridPlane(MAP_PLANE);

		i = 0;
		for (y = 0; y < map.height; y += 1) {
			for (x = 0; x < map.width; x += 1) {
				data = map.data[i];
				switch(data) {
					case MAP_ICE:
						glyph = '';
						color = shade(ice_RGB);
						break;
					case MAP_WALL:
						glyph = '';
						color = shade(wall_RGB);
						break;
					case MAP_SPACE:
						glyph = '';
						color = SPACE_COLOR;
						break;
					case MAP_UP_DIR:
						glyph = '▲';
						glyph_color = PS.COLOR_RED;
						color = shade(ice_RGB);
						break;
					case MAP_LEFT_DIR:
						glyph = '◀';
						glyph_color = PS.COLOR_RED;
						color = shade(ice_RGB);
						break;
					case MAP_RIGHT_DIR:
						glyph = '▶';
						glyph_color = PS.COLOR_RED;
						color = shade(ice_RGB);
						break;
					case MAP_DOWN_DIR:
						glyph = '▼';
						glyph_color = PS.COLOR_RED;
						color = shade(ice_RGB);
						break;
					case MAP_TELE:
						glyph = '◉';
						glyph_color = PS.COLOR_GREEN;
						color = shade(ice_RGB);
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
		PS.gridPlane(oplane);
	};

	return {
		// Initialize grid information.
		init: function() {
			// Team name sent to db server.
			const TEAM = "fishbowl";

			// Initialize grid.
			PS.gridSize(GRID_X, GRID_Y);
			PS.gridColor(SPACE_COLOR);
			PS.border(PS.ALL, PS.ALL, 0);
			ice_RGB = PS.unmakeRGB(ICE_COLOR, {});
			wall_RGB = PS.unmakeRGB(WALL_COLOR, {});
			PS.statusText("Use arrow/WASD keys to move");

			// Initialize level 1.
			level_num = 1;
			draw_map(create_map(level1));

			// Initialize slide-able block.
			block_id = PS.spriteSolid(1, 1);
			PS.spriteSolidColor(block_id, BLOCK_COLOR);
			PS.spritePlane(block_id, BLOCK_PLANE);
			PS.spriteMove(block_id, block_x, block_y);

			// Initialize the goal.
			goal_id = PS.spriteSolid(1, 1);
			PS.spriteSolidColor(goal_id, GOAL_COLOR);
			PS.spritePlane(goal_id, GOAL_PLANE);
			PS.spriteMove(goal_id, goal_x, goal_y);
			PS.spriteCollide(goal_id, win_level);

			// Initialize timer.
			timer_id = PS.timerStart(3, block_animate);

			// Handle login information.
			PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
				if ( user === PS.ERROR ) {
					return;
				}
				PS.dbEvent( TEAM, "startup", user );
				PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
			}, { active : true } );	// Change to 'true' when deploying for Playtesting.
		},

		// Handle keyboard input (Arrow Keys & WASD).
		keyDown: function(key) {
			switch (key) {
				case PS.KEY_ARROW_UP:
				case 119:
				case 87: {
					slide(0, -1);
					break;
				}
				case PS.KEY_ARROW_DOWN:
				case 115:
				case 83: {
					slide(0, 1);
					break;
				}
				case PS.KEY_ARROW_LEFT:
				case 97:
				case 65: {
					slide(-1, 0);
					break;
				}
				case PS.KEY_ARROW_RIGHT:
				case 100:
				case 68: {
					slide(1, 0);
					break;
				}
			}
		}
	};
} () );

PS.init = G.init;
PS.keyDown = G.keyDown;