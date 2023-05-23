/* global google */

import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

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

function convertCoordinates(c) {
    return {
        lng: parseFloat(c[0]),
        lat: parseFloat(c[1]),
    };
}

function convertCoordinatesArray(coords) {
    return coords.map(convertCoordinates);
}



// window.init_map = function() {
//     function d() {
//         var d = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : !0;
//         window.boundsInitialized || (window.boundsInitialized = !0,
//             d = !1);
//         d = {
//             coords: {
//                 northEastLatitude: ya.getBounds().getNorthEast().lat(),
//                 northEastLongitude: ya.getBounds().getNorthEast().lng(),
//                 southWestLatitude: ya.getBounds().getSouthWest().lat(),
//                 southWestLongitude: ya.getBounds().getSouthWest().lng()
//             },
//             updateProperties: d
//         };
//         u.$emit("properties-map-bounds-changed", d)
//     }
//     function h(d) {
//         for (var h = [], k = 0; k < d.getLength(); k++)
//             h.push(new ag.geom.Coordinate(d.getAt(k).lat(),d.getAt(k).lng()));
//         h.push(h[0]);
//         d = new ag.geom.GeometryFactory;
//         h = d.createLinearRing(h);
//         d = d.createPolygon(h);
//         if ((new ag.operation.IsSimpleOp(d)).isSimpleLinearGeometry(d))
//             return null;
//         h = [];
//         d = new ag.geomgraph.GeometryGraph(0,d);
//         d = new ag.operation.valid.ConsistentAreaTester(d);
//         d.isNodeConsistentArea() || (d = d.getInvalidPoint(),
//             h.push([d.x, d.y]));
//         return h
//     }
//     function q() {
//         ub && ub.setMap(null);
//         ub = new google.maps.Polyline({
//             map: ya,
//             clickable: !1,
//             strokeColor: "#BA9BB2",
//             strokeWeight: 2
//         });
//         var d = {
//             path: "M 0,-1 0,1",
//             strokeOpacity: 1,
//             scale: 2,
//             strokeColor: "#BA9BB2"
//         };
//         k("#gmap_canvas").on("mouseup.draw touchend.draw", function(d) {
//             d.preventDefault();
//             var n = document.getElementById("gmap_canvas").getBoundingClientRect()
//                 , p = d.clientX - n.left
//                 , q = d.clientY - n.top;
//             "touchend" === d.type && (q = k(window).scrollTop(),
//                 d = d.originalEvent.touches[0] || d.originalEvent.changedTouches[0],
//                 p = d.pageX - n.left,
//                 q = d.pageY - n.top - q);
//             n = t(p, q);
//             ub.getPath().push(n);
//             n = ub.getPath();
//             3 < n.length && (n = h(n)) && n.length && m()
//         });
//         k("#gmap_canvas").on("mousemove.draw touchmove.draw", function(h) {
//             h.preventDefault();
//             kf && kf.setMap(null);
//             var n = ub.getPath()
//                 , m = n.length;
//             if (0 !== m) {
//                 var p = document.getElementById("gmap_canvas").getBoundingClientRect()
//                     , q = h.clientX - p.left
//                     , y = h.clientY - p.top;
//                 "touchmove" === h.type && (y = k(window).scrollTop(),
//                     h = h.originalEvent.touches[0] || h.originalEvent.changedTouches[0],
//                     q = h.pageX - p.left,
//                     y = h.pageY - p.top - y);
//                 p = t(q, y);
//                 n = [n.getArray()[m - 1], p];
//                 kf = new google.maps.Polyline({
//                     path: n,
//                     strokeOpacity: 0,
//                     icons: [{
//                         icon: d,
//                         offset: "0",
//                         repeat: "20px"
//                     }],
//                     map: ya
//                 })
//             }
//         })
//     }
//     function m() {
//         kf && kf.setMap(null);
//         if (du(ub, 7E-4)) {
//             var d, n = ub.getPath();
//             do
//                 (d = h(n)) && d.length && n.pop();
//             while (d && d.length);
//             d = [];
//             for (var m = 0; m < n.length; m++) {
//                 var p = n.getAt(m);
//                 p = {
//                     longitude: p.lng(),
//                     latitude: p.lat()
//                 };
//                 d.push(p)
//             }
//             n = ub.getPath().getArray()[0];
//             ub.getPath().push(n);
//             d.push(d[0]);
//             u.$emit("properties-map-polygon-draw-end", d)
//         } else
//             u.$emit("properties-map-polygon-draw-end", null);
//         x();
//         k("#gmap_canvas").off(".draw");
//         k(".map-draw-complete").addClass("d-none");
//         B()
//     }
//     function p() {
//         rd.forEach(function(d) {
//             d.setClickable(!1)
//         });
//         u.$emit("set-enable-cluster-mouseover", {
//             enable: !1
//         });
//         lg.forEach(function(d) {
//             d.setZoomOnClick(!1)
//         })
//     }
//     function x() {
//         rd.forEach(function(d) {
//             d.setClickable(!0)
//         });
//         u.$emit("set-enable-cluster-mouseover", {
//             enable: !0
//         });
//         lg.forEach(function(d) {
//             d.setZoomOnClick(!0)
//         })
//     }
//     function n() {
//         ya.setOptions({
//             draggable: !1,
//             scrollwheel: !1,
//             disableDoubleClickZoom: !1
//         })
//     }
//     function B() {
//         ya.setOptions({
//             draggable: !0,
//             scrollwheel: !0,
//             disableDoubleClickZoom: !0
//         })
//     }
//     function t(d, h) {
//
//
//         ///keeper :))))
//
//         var k = ya.getBounds().getNorthEast()
//             , n = ya.getBounds().getSouthWest()
//             , m = ya.getProjection();
//         k = m.fromLatLngToPoint(k);
//         n = m.fromLatLngToPoint(n);
//         var p = 1 << ya.getZoom();
//         return m.fromPointToLatLng(new google.maps.Point(d / p + n.x,h / p + k.y))
//     }
//     Pt();
//     Ot();
//     if (!(0 >= k("#gmap_canvas").length)) {
//         ya = new google.maps.Map(document.getElementById("gmap_canvas"),{
//             zoom: 10,
//             maxZoom: 18,
//             center: new google.maps.LatLng(41.24216,-96.20799),
//             mapTypeId: "roadmap",
//             clickableIcons: !1,
//             gestureHandling: "greedy",
//             styles: Nr,
//             visualRefresh: !0,
//             disableDefaultUI: !0
//         });
//         google.maps.Map.prototype.panToWithOffset = function(d, h, k) {
//             var n = this
//                 , m = new google.maps.OverlayView;
//             m.onAdd = function() {
//                 var m = this.getProjection()
//                     , p = m.fromLatLngToContainerPixel(d);
//                 p.x += h;
//                 p.y += k;
//                 n.panTo(m.fromContainerPixelToLatLng(p))
//             }
//             ;
//             m.draw = function() {}
//             ;
//             m.setMap(this)
//         }
//         ;
//         document.getElementById("gmap_canvas").style.display = "block";
//         ya.addListener("dragend", function() {
//             k(".gm-style-iw").prev("div").remove();
//             k(".gm-style-iw").parent().addClass("gm-style-parent")
//         });
//         ya.addListener("dragstart", function() {
//             k(".gm-style-iw").prev("div").remove();
//             k(".gm-style-iw").parent().addClass("gm-style-parent")
//         });
//         ya.addListener("zoom_changed", function() {
//             k(".gm-style-iw").prev("div").remove();
//             k(".gm-style-iw").parent().addClass("gm-style-parent");
//             sn()
//         });
//         var y = void 0, A = function I() {
//             var d = k('.cmp-agent-property-listing #gmap_canvas div[tabindex\x3d"0"]');
//             0 < d.length ? (d.attr("tabindex", -1),
//                 y = setTimeout(function() {
//                     I()
//                 }, 50)) : clearTimeout(y)
//         }, H;
//         ya.addListener("dragend", function() {
//             u.$emit("properties-map-search-toggle", !1);
//             clearTimeout(H);
//             H = setTimeout(d, 500)
//         });
//         ya.addListener("dblclick", function() {
//             u.$emit("properties-map-search-toggle", !1);
//             clearTimeout(H);
//             H = setTimeout(d, 500)
//         });
//         ya.addListener("zoom_changed", function() {
//             1 == hi && u.$emit("properties-map-search-toggle", !1);
//             hi = !1;
//             clearTimeout(H);
//             H = setTimeout(d, 500)
//         });
//         google.maps.event.addListenerOnce(ya, "tilesloaded", function() {
//             A()
//         });
//         google.maps.event.addListener(ya, "bounds_changed", function() {});
//         k(".map-draw").unbind();
//         k(".map-draw").click(function(d) {
//             d.preventDefault();
//             k(".cmp-properties-map").hasClass("draw-active") ? (ub && ub.setMap(null),
//                 k(".map-draw-complete").addClass("d-none"),
//             kf && kf.setMap(null),
//                 k("#gmap_canvas").off(".draw"),
//                 B(),
//                 u.$emit("properties-map-polygon-draw-end", null),
//                 x(),
//                 k(".map-search-toggle").removeClass("active")) : (n(),
//                 u.$emit("properties-map-polygon-draw-start"),
//                 p(),
//                 n(),
//             k(".map-search-toggle").hasClass("active") || k(".map-search-toggle").addClass("active"),
//                 k(".map-draw-complete").removeClass("d-none"),
//                 q())
//         });
//         k('\x3ca data-text\x3d"Draw" data-text-close\x3d"Complete Draw" class\x3d"map-draw-complete d-none"\x3e\x3c/a\x3e').insertBefore(".map-draw");
//         k(".map-draw-complete").click(function(d) {
//             d.preventDefault();
//             m()
//         });
//         k(".map-search-toggle").unbind();
//         k(".map-search-toggle").click(function() {
//             k(this).toggleClass("active");
//             k(this).hasClass("active") ? u.$emit("properties-map-search-toggle", !0) : (u.$emit("properties-map-polygon-clear-polygon-coords"),
//                 d(!0),
//                 u.$emit("properties-map-search-toggle", !1),
//             ub && ub.setMap(null))
//         });
//         u.$on("properties-map-reset", function(d) {
//             k(".map-search-toggle").removeClass("active");
//             ub && ub.setMap(null)
//         });
//         window.mapInitialized = !0
//     }
// }
//     function h(d) {
//         for (var h = [], k = 0; k < d.getLength(); k++)
//             h.push(new ag.geom.Coordinate(d.getAt(k).lat(),d.getAt(k).lng()));
//         h.push(h[0]);
//         d = new ag.geom.GeometryFactory;
//         h = d.createLinearRing(h);
//         d = d.createPolygon(h);
//         if ((new ag.operation.IsSimpleOp(d)).isSimpleLinearGeometry(d))
//             return null;
//         h = [];
//         d = new ag.geomgraph.GeometryGraph(0,d);
//         d = new ag.operation.valid.ConsistentAreaTester(d);
//         d.isNodeConsistentArea() || (d = d.getInvalidPoint(),
//             h.push([d.x, d.y]));
//         return h
//     }
//     function q() {
//         ub && ub.setMap(null);
//         ub = new google.maps.Polyline({
//             map: ya,
//             clickable: !1,
//             strokeColor: "#BA9BB2",
//             strokeWeight: 2
//         });
//         var d = {
//             path: "M 0,-1 0,1",
//             strokeOpacity: 1,
//             scale: 2,
//             strokeColor: "#BA9BB2"
//         };
//         k("#gmap_canvas").on("mouseup.draw touchend.draw", function(d) {
//             d.preventDefault();
//             var n = document.getElementById("gmap_canvas").getBoundingClientRect()
//                 , p = d.clientX - n.left
//                 , q = d.clientY - n.top;
//             "touchend" === d.type && (q = k(window).scrollTop(),
//                 d = d.originalEvent.touches[0] || d.originalEvent.changedTouches[0],
//                 p = d.pageX - n.left,
//                 q = d.pageY - n.top - q);
//             n = t(p, q);
//             ub.getPath().push(n);
//             n = ub.getPath();
//             3 < n.length && (n = h(n)) && n.length && m()
//         });
//         k("#gmap_canvas").on("mousemove.draw touchmove.draw", function(h) {
//             h.preventDefault();
//             kf && kf.setMap(null);
//             var n = ub.getPath()
//                 , m = n.length;
//             if (0 !== m) {
//                 var p = document.getElementById("gmap_canvas").getBoundingClientRect()
//                     , q = h.clientX - p.left
//                     , y = h.clientY - p.top;
//                 "touchmove" === h.type && (y = k(window).scrollTop(),
//                     h = h.originalEvent.touches[0] || h.originalEvent.changedTouches[0],
//                     q = h.pageX - p.left,
//                     y = h.pageY - p.top - y);
//                 p = t(q, y);
//                 n = [n.getArray()[m - 1], p];
//                 kf = new google.maps.Polyline({
//                     path: n,
//                     strokeOpacity: 0,
//                     icons: [{
//                         icon: d,
//                         offset: "0",
//                         repeat: "20px"
//                     }],
//                     map: ya
//                 })
//             }
//         })
//     }
//     function m() {
//         kf && kf.setMap(null);
//         if (du(ub, 7E-4)) {
//             var d, n = ub.getPath();
//             do
//                 (d = h(n)) && d.length && n.pop();
//             while (d && d.length);
//             d = [];
//             for (var m = 0; m < n.length; m++) {
//                 var p = n.getAt(m);
//                 p = {
//                     longitude: p.lng(),
//                     latitude: p.lat()
//                 };
//                 d.push(p)
//             }
//             n = ub.getPath().getArray()[0];
//             ub.getPath().push(n);
//             d.push(d[0]);
//             u.$emit("properties-map-polygon-draw-end", d)
//         } else
//             u.$emit("properties-map-polygon-draw-end", null);
//         x();
//         k("#gmap_canvas").off(".draw");
//         k(".map-draw-complete").addClass("d-none");
//         B()
//     }
//     function p() {
//         rd.forEach(function(d) {
//             d.setClickable(!1)
//         });
//         u.$emit("set-enable-cluster-mouseover", {
//             enable: !1
//         });
//         lg.forEach(function(d) {
//             d.setZoomOnClick(!1)
//         })
//     }
//     function x() {
//         rd.forEach(function(d) {
//             d.setClickable(!0)
//         });
//         u.$emit("set-enable-cluster-mouseover", {
//             enable: !0
//         });
//         lg.forEach(function(d) {
//             d.setZoomOnClick(!0)
//         })
//     }
//     function n() {
//         ya.setOptions({
//             draggable: !1,
//             scrollwheel: !1,
//             disableDoubleClickZoom: !1
//         })
//     }
//     function B() {
//         ya.setOptions({
//             draggable: !0,
//             scrollwheel: !0,
//             disableDoubleClickZoom: !0
//         })
//     }
//     function t(d, h) {
//
//
//         ///keeper :))))
//
//         var k = ya.getBounds().getNorthEast()
//             , n = ya.getBounds().getSouthWest()
//             , m = ya.getProjection();
//         k = m.fromLatLngToPoint(k);
//         n = m.fromLatLngToPoint(n);
//         var p = 1 << ya.getZoom();
//         return m.fromPointToLatLng(new google.maps.Point(d / p + n.x,h / p + k.y))
//     }
//     Pt();
//     Ot();
//     if (!(0 >= k("#gmap_canvas").length)) {
//         ya = new google.maps.Map(document.getElementById("gmap_canvas"),{
//             zoom: 10,
//             maxZoom: 18,
//             center: new google.maps.LatLng(41.24216,-96.20799),
//             mapTypeId: "roadmap",
//             clickableIcons: !1,
//             gestureHandling: "greedy",
//             styles: Nr,
//             visualRefresh: !0,
//             disableDefaultUI: !0
//         });
//         google.maps.Map.prototype.panToWithOffset = function(d, h, k) {
//             var n = this
//                 , m = new google.maps.OverlayView;
//             m.onAdd = function() {
//                 var m = this.getProjection()
//                     , p = m.fromLatLngToContainerPixel(d);
//                 p.x += h;
//                 p.y += k;
//                 n.panTo(m.fromContainerPixelToLatLng(p))
//             }
//             ;
//             m.draw = function() {}
//             ;
//             m.setMap(this)
//         }
//         ;
//         document.getElementById("gmap_canvas").style.display = "block";
//         ya.addListener("dragend", function() {
//             k(".gm-style-iw").prev("div").remove();
//             k(".gm-style-iw").parent().addClass("gm-style-parent")
//         });
//         ya.addListener("dragstart", function() {
//             k(".gm-style-iw").prev("div").remove();
//             k(".gm-style-iw").parent().addClass("gm-style-parent")
//         });
//         ya.addListener("zoom_changed", function() {
//             k(".gm-style-iw").prev("div").remove();
//             k(".gm-style-iw").parent().addClass("gm-style-parent");
//             sn()
//         });
//         var y = void 0, A = function I() {
//             var d = k('.cmp-agent-property-listing #gmap_canvas div[tabindex\x3d"0"]');
//             0 < d.length ? (d.attr("tabindex", -1),
//                 y = setTimeout(function() {
//                     I()
//                 }, 50)) : clearTimeout(y)
//         }, H;
//         ya.addListener("dragend", function() {
//             u.$emit("properties-map-search-toggle", !1);
//             clearTimeout(H);
//             H = setTimeout(d, 500)
//         });
//         ya.addListener("dblclick", function() {
//             u.$emit("properties-map-search-toggle", !1);
//             clearTimeout(H);
//             H = setTimeout(d, 500)
//         });
//         ya.addListener("zoom_changed", function() {
//             1 == hi && u.$emit("properties-map-search-toggle", !1);
//             hi = !1;
//             clearTimeout(H);
//             H = setTimeout(d, 500)
//         });
//         google.maps.event.addListenerOnce(ya, "tilesloaded", function() {
//             A()
//         });
//         google.maps.event.addListener(ya, "bounds_changed", function() {});
//         k(".map-draw").unbind();
//         k(".map-draw").click(function(d) {
//             d.preventDefault();
//             k(".cmp-properties-map").hasClass("draw-active") ? (ub && ub.setMap(null),
//                 k(".map-draw-complete").addClass("d-none"),
//             kf && kf.setMap(null),
//                 k("#gmap_canvas").off(".draw"),
//                 B(),
//                 u.$emit("properties-map-polygon-draw-end", null),
//                 x(),
//                 k(".map-search-toggle").removeClass("active")) : (n(),
//                 u.$emit("properties-map-polygon-draw-start"),
//                 p(),
//                 n(),
//             k(".map-search-toggle").hasClass("active") || k(".map-search-toggle").addClass("active"),
//                 k(".map-draw-complete").removeClass("d-none"),
//                 q())
//         });
//         k('\x3ca data-text\x3d"Draw" data-text-close\x3d"Complete Draw" class\x3d"map-draw-complete d-none"\x3e\x3c/a\x3e').insertBefore(".map-draw");
//         k(".map-draw-complete").click(function(d) {
//             d.preventDefault();
//             m()
//         });
//         k(".map-search-toggle").unbind();
//         k(".map-search-toggle").click(function() {
//             k(this).toggleClass("active");
//             k(this).hasClass("active") ? u.$emit("properties-map-search-toggle", !0) : (u.$emit("properties-map-polygon-clear-polygon-coords"),
//                 d(!0),
//                 u.$emit("properties-map-search-toggle", !1),
//             ub && ub.setMap(null))
//         });
//         u.$on("properties-map-reset", function(d) {
//             k(".map-search-toggle").removeClass("active");
//             ub && ub.setMap(null)
//         });
//         window.mapInitialized = !0
//     }
// }
async function initMap() {
    const Nr = [{
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [{
            color: "#444444"
        }]
    }, {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{
            saturation: "-42"
        }, {
            lightness: "-53"
        }, {
            gamma: "2.98"
        }]
    }, {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.fill",
        stylers: [{
            saturation: "1"
        }, {
            lightness: "31"
        }, {
            weight: "1"
        }]
    }, {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.stroke",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{
            lightness: "12"
        }]
    }, {
        featureType: "landscape",
        elementType: "all",
        stylers: [{
            saturation: "67"
        }]
    }, {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [{
            visibility: "on"
        }, {
            color: "#ececec"
        }]
    }, {
        featureType: "landscape.natural",
        elementType: "geometry.fill",
        stylers: [{
            visibility: "on"
        }]
    }, {
        featureType: "landscape.natural.landcover",
        elementType: "geometry.fill",
        stylers: [{
            visibility: "on"
        }, {
            color: "#ffffff"
        }, {
            saturation: "-2"
        }, {
            gamma: "7.94"
        }]
    }, {
        featureType: "landscape.natural.terrain",
        elementType: "geometry",
        stylers: [{
            visibility: "on"
        }, {
            saturation: "94"
        }, {
            lightness: "-30"
        }, {
            gamma: "8.59"
        }, {
            weight: "5.38"
        }]
    }, {
        featureType: "poi",
        elementType: "all",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{
            saturation: "-26"
        }, {
            lightness: "20"
        }, {
            weight: "1"
        }, {
            gamma: "1"
        }]
    }, {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [{
            visibility: "on"
        }]
    }, {
        featureType: "road",
        elementType: "all",
        stylers: [{
            saturation: -100
        }, {
            lightness: 45
        }]
    }, {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{
            visibility: "on"
        }, {
            color: "#fafafa"
        }]
    }, {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{
            gamma: "0.95"
        }, {
            lightness: "3"
        }]
    }, {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "road.highway",
        elementType: "all",
        stylers: [{
            visibility: "simplified"
        }]
    }, {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{
            lightness: "100"
        }, {
            gamma: "5.22"
        }]
    }, {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{
            visibility: "on"
        }]
    }, {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "transit",
        elementType: "all",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "water",
        elementType: "all",
        stylers: [{
            color: "#b3dced"
        }, {
            visibility: "on"
        }]
    }, {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{
            visibility: "on"
        }, {
            color: "#ffffff"
        }]
    }, {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{
            visibility: "off"
        }, {
            color: "#e6e6e6"
        }]
    }];
    // const mapDiv = document.querySelector('.property-result-map');
    // // const coordinates = window.liveby.geometry.coordinates[0];
    // const map = new google.maps.Map(mapDiv, {
    //     zoom: 10,
    //     maxZoom: 18,
    //     center: new google.maps.LatLng(41.24216, -96.20799),
    //     mapTypeId: 'roadmap',
    //     clickableIcons: false,
    //     gestureHandling: 'greedy',
    //     // styles: Nr,
    //     visualRefresh: true,
    //     disableDefaultUI: true,
    // });
    // google.maps.Map.prototype.panToWithOffset = function (d, h, k) {
    //     var n = this
    //         , m = new google.maps.OverlayView;
    //     m.onAdd = function () {
    //         var m = this.getProjection()
    //             , p = m.fromLatLngToContainerPixel(d);
    //         p.x += h;
    //         p.y += k;
    //         n.panTo(m.fromContainerPixelToLatLng(p))
    //     };
    //     m.draw = function () {
    //     };
    //     m.setMap(this)
    // };
    //
    // document.querySelector('.property-result-map').style.display = "block";
    // map.addListener("dragend", function () {
    //     // k(".gm-style-iw").prev("div").remove();
    //     // k(".gm-style-iw").parent().addClass("gm-style-parent")
    // });
    // map.addListener("dragstart", function() {
    //     // k(".gm-style-iw").prev("div").remove();
    //     // k(".gm-style-iw").parent().addClass("gm-style-parent")
    // });
    // map.addListener("zoom_changed", function() {
    //     // k(".gm-style-iw").prev("div").remove();
    //     // k(".gm-style-iw").parent().addClass("gm-style-parent");
    //     // sn()
    // });
    // google.maps.event.addListener(map, "bounds_changed", function() {});
    //
    // window.mapInitialized = true;

    const mapDiv = document.querySelector('.property-result-map');
    const { Map } = await google.maps.importLibrary("maps");
    let map = new Map(mapDiv, {
        center: { lat: 41.24216, lng: -96.20799 },
        zoom: 10,
        maxZoom: 18,
        mapTypeId: "roadmap",
        clickableIcons: false,
        gestureHandling: "greedy",
        visualRefresh: true,
        disableDefaultUI: true,
        styles: Nr
    });
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
    const mapsApiKey = 'AIzaSyCypwVwVpDMRUGiacGCQmPuvmVmmyOYRJs'
    const src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places&callback=${CALLBACK_FN}`;
    loadJS(src);
}

initGoogleMapsAPI();
