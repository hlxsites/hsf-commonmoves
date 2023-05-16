/* global google */

import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

function getCenter(coords) {
  // Find bounding box
  const minX = coords.reduce((x1, x2) => Math.min(x1, x2[0]), 10000);
  const maxX = coords.reduce((x1, x2) => Math.max(x1, x2[0]), -10000);
  const minY = coords.reduce((y1, y2) => Math.min(y1, y2[1]), 10000);
  const maxY = coords.reduce((y1, y2) => Math.max(y1, y2[1]), -10000);
  // Return center of bounding box
  return [(maxX + minX) / 2, (maxY + minY) / 2];
}

function convertCoordinates(coords) {
  return coords.map((c) => ({
    lng: parseFloat(c[0]),
    lat: parseFloat(c[1]),
  }));
}

function initLiveByMap() {
  const mapDiv = document.querySelector('.liveby-map-main');
  const coordinates = window.liveby.geometry.coordinates[0];
  const mapCenter = getCenter(coordinates);
  const map = new google.maps.Map(mapDiv, {
    zoom: 12,
    maxZoom: 18,
    center: {
      lng: parseFloat(mapCenter[0]),
      lat: parseFloat(mapCenter[1]),
    },
    mapTypeId: 'roadmap',
    clickableIcons: true,
    gestureHandling: 'greedy',
    visualRefresh: true,
    disableDefaultUI: false,
  });

  const polyOptions = {
    map,
    strokeColor: '#BA9BB2',
    strokeWeight: 2,
    fillColor: '#BA9BB2',
    fillOpacity: 0.3,
    clickable: false,
    zIndex: 1,
    path: convertCoordinates(coordinates),
    editable: false,
  };

  // eslint-disable-next-line no-unused-vars
  const poly = new google.maps.Polygon(polyOptions);
}

function loadJS(src) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.innerHTML = `
    (()=>{
      let script = document.createElement('script');
      script.src = '${src}';
      document.head.append(script);
    })();
  `;
  document.head.append(script);
}

async function initGoogleMapsAPI() {
  const placeholders = await fetchPlaceholders();
  const CALLBACK_FN = 'initLiveByMap';
  window[CALLBACK_FN] = initLiveByMap;
  const { mapsApiKey } = placeholders;
  const src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=maps&callback=${CALLBACK_FN}`;
  loadJS(src);
}

initGoogleMapsAPI();
