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

	console.log(backTexture)

	const geometry = new THREE.CylinderGeometry(2, 2, 0.2, 100);

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