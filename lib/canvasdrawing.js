/**
 * TODO:
 *	- different brushes
 *  - reset link
 *  - save link
 *  - warning for ie users
 *  - resize canvas
 */
/**
 * CanvasDrawing Constructor.
 *
 * Setup default values, the canvas element, and add interface.
 *
 * @author Bala Clark
 * @constructor
 * @param {String} canvasId Id of the canvas element to be used.
 * @param {Object} options Any user defined options.
 */
function CanvasDrawing(canvasId, options) {

	var cd = CanvasDrawing.prototype,
		defaults = {
			lineWidth: 3,
			color: "#000",
			freeDrawing: true
		};
	
	// replace defaults with user defined options
	cd.options = defaults.merge(options);
	
	// init canvas
	cd.canvas = document.getElementById(canvasId);
	cd.context = this.canvas.getContext("2d");

	// setup user drawing controls, specific functions are used to translate the MouseEvent to x / y coordinates
	function controls(e) {
		
		var offset = cd.offset(cd.canvas, e),
			x = offset.x,
			y = offset.y;

		if (e.preventDefault) { e.preventDefault(); }
		
		switch (e.type) {
			case "mousedown": 
			case "onmousedown":
			case "touchstart":
				cd.drawStart(x, y);
				break;
			case "mousemove": 
			case "onmousemove":
			case "touchmove":
				cd.draw(x, y);
				break;
			case "mouseup": 
			case "onmouseup":
			case "touchend":
				cd.drawStop();
				break;
		}
	}

	// add click & touch interfaces
	if (this.options.freeDrawing) {
		if (this.canvas.addEventListener) {
			// mouse events
			this.canvas.addEventListener("mousedown", controls, false);
			this.canvas.addEventListener("mousemove", controls, false);
			document.addEventListener("mouseup", controls, false);
			// touch events
			this.canvas.addEventListener("touchstart", cd.drawStart, false);
			this.canvas.addEventListener("touchmove", cd.draw, false);
			document.addEventListener("touchend", cd.drawStop, false);
		} else {
			// IE
			this.canvas.attachEvent("onmousedown", cd.drawStart);
			this.canvas.attachEvent("onmousemove", cd.draw);
			document.attachEvent("onmouseup", cd.drawStop);
		}
	}
}

/**
 * Calculate the current mouse position relative to an element.
 * 
 * Credit to Mark Pilgrim: http://www.diveintohtml5.org/canvas.html
 *
 * @param element {Object} A HTML element
 * @param e {MouseEvent}
 * @return Cursor position coordinates
 */
CanvasDrawing.prototype.offset = function(element, e) {

	var x, y;

	// check if page relative positions exist, if not figure them out
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	// make the position relative to the canvas
	x -= element.offsetLeft;
	y -= element.offsetTop;

	return {"x": x, "y": y};
};

/**
 * Initialise the drawing instrument & start position.
 *
 * @param x
 * @param y
 */
CanvasDrawing.prototype.drawStart = function(x, y) {

	var cd = this;

	// setup brush (TODO: different brushes)
	cd.drawing = true;
	cd.context.lineCap = "round";
	cd.context.lineJoin = "round";
	cd.context.strokeStyle = cd.options.color;
	cd.context.fillStyle = cd.options.color;
	cd.context.lineWidth = cd.options.lineWidth;

	// draw initial dot (otherwise nothing will draw unless the brush is dragged)
	if (cd.options.freeDrawing) {
		cd.context.beginPath();
		cd.context.moveTo(x + 0.01, y + 0.01);
		cd.context.lineTo(x, y);
		cd.context.closePath();
		cd.context.stroke();
	}
	
	// save current mouse position
	cd.oldX = x;
	cd.oldY = y;
};

/**
 * Draw a path.
 *
 * @param {MouseEvent} e
 */
CanvasDrawing.prototype.draw = function(x, y) {

	var cd = this;

	if (cd.drawing) {
		// draw
		cd.context.beginPath();
		cd.context.moveTo(cd.oldX, cd.oldY);
		cd.context.lineTo(x, y);
		cd.context.closePath();
		cd.context.stroke();
	}
	
	// save current mouse position
	cd.oldX = x;
	cd.oldY = y;
};

/**
 * Stop drawing
 */
CanvasDrawing.prototype.drawStop = function() {
	this.drawing = false;
};

/**
 * Reset the canvas.
 */
CanvasDrawing.prototype.clearCanvas = function() {
	var cd = this;
	cd.context.clearRect(0,0, cd.canvas.width, cd.canvas.height);
	cd.canvas.width = cd.canvas.width;
};

/**
 * Extends the standard Object.
 * 
 * Merge two arrays. Any properties in b will replace the same properties in
 * a. New properties from b will be added to a.
 * 
 * @param {Object} object
 */
Object.prototype.merge = function(object) {
	
	var prop, a = this, b = object;

	if (typeof b === "undefined") { b = {}; }

	for (prop in a) {
		if (a.hasOwnProperty(prop)) {
			if (prop in b) { continue; }
			b[prop] = a[prop];
		}
	}

	return b;
};