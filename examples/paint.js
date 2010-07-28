

window.onload = function() {
	
	var drawing = new CanvasDrawing("canvas"),
		swatches = document.getElementById("swatch").getElementsByTagName("div");

	// colour the swatches & add click event
	for (var i=0; i < swatches.length; i++) {
		swatches[i].addEventListener("click", , false);
		swatches[i].style["background-color"] = swatches[i].getAttribute("data-color");
	}
};