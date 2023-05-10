import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

function getCenter(coords) {
  // Not fancy, just take the average of all coordinates
  return coords.reduce((v,l)=>[l[0]/coords.len+v[0],l[1]/coords.len+v[1]],[0,0])
}

function initLiveByMap() {
  debugger;
  const mapDiv = document.querySelector('.liveby-map-main');
  const autocomplete = new google.maps.places.Autocomplete(input, {fields:['formatted_address'], types: ['address']});
  const coordinates = window.liveby.geometery.coordinates[0];
  const mapCenter = getCenter(coordinates);
  const map = new google.maps.Map(mapDiv, {
    zoom: 15,
    maxZoom: 1,
    center: new google.maps.LatLng(mapCenter[0], mapCenter[1]),
    mapTypeId: 'roadmap',
    clickableIcons: false,
    gestureHandling: 'greedy',
    styles: snazzyMapStyle,
    visualRefresh: true,
    disableDefaultUI: true
  });

  var polyOptions = {
    map: map,
    strokeColor: '#BA9BB2',
    strokeWeight: 2,
    clickable: false,
    zIndex: 1,
    path: coordinates,
    editable: false,
    fillOpacity: 0
  };
  
  poly = new google.maps.Polygon(polyOptions);
}

async function initGooglePlacesAPI() {
  const placeholders = await fetchPlaceholders();
  const CALLBACK_FN = 'initLivebyMap';
  window[CALLBACK_FN] = initLiveByMap;
  const { mapsApiKey } = placeholders;
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.innerHTML = `
    const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=maps&callback=${CALLBACK_FN}";
      document.head.append(script);
  `;
  document.head.append(script);
}

initGooglePlacesAPI();
