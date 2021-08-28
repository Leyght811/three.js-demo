import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import rendererCommon from "./gallery";

const closeButton = document.getElementById("modalCloseButton");
let rotationX = 0
let rotationY = 0
let rotationZ = 0
let positionX = 0
let positionY = 0
let positionZ = 0

const showHideModal = (model) => {
  let modalDisplay = document.getElementById("modalBackground");
  if (modalDisplay.style.display == "none") {
    document.getElementById("modalBackground").style.display = "block";
  } else {
    document.getElementById("modalBackground").style.display = "none";
  }

  if (model.id !== null) {
    const modalName = document.getElementById("galleryModalName");
    modalName.innerHTML = model.name

    const loader = new GLTFLoader();
    loader.load(model.url, (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material.map) {
            child.material.map.anisotropy = 8;
          }
        }
      });
      rendererCommon("galleryModalCanvas", gltf.scene);

      requestAnimationFrame(render);

      function render() {
          if(modalDisplay.style.display !== "none"){
            // console.log(mesh)
            gltf.scene.rotation.y += rotationY * 0.01
            gltf.scene.rotation.x += rotationX * 0.01
            gltf.scene.rotation.z += rotationZ * 0.01
            gltf.scene.position.x = positionX * 0.5
            gltf.scene.position.y = positionY * 0.5
            gltf.scene.position.z = positionZ * 0.5
            requestAnimationFrame(render);
          }
      }
    });
  } else {
    var canvas = document.getElementById("galleryModalCanvas");
    canvas.remove();
    var newCanvas = document.createElement("CANVAS");
    newCanvas.id = "galleryModalCanvas";
    newCanvas.className = "modalBox";
    // modalDisplay.appendChild(newCanvas)
    var canvasContainer = document.getElementById("galleryModalCanvasContainer")
    canvasContainer.appendChild(newCanvas)
  }
};

document.getElementById("galleryModalXRotation").oninput = function() {
    rotationX = this.value
}

document.getElementById("galleryModalYRotation").oninput = function() {
    rotationY = this.value
}

document.getElementById("galleryModalZRotation").oninput = function() {
    rotationZ = this.value
}

document.getElementById("galleryModalXPosition").oninput = function() {
    positionX = this.value
}

document.getElementById("galleryModalYPosition").oninput = function() {
    positionY = this.value
}

document.getElementById("galleryModalZPosition").oninput = function() {
    positionZ = this.value
}

closeButton.addEventListener("click", () => {
  showHideModal({ id: null, name: null, url: null });
});


export default showHideModal;
