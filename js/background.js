const canvas = document.getElementById('stars');

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const ctx = canvas.getContext('2d');

const stars = [];
const numStars = 100;
const speed = 0.4;

const makeStar = () => ({
	x: Math.random(),
	y: Math.random(),
	distance: Math.sqrt(Math.random()),
	color: `hsl(${Math.random() * 20}, 0%, ${(Math.random() * 100)}%, 40%)`
});

for (i = 0; i < numStars; i++) {
	stars[i] = makeStar();
}

function updateStars() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (i = 0; i < numStars; i++) {
		stars[i].y -= Math.pow(stars[i].distance, 2) / canvas.height * speed;
		stars[i].x -= Math.pow(stars[i].distance, 2) / canvas.width * speed;
		

		if (stars[i].x <= 0) {
			stars[i] = makeStar();
			stars[i].x = 1;
		}
		
		if (stars[i].y <= 0) {
			stars[i] = makeStar();
			stars[i].y = 1;
		}

		ctx.beginPath();
		ctx.arc(stars[i].x * canvas.width, stars[i].y * canvas.height, stars[i].distance * 2.5, 0, 2 * Math.PI, false);
		ctx.fillStyle = stars[i].color;
		ctx.fill();
	}
}

const resizeObserver = new ResizeObserver(entries => {
	console.log('ee')
	for (const entry of entries) {
		const main = entry.target;

		canvas.width = main.clientWidth;
		canvas.height = main.clientHeight;
	
		updateStars();
	}
});

resizeObserver.observe(document.getElementsByTagName('main')[0]);

setInterval(function () {
	updateStars();
}, 30);