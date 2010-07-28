
/**
 * TODO:
 *  - shake pad to clear canvas
 *  - style
 *  - rotate dials when drawing
 */

function dial(e) {

	if (e.preventDefault) { e.preventDefault(); }

	var cd = CanvasDrawing.prototype,
		offset = e.offset(), // mouse positions
		side,		// the active side of dial
		direction,	// the direction the dial is rotating

	// use default start positions if this is a new drawing
	x = (typeof cd.oldX === "undefined") ? cd.options.lineWidth : cd.oldX,
	y = (typeof cd.oldY === "undefined") ? cd.canvas.height - cd.options.lineWidth : cd.oldY;

	// initialise the drawing if needed
	if (!cd.drawing && e.type === "mousedown") { cd.drawStart(x, y);

	// draw
	} else if (cd.drawing) {
		
		side = (offset.x < this.offsetWidth / 2) ? "left" : "right";
		direction = (offset.y < cd.dialY) ? "up" : "down";
		cd.dialY = offset.y;

		// only draw if the pointers are within the canvas dimensions
		if (cd.oldX <= cd.canvas.width && cd.oldY >= 0) {

			// left dial controls
			if (this.id === "left") {
				
				y = cd.oldY;

				// draw right
				if (side === "left" && direction === "up") { x = cd.oldX + 1; }
				if (side === "right" && direction === "down") { x = cd.oldX + 1; }
				
				// draw left
				if (side === "left" && direction === "down") { x = cd.oldX - 1; }
				if (side === "right" && direction === "up") { x = cd.oldX - 1; }
			}

			// right dial controls
			if (this.id === "right") {
				
				x = cd.oldX;

				// draw up
				if (side === "left" && direction === "up") { y = cd.oldY - 1; }
				if (side === "right" && direction === "down") { y = cd.oldY - 1; }

				// draw down
				if (side === "left" && direction === "down") { y = cd.oldY + 1; }
				if (side === "right" && direction === "up") { y = cd.oldY + 1; }
			}
			
			// correct pointers if they exceed the canvas dimensions
			if (x > cd.canvas.width) { x = cd.canvas.width; }
			if (x < 0) { x = 0; }
			if (y > cd.canvas.height) { y = cd.canvas.height; }
			if (y < 0) { y = 0; }
			
			cd.draw(x, y);
		}
	}
}

window.onload = function() {

	// initialise the canvas drawing
	var i, dials, etch = new CanvasDrawing("canvas", {
		lineWidth: 1,
		color: "#666",
		freeDrawing: false // this stops the user from drawing directly onto the canvas with mouse / touch
	});

	dials = document.getElementById("controls").getElementsByTagName("div");

	// bind controls
	for (i=0; i < dials.length; i++) {
		// mouse
		dials[i].addEventListener("mousedown", dial, false);
		dials[i].addEventListener("mousemove", dial, false);
		// touch
		dials[i].addEventListener("touchstart", dial, false);
		dials[i].addEventListener("touchmove", dial, false);
	}

	document.addEventListener("mouseup", etch.drawStop, false);
	document.addEventListener("touchend", etch.drawStop, false);
};