/* global google */
/* global markerClusterer */

import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

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

let rd = [];
let lg = [];
let uf = [];
let Zd = !1;
let Bj = [];
let Cj = [];
let map;
let hi = !1;
let Hh = [];
const bA = function (d, h, k, m) {
  d.forEach((d) => {
    h.push(d);
    d = new Yd(d);
    d.setMap(m);
    k.push(d);
  });
};



function Yd(a) {
  this.baseMarker = a;
  const c = a.getPosition().lat();
  const f = a.getPosition().lng();
  this.lat = c;
  this.lng = f;
  this.pos = new google.maps.LatLng(c, f);
  this.icon = a.icon;
  this.propId = a.propId;
}

function Pt() {
  Yd.prototype = new google.maps.OverlayView();
  Yd.prototype.onRemove = function () {};
  Yd.prototype.onAdd = function () {
    const a = document.createElement('DIV');
    a.style.position = 'absolute';
    a.className = 'RevealMarker';
    const c = this.icon.scaledSize.height;
    const f = this.icon.scaledSize.width;
    let d = '50%';
    let h = '50%';
    this.baseMarker.icon.labelOrigin && (h = `${this.baseMarker.icon.labelOrigin.x}px`,
        d = `${this.baseMarker.icon.labelOrigin.y}px`);
    a.innerHTML = `\x3cdiv class\x3d"reveal-marker"\x3e\x3cimg src\x3d"${this.icon.url.replace('map-marker', 'map-reveal-marker')}" style\x3d"width:${f}px;height:${c}px" alt\x3d"Marker image"\x3e\x3cspan class\x3d"reveal-marker__text" style\x3d"top:${d};left: ${h}"\x3e${this.baseMarker.label.text}\x3c/span\x3e\x3c/div\x3e`;
    a.style.visibility = 'hidden';
    this.getPanes().floatPane.appendChild(a);
    this.div = a;
  };
  Yd.prototype.draw = function () {
    this.getProjection();
    const a = this.icon.scaledSize.width;
    this.div.style.top = `${-1 * this.icon.scaledSize.height}px`;
    this.div.style.left = `${-1 * Math.round(a / 2)}px`;
  };
  Yd.prototype.hide = function () {
    this.div && (this.div.style.visibility = 'hidden');
  };
  Yd.prototype.show = function () {
    this.div && (this.div.style.visibility = 'visible');
  };
  Yd.prototype.getPosition = function () {
    return this.baseMarker.getPosition();
  };
}

function bu() {
  for (let a = 0; a < rd.length; a++) {
    rd[a].setMap(null);
    rd[a] = null;
  }
  rd = [];
  lg.forEach((a) => {
    a.clearMarkers();
  });
  lg = [];
}

function Jd() {
  uf.forEach((a) => {
    const c = a.anchor;
    c && c.setOptions({
      zIndex: c.bhhsInitialZIndex,
    });
    a.close();
  });
  uf = [];
  Zd = !0;
  document.querySelector('.mobile-info-window').classList.remove('is-active');
  document.querySelector('.mobile-cluster-info-window').innerHTML = null;
}
function sn() {
  if (Bj.length > 0) for (var a = 0; a < Bj.length; a++) Bj[a].close();
  if (Cj.length > 0) for (a = 0; a < Cj.length; a++) Cj[a].close();
  document.querySelector('.mobile-cluster-info-window').style.display = 'none';
  document.querySelector('.mobile-info-window').classList.remove('is-active');

}

function cu(a) {
  let c = new google.maps.LatLngBounds;
  a.forEach(function(a) {
    c.extend(a.getPosition())
  });
  0 < a.length && (map.setCenter(c.getCenter()),
      map.fitBounds(c))
}

function Zt(a) {
  a.addListener('click', () => {
    Jd();
  });
}

function vj(a, c) {
  let f = '/icons/maps/map-marker-standard.png';
  let d = 50;
  let h = 25;
  if (c === 'cluster') {
    f = '/icons/maps/map-clusterer-blue.png';
    h = d = 30;
  }
  return function (q) {
    let m = q.labelText;
    let p = void 0 === m ? '' : m;
    m = q.groupCount;
    const k = q.listingKey;
    q = new google.maps.LatLng(q.latitude, q.longitude);
    let n = 0;
    c === 'cluster' && (n = Math.round(2 * Math.log10(m)) / 2 * 6);
    n = {
      url: f,
      scaledSize: new google.maps.Size(d + n, h + n),
    };
    p = new google.maps.Marker({
      position: q,
      icon: n,
      map: a,
      anchor: new google.maps.Point(0, 0),
      label: {
        fontFamily: 'var(--font-family-proxima)',
        fontWeight: 'var(--font-weight-semibold:)',
        fontSize: '12px',
        text: p || '',
        color: 'var(--white)',
        labelAnchor: new google.maps.Point(30, 0),
      },
      labelClass: 'no-class',
      width: 50,
      height: 50,
    });
    p.groupCount = m;
    p.listingKey = k;
    return p;
  };
}

function Qt() {
  const a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
  const c = vj(arguments[1], 'cluster');
  const f = [];
  a.forEach((a, h) => {
    const d = a.count;
    h = a.neLat;
    const m = a.neLon;
    const p = a.swLat;
    const k = a.swLon;
    a = c({
      latitude: a.centerLat,
      longitude: a.centerLon,
      labelText: `${d}`,
      visible: !0,
      groupCount: d,
    });
    a.neLat = h;
    a.neLon = m;
    a.swLat = p;
    a.swLon = k;
    f.push(a);
  });
  return f;
}

function Rt(a) {
  a.filter((a) => a.visible).forEach((a) => {
    a.addListener('click', () => {
      window.dispatchEvent(new Event('search-by-cluster-click',
          {coords: {
              northEastLatitude: a.neLat,
              northEastLongitude: a.neLon,
              southWestLatitude: a.swLat,
              southWestLongitude: a.swLon,
            },
          }));
      const c = new google.maps.LatLngBounds();
      c.extend(new google.maps.LatLng(a.neLat, a.neLon));
      c.extend(new google.maps.LatLng(a.swLat, a.swLon));
      a.map.panTo(c.getCenter());
    });
  });
}

const aA = function (d, h, k, m, p) {
  h = h || [];
  k = k || [];
  let q = [];
  Zt(d);
  if (h.length > 0) {
    k = Qt(h, d),
        Rt(k),
        q = q.concat(k);
  } else if (k.length > 0) {
    const n = Yt({
      listingPins: k,
    });
    const B = [];
    Object.keys(n).forEach((h, k) => {
      h = n[h];
      h.length > 1 ? (h = au({
        groupOfListingPins: h,
        propertiesMap: d,
        isAgentPage: m,
        agentHomePath: p,
      }),
          q = q.concat(h)) : B.push(h[0]);
    });
    k = St(B, d, m, p);
    q = q.concat(k);
  }
  return {
    markers: q,
    markerClusters: [],
  };
};


async function initMap() {
  Pt();
  const mapDiv = document.querySelector('.property-result-map');
  const { Map } = await google.maps.importLibrary('maps');
  map = new Map(mapDiv, {
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
  window.mapInitialized = !0;
  window.renderPropertyMap = function (d) {
    const h = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : !0;
    new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, 0),
    });
    Jd();
    sn();
    d && (Promise.resolve(1).then(() => {
      //update map center
      !h && window.boundsInitialized || cu(rd);
    }));
        // document.querySelector('.map-style-hybrid').unbind();
        document.querySelector('.map-style-hybrid').addEventListener('click', function () {
          document.querySelector('.map-style-hybrid').classList.toggle('activated');
          if (document.querySelector('.map-style-hybrid').classList.contains('activated')) {
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            map.setOptions({
              styles: [],
            }) }
          else {
            map.setOptions({styles: Nr,});
            map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
          }});
        // k('.map-zoom-in').unbind(),
        // k('.map-zoom-out').unbind(),
      document.querySelector('.map-zoom-in').addEventListener('click', () =>{
          hi = !0;
          map.setZoom(map.getZoom() + 1);
        });
    document.querySelector('.map-zoom-out').addEventListener('click', () => {
          hi = !0;
          map.setZoom(map.getZoom() - 1);
        });
  };

  window.updatePropertyMap = function (d, h, k, m) {
    window.mapInitialized ? (clearTimeout(window.queuedRenderPropertyMap),
        bu(),
        window.renderPropertyMap(d, h),
        h = aA(map, d && d.listingClusters && d.listingClusters.length > 0 ? d.listingClusters : [], d && d.listingPins && d.listingPins.length > 0 ? d.listingPins : [], k, m),
        k = h.markerClusters,
        bA(h.markers, rd, Hh, map),
        lg = [].concat(k)) : window.queuedRenderPropertyMap = setTimeout(() => {
      window.updatePropertyMap(d);
    }, 200);
  };
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
  const CALLBACK_FN = 'initMap';
  window[CALLBACK_FN] = initMap;
  const { mapsApiKey } = placeholders;
  const clusterSrc = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
  loadJS(clusterSrc);
  const src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places&callback=${CALLBACK_FN}`;
  loadJS(src);
}

initGoogleMapsAPI();
