import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

function initPropertyMap() {
  const urlParams = new URLSearchParams(window.location.search);
  const latitude = urlParams.get('latitude') || window.property.Latitude;
  const longitude = urlParams.get('longitude') || window.property.Longitude;
  const position = { lat: Number(latitude), lng: Number(longitude) };
  // eslint-disable-next-line no-undef
  const styledMap = new google.maps.StyledMapType(
    [
      { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#444444' }] },
      { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ saturation: '-42' }, { lightness: '-53' }, { gamma: '2.98' }] },
      { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ saturation: '1' }, { lightness: '31' }, { weight: '1' }] },
      { featureType: 'administrative.neighborhood', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
      { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ lightness: '12' }] },
      { featureType: 'landscape', elementType: 'all', stylers: [{ saturation: '67' }] },
      { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#fbf1e8' }] },
      { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#ececec' }] },
      { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
      { featureType: 'landscape.natural.landcover', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { saturation: '-2' }, { gamma: '7.94' }] },
      { featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{ visibility: 'on' }, { saturation: '94' }, { lightness: '-30' }, { gamma: '8.59' }, { weight: '5.38' }] },
      { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ saturation: '-26' }, { lightness: '20' }, { weight: '1' }, { gamma: '1' }] },
      { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
      { featureType: 'road', elementType: 'all', stylers: [{ saturation: -100 }, { lightness: 45 }] },
      { featureType: 'road', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }, { color: '#fafafa' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ gamma: '0.95' }, { lightness: '3' }] },
      { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
      { featureType: 'road.highway', elementType: 'all', stylers: [{ visibility: 'simplified' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ lightness: '100' }, { gamma: '5.22' }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ visibility: 'on' }] },
      { featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
      { featureType: 'water', elementType: 'all', stylers: [{ color: '#b3dced' }, { visibility: 'on' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ visibility: 'on' }, { color: '#ffffff' }] },
      { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }, { color: '#e6e6e6' }] },
    ],
    {
      name: 'Styled Map',
    },
  );
  const mapElem = document.getElementById('cmp-map-canvas');
  // eslint-disable-next-line no-undef
  const map = new google.maps.Map(mapElem, {
    zoom: 15,
    center: position,
    mapTypeControlOptions: {
      mapTypeIds: ['styled_map', 'hybrid'],
    },
    visualRefresh: true,
    disableDefaultUI: true,
    styles: [{
      featureType: 'poi',
      stylers: [{
        visibility: 'off',
      }],
    }],
  });
  map.mapTypes.set('styled_map', styledMap);
  map.setMapTypeId('styled_map');
  // eslint-disable-next-line no-undef, no-unused-vars
  const marker = new google.maps.Marker({
    map,
    position,
    icon: {
      url: 'https://www.commonmoves.com/etc/clientlibs/bhhs-pagelibs/images/google-maps/UI/Map/marker-blue.png',
    },
  });
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
  const CALLBACK_FN = 'initPropertyMap';
  window[CALLBACK_FN] = initPropertyMap;
  const { mapsApiKey } = placeholders;
  const src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=maps&callback=${CALLBACK_FN}`;
  loadJS(src);
}

initGoogleMapsAPI();
