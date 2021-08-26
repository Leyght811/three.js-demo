import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import avocadoURL from "../../scene/Avocado/Avocado.gltf";
import barramundiFishURL from "../../scene/BarramundiFish/BarramundiFish.gltf";
import corsetURL from "../../scene/Corset/Corset.gltf";
import damagedHelmetURL from "../../scene/DamagedHelmet/DamagedHelmet.gltf";
import dragonURL from "../../scene/Dragon/Dragon.gltf";
import duckURL from "../../scene/Duck/Duck.gltf";
import queenUrl from "../../scene/Queen/Queen.gltf";
import foxURL from "../../scene/Fox/Fox.gltf";
import waterBottleURL from "../../scene/WaterBottle/WaterBottle.gltf";

//Creates an array of objects with the url for each gltf object
const models = [
  { id: 0, name: "Avocado", url: avocadoURL },
  { id: 1, name: "Barramundi Fish", url: barramundiFishURL },
  { id: 2, name: "Corset", url: corsetURL },
  { id: 3, name: "Damaged Helmet", url: damagedHelmetURL },
  { id: 4, name: "Dragon", url: dragonURL },
  { id: 5, name: "Duck", url: duckURL },
  { id: 6, name: "Queen", url: queenUrl },
  { id: 7, name: "Fox", url: foxURL },
  { id: 8, name: "Water Bottle", url: waterBottleURL },
];

// Creates a row in the container for every 5 models
const rowCount = Math.ceil(models.length / 5);

const galleryContainer = document.getElementById("myGalleryContainer");

for (let i = 0; i < rowCount; i++) {
  let node = document.createElement("DIV");
  node.className = "row";
  node.id = "row" + i;
  galleryContainer.appendChild(node);
}

//Adds columns
let colCount = 0;
let rowInsert = 0;

for (let i = 0; i < models.length; i++) {
  if (colCount === 5) {
    rowInsert += 1;
    colCount = 0;
  }
  let row = document.getElementById("row" + rowInsert);
  let col = document.createElement("DIV");
  let node = document.createElement("CANVAS");
  col.className = "col";
  col.id = "col" + i;
  node.id = "galleryCanvas" + i;
  node.className = "galleryCanvas";
  col.appendChild(node);
  row.appendChild(col);
  rendererCommon(node.id, models[i].url);

  colCount += 1;
}

function rendererCommon(canvas, gltfUrl) {
  var canvasObj = document.getElementById(canvas);
  var renderer = new THREE.WebGLRenderer({
      canvas: canvasObj,
      antialias: true,
    }),
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 3000),
    scene = new THREE.Scene(),
    light = new THREE.AmbientLight(0xffffff, 0.5), // will light the dark sides of the object;
    light1 = new THREE.PointLight(0xffffff, 0.5); //will light the front of the object
  var model;
  const loader = new GLTFLoader();

  loader.load(gltfUrl, (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material.map) {
          child.material.map.anisotropy = 8;
        }
      }
    });

    model = gltf.scene;
    // console.log(model)
    renderer.setClearColor(0x262f40);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(canvasObj.width, canvasObj.height);
    //WINDOW RESIZE FUNCTION

    window.addEventListener("resize", onWindowResize);

    function onWindowResize() {
      // camera.aspect = (window.innerWidth * 0.4) / (window.innerHeight * 0.4);

      camera.updateProjectionMatrix();
      // renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4);
      // renderer.setSize(canvasObj.innerWidth, canvasObj.innerHeight);
    }

    scene.add(light);
    scene.add(light1);
    scene.add(model);
    camera.position.z = 5;

    //ANIMATION
    requestAnimationFrame(render);

    function render() {
      // console.log(scene.model)
      // model.rotation.x += 0.1;
      // model.rotation.y += 0.1;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
  });
}
