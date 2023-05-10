import { fetchPlaceholders } from "../../scripts/lib-franklin.js";

const snazzyMapStyle = [
    {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [{ color: "#444444" }],
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
            { saturation: "-42" },
            { lightness: "-53" },
            { gamma: "2.98" },
        ],
    },
    {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.fill",
        stylers: [{ saturation: "1" }, { lightness: "31" }, { weight: "1" }],
    },
    {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.stroke",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{ lightness: "12" }],
    },
    {
        featureType: "landscape",
        elementType: "all",
        stylers: [{ saturation: "67" }],
    },
    {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [{ visibility: "on" }, { color: "#ececec" }],
    },
    {
        featureType: "landscape.natural",
        elementType: "geometry.fill",
        stylers: [{ visibility: "on" }],
    },
    {
        featureType: "landscape.natural.landcover",
        elementType: "geometry.fill",
        stylers: [
            { visibility: "on" },
            { color: "#ffffff" },
            { saturation: "-2" },
            { gamma: "7.94" },
        ],
    },
    {
        featureType: "landscape.natural.terrain",
        elementType: "geometry",
        stylers: [
            { visibility: "on" },
            { saturation: "94" },
            { lightness: "-30" },
            { gamma: "8.59" },
            { weight: "5.38" },
        ],
    },
    {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
            { saturation: "-26" },
            { lightness: "20" },
            { weight: "1" },
            { gamma: "1" },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [{ visibility: "on" }],
    },
    {
        featureType: "road",
        elementType: "all",
        stylers: [{ saturation: -100 }, { lightness: 45 }],
    },
    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ visibility: "on" }, { color: "#fafafa" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ gamma: "0.95" }, { lightness: "3" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "road.highway",
        elementType: "all",
        stylers: [{ visibility: "simplified" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ lightness: "100" }, { gamma: "5.22" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ visibility: "on" }],
    },
    {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "water",
        elementType: "all",
        stylers: [{ color: "#b3dced" }, { visibility: "on" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ visibility: "on" }, { color: "#ffffff" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ visibility: "off" }, { color: "#e6e6e6" }],
    },
];

function getCenter(coords) {
    // Not fancy, just take the average of all coordinates
    return coords.reduce(
        (v, l) => [l[0] / coords.length + v[0], l[1] / coords.length + v[1]],
        [0, 0]
    );
}

function initLiveByMap() {
    const mapDiv = document.querySelector(".liveby-map-main");
    const coordinates = window.liveby.geometry.coordinates[0];
    const mapCenter = getCenter(coordinates);
    const map = new google.maps.Map(mapDiv, {
        zoom: 15,
        maxZoom: 18,
        center: new google.maps.LatLng(mapCenter[0], mapCenter[1]),
        mapTypeId: "roadmap",
        clickableIcons: false,
        gestureHandling: "greedy",
        styles: snazzyMapStyle,
        visualRefresh: true,
        disableDefaultUI: true,
    });

    const polyOptions = {
        map: map,
        strokeColor: "#BA9BB2",
        strokeWeight: 2,
        clickable: false,
        zIndex: 1,
        path: coordinates,
        editable: false,
        fillOpacity: 0,
    };

    const poly = new google.maps.Polygon(polyOptions);
}

async function initGooglePlacesAPI() {
    const placeholders = await fetchPlaceholders();
    const CALLBACK_FN = "initLiveByMap";
    window[CALLBACK_FN] = initLiveByMap;
    const { mapsApiKey } = placeholders;
    const script = document.createElement("script");
    script.type = "text/javascript";
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
