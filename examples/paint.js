
var drawing;

window.onload = function() {
	
	drawing = new CanvasDrawing("canvas");
	var swatches = document.getElementById("swatches").getElementsByTagName("div");

	// colour the swatches & add click event
	for (var i=0; i < swatches.length; i++) {
		swatches[i].style.backgroundColor = swatches[i].getAttribute("data-color");
		swatches[i].addEventListener("click", function() { 
			drawing.setOption("color", this.getAttribute("data-color"));
		}, false);
	}
};