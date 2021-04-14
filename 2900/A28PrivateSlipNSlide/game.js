/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-24 (BM)
*/

/* globals PS : true */

"use strict";

const G = (function () {

	// Grid Constants.
	const GRID_SIZE = 15;

	// Color Constants.
	const SPACE_COLOR = 0xF2F9F9;
	const BLOCK_COLOR = 0xF4FDFF;
	const BLOCK_PULSE_COLOR = 0xEDF4F5;
	const GOAL_COLOR = 0x1C4147;
	const ICE_COLOR = 0xA9D4DE;
	const WALL_COLOR = 0xB3B3B3;

	// Image Map Constants.
	const MAP_WALL = 0;
	const MAP_ICE = 1;
	const MAP_SPACE = 2;
	const MAP_UP_DIR = 3;
	const MAP_DOWN_DIR = 4;
	const MAP_LEFT_DIR = 5;
	const MAP_RIGHT_DIR = 6;
	const MAP_TELE1 = 7;
	const MAP_TELE2 = 8;

	// Plane Constants.
	const MAP_PLANE = 0;
	const GOAL_PLANE = 1;
	const BLOCK_PLANE = 1;

	// Variables for Color Variation.
	let ice_RGB;
	let wall_RGB;

	// Variables for handling Animation & Movement.
	let slide_path = null;
	let is_sliding = false;
	let block_position;
	let direction;
	let pulse = 0;

	// Variables for keeping track of IDs.
	let block_id;
	let goal_id;
	let timer_id_animate;
	let timer_id_pulse;

	// Variables for block & goal positions.
	let block_x;
	let block_y;
	let goal_x;
	let goal_y;

	// Variables for handling level information.
	let current_map;
	let level_num = 1;

	// Variables for handling level selection.
	let complete_list = [];
	let level_select_active = false;

	// Level selection layout.
	let level_select = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 'B1', 1, 'B2', 1, 'B3', 1, 'B4', 1, 'B5', 1, 'B6', 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 3, 1, 'D1', 1, 'D2', 1, 'D3', 1, 'D4', 1, 'D5', 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 'D6', 1, 'D7', 1, 'D8', 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 7, 1, 'T1', 1, 'T2', 1, 'T3', 1, 'T4', 1, 'T5', 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 'T6', 1, 'T7', 1, 'T8', 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 'C1', 1, 'C2', 1, 'C3', 1, 'C4', 1, 'C5', 1, 'C6', 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]

	// Block Levels.
	let B1 =  [
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
	let B2 =  [
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
	let B3 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 1
		2, 2, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, // 2
		2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, // 3
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
	let B4 =  [
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
	let B5 =  [
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
	let B6 =  [
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

	// Director Levels.
	let D1 =  [
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
	let D2 =  [
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
	let D3 =  [
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
	let D4 =  [
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
	let D5 =  [
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
	let D6 =  [
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
	let D7 =  [
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
	let D8 =  [
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

	// Teleport Levels.
	let T1 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 1
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 2
		2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 3
		2, 2, 2, 2, 2, 2, 0, 1, 7, 1, 1, 1, 1, 1, 0, // 4
		2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 5
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 6
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 7
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 8
		0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, // 9
		0, 1, 1, 1, 1, 1, 7, 1, 0, 2, 2, 2, 2, 2, 2, // 10
		0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, // 11
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 12
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let T2 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 1
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 2
		2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, // 3
		2, 0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, // 4
		2, 0, 1, 1, 1, 1, 7, 1, 0, 0, 0, 0, 0, 0, 2, // 5
		2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 2, // 6
		2, 2, 2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 0, 2, // 7
		2, 2, 2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 0, 2, // 8
		2, 2, 2, 2, 2, 0, 1, 0, 1, 7, 1, 1, 1, 0, 2, // 9
		2, 2, 2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 0, 2, // 10
		2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, // 11
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 12
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let T3 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, // 1
		2, 0, 1, 1, 1, 1, 0, 2, 0, 1, 1, 1, 1, 0, 2, // 2
		2, 0, 1, 1, 1, 1, 0, 2, 0, 1, 8, 1, 1, 0, 2, // 3
		2, 0, 1, 8, 1, 1, 0, 2, 0, 1, 1, 1, 1, 0, 2, // 4
		2, 0, 1, 1, 1, 1, 0, 2, 0, 1, 1, 1, 0, 0, 2, // 5
		2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 1, 0, 2, // 6
		2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 0, 2, // 7
		2, 2, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 1, 0, 2, // 8
		2, 0, 0, 1, 1, 1, 0, 2, 0, 0, 0, 1, 1, 0, 2, // 9
		2, 0, 1, 1, 7, 1, 0, 2, 0, 1, 1, 1, 1, 0, 2, // 10
		2, 0, 1, 1, 1, 1, 0, 2, 0, 1, 7, 1, 1, 0, 2, // 11
		2, 0, 1, 1, 1, 0, 0, 2, 0, 1, 1, 1, 1, 0, 2, // 12
		2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let T4 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 1
		2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, // 2
		2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 7, 1, 1, 0, 2, // 3
		2, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 2, // 4
		2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 5
		2, 0, 1, 1, 1, 1, 0, 8, 0, 1, 1, 1, 1, 0, 2, // 6
		2, 0, 1, 1, 1, 8, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 7
		2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 8
		2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 2, // 9
		2, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 2, // 10
		2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, // 11
		2, 0, 0, 1, 1, 1, 1, 7, 1, 1, 1, 1, 0, 0, 2, // 12
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]
	let T5 =  [
	//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 0
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 1
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, // 2
		2, 2, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 2, 2, 2, // 3
		2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, // 4
		2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 5
		2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 6
		2, 2, 0, 8, 0, 7, 1, 1, 8, 1, 1, 1, 0, 2, 2, // 7
		2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 8
		2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 7, 0, 2, 2, // 9
		2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, // 10
		2, 2, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 2, 2, // 11
		2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, // 12
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 13
		2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2  // 14
	]

	// Combo Levels.
	//let C1 = [...]
	//...

	// create_map - Handles creation of new image map information for levels.
	let create_map = function(data) {
		let imagemap = {
			width: GRID_SIZE,
			height: GRID_SIZE,
			pixelSize: 1,
			data: data
		}

		// Update current map, used for level switching.
		current_map = imagemap;
		return imagemap;
	};

	// load_level - Loads level information (block position, goal position, and the image map).
	let load_level = function(num, bx, by, gx, gy, map) {
		PS.statusText("Arrows/WASD to move  |  ESC to quit");
		level_select_active = false;
		PS.spriteSolidAlpha(block_id, PS.ALPHA_OPAQUE);
		PS.spriteSolidAlpha(goal_id, PS.ALPHA_OPAQUE);
		PS.border(PS.ALL, PS.ALL, 0);
		level_num = num;
		block_x = bx;
		block_y = by;
		goal_x = gx;
		goal_y = gy;
		PS.spriteMove(block_id, block_x, block_y);
		PS.spriteMove(goal_id, goal_x, goal_y);
		draw_map(create_map(map));
	};

	// win_level - Handles Collision information between the Block & Goal.
	let win_level = function(s1, p1, s2, p2, type) {
		if (type === PS.SPRITE_OVERLAP) {
			switch(level_num) {
				case 1:
					// Load level 2.
					complete_list.push('B1');
					load_level(2, 3, 3, 3, 6, B2);
					break;
				case 2:
					// Load level 3.
					complete_list.push('B2');
					load_level(3, 3, 11, 3, 2, B3);
					break;
				case 3:
					// Load level 4.
					complete_list.push('B3');
					load_level(4, 8, 2, 4, 6, B4);
					break;
				case 4:
					// Load level 5.
					complete_list.push('B4');
					load_level(5, 4, 11, 7, 2, B5);
					break;
				case 5:
					// Load level 6.
					complete_list.push('B5');
					load_level(6, 13, 13, 13, 9, B6);
					break;
				case 6:
					// Load level selection.
					complete_list.push('B6');
					load_level_select();
					break;
				case 7:
					// Load level 8.
					complete_list.push('D1');
					load_level(8, 4, 3, 7, 2, D2);
					break;
				case 8:
					// Load level 9.
					complete_list.push('D2');
					load_level(9, 7, 11, 7, 7, D3);
					break;
				case 9:
					// Load level 10.
					complete_list.push('D3');
					load_level(10, 9, 2, 12, 10, D4);
					break;
				case 10:
					// Load level 11.
					complete_list.push('D4');
					load_level(11, 8, 2, 4, 6, D5);
					break;
				case 11:
					// Load level 12.
					complete_list.push('D5');
					load_level(12, 4, 11, 7, 2, D6);
					break;
				case 12:
					// Load level 13.
					complete_list.push('D6');
					load_level(13, 2, 12, 7, 4, D7);
					break;
				case 13:
					// Load level 14.
					complete_list.push('D7');
					load_level(14, 1, 5, 13, 9, D8);
					break;
				case 14:
					// Load level selection.
					complete_list.push('D8');
					load_level_select();
					break;
				case 15:
					// Load level 16.
					complete_list.push('T1');
					load_level(16, 2, 5, 6, 10, T2);
					break;
				case 16:
					// Load level 17.
					complete_list.push('T2');
					load_level(17, 2, 12, 5, 2, T3);
					break;
				case 17:
					// Load level 18.
					complete_list.push('T3');
					load_level(18, 11, 2, 7, 9, T4);
					break;
				case 18:
					// Load level 19.
					complete_list.push('T4');
					load_level(19, 5, 11, 3, 11, T5);
					break;
				case 19:
					// Load level selection.
					complete_list.push('T5');
					load_level_select();
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
		let data = current_map.data[((ny + dy) * GRID_SIZE) + (nx + dx)];

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
				data = current_map.data[((ny + dy) * GRID_SIZE) + (nx + dx)];

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
				case MAP_UP_DIR:
					director(nx, ny, 0, -1, special_path);
					break;
				case MAP_DOWN_DIR:
					director(nx, ny, 0, 1, special_path);
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
		let data = current_map.data[((ny + y) * GRID_SIZE) + (nx + x)];

		// Check if a special bead is immediately next to the block.
		if(data > 2 && data < 7) {
			nx += x;
			ny += y;
			hit_director = true;
		}

		// Don't do anything if player attempts to move into a wall, or the block is already sliding.
		if (data !== MAP_WALL) {

			// Build path until hitting a wall or director.
			while (!wall_collide && !hit_director) {
				is_sliding = true;
				nx += x;
				ny += y;

				// Continuously check if the next bead is a wall or director & act accordingly.
				data = current_map.data[((ny + y) * GRID_SIZE) + (nx + x)];

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
				case MAP_UP_DIR:
					director(nx, ny, 0, -1, PS.line(block_x, block_y, nx, ny));
					break;
				case MAP_DOWN_DIR:
					director(nx, ny, 0, 1, PS.line(block_x, block_y, nx, ny));
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
			let oldX = point[0];
			let oldY = point[1];
			let newX, newY;
			PS.spriteMove(block_id, point[0], point[1]);

			// Play audio when block passes over a special glyph.
			if (PS.glyph(point[0], point[1]) > 0) {
				PS.audioPlay("fx_blip");
			}

			// If block goes over a teleport.
			if (PS.glyph(point[0], point[1]) === 0x2B24) {
				slide_path = null;
				is_sliding = false;

				// Find the other teleport of the same color, move block there, and initiate slide in the proper direction.
				for (let i = 0; i < GRID_SIZE; i++) {
					for (let j = 0; j < GRID_SIZE; j++) {
						if (PS.glyph(i,j) === 0x2B24 && PS.glyphColor(i, j) === PS.glyphColor(point[0], point[1]) && (i !== point[0] || j !== point[1])) {
							block_x = i;
							block_y = j;
							PS.spriteMove(block_id, block_x, block_y);
							switch(direction) {
								case("up"):
									slide(0, -1);
									break;
								case("down"):
									slide(0, 1);
									break;
								case("left"):
									slide(-1, 0);
									break;
								case("right"):
									slide(1, 0);
									break;
							}
						}
					}
				}
			} else {
				block_position += 1;

				// Check if the block is done moving.
				if (block_position >= slide_path.length) {
					slide_path = null;
					is_sliding = false;
					PS.audioPlay("fx_blast2", {volume: 0.05});
				} else {

					// Keep track of direction to send to teleports.
					let point2 = slide_path[block_position];
					newX = point2[0];
					newY = point2[1];
					if (newY - oldY === -1) direction = "up";
					if (newY - oldY === 1) direction = "down";
					if (newX - oldX === -1) direction = "left";
					if (newX - oldX === 1) direction = "right";
				}
			}
		}
	};

	// block_animate - Animate block appearance on a timer.
	let block_pulse = function() {
		switch(pulse%3) {
			case 0:
				PS.spriteSolidColor(block_id, BLOCK_COLOR);
				break;
			case 1:
				break;
			case 2:
				PS.spriteSolidColor(block_id, BLOCK_PULSE_COLOR);
				break;
		}
		pulse += 1;
	};

	// shade - Randomly assign shades to Walls & Ice.
	let shade = function(color) {
		let vary, r, g, b;
		const RANGE = 6;

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

		i = 0;
		oplane = PS.gridPlane();
		PS.gridPlane(MAP_PLANE);

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
					case MAP_TELE1:
						glyph = '⬤';
						glyph_color = PS.COLOR_GREEN;
						color = shade(ice_RGB);
						break;
					case MAP_TELE2:
						glyph = '⬤';
						glyph_color = PS.COLOR_BLUE;
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

	// load_level_select - Loads and configures the level selection screen.
	let load_level_select = function() {
		if (complete_list.includes('D8') && complete_list.includes('T5')) { PS.statusText("All levels complete!"); } else { PS.statusText("Select a Level"); }
		level_select_active = true;

		// Hide sprites.
		PS.spriteMove(block_id, 0, 0);
		PS.spriteMove(goal_id, 0, 1);
		PS.spriteSolidAlpha(block_id, PS.ALPHA_TRANSPARENT);
		PS.spriteSolidAlpha(goal_id, PS.ALPHA_TRANSPARENT);

		let oplane, i, x, y, data, color, glyph, glyph_color;
		let map = (create_map(level_select));

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
					case MAP_UP_DIR:
						glyph = '▲';
						glyph_color = PS.COLOR_RED;
						color = shade(ice_RGB);
						break;
					case MAP_TELE1:
						glyph = '⬤';
						glyph_color = PS.COLOR_GREEN;
						color = shade(ice_RGB);
						break;
					case 'B1':
						glyph = '1';
						glyph_color = PS.COLOR_BLACK;
						color = shade(wall_RGB);
						break;
					case 'B2':
						glyph = '2';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('B1')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'B3':
						glyph = '3';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('B2')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'B4':
						glyph = '4';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('B3')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'B5':
						glyph = '5';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('B4')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'B6':
						glyph = '6';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('B5')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'D1':
						glyph = '1';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('B6')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'D2':
						glyph = '2';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('D1')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'D3':
						glyph = '3';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('D2')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'D4':
						glyph = '4';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('D3')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'D5':
						glyph = '5';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('D4')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'D6':
						glyph = '6';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('D5')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'D7':
						glyph = '7';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('D6')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'D8':
						glyph = '8';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('D7')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'T1':
						glyph = '1';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('B6')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'T2':
						glyph = '2';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('T1')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'T3':
						glyph = '3';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('T2')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'T4':
						glyph = '4';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('T3')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					case 'T5':
						glyph = '5';
						glyph_color = PS.COLOR_BLACK;
						if (complete_list.includes('T4')) { color = shade(wall_RGB); } else { color = PS.COLOR_BLACK; }
						break;
					default:
						color = shade(ice_RGB);
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
			PS.gridSize(GRID_SIZE, GRID_SIZE);
			PS.gridColor(SPACE_COLOR);
			PS.border(PS.ALL, PS.ALL, 0);
			ice_RGB = PS.unmakeRGB(ICE_COLOR, {});
			wall_RGB = PS.unmakeRGB(WALL_COLOR, {});

			// Initialize slide-able block.
			block_id = PS.spriteSolid(1, 1);
			PS.spriteSolidColor(block_id, BLOCK_COLOR);
			PS.spritePlane(block_id, BLOCK_PLANE);

			// Initialize the goal.
			goal_id = PS.spriteSolid(1, 1);
			PS.spriteSolidColor(goal_id, GOAL_COLOR);
			PS.spritePlane(goal_id, GOAL_PLANE);
			PS.spriteCollide(goal_id, win_level);

			// Initialize level selection screen.
			load_level_select();

			// Initialize timers.
			timer_id_animate = PS.timerStart(3, block_animate);
			timer_id_pulse = PS.timerStart(30, block_pulse);

			// Handle login information.
			PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
				if ( user === PS.ERROR ) {
					return;
				}
				PS.dbEvent( TEAM, "startup", user );
				PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
			}, { active : true } );	// Change to 'true' when deploying for Play Testing.
		},

		// Handle keyboard input.
		keyDown: function(key) {
			// Don't accept new input if the block is sliding.
			if (!is_sliding && !level_select_active) {
				switch (key) {
					case PS.KEY_ARROW_UP:
					case 119:
					case 87: {
						direction = "up";
						slide(0, -1);
						break;
					}
					case PS.KEY_ARROW_DOWN:
					case 115:
					case 83: {
						direction = "down";
						slide(0, 1);
						break;
					}
					case PS.KEY_ARROW_LEFT:
					case 97:
					case 65: {
						direction = "left";
						slide(-1, 0);
						break;
					}
					case PS.KEY_ARROW_RIGHT:
					case 100:
					case 68: {
						direction = "right";
						slide(1, 0);
						break;
					}
					case PS.KEY_ESCAPE:
						load_level_select();
				}
			}
		},

		// Handle mouse input for level selection.
		touch: function(x, y) {
			let data = current_map.data[(y * GRID_SIZE) + x];
			if (data !== MAP_ICE && data !== MAP_WALL && data !== MAP_UP_DIR && data !== MAP_TELE1 && PS.color(x, y) !== PS.COLOR_BLACK && level_select_active) {
				switch (data) {
					case 'B1':
						load_level(1, 3, 7, 11, 7, B1);
						break;
					case 'B2':
						load_level(2, 3, 3, 3, 6, B2);
						break;
					case 'B3':
						load_level(3, 3, 11, 3, 2, B3);
						break;
					case 'B4':
						load_level(4, 8, 2, 4, 6, B4);
						break;
					case 'B5':
						load_level(5, 4, 11, 7, 2, B5);
						break;
					case 'B6':
						load_level(6, 13, 13, 13, 9, B6);
						break;
					case 'D1':
						load_level(7, 4, 4, 7, 4, D1);
						break;
					case 'D2':
						load_level(8, 4, 3, 7, 2, D2);
						break;
					case 'D3':
						load_level(9, 7, 11, 7, 7, D3);
						break;
					case 'D4':
						load_level(10, 9, 2, 12, 10, D4);
						break;
					case 'D5':
						load_level(11, 8, 2, 4, 6, D5);
						break;
					case 'D6':
						load_level(12, 4, 11, 7, 2, D6);
						break;
					case 'D7':
						// Load level 13.
						load_level(13, 2, 12, 7, 4, D7);
						break;
					case 'D8':
						// Load level 14.
						load_level(14, 1, 5, 13, 9, D8);
						break;
					case 'T1':
						// Load level 15.
						load_level(15, 1, 10, 13, 4, T1);
						break;
					case 'T2':
						// Load level 16.
						load_level(16, 2, 5, 6, 10, T2);
						break;
					case 'T3':
						// Load level 17.
						load_level(17, 2, 12, 5, 2, T3);
						break;
					case 'T4':
						// Load level 18.
						load_level(18, 11, 2, 7, 9, T4);
						break;
					case 'T5':
						// Load level 19.
						load_level(19, 5, 11, 3, 11, T5);
						break;
				}
			}
		},

		// Highlight levels when mouse hovers over them.
		enter: function(x, y) {
			let data = current_map.data[(y * GRID_SIZE) + x];
			if (level_select_active) {
				// Only highlight levels that have been unlocked & distinguish between complete and uncomplete levels.
				if (data !== MAP_WALL && data !== MAP_ICE && data !== MAP_UP_DIR && data !== MAP_TELE1) {
					PS.border(x, y, 3);
					if (complete_list.includes(data)) { PS.borderColor(x, y, PS.COLOR_YELLOW); } else { PS.borderColor(x, y, PS.COLOR_BLACK); }
				}
			}
		},

		// Remove highlight from levels when mouse leaves their space.
		exit: function(x, y) {
			PS.border(x, y, 0);
		}
	};

} () );

PS.init = G.init;
PS.keyDown = G.keyDown;
PS.touch = G.touch;
PS.enter = G.enter;
PS.exit = G.exit;