import THREE from 'three';
import * as repository from 'repository';

var jsonLoader = new THREE.JSONLoader();

export default class ModelData {
	constructor(data) {
		this._data = data;
		this._isLoaded = false;

		this.geometry = jsonLoader.parse(data.model).geometry;
	}

	get name() {
		return this._data.name;
	}

	get geometry() {
		return this._geometry;
	}

	set geometry(geometry) {
		geometry.computeBoundingBox();
		this._geometry = geometry;
	}

	get asyncData() {
		return this._isLoaded ?
			Promise.resolve(this._loadedData) :
			this.loadData().then(() => this._loadedData);
	}

	loadData() {
		//TODO: avoid multiple save
		var load = [];

		for (var key in this._loadedData) {
			load.push(this.loadImage(key));
		}

		return Promise.all(load)
			.then(results => {
				results.forEach(obj => {
					this._loadedData[obj.key] = obj.image;
				});
				
				this._isLoaded = true;
			});
	}

	loadImage(key) {
		var url = this._data[key];

		return repository.loadImage(url)
			.then(image => ({image, key}));
	}
}