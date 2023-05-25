/* global google */
/* global markerClusterer */

import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import {removeFilterValue, searchProperty, setFilterValue} from "../property-search-bar/filter-processor.js";

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
let rn = !0;

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

function Yt(a) {
  a = a.listingPins;
  return (void 0 === a ? [] : a).reduce((a, f) => {
    const c = `${f.lat}${f.lon}`;
    Array.isArray(a[c]) || (a[c] = []);
    a[c].push(f);
    return a;
  }, {});
}

let U = {
  isXs() {
    return window.innerWidth <= 575;
  },
  isSm() {
    const a = window.innerWidth;
    return a >= 576 && a <= 599;
  },
  isMd() {
    const a = window.innerWidth;
    return a >= 600 && a <= 991;
  },
  isLg() {
    const a = window.innerWidth;
    return a >= 992 && a <= 1199;
  },
  isXl() {
    return window.innerWidth >= 1200;
  },
};

function Xt(a, c, f) {
  a = on(a);
  Promise.all(a).then((a) => {
    a = pn(a, c, f);
    let d = document.getElementsByClassName('mobile-cluster-info-window');
    d.length > 0 && (d = d[0],
        d.innerHTML = '',
        d.appendChild(a),
        d.style.display = 'block');
  });
}

function $t() {
  return rn;
}

function au(a) {
  let c = a.groupOfListingPins;
  const f = void 0 === c ? [] : c;
  const d = a.propertiesMap;
  const h = a.isAgentPage;
  const q = a.agentHomePath;
  a = vj(d, 'cluster');
  c = [];
  const m = f[0];
  const p = f.length;
  const k = m.lat;
  const n = m.lon;
  const B = a({
    latitude: k,
    longitude: n,
    labelText: `${p}`,
    visible: !0,
    groupCount: p,
  });
  c.push(B);
  B.setZIndex(0);
  B.bhhsInitialZIndex = B.getZIndex();
  const t = {
    getListingPins() {
      return [].concat(f);
    },
    getCenter() {
      return new google.maps.LatLng(k, n);
    },
  };
  U.isXs() ? B.addListener('click', () => {
    Jd();
    Xt(t, h, q);
  }) : (B.addListener('mouseover', () => {
    $t && Zd && (Jd(),
        Zd = !1,
        Wt(t, d, B, h, q));
  }),
      B.addListener('mouseover', function () {
        this.setOptions({
          zIndex: 1000002,
        });
      }));
  return c;
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
      const event = new CustomEvent('search-by-cluster-click',
          {detail: {
              northEastLatitude: a.neLat,
              northEastLongitude: a.neLon,
              southWestLatitude: a.swLat,
              southWestLongitude: a.swLon,
            },
          });
      window.dispatchEvent(event);
      const c = new google.maps.LatLngBounds();
      c.extend(new google.maps.LatLng(a.neLat, a.neLon));
      c.extend(new google.maps.LatLng(a.swLat, a.swLon));
      a.map.panTo(c.getCenter());
    });
  });
}

function commaSeparatedPriceToFloat(a) {
  a = (`${a}`).replace('$', '');
  a = a.replace(/,/g, '');
  a = parseFloat(a);
  return isNaN(a) ? 0 : a;
}

function nFormatter(a, c) {
  const f = [{
    value: 1,
    symbol: '',
  }, {
    value: 1E3,
    symbol: 'k',
  }, {
    value: 1E6,
    symbol: 'M',
  }, {
    value: 1E9,
    symbol: 'G',
  }, {
    value: 1E12,
    symbol: 'T',
  }, {
    value: 1E15,
    symbol: 'P',
  }, {
    value: 1E18,
    symbol: 'E',
  }]; let
      d;
  for (d = f.length - 1; d > 0 && !(a >= f[d].value); d--) ;
  return (a / f[d].value).toFixed(c).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + f[d].symbol;
}

function Tt(a) {
  a = commaSeparatedPriceToFloat(a);
  return `$${nFormatter(a, 1)}`;
}

function Aj(a) {
  let c = a.propertyData;
  let f = void 0 === c ? {
    city: '',
    zipCode: '',
    id: '',
    stateOrProvince: '',
    luxury: !1,
    isCompanyListing: !1,
  } : c;
  c = a.propertyImage;
  const d = a.propertyPrice;
  const h = a.municipality;
  const q = a.addMlsFlag;
  const m = a.listAor;
  const p = a.mlsLogo;
  const k = a.mlsStatus;
  const n = a.ClosedDate;
  const B = a.ListingId;
  const t = a.CourtesyOf;
  const y = a.sellingOfficeName;
  const A = a.ApplicationType;
  const H = a.propertyAltCurrencyPrice;
  const J = a.brImageUrl;
  const I = a.propertyAddress;
  const P = a.propertyPdpPath;
  f = {
    city: f.city,
    state: f.stateOrProvince,
    postalCode: f.zipCode,
    listingKey: f.id,
    luxury: f.luxury,
    isCompanyListing: f.isCompanyListing,
  };
  f = void 0 === f ? {
    city: '',
    state: '',
    postalCode: '',
    listingKey: '',
    luxury: !1,
    isCompanyListing: !1,
  } : f;
  a = a.propertyProviders;
  // const u = document.getElementById('property-info-window').innerHTML;
 // @todo prepare content for info window
  // c = ah.render(u, {
  //   image: c,
  //   price: d,
  //   municipality: h,
  //   addMlsFlag: q,
  //   listAor: m,
  //   mlsLogo: p,
  //   mlsStatus: k,
  //   ClosedDate: n,
  //   ListingId: B,
  //   CourtesyOf: t,
  //   sellingOfficeName: y,
  //   ApplicationType: A,
  //   altCurrencyPrice: H,
  //   brImageUrl: J,
  //   address: I,
  //   city: f.city,
  //   stateOrProvince: f.state,
  //   postalCode: f.postalCode,
  //   propertyId: f.listingKey,
  //   linkUrl: P,
  //   luxury: f.luxury,
  //   luxuryLabel: Granite.I18n.get('luxury collection'),
  //   isCompanyListing: f.isCompanyListing,
  //   providers: a,
  // });
  return new google.maps.InfoWindow({
    content: '',
  });
}

function mn(a) {
  google.maps.event.addListener(a, 'domready', () => {
    uf.push(a);
  });
}

function St() {
  const a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
  const c = arguments[1];
  const f = arguments[2];
  const d = arguments[3];
  const h = vj(c);
  const q = [];
  a.forEach((a, p) => {
    const m = a.lat;
    const n = a.lon;
    const B = Tt(a.price);
    const t = a.listingKey;
    const y = a.officeCode;
    a = h({
      latitude: m,
      longitude: n,
      labelText: `${B}`,
      visible: !0,
      groupCount: 1,
      listingKey: t,
    });
    U.isXs() ? (a.addListener('click', function () {
      const a = this;
      Jd();
      if (this.propertyPdpPath) {
        let c = a.propertyImage;
        const h = a.propertyPrice;
        const m = a.listAor;
        const q = a.mlsLogo;
        const p = a.mlsStatus;
        const n = a.ClosedDate;
        const x = a.ListingId;
        const B = a.CourtesyOf;
        const u = a.sellingOfficeName;
        const v = a.ApplicationType;
        const E = a.propertyAltCurrencyPrice;
        const G = a.brImageUrl;
        const X = a.propertyAddress;
        const Jb = a.propertyProviders || a.originatingSystemName;
        const Ab = a.propertyId;
        const Ba = a.propertyCity;
        const da = a.propertyZipcode;
        const Id = a.propertyState;
        const Ma = a.propertyPdpPath;
        const Wh = a.propertyLuxury;
        var aa = jn(a);
        c = Ut({
          image: c,
          price: h,
          listAor: m,
          mlsLogo: q,
          mlsStatus: p,
          ClosedDate: n,
          ListingId: x,
          CourtesyOf: B,
          sellingOfficeName: u,
          ApplicationType: v,
          altCurrencyPrice: E,
          brImageUrl: G,
          address: X,
          city: Ba,
          stateOrProvince: Id,
          postalCode: da,
          propertyId: Ab,
          pdpPath: Ma,
          luxury: Wh,
          isCompanyListing: a.propertyIsCompanyListing,
          providers: Jb,
        });
        k('.mobile-info-window').addClass('is-active').html(c);
        wj(aa);
        xj();
      } else {
        aa = Vt(),
            k('.mobile-info-window').addClass('is-active').html(aa),
            yj(t, y).then((c) => {
              let h = zj(c, f, d);
              const m = document.getElementById('property-info-window-mobile').innerHTML;
              h = ah.render(m, {
                image: h.propertyImage,
                price: h.propertyPrice,
                municipality: h.municipality,
                addMlsFlag: h.addMlsFlag,
                listAor: h.listAor,
                mlsLogo: h.mlsLogo,
                mlsStatus: h.mlsStatus,
                ClosedDate: h.ClosedDate,
                ListingId: h.ListingId,
                CourtesyOf: h.CourtesyOf,
                sellingOfficeName: h.sellingOfficeName,
                ApplicationType: h.ApplicationType,
                altCurrencyPrice: h.propertyAltCurrencyPrice,
                brImageUrl: h.brImageUrl,
                address: h.propertyAddress,
                city: h.propertyData.city,
                providers: h.propertyProviders,
                stateOrProvince: h.propertyData.stateOrProvince,
                postalCode: h.propertyData.zipCode,
                propertyId: h.propertyData.id,
                linkUrl: h.propertyLinkUrl,
                luxury: h.propertyData.luxury,
                isCompanyListing: h.propertyData.isCompanyListing,
                luxuryLabel: Granite.I18n.get('luxury collection'),
              });
              k('.mobile-info-window').addClass('is-active').html(h);
              wj(c);
              xj();
              kn({
                property: c,
                marker: a,
              });
            });
      }
    }),
        a.bhhsInitialZIndex = a.getZIndex(),
        a.addListener('click', function () {
          this.setOptions({
            zIndex: 1000002,
          });
        })) : (a.addListener('mouseover', function () {
      if (Zd) {
        Jd();
        Zd = !1;
        const a = this;
        if (this.propertyPdpPath) {
          let h = a.propertyImage;
          const m = a.propertyPrice;
          const q = a.municipality;
          const p = a.addMlsFlag;
          const n = a.listAor;
          const k = a.mlsLogo;
          const x = a.mlsStatus;
          const B = a.ClosedDate;
          const u = a.ListingId;
          const v = a.CourtesyOf;
          const E = a.sellingOfficeName;
          const G = a.ApplicationType;
          const X = a.propertyAltCurrencyPrice;
          const Jb = a.brImageUrl;
          const Ab = a.propertyAddress;
          const Ba = a.propertyProviders || a.originatingSystemName;
          const da = a.propertyId;
          const Id = a.propertyCity;
          const Ma = a.propertyZipcode;
          const Wh = a.propertyState;
          const aa = a.propertyPdpPath;
          const qd = a.propertyLuxury;
          const L = a.propertyIsCompanyListing;
          const O = jn(a);
          h = Aj({
            propertyImage: h,
            propertyPrice: m,
            municipality: q,
            addMlsFlag: p,
            listAor: n,
            mlsLogo: k,
            mlsStatus: x,
            ClosedDate: B,
            ListingId: u,
            CourtesyOf: v,
            sellingOfficeName: E,
            ApplicationType: G,
            propertyAltCurrencyPrice: X,
            brImageUrl: Jb,
            propertyAddress: Ab,
            propertyPdpPath: aa,
            propertyProviders: Ba,
            propertyData: {
              city: Id,
              zipCode: Ma,
              id: da,
              stateOrProvince: Wh,
              luxury: qd,
              isCompanyListing: L,
            },
          });
          h.open(c, a);
          ln(h, O);
          Zd = !0;
        } else {
          const F = Aj({
            propertyImage: '',
            propertyPrice: 'loading...',
            propertyAltCurrencyPrice: '',
            brImageUrl: '',
            propertyAddress: '-',
            municipality: '',
            addMlsFlag: '',
            listAor: '',
            mlsLogo: '',
            mlsStatus: '',
            ClosedDate: '',
            ListingId: '',
            CourtesyOf: '',
            sellingOfficeName: '',
            ApplicationType: '',
            propertyPdpPath: '',
            propertyProviders: '-',
            propertyData: {},
          });
          mn(F);
          F.open(c, a);
          //@todo fix property info window with link to property detal page

          // yj(t, y).then((h) => {
          //   F.close();
          //   Zd = !0;
          //   let m = zj(h, f, d);
          //   m = Aj({
          //     propertyImage: m.propertyImage,
          //     propertyPrice: m.propertyPrice,
          //     municipality: m.municipality,
          //     addMlsFlag: m.addMlsFlag,
          //     listAor: m.listAor,
          //     mlsLogo: m.mlsLogo,
          //     mlsStatus: m.mlsStatus,
          //     ClosedDate: m.ClosedDate,
          //     ListingId: m.ListingId,
          //     CourtesyOf: m.CourtesyOf,
          //     sellingOfficeName: m.sellingOfficeName,
          //     ApplicationType: m.ApplicationType,
          //     propertyAltCurrencyPrice: m.propertyAltCurrencyPrice,
          //     brImageUrl: m.brImageUrl,
          //     propertyAddress: m.propertyAddress,
          //     propertyProviders: m.propertyProviders,
          //     propertyPdpPath: m.propertyLinkUrl,
          //     propertyData: {
          //       city: m.propertyData.city,
          //       zipCode: m.propertyData.zipCode,
          //       id: m.propertyData.id,
          //       stateOrProvince: m.propertyData.stateOrProvince,
          //       luxury: m.propertyData.luxury,
          //       isCompanyListing: m.propertyData.isCompanyListing,
          //     },
          //   });
          //   m.open(c, a);
          //   ln(m, h);
          //   kn({
          //     property: h,
          //     marker: a,
          //   });
          // });
        }
      }
    }),
        a.addListener('mouseover', function () {
          this.setOptions({
            zIndex: 1000002,
          });
        }));
    a.setZIndex(200 + p);
    a.bhhsInitialZIndex = a.getZIndex();
    q.push(a);
  });
  return q;
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

//@todo move to search class
function createMapSearchGeoJsonParameter(d) {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [d],
      },
    }],
  };
}

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
  window.addEventListener('search-by-cluster-click', (e) => {
    //set Search params
    setFilterValue('NorthEastLatitude', e.detail.northEastLatitude);
    setFilterValue( 'NorthEastLongitude', e.detail.northEastLongitude);
    setFilterValue('SouthWestLatitude', e.detail.southWestLatitude);
    setFilterValue('SouthWestLongitude', e.detail.southWestLongitude);
    setFilterValue('SearchType', 'Map');
    let m = [];
    let p = [e.detail.southWestLongitude, e.detail.northEastLatitude];
    let q = [e.detail.northEastLongitude, e.detail.northEastLatitude];
    let x = [e.detail.northEastLongitude, e.detail.southWestLatitude];
    let T = [e.detail.southWestLongitude, e.detail.southWestLatitude];
    m.push(p);
    m.push(T);
    m.push(x);
    m.push(q);
    m.push(p);
    m = createMapSearchGeoJsonParameter(m);
    m = JSON.stringify(m);
    removeFilterValue('MapSearchType');
    setFilterValue('SearchParameter', m);
    searchProperty();
    // d.mapBounds = e.coords;
    // d.searchByMapBounds = !1;
    // d.query.SearchType = 'Map';
    // d.makeRequest();
  });

  window.addEventListener('properties-map-bounds-changed', (event) => {
    //set Search params
    d.mapCoordinates.northEastLatitude = event.coords.northEastLatitude;
    d.mapCoordinates.northEastLongitude = event.coords.northEastLongitude;
    d.mapCoordinates.southWestLatitude = event.coords.southWestLatitude;
    d.mapCoordinates.southWestLongitude = event.coords.southWestLongitude;
    d.mapBounds = event.coords;
    d.searchByMapBounds && !d.searchByMapDraw && event.updateProperties && d.makeRequest();
    if (d.searchByMapDraw) {
      const k = d.mapBounds.southWestLatitude;
      const n = d.mapBounds.southWestLongitude;
      const m = d.mapBounds.northEastLatitude;
      const p = d.mapBounds.northEastLongitude;
      d.properties = d.properties.map((d) => {
        const h = d.Longitude;
        const q = d.Latitude;
        d.hide = q < k || q > m || h < n || h > p ? !0 : !1;
        return d;
      });
    }
  });
  //add custom events handling 
  
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
  // const { mapsApiKey } = placeholders;
  const mapsApiKey = 'AIzaSyCypwVwVpDMRUGiacGCQmPuvmVmmyOYRJs';
  const clusterSrc = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
  loadJS(clusterSrc);
  const src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places&callback=${CALLBACK_FN}`;
  loadJS(src);
}

initGoogleMapsAPI();
