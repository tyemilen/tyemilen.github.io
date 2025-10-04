const random = (min, max) => Math.random() * (max - min) + min;

const MIN_ROTATION_SPEED = 0.5;
const MAX_ROTATION_SPEED = 0.8;

const onBeforeCompile = (shader, color) => {
	shader.fragmentShader = shader.fragmentShader.replace(
		"#include <alphatest_fragment>",
		`if ( diffuseColor.a < 0.9 ) diffuseColor = vec4(vec3(${color}), 1.0);`)
};

function renderImage(canvas, texturePath, rotationSpeed, aColor = '0,0,0') {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true
	});
	renderer.setSize(canvas.width, canvas.height, true);
	renderer.outputEncoding = THREE.sRGBEncoding;

	camera.position.set(0, 0, 6);

	const texture = new THREE.TextureLoader().load(texturePath);
	const backTexture = new THREE.TextureLoader().load(texturePath);
	backTexture.flipY = false;

	const geometry = new THREE.CylinderGeometry(3, 3, 0.2, 100);

	const cylinder = new THREE.Mesh(geometry, [
		new THREE.MeshStandardMaterial(),
		new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.5, onBeforeCompile: shader => onBeforeCompile(shader, aColor) }),
		new THREE.MeshStandardMaterial({ map: backTexture, alphaTest: 0.5, onBeforeCompile: shader => onBeforeCompile(shader, aColor) }),
	]);
	cylinder.castShadow = true;
	scene.add(cylinder);

	const light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 2, 2);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	scene.add(light);

	cylinder.rotation.x = Math.PI / 2;
	cylinder.rotation.y = Math.PI / 2;

	let breathState = true;
	function animate() {
		requestAnimationFrame(animate);

		cylinder.rotateX(THREE.Math.degToRad(rotationSpeed));

		if (cylinder.scale.y < 1.3 && !breathState) {
			cylinder.scale.y += .001;
			if (cylinder.scale.y >= 1.3) breathState = true;

		} else {
			cylinder.scale.y -= .001;

			if (cylinder.scale.y <= 1) breathState = false;
		}

		renderer.render(scene, camera);
	}
	renderer.render(scene, camera);

	animate();

	window.addEventListener('resize', () => {
		camera.updateProjectionMatrix();
		renderer.setSize(canvas.width, canvas.height);
	});
}

renderImage(document.getElementById('github'), './assets/github.png', random(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED));
renderImage(document.getElementById('twt'), './assets/twt.png', -random(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED));

const titlebars = document.getElementsByClassName('window__titlebar');

let zIndexCounter = 0;

for (const titlebar of titlebars) {
	const window = titlebar.parentElement;
	let rect = window.getBoundingClientRect();

	const beginDragging = (ev) => {
		rect = window.getBoundingClientRect();
		titlebar.dragging = true;
		window.offsetX = ev.clientX || ev.touches[0].clientX;
		window.offsetY = ev.clientY || ev.touches[0].clientY;

		zIndexCounter += 1;
		window.style.zIndex = zIndexCounter
	}

	const handleDragging = (ev) => {
		if (!titlebar.dragging) return;
		let x = ((ev.clientX || ev.touches[0].clientX) - window.offsetX) + rect.x;
		let y = ((ev.clientY || ev.touches[0].clientY) - window.offsetY) + rect.y;

		window.style.left = `${x}px`;
		window.style.top = `${y}px`;
	}
	
	const stopDragging = () => {
		titlebar.dragging = false;
	}

	titlebar.addEventListener('mousedown', (ev) => beginDragging(ev));
	document.addEventListener('mousemove', (ev) => handleDragging(ev));
	document.addEventListener('mouseup', () => stopDragging());

	titlebar.addEventListener('touchstart', (ev) => beginDragging(ev));
	document.addEventListener('touchmove', (ev) => handleDragging(ev));
	document.addEventListener('touchend', (ev) => stopDragging());
}

;(async() => {
	const { track } = await fetch('https://lastfm-last-played.biancarosa.com.br/tyemil/latest-song').then(r => r.json());

	console.log(track);
	console.log(track['@attr']);
	if (track['@attr']?.nowplaying == 'true') {
		document.getElementById('track-cover').src = track.image[1]['#text'];
		document.getElementById('track').innerText = `${track.artist['#text']} - ${track.name}`;
	}
})();