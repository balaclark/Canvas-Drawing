
var drawing;

window.onload = function() {

	drawing = new CanvasDrawing("canvas", { lineWidth: 20, color: "olive" })

	var i,
		swatches = document.getElementById("swatches").getElementsByTagName("div"),
		brushSizes = document.getElementById("brush-sizes").getElementsByTagName("div");

	// colour swatches
	for (i=0; i < swatches.length; i++) {

		// colour the swatches
		swatches[i].style.backgroundColor = swatches[i].getAttribute("data-color");

		// add controls
		swatches[i].addEventListener("click", function() {
			drawing.setOption("color", this.getAttribute("data-color"));
		}, false);
	}

	// brush sizes
	for (i=0; i < 2; i++) {
		brushSizes[i].addEventListener("click", function() {

			// set line width
			drawing.setOption("lineWidth", drawing.options.lineWidth + parseInt(this.getAttribute("data-increment"), 10));

			// display current line width
			document.getElementById("brush-size").innerHTML = Math.floor(drawing.options.lineWidth);
		}, false);
	}

	// clear
	document.getElementById("clear").addEventListener("click", drawing.clearCanvas, false);
};