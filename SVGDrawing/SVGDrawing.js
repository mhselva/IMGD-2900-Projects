/*
--------------------------------------------------------
|                 CS4731 - Project 1                   |
|                   Matthew Selva                      |
|                                                      |
| Extra Credit:                                        |
|	-Implementation of Color Picker for line drawing   |
|  		-Points are not colored, only lines			   |
|   -I believe the "nudge" Zoom mentioned in the       |
|    announcement today (1/28) has been implemented    |
--------------------------------------------------------
 */

function main() {

	// Sets up HTML Interactions.
	let canvas = document.getElementById('webgl');
	let red = document.getElementById('colorPickR');
	let yellow = document.getElementById('colorPickY');
	let green = document.getElementById('colorPickG');
	let blue = document.getElementById('colorPickB');
	let purple = document.getElementById('colorPickP');
	let black = document.getElementById('colorPickBl');
	document.getElementById("filePicker").addEventListener("change", parseSVG);

	// Initialize color picker functionality.
	initColorPicker(red);
	initColorPicker(yellow);
	initColorPicker(green);
	initColorPicker(blue);
	initColorPicker(purple);
	initColorPicker(black);

	// Initialize WebGL and Shader Information.
	let gl = canvas.getContext("webgl");
	let program = initShaders(gl, "vshader", "fshader");
	gl.useProgram(program);

	// Initialize Arrays.
	let lines, colors, points = [];
	let currentLines = [];		// Currently displayed lines, used for panning.
	let originalLines = [];		// Original list of lines, used for resetting the view.

	// Initialize Variables.
	let zoom = 1;				// Value and direction of the Zoom.
	let scale = 1;				// Scale factor applied to all lines.
	let xOrigin = 0;			// xOrigin of the Image, used for zooming into a point.
	let yOrigin = 0;			// yOrigin of the Image, used for zooming into a point.
	let lineChangeX = 0;		// Change in X Direction from a single Click & Drag event.
	let lineChangeY = 0;		// Change in Y Direction from a single Click & Drag event.
	let lineChangeXTotal = 0;	// Total change in X Direction from all Click & Drag events, used to properly display Drawn Lines after reset.
	let lineChangeYTotal = 0;	// Total change in Y Direction from all Click & Drag events, used to properly display Drawn Lines after reset.
	let runTotalOnce = 0;		// Ensures the Total values are only calculated once per movement.
	let move = false;			// Ensures the Total values are only calculated on Click & Drag events rather than every Click.
	let drawing = false;		// Used to differentiate between drawing a Point vs. drawing a Line when manually creating lines.
	let blankScreen = true;		// Used to differentiate between a screen with no SVG rendered vs. a screen with an SVG rendered.
	let color = vec4(0.0, 0.0, 0.0, 1.0);
	let projMatrix, tMatrix;

	// Drawing to the Canvas.
	function draw() {

		// Setting up the Viewport.
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Buffer for Lines.
		let lBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, lBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(lines), gl.STATIC_DRAW);

		// Setting up Line Information.
		let vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		// Buffer for Colors.
		let cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

		// Setting up Color Information.
		let vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, true, 0, 0);
		gl.enableVertexAttribArray(vColor);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT)

		// Initialize Model Matrix.
		let modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
		gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(tMatrix));

		// Initialize Projection Matrix.
		let projMatrixLoc = gl.getUniformLocation(program, "projMatrix");
		gl.uniformMatrix4fv(projMatrixLoc, false, flatten(projMatrix));

		// Draw Lines.
		currentLines = lines;
		gl.drawArrays(gl.LINES, 0, lines.length);

		// Buffer for Points.
		lBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, lBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

		// Setting up Point information.
		vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		// Draw Points.
		gl.drawArrays(gl.POINTS, 0, points.length);
	}

	// Parses an SVG File so it can be drawn.
	function parseSVG() {
		initArrays();
		let reader = new FileReader();
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		let file = document.querySelector('input[type=file]').files[0];

		// Loads the SVG file.
		reader.onload = function () {
			let oParser = new DOMParser();
			let oDOM = oParser.parseFromString(reader.result.toString(), "image/svg+xml")
			let root = oDOM.documentElement;
			let viewBox = root.getAttribute("viewBox").split(" ")
			let minX = 0.0
			let minY = 0.0
			let width = 1.0
			let height = 1.0
			if (viewBox.length > 0) {
				minX = parseFloat(viewBox[0])
				minY = parseFloat(viewBox[1])
				width = parseFloat(viewBox[2])
				height = parseFloat(viewBox[3])
			}

			// Adjust the size of the Canvas to fit the Image.
			let viewWidth = width - minX
			let viewHeight = height - minY
			let aRatio = viewWidth / viewHeight
			let newWidth = 400 * aRatio

			canvas.clientWidth = newWidth
			canvas.width = newWidth

			let lineArray = root.getElementsByTagName("line");

			// Parse SVG and draw it to the screen.
			for (let i = 0; i < lineArray.length; i++) {
				let x1 = parseFloat(lineArray[i].getAttribute("x1"));
				let y1 = parseFloat(lineArray[i].getAttribute("y1"));
				let x2 = parseFloat(lineArray[i].getAttribute("x2"));
				let y2 = parseFloat(lineArray[i].getAttribute("y2"));

				x1 = ((x1 / width)  - (0.5 + (minX / width)))  * 2.0;
				y1 = ((y1 / height) - (0.5 + (minY / height))) * 2.0;
				x2 = ((x2 / width)  - (0.5 + (minX / width)))  * 2.0;
				y2 = ((y2 / height) - (0.5 + (minY / height))) * 2.0;

				let point1 = vec4(x1, y1 * (-1.0), 0.0, 1.0);
				let point2 = vec4(x2, y2 * (-1.0), 0.0, 1.0);

				lines.push(point1);
				lines.push(point2);

				if (lineArray[i].getAttribute("stroke")) {
					let hex = lineArray[i].getAttribute("stroke").substring(1).match(/.{1,2}/g);
					let rgb = [
						parseInt(hex[0], 16),
						parseInt(hex[1], 16),
						parseInt(hex[2], 16)
					];
					colors.push(vec4(rgb[0], rgb[1], rgb[2], 1.0));
					colors.push(vec4(rgb[0], rgb[1], rgb[2], 1.0));
				} else {
					colors.push(vec4(0.0, 0.0, 0.0, 1.0));
					colors.push(vec4(0.0, 0.0, 0.0, 1.0));
				}
			}

			initVariables();
			initMatrices();
			blankScreen = false;
			originalLines = lines;
			draw();
			resetLines();
		}
		if (file) {
			reader.readAsText(file);
		}
	}

	// Returns the Mouse's Position on the Canvas.
	function getMouseCoords(mouse) {

		// Mouse position relative to Canvas.
		const rect = canvas.getBoundingClientRect();
		const xMouse = mouse.clientX - rect.left;
		const yMouse = mouse.clientY - rect.top;

		// Normalized position on Canvas.
		const normX = xMouse / canvas.clientWidth;
		const normY = yMouse / canvas.clientHeight;

		// Convert to clip space.
		const clipX = normX * 2 - 1;
		const clipY = normY * -2 + 1;

		return [clipX, clipY];
	}

	// Initializes onClick functions for color pickers.
	function initColorPicker(colorP) {
		colorP.addEventListener("click", function() {
			resetColorPickers();
			colorP.style.borderColor = "black";
			switch(colorP) {
				case red:
					color = vec4(255.0, 0.0, 0.0, 1.0);
					break;
				case yellow:
					color = vec4(255.0, 255.0, 0.0, 1.0);
					break;
				case green:
					color = vec4(0.0, 128.0, 0.0, 1.0);
					break;
				case blue:
					color = vec4(0.0, 0.0, 255.0, 1.0);
					break;
				case purple:
					color = vec4(128.0, 0.0, 128.0, 1.0);
					break;
				case black:
					color = vec4(0.0, 0.0, 0.0, 1.0);
					break;
			}
		})
	}

	// Resets color pickers to inactive state.
	function resetColorPickers() {
		red.style.borderColor = "white";
		yellow.style.borderColor = "white";
		green.style.borderColor = "white";
		blue.style.borderColor = "white";
		purple.style.borderColor = "white";
		black.style.borderColor = "white";
	}

	// Handles zooming in and out with the mouse wheel.
	canvas.addEventListener("wheel", function (mouse) {
		mouse.preventDefault();
		let [xMouse, yMouse] = getMouseCoords(mouse);

		// Zoom Speed.
		zoom = Math.exp(mouse.deltaY * -0.01);
		zoom = Math.min(Math.max(0.975, zoom), 1.025);

		// Scaling the Image based on Zoom Direction/Speed & Mouse Location.
		scale *= zoom;
		if (scale < 10 && scale > 0.1) {

			// Translate so the origin is at the center of the screen.
			tMatrix = mult(tMatrix, translate(xOrigin, yOrigin, 0.0));

			// Shift the origin based on the Mouse location.
			xOrigin -= xMouse / (scale * zoom) - xMouse / scale;
			yOrigin -= yMouse / (scale * zoom) - yMouse / scale;

			// Scale the matrix and return the origin to its proper position.
			tMatrix = mult(tMatrix, scalem(zoom, zoom, 0.0));
			tMatrix = mult(tMatrix, translate(-xOrigin, -yOrigin, 0.0));
		}

		// Ensuring the Scale Factor doesn't get out of hand.
		if (scale > 10) { scale = 10; }
		if (scale < 0.1) { scale = 0.1; }

		draw();
	})

	// Handles Click Events.
	canvas.addEventListener("mousedown", function (mouse) {
		move = false;
		mouse.preventDefault();
		let [xMouse1, yMouse1] = getMouseCoords(mouse);

		// Add a new point if Right Click.
		if (mouse.button === 2) {
			addPoint(xMouse1, yMouse1);
			return;
		}

		// Position at the beginning of the shift.
		let lineX1 = lines[0][0];
		let lineY1 = lines[0][1];

		// Pan the image if Left Click and Drag.
		function onMouseMove(mouse) {
			move = true;
			runTotalOnce = 0;
			let [xMouse2, yMouse2] = getMouseCoords(mouse);

			// Update the position of every Line based on the movement of the Mouse.
			for (let i = 0; i < currentLines.length; i++) {
				let currLine = currentLines[i];
				lines[i] = vec4(currLine[0] + (xMouse2 - xMouse1) / (scale),
								currLine[1] + (yMouse2 - yMouse1) / (scale),
								currLine[2],
								currLine[3]);
			}

			// Calculate the shifted image for storing drawn lines.
			let lineX2 = lines[0][0];
			let lineY2 = lines[0][1];
			lineChangeX = lineX2 - lineX1;
			lineChangeY = lineY2 - lineY1;

			// Update the position of Points in the Canvas, if there are any.
			if (points.length > 0) {
				points[0][0] += (xMouse2 - xMouse1) / scale;
				points[0][1] += (yMouse2 - yMouse1) / scale;
			}

			xMouse1 = xMouse2;
			yMouse1 = yMouse2;
			draw();
		}

		// End the Event once the Mouse is no longer Pressed.
		canvas.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener("mouseup", function () {

			// Calculate the total displacement of the image.
			if (move && runTotalOnce === 0) {
				lineChangeXTotal += lineChangeX;
				lineChangeYTotal += lineChangeY;
				runTotalOnce++;
			}

			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.onmouseup = null;
		});
	});

	// Adds a Point or Line when the user Right Clucks.
	function addPoint(xMouse, yMouse) {

		// Initialize Values if it's the first Point.
		if (blankScreen) {
			initMatrices();
			initArrays();
			blankScreen = false;
		}

		// Calculates the location of a new point.
		let pointX = (xMouse/scale)+xOrigin;
		let pointY = (yMouse/scale)+yOrigin;

		// Places the first point, preventing colors from mixing.
		if (!drawing) {
			colors.push(color);
			points.push(vec4(pointX, pointY, 0.0, 1.0));
			drawing = true;
			draw();
			colors.pop();
			return;
		}

		// Connects the previous point to a Line.
		if (drawing) {

			// Position of the line with respect to the Canvas.
			let point1 = vec4(points[0][0], points[0][1], 0.0, 1.0);
			let point2 = vec4(pointX, pointY, 0.0, 1.0);

			// Draw the lines to the screen.
			lines.push(point1);
			lines.push(point2);

			// Save the lines based on any transforms so they're still displayed properly after resetting.
			originalLines.push(vec4(points[0][0] - lineChangeXTotal, points[0][1] - lineChangeYTotal, 0.0, 1.0));
			originalLines.push(vec4(pointX - lineChangeXTotal, pointY - lineChangeYTotal, 0.0, 1.0));

			// Color of the line.
			colors.push(color);
			colors.push(color);
			points = [];
			drawing = false;
			draw();
		}
	}

	// Resets the view.
	document.addEventListener('keydown', event => {
		if ((event.key === 'R') || (event.key === 'r')) {
			points = [];
			drawing = false;
			initVariables();
			resetLines();
			draw();
		}
	});

	// Resets the lines to their original values.
	function resetLines() {
		lines = [];
		initMatrices();
		for (let i = 0; i < originalLines.length; i++) {
			lines.push(originalLines[i]);
		}
	}

	// Initializes Matrix information.
	function initMatrices() {
		tMatrix = scalem(1.0, 1.0, 0.0);
		projMatrix = ortho(-1, 1, -1, 1, -1, 1);
	}

	// Initializes Array data.
	function initArrays() {
		lines = [];
		colors = [];
		points = [];
		currentLines = [];
		originalLines = [];
	}

	// Initializes Variables.
	function initVariables() {
		zoom = 1;
		scale = 1;
		xOrigin = 0;
		yOrigin = 0;
		lineChangeX = 0;
		lineChangeY = 0;
		lineChangeXTotal = 0;
		lineChangeYTotal = 0;
	}
}
