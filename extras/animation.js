
var interval, positions = {}, canvas, ctx;

window.onload = function() {
	
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	ctx.fillRect(0, 0, canvas.width, canvas.height);

	animation();
	
	canvas.addEventListener("click", stop, false);
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
		
		alpha = Math.random() * 1;
		size = Math.random() * maxSize;

		positions[x,y] = {
			x: x,
			y: y,
			r: r,
			g: g,
			b: b,
			alpha: alpha,
			size: size
		};
		
		ctx.fillStyle = "rgb("+ r +","+ g +","+ b +")";
	
		ctx.globalAlpha = 1;

		fade = setInterval(function(){

			if (tmpAlpha >= 1) {
				clearInterval(fade); 
			} else {

				tmpAlpha += 0.01;

				ctx.globalAlpha = tmpAlpha;

				ctx.beginPath();
				ctx.arc(x, y, size, 0, Math.PI*2, true);

				ctx.fill();
			}

		}, 100);
		
		status.innerHTML = i;

	}, 200);
}

function stop() {
	clearInterval(interval);
}