import Search from '../Search.js';

export default class BoxSearch extends Search {
  #minLat;

  #maxLat;

  #minLong;

  #maxLong;

  constructor() {
    super();
    this.type = 'Box';
    Object.defineProperties(this, {
      minLat: {
        enumerable: true,
        set: (value) => {
          this.#minLat = `${parseFloat(`${value}`).toFixed(7)}`;
        },
        get: () => this.#minLat,
      },
      maxLat: {
        enumerable: true,
        set: (value) => {
          this.#maxLat = `${parseFloat(`${value}`).toFixed(7)}`;
        },
        get: () => this.#maxLat,
      },
      minLong: {
        enumerable: true,
        set: (value) => {
          this.#minLong = `${parseFloat(`${value}`).toFixed(7)}`;
        },
        get: () => this.#minLong,
      },
      maxLong: {
        enumerable: true,
        set: (value) => {
          this.#maxLong = `${parseFloat(`${value}`).toFixed(7)}`;
        },
        get: () => this.#maxLong,
      },
    });
  }

  asCregURLSearchParameters() {
    const params = super.asCregURLSearchParameters();
    params.set('SearchType', 'Map');
    const obj = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [this.minLong, this.minLat], // Bottom left
            [this.minLong, this.maxLat], // Top left
            [this.maxLong, this.maxLat], // Top right
            [this.maxLong, this.minLat], // Bottom right
            [this.minLong, this.minLat], // Close the box
          ]],
        },
      }],
    };
    params.set('SearchParameter', JSON.stringify(obj));
    return params;
  }

  populateFromConfig(entries) {
    super.populateFromConfig(entries);
    let entry = entries.find(([k]) => k.includes('min') && k.includes('lat'));
    if (entry) [, this.minLat] = entry;
    entry = entries.find(([k]) => k.includes('max') && k.includes('lat'));
    if (entry) [, this.maxLat] = entry;
    entry = entries.find(([k]) => k.includes('min') && k.includes('lon'));
    if (entry) [, this.minLong] = entry;
    entry = entries.find(([k]) => k.includes('max') && k.includes('lon'));
    if (entry) [, this.maxLong] = entry;
  }
}
