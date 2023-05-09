var lat = 42.56574249267578;
var lon = -70.76632690429688;
// Initialize and add the map
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
        ({key: "AIzaSyBMKOKRwvyDN-jt1fcplAYTRfOaZKN8VVE", v: "beta"});
let map;

async function initMap() {
  // The location of Uluru
  const position = { lat: lat, lng: lon };
  // Request needed libraries.
  //@ts-ignore
  const { Map, StyledMapType } = await google.maps.importLibrary("maps");
  const { Marker } = await google.maps.importLibrary("marker");
  const { Point } = await google.maps.importLibrary("core");
  // The map, centered at Uluru
  
  var styledMap = new StyledMapType(
    [
      { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#444444" }]}, 
      { featureType: "administrative.locality", elementType: "labels.text.fill",stylers: [{ saturation: "-42" }, { lightness: "-53" }, { gamma: "2.98" }]}, 
      { featureType: "administrative.neighborhood", elementType: "labels.text.fill", stylers: [{ saturation: "1" }, { lightness: "31" }, { weight: "1" }]}, 
      { featureType: "administrative.neighborhood", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }]}, 
      { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ lightness: "12" }]}, 
      { featureType: "landscape", elementType: "all", stylers: [{ saturation: "67" }]}, 
      { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#fbf1e8" }]}, 
      { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ visibility: "on" }, { color: "#ececec" }]}, 
      { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ visibility: "on" }]}, 
      { featureType: "landscape.natural.landcover", elementType: "geometry.fill", stylers: [{ visibility: "on" }, { color: "#ffffff" }, { saturation: "-2" }, { gamma: "7.94" }]}, 
      { featureType: "landscape.natural.terrain", elementType: "geometry", stylers: [{ visibility: "on" }, { saturation: "94" }, { lightness: "-30" }, { gamma: "8.59" }, { weight: "5.38" }]}, 
      { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }]}, 
      { featureType: "poi.park", elementType: "geometry", stylers: [{ saturation: "-26" }, { lightness: "20" }, { weight: "1" }, { gamma: "1" }]}, 
      { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ visibility: "on" }]}, 
      { featureType: "road", elementType: "all", stylers: [{ saturation: -100 }, { lightness: 45 }]}, 
      { featureType: "road", elementType: "geometry.fill", stylers: [{ visibility: "on" }, { color: "#fafafa" }]}, 
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ visibility: "off" }]}, 
      { featureType: "road", elementType: "labels.text.fill", stylers: [{ gamma: "0.95" }, { lightness: "3" }]}, 
      { featureType: "road", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }]}, 
      { featureType: "road.highway", elementType: "all", stylers: [{ visibility: "simplified" }]}, 
      { featureType: "road.highway", elementType: "geometry", stylers: [{ lightness: "100" }, { gamma: "5.22" }]}, 
      { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ visibility: "on" }]}, 
      { featureType: "road.arterial", elementType: "labels.icon", stylers: [{ visibility: "off" }]}, 
      { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }]}, 
      { featureType: "water", elementType: "all", stylers: [{ color: "#b3dced" }, { visibility: "on" }]}, 
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ visibility: "on" }, { color: "#ffffff" }]}, 
      { featureType: "water", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }, { color: "#e6e6e6" }]}
    ],
    {
    name: "Styled Map"
    }
  );
  
  map = new Map(document.getElementById("cmp-map-canvas"), {
    zoom: 15,
    center: position,
    mapTypeControlOptions: {
      mapTypeIds: ["styled_map", "hybrid"]
    },
    visualRefresh: true,
    disableDefaultUI: true,
    styles: [{
        featureType: "poi",
        stylers: [{
            visibility: "off"
        }]
    }]
  });
  map.mapTypes.set("styled_map", styledMap);
  map.setMapTypeId("styled_map");
  // The marker, positioned at Uluru
  const marker = new Marker({
    map: map,
    position: position,
    title: "Uluru",
    icon: {
      url: "https://www.commonmoves.com/etc/clientlibs/bhhs-pagelibs/images/google-maps/UI/Map/marker-blue.png",
      anchor: new Point(0,0)
    }
  });
}

initMap();
