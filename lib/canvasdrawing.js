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
 * @constructor
 * @param {String} canvasId Id of the canvas element to be used.
 * @param {Object} options Any user defined options.
 */
function CanvasDrawing(canvasId, options) {

	var cd = CanvasDrawing.prototype,
		defaults = {
			lineWidth: 3,
			color: "#000",
			brush: "circle"
		};

	// replace defaults with user defined options
	cd.options = defaults.merge(options);
	
	// init canvas
	cd.canvas = document.getElementById(canvasId);
	cd.context = this.canvas.getContext("2d");

	// add click & touch interfaces
	if (this.canvas.addEventListener) {
		// mouse events
		this.canvas.addEventListener("mousedown", cd.drawStart, false);
		this.canvas.addEventListener("mousemove", cd.draw, false);
		document.addEventListener("mouseup", cd.drawStop, false);
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

/**
 * Calculate the current mouse position relative to the canvas.
 * 
 * Credit to Mark Pilgrim: http://www.diveintohtml5.org/canvas.html
 *
 * @param e {MouseEvent}
 * @retun Cursor position coordinates
 * @type Object
 */
CanvasDrawing.prototype.offset = function(e) {

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
	x -= this.canvas.offsetLeft;
	y -= this.canvas.offsetTop;

	return {"x": x, "y": y};
};

/**
 * Initialise the drawing instrument & start position.
 *
 * @param {MouseEvent} e
 */
CanvasDrawing.prototype.drawStart = function(e) {

	if (e.preventDefault) { e.preventDefault(); }

	var cd = CanvasDrawing.prototype,
		offset = cd.offset(e);

	// setup brush
	cd.drawing = true;
	cd.context.lineCap = "round";
	cd.context.lineJoin = "round";
	cd.context.strokeStyle = cd.options.color;
	cd.context.fillStyle = cd.options.color;
	cd.context.lineWidth = cd.options.lineWidth;

	// draw initial dot (otherwise nothing will draw unless the brush is dragged)
	cd.context.beginPath();
	cd.context.moveTo(offset.x + .1, offset.y + .1);
	cd.context.lineTo(offset.x, offset.y);
	cd.context.closePath();
	cd.context.stroke();

	// save current mouse position
	cd.oldX = offset.x;
	cd.oldY = offset.y;
};

/**
 * Draw a path.
 *
 * @param {MouseEvent} e
 */
CanvasDrawing.prototype.draw = function(e) {

	var cd = CanvasDrawing.prototype,
		offset = cd.offset(e);

	if (cd.drawing) {
		// draw
		cd.context.beginPath();
		cd.context.moveTo(cd.oldX, cd.oldY);
		cd.context.lineTo(offset.x, offset.y);
		cd.context.closePath();
		cd.context.stroke();
	}
	
	// save current mouse position
	cd.oldX = offset.x;
	cd.oldY = offset.y;
}

/**
 * Stop drawing
 */
CanvasDrawing.prototype.drawStop = function() {
	CanvasDrawing.prototype.drawing = false;
}

/**
 * Reset the canvas.
 */
CanvasDrawing.prototype.clearCanvas = function() {
	var cd = CanvasDrawing.prototype;
	cd.context.clearRect(0,0, cd.canvas.width, cd.canvas.height);
	cd.canvas.width = cd.canvas.width;
}

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
}