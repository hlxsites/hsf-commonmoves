/* global google */
/* global markerClusterer */

import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

// import { MarkerClusterer } from "@googlemaps/markerclusterer";

/* Unused but working
function getCenter(coords) {
  // Find bounding box
  const minX = coords.reduce((x1, x2) => Math.min(x1, x2[0]), 10000);
  const maxX = coords.reduce((x1, x2) => Math.max(x1, x2[0]), -10000);
  const minY = coords.reduce((y1, y2) => Math.min(y1, y2[1]), 10000);
  const maxY = coords.reduce((y1, y2) => Math.max(y1, y2[1]), -10000);
  // Return center of bounding box
  return [(maxX + minX) / 2, (maxY + minY) / 2];
}
*/
const locations = [
  {
    label: '924',
    position: { lat: 41.410587310791016, lng: -96.08919906616211 },
  },
  {
    label: '69',
    position: { lat: 41.42308235168457, lng: -96.71240615844727 },
  },
];

function convertCoordinates(c) {
  return {
    lng: parseFloat(c[0]),
    lat: parseFloat(c[1]),
  };
}

function convertCoordinatesArray(coords) {
  return coords.map(convertCoordinates);
}

async function initMap() {
  const Nr = [{
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#444444',
    }],
  }, {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{
      saturation: '-42',
    }, {
      lightness: '-53',
    }, {
      gamma: '2.98',
    }],
  }, {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [{
      saturation: '1',
    }, {
      lightness: '31',
    }, {
      weight: '1',
    }],
  }, {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.stroke',
    stylers: [{
      visibility: 'off',
    }],
  }, {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{
      lightness: '12',
    }],
  }, {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [{
      saturation: '67',
    }],
  }, {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [{
      visibility: 'on',
    }, {
      color: '#ececec',
    }],
  }, {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [{
      visibility: 'on',
    }],
  }, {
    featureType: 'landscape.natural.landcover',
    elementType: 'geometry.fill',
    stylers: [{
      visibility: 'on',
    }, {
      color: '#ffffff',
    }, {
      saturation: '-2',
    }, {
      gamma: '7.94',
    }],
  }, {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [{
      visibility: 'on',
    }, {
      saturation: '94',
    }, {
      lightness: '-30',
    }, {
      gamma: '8.59',
    }, {
      weight: '5.38',
    }],
  }, {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }],
  }, {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      saturation: '-26',
    }, {
      lightness: '20',
    }, {
      weight: '1',
    }, {
      gamma: '1',
    }],
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{
      visibility: 'on',
    }],
  }, {
    featureType: 'road',
    elementType: 'all',
    stylers: [{
      saturation: -100,
    }, {
      lightness: 45,
    }],
  }, {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{
      visibility: 'on',
    }, {
      color: '#fafafa',
    }],
  }, {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      visibility: 'off',
    }],
  }, {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{
      gamma: '0.95',
    }, {
      lightness: '3',
    }],
  }, {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [{
      visibility: 'off',
    }],
  }, {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [{
      visibility: 'simplified',
    }],
  }, {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      lightness: '100',
    }, {
      gamma: '5.22',
    }],
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      visibility: 'on',
    }],
  }, {
    featureType: 'road.arterial',
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off',
    }],
  }, {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }],
  }, {
    featureType: 'water',
    elementType: 'all',
    stylers: [{
      color: '#b3dced',
    }, {
      visibility: 'on',
    }],
  }, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      visibility: 'on',
    }, {
      color: '#ffffff',
    }],
  }, {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{
      visibility: 'off',
    }, {
      color: '#e6e6e6',
    }],
  }];

  const mapDiv = document.querySelector('.property-result-map');
  const { Map } = await google.maps.importLibrary('maps');
  const map = new Map(mapDiv, {
    zoom: 10,
    maxZoom: 18,
    center: new google.maps.LatLng(41.24216, -96.20799),
    mapTypeId: 'roadmap',
    clickableIcons: false,
    gestureHandling: 'greedy',
    styles: Nr,
    visualRefresh: true,
    disableDefaultUI: true,
  });
    // add info about listing clusters
  const infoWindow = new google.maps.InfoWindow({
    content: '',
    disableAutoPan: true,
  });
    // Create an array of alphabetical characters used to label the markers.
    // Add some markers to the map.
  const markers = locations.map((obj, i) => {
    const { position } = obj;
    const { label } = obj;
    const marker = new google.maps.Marker({
      position,
      label,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener('click', () => {
      infoWindow.setContent(label);
      infoWindow.open(map, marker);
    });
    return marker;
  });

  // Add a marker clusterer to manage the markers.
  // new markerClusterer.MarkerClusterer({ markers, map });
}

//     google.maps.Map.prototype.panToWithOffset = function(d, h, k) {
//         var n = this
//             , m = new google.maps.OverlayView;
//         m.onAdd = function() {
//             var m = this.getProjection()
//                 , p = m.fromLatLngToContainerPixel(d);
//             p.x += h;
//             p.y += k;
//             n.panTo(m.fromContainerPixelToLatLng(p))
//         }
//         ;
//         m.draw = function() {}
//         ;
//         m.setMap(this)
//     };
//     mapDiv.style.display = "block";
//     // map.addListener("dragend", function() {
//     //     k(".gm-style-iw").prev("div").remove();
//     //     k(".gm-style-iw").parent().addClass("gm-style-parent")
//     // });
//     // map.addListener("dragstart", function() {
//     //     k(".gm-style-iw").prev("div").remove();
//     //     k(".gm-style-iw").parent().addClass("gm-style-parent")
//     // });
//     // map.addListener("zoom_changed", function() {
//     //     k(".gm-style-iw").prev("div").remove();
//     //     k(".gm-style-iw").parent().addClass("gm-style-parent");
//     //     sn()
//     // });
//     // const polyOptions = {
//     //     map,
//     //     strokeColor: '#BA9BB2',
//     //     strokeWeight: 2,
//     //     fillColor: '#BA9BB2',
//     //     fillOpacity: 0.3,
//     //     clickable: false,
//     //     zIndex: 1,
//     //     path: convertCoordinatesArray(coordinates),
//     //     editable: false,
//     // };
//     //
//     // // eslint-disable-next-line no-unused-vars
//     // const poly = new google.maps.Polygon(polyOptions);
// }
//
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
  const CALLBACK_FN = 'initMap';
  window[CALLBACK_FN] = initMap;
  // const { mapsApiKey } = placeholders;
  const mapsApiKey = 'AIzaSyCypwVwVpDMRUGiacGCQmPuvmVmmyOYRJs';
  const clusterSrc = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
  loadJS(clusterSrc);
  const src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places&callback=${CALLBACK_FN}`;
  loadJS(src);
}

initGoogleMapsAPI();
