import THREE from 'three';

import LibraryData from 'data/models/LibraryData';
import * as repository from 'repository';

import model from './model.json';

import map from './map.png';
import img from './img.jpg';

var params = {
    name: 'default',
    isDataURLs: true,
    model: model,
    images: {
        map: map,
        img: img
    }
};

var materials = [
    new THREE.MeshPhongMaterial({
        shininess: 0
    })
];

var textures = [
    {map: 'map'}
];

var lights = [
    new THREE.AmbientLight(0x666666),
    new THREE.PointLight(0x888888, 1.3, 10)
];
lights[1].position.set(0, 2, 0);

function register() {
    var libraryData = new LibraryData(params, materials, textures, lights);
    repository.registerLibrary(libraryData);
}

export default {
    register
};