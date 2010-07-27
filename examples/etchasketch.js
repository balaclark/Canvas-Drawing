
var etch;

window.onload = function() {

	etch = new CanvasDrawing("canvas", {
		lineWidth: 0.5,
		color: "#999",
		freeDrawing: false
	});

	document.getElementById("left").addEventListener("mousemove", dial, false);
	document.getElementById("right").addEventListener("mousemove", dial, false);
};

function dial(e) {

	var cd = CanvasDrawing.prototype,
		x = (typeof cd.oldX === "undefined") ? cd.options.lineWidth : cd.oldX,
		y = (typeof cd.oldY === "undefined") ? cd.canvas.height - cd.options.lineWidth : cd.oldY;

	// initialise the drawing if needed
	if (!cd.drawing) { cd.drawStart(x, y); }

	// draw
	if (cd.drawing) {

		// only draw if the pointers are within the canvas dimensions
		if (cd.oldX <= cd.canvas.width && cd.oldY >= 0) {

			// increment pointers, making sure they don't exceed the canvas' dimensions
			x = (this.id === "left" && cd.oldX < cd.canvas.width) ? cd.oldX + 1 : cd.oldX;
			y = (this.id === "right" && cd.oldY > 0) ? cd.oldY - 1 : cd.oldY;
			
			cd.draw(x, y);
		}
	}
};