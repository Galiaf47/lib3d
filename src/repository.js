import THREE from 'three';

var books = new Map();
var sections = new Map();
var libraries = new Map();

var jsonLoader = new THREE.JSONLoader();
var dataLoader = new THREE.XHRLoader();
dataLoader.setResponseType('json');

export function loadLibraryData(model) {
	var path = `/obj/libraries/${model}`;
    var modelUrl = `${path}/model.json`;
    var mapUrl = `${path}/map.jpg`;

    return Promise.all([
    	loadGeometry(modelUrl),
    	loadImage(mapUrl)
    ]).then(results => ({
    	geometry: results[0],
    	mapImage: results[1]
    }));
}

export function loadSectionData(model) {
	var path = `/obj/sections/${model}`;
    var modelUrl = `${path}/model.js`;
    var mapUrl = `${path}/map.jpg`;
    var dataUrl = `${path}/data.json`;

    return Promise.all([
    	loadGeometry(modelUrl), 
    	loadImage(mapUrl), 
    	loadData(dataUrl)
    ]).then(sectionData => ({
		geometry: sectionData[0],
		mapImage: sectionData[1],
		data: sectionData[2]
    }));
}

export function loadBookData(model) {
	var path = `/obj/books/${model}`;
    var modelUrl = `${path}/model.js`;
    var mapUrl = `${path}/map.jpg`;
    var bumpMapUrl = `${path}/bump_map.jpg`;
    var specularMapUrl = `${path}/specular_map.jpg`;

    return  Promise.all([
    	loadGeometry(modelUrl),
    	loadImage(mapUrl).catch(() => {
    		console.error('repository: Error loading book map:', model);
    		return null;
    	}),
    	loadImage(bumpMapUrl).catch(() => {
    		console.error('repository: Error loading book bumpMap:', model);
    		return null;
    	}),
    	loadImage(specularMapUrl).catch(() => {
    		console.error('repository: Error loading book specularMap:', model);
    		return null;
    	})
    ]).then(results => ({
    	geometry: results[0],
    	mapImage: results[1],
    	bumpMapImage: results[2],
    	specularMapImage: results[3]
    }));
}

export function getBookData(model) {
    return books.get(model);
}

export function getSectionData(model) {
    return sections.get(model);
}

export function getLibraryData(model) {
    return libraries.get(model);
}

export function loadImage(url) {
    var img = new Image();
        
    img.crossOrigin = ''; 
    img.src = url;

    return new Promise((resolve, reject) => {
    	img.onload = function() {
    		resolve(img);
    	};

    	img.onerror = function(err) {
    		reject(err);
    	};
    });
}

export function registerBook(data) {
    books.set(data.name, data);
}

export function registerSection(data) {
    sections.set(data.name, data);
}

export function registerLibrary(data) {
    libraries.set(data.name, data);
}

function loadGeometry(url) {
    return new Promise((resolve, reject) => {
        jsonLoader.load(url, geometry => {
            geometry.computeBoundingBox();
            resolve(geometry);
        }, () => {}, reject);
    });
}

function loadData(url) {
	return new Promise((resolve, reject) => {
		dataLoader.load(url, resolve, () => {}, reject);
	});
}