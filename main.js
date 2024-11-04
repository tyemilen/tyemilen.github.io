const random = (min, max) => Math.random() * (max - min) + min;

const MIN_ROTATION_SPEED = 0.5;
const MAX_ROTATION_SPEED = 0.8;

function renderImage(canvas, texturePath, rotationSpeed) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });
    renderer.setSize(canvas.width, canvas.height, true);
    renderer.outputEncoding = THREE.sRGBEncoding;
    camera.position.set(0, 0, 0);

    const texture = new THREE.TextureLoader().load(texturePath);
    const geometry = new THREE.BoxGeometry(3, 4, .1);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 2, 2);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    scene.add(light);

    camera.position.z = 4.5;

    let breathState = true;
    function animate() {
        requestAnimationFrame(animate);

        cube.rotateY(THREE.Math.degToRad(rotationSpeed));
        
        if (cube.scale.y < 1.3 && !breathState) {
            cube.scale.y += .001;
            if (cube.scale.y >= 1.3) breathState = true;

        } else {
            cube.scale.y -= .001;

            if (cube.scale.y <= 1) breathState = false;            
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.width, canvas.height);
    });
}

renderImage(document.getElementById('cat'), './assets/cat.jpg', random(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED));
renderImage(document.getElementById('cat2'), './assets/cat2.jpg', -random(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED));
renderImage(document.getElementById('cat3'), './assets/cat3.jpg', random(MIN_ROTATION_SPEED, MAX_ROTATION_SPEED));

document.addEventListener('DOMContentLoaded', () => {
    const originalTitle = document.title;
    const letters = originalTitle.split('');

    let index = 1;

    document.title = letters[0];
    function updateTitle() {
        document.title += letters[index] == ' ' ? letters[index] + ' ' : letters[index];
        
        if (index >= letters.length) {
            index = 1;
            document.title = letters[0];
        } else {
            ++index;
        }
    }

    intervalId = setInterval(updateTitle, 300);
});