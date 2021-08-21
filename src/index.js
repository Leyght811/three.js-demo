import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

// Import our glTF model.
import gltfUrl from "../scene/Dungeon/DungeonPieces.gltf";

// Import our GUI
import * as dat from 'dat.gui'

//debug
const gui = new dat.GUI()

// Create the renderer and scene, which will consist of one light and the main camera.
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
const scene = new THREE.Scene();

//Creates the velocity and movement that the camera will follow
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

const objects = []

// Creates camera, this will be added to PointerLockControls so that it follows the mouse pointer rather than being added directly to the scene
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.clientWidth / canvas.clientHeight,
  1,
  1000
);
camera.position.set(83, 15, -300);
camera.rotateY(3.3)
// console.log(camera.rotation)

//PointerLockControls causes camera to follow mouse pointer
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// gui.add(controls.getObject().rotation, 'y').min(0).max(3.3)


document.addEventListener("click", function () {
  controls.lock();
});

//Adds lighting to scene
const light = new THREE.AmbientLight();
scene.add(light);

// Load the glTF model and add it to the scene.
var model;
const loader = new GLTFLoader();
loader.load(gltfUrl, (gltf) => {
  model = gltf.scene.children[1];
  model.scale.set(10,10,10)
  // model.position.y -= model.clientHeight
  scene.add(model);
});

// gui.add(controls.getObject().position, 'x')
// gui.add(controls.getObject().position, 'y')
// gui.add(controls.getObject().position, 'z')

// Instruct the engine to resize when the window does.
window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

document.addEventListener("keypress", onDocumentKeyDown);
document.addEventListener("keyup", onDocumentKeyUp);

function onDocumentKeyDown(event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = true;
      break;

    case "ArrowLeft":
    case "KeyA":
      moveLeft = true;
      break;

    case "ArrowDown":
    case "KeyS":
      moveBackward = true;
      break;

    case "ArrowRight":
    case "KeyD":
      moveRight = true;
      break;

    case "Space":
    case "KeyQ":
      moveUp = true;
      break;

    case "Shift":
    case "KeyE":
      moveDown = true;
      break;
  }
}

function onDocumentKeyUp(event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = false;
      break;

    case "ArrowLeft":
    case "KeyA":
      moveLeft = false;
      break;

    case "ArrowDown":
    case "KeyS":
      moveBackward = false;
      break;

    case "ArrowRight":
    case "KeyD":
      moveRight = false;
      break;

    case "Space":
    case "KeyQ":
      moveUp = false;
      break;

    case "Shift":
    case "KeyE":
      moveDown = false;
      break;
  }
}

//Floor

let raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

// // floor

// let floorGeometry = new PlaneGeometry(2000, 2000, 100, 100);
// floorGeometry.rotateX(-Math.PI / 2);

// // vertex displacement

// let position = floorGeometry.attributes.position;

// for (let i = 0, l = position.count; i < l; i++) {
//   vertex.fromBufferAttribute(position, i);

//   vertex.x += Math.random() * 20 - 10;
//   vertex.y += Math.random() * 2;
//   vertex.z += Math.random() * 20 - 10;

//   position.setXYZ(i, vertex.x, vertex.y, vertex.z);
// }

// floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

// position = floorGeometry.attributes.position;
// const colorsFloor = [];

// for (let i = 0, l = position.count; i < l; i++) {
//   color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
//   colorsFloor.push(color.r, color.g, color.b);
// }

// floorGeometry.setAttribute("color", new Float32BufferAttribute(colorsFloor, 3));

// const floorMaterial = new MeshBasicMaterial({ vertexColors: true });

// const floor = new Mesh(floorGeometry, floorMaterial);
// scene.add(floor);


const clock = new THREE.Clock();

// Start the engine's main render loop.
const animate = () => {
  requestAnimationFrame(animate);
  // console.log(controls.getObject().position.y)
  const time = performance.now();

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects);

    const onObject = intersections.length > 0;
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    // direction.y = Number(moveUp) - Number(moveDown);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 800.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 800.0 * delta;
    if (moveUp) controls.getObject().position.y += 2
    if (moveDown) controls.getObject().position.y -= 2

    // if (moveUp || moveDown) velocity.y -= direction.y * 400.0 * delta;

    // if ( onObject === true ) {

    //   velocity.y = Math.max( 0, velocity.y );

    // }
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    // controls.getObject().position.y += (-velocity.y * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;
    }
    if (controls.getObject().position.y > 30) {
      velocity.y = 0;
      controls.getObject().position.y = 30
    }
  }
  prevTime = time;
  renderer.render(scene, camera);
};

animate();
