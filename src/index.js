import THREE from 'three';

import camera from './camera';
import environment from './environment';

export {locator} from './locator';
export {mouse} from './mouse';
export {preview} from './preview';
export {selector} from './selector';
export {navigation} from './navigation';

export {default as ShelfObject} from './models/ShelfObject';
export {default as BookObject} from './models/BookObject';
export {default as SectionObject} from './models/SectionObject';
export {default as SelectorMeta} from './models/SelectorMeta';
export {default as SelectorMetaDto} from './models/SelectorMetaDto';

var loops = [];
export var renderer;

export function init(width, height, canvas) {
	renderer = new THREE.WebGLRenderer({canvas: canvas || undefined, antialias: true});
	renderer.setSize(width, height);

	environment.scene = new THREE.Scene();
	environment.scene.fog = new THREE.Fog(0x000000, 4, 7);

	startRenderLoop();
}

export function addLoop(func) {
	loops.push(func);
}

//TODO: replace by export environment.loadLibrary as load
export function load(dto) {
	return environment.loadLibrary(dto);
}

function startRenderLoop() {
	requestAnimationFrame(startRenderLoop);

	loops.forEach(func => func());
	
	renderer.render(environment.scene, camera.camera);
}

export {
	camera,
	environment
};

console.log('*');