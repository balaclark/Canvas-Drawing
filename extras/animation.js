
var interval, positions = [], canvas, ctx;

window.onload = function() {
	
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	ctx.fillRect(0, 0, canvas.width, canvas.height);

	animation();
	
	canvas.addEventListener("click", clicky, false);
};

function animation() {
	
	var x, y, r, g, b, maxSize, alpha, tmpAlpha, size, fade,
		i = 0,
		status = document.getElementById("status");
	
	interval = setInterval(function() {

		x = Math.random() * canvas.width;
		y = Math.random() * canvas.height;
		maxSize = 50;
		tmpAlpha = 0;

		i += 1;

		r = Math.floor(Math.random() * 255);
		g = Math.floor(Math.random() * 255);
		b = Math.floor(Math.random() * 255);
		
		alpha = Math.random() * 0.6;
		size = Math.random() * maxSize;

		positions.push({
			x: Math.floor(x),
			y: Math.floor(y),
			r: r,
			g: g,
			b: b,
			alpha: alpha,
			size: size
		});
		
		ctx.fillStyle = "rgb("+ r +","+ g +","+ b +")";
		
		ctx.globalAlpha = 1;

		// fade in ball
		fade = setInterval(function(){

			if (tmpAlpha >= alpha) {
				clearInterval(fade);
			} else {

				tmpAlpha += 0.01;

				ctx.globalAlpha = tmpAlpha;
				ctx.beginPath();
				ctx.arc(x, y, size, 0, Math.PI*2, true);
				ctx.fill();
			}
		}, 50);
		
		status.innerHTML = i;

	}, 200);
}

var clickX, clickY;

function clicky(e) {
	clickX = e.offset().x,
	clickY = e.offset().y;

	console.log(positions.filter(getBubble));
}

function getBubble(e) {
	return (e.x < clickX); // todo: finish
}

function stop() {
	clearInterval(interval);
}

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