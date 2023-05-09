var y = new google.maps.StyledMapType(
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
  name: "Styled Road Map"
  }
);
Ec = new google.maps.Map(document.getElementById("pdpgmap_canvas"),{
  zoom: 15,
  center: new google.maps.LatLng(q,p),
  visualRefresh: !0,
  disableDefaultUI: !0,
  styles: [{
      featureType: "poi",
      stylers: [{
          visibility: "off"
      }]
  }],
  mapTypeControlOptions: {
      mapTypeIds: ["styled_roadmap", "hybrid"]
  }
});
Ec.mapTypes.set("styled_roadmap", y);
Ec.setMapTypeId("styled_roadmap");
q = new google.maps.LatLng(q,p);
(new google.maps.Marker({
  position: q,
  icon: n ? "/etc/clientlibs/bhhs-pagelibs/images/google-maps/UI/Map/marker-purple.png" : "/etc/clientlibs/bhhs-pagelibs/images/google-maps/UI/Map/marker-blue.png",
  map: Ec,
  anchor: new google.maps.Point(0,0)
})).setMap(Ec);
k(".map-style-hybrid").click(function() {
  k(this).toggleClass("activated");
  k(this).hasClass("activated") ? Ec.setMapTypeId(google.maps.MapTypeId.HYBRID) : Ec.setMapTypeId("styled_roadmap")
});
k(".map-zoom-in").click(function() {
  Ec.setZoom(Ec.getZoom() + 1)
});
k(".map-zoom-out").click(function() {
  Ec.setZoom(Ec.getZoom() - 1)
});