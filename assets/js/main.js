const thingsData = [
	{ img: 'gleb.svg', title: 'Thing', desc: 'nothingburger' },
	{ img: 'ika.svg', title: 'Thing', desc: 'awesome sauce' },
	{ img: 'bieberite.png', title: 'Thing', desc: 'nothingburger' },
];

function renderThings() {
	const container = document.getElementById('things');
	if (!container) return;

	container.innerHTML = thingsData
		.map((t) => {
			return `
							<div class="thing">
							<div class="thing-logo">
								<img src="assets/things/${t.img}" />
							</div>
							<div class="thing-description">
								<p>${t.title}</p>
								<p>${t.desc}</p>
							</div>
						</div>
      					`;
		})
		.join('');
}

function createPetal(container) {
	const petal = document.createElement('div');
	const size = Math.random() * 15;

	Object.assign(petal.style, {
		position: 'absolute',
		top: '-50px',
		left: `${Math.random() * 100}vw`,
		width: `${size}px`,
		height: `${size * 1.2}px`,
		backgroundColor: '#004e78',
		borderRadius: '50% 0 50% 50%',
		opacity: Math.random() * 0.4 + 0.6,
		animation: `fall ${Math.random() * 5 + 5}s linear ${Math.random() * 5}s infinite`,
	});

	container.appendChild(petal);
}

function initPetals() {
	const container = document.getElementById('fella');
	if (!container) return;

	for (let i = 0; i < 50; i++) {
		createPetal(container);
	}
}

async function loadTrack() {
	const res = await fetch('https://lastfm-last-played.biancarosa.com.br/tyemil/latest-song');
	const { track } = await res.json();

	const cover = document.getElementById('track-cover');
	const text = document.getElementById('track');

	if (cover) cover.src = track.image[1]['#text'];
	if (text) text.textContent = `${track.artist['#text']} - ${track.name}`;
}

document.addEventListener('DOMContentLoaded', () => {
	renderThings();
	initPetals();
	loadTrack();
});

const sign = document.getElementById('sign');
const routes = [
	{ name: 'INDEX', path: '/' },
	{ name: 'CONTACT', path: '/contact' },
	{ name: 'MUSIC', path: 'https://soundcloud.com/nomental' },
];
routes.forEach((route) => {
	const oldtarget = sign.querySelector(`#ROUTE_${route.name}_1`);
	const target = sign.querySelector(`#ROUTE_${route.name}_2`);
	const trigger = sign.querySelector(`#ROUTE_${route.name}_RECT`);
	if (target && trigger) {
		target.style.display = 'none';
		trigger.addEventListener('click', async (event) => {
			event.stopPropagation();
			window.location.href = route.path;
		});
		trigger.addEventListener('mouseenter', () => {
			oldtarget.style.display = 'none';
			target.style.display = 'block';
		});
		trigger.addEventListener('mouseleave', () => {
			target.style.display = 'none';
			oldtarget.style.display = 'block';
		});
	}
});
