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
	cd.context = cd.canvas.getContext("2d");

	// setup user drawing controls, specific functions are used to translate the MouseEvent to x / y coordinates
	function controls(e) {
		
		var offset = e.offset(),
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
	if (cd.options.freeDrawing) {
		if (cd.canvas.addEventListener) {
			// mouse events
			cd.canvas.addEventListener("mousedown", controls, false);
			cd.canvas.addEventListener("mousemove", controls, false);
			document.addEventListener("mouseup", controls, false);
			// touch events
			cd.canvas.addEventListener("touchstart", controls, false);
			cd.canvas.addEventListener("touchmove", controls, false);
			document.addEventListener("touchend", controls, false);
		} else {
			// IE
			cd.canvas.attachEvent("onmousedown", controls);
			cd.canvas.attachEvent("onmousemove", controls);
			document.attachEvent("onmouseup", controls);
		}
	}
}

CanvasDrawing.prototype.setOption = function(option, value) {
	
	var cd = CanvasDrawing.prototype;

	if (!cd.options.hasOwnProperty(option)) { throw "Invalid CanvasDrawing option: '" + option + "'"; }

	cd.options[option] = value;
};

/**
 * Initialise the drawing instrument & start position.
 *
 * @param x {Number}
 * @param y {Number}
 */
CanvasDrawing.prototype.drawStart = function(x, y) {

	var cd = CanvasDrawing.prototype;

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
	
	// save current position
	cd.oldX = x;
	cd.oldY = y;
};

/**
 * Draw a path.
 *
 * @param x {Number}
 * @param y {Number}
 */
CanvasDrawing.prototype.draw = function(x, y) {

	var cd = CanvasDrawing.prototype;

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
	CanvasDrawing.prototype.drawing = false;
};

/**
 * Reset the canvas.
 */
CanvasDrawing.prototype.clearCanvas = function() {
	
	var cd = CanvasDrawing.prototype;

	cd.drawing = false;
	cd.context.clearRect(0, 0, cd.canvas.width, cd.canvas.height);
	cd.canvas.width = cd.canvas.width;
};

/**
 * Merge two arrays. Any properties in b will replace the same properties in
 * a. New properties from b will be added to a.
 * 
 * @param object {Object}
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

/**
 * Calculate the current mouse position relative to an element.
 *
 * Credit to Mark Pilgrim: http://www.diveintohtml5.org/canvas.html
 *
 * @return Cursor position coordinates
 */
MouseEvent.prototype.offset = function() {

	var x, y;

	// check if page relative positions exist, if not figure them out
	if (this.offsetX || this.offsetY) {
		x = this.offsetX;
		y = this.offsetY;
	} else {

		if (this.pageX || this.pageY) {
			x = this.pageX;
			y = this.pageY;
		} else {
			x = this.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = this.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		// make the position relative to the element
		x -= this.target.offsetLeft;
		y -= this.target.offsetTop;
	}
	
	return {"x": x, "y": y};
};

