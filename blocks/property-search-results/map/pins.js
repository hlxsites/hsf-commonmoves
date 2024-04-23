/* global google */

import { formatPrice } from '../../../scripts/util.js';
import { createClusterMaker } from './clusters.js';
import { BREAKPOINTS } from '../../../scripts/scripts.js';
import { getDetails } from '../../../scripts/apis/creg/creg.js';
import {
  a, p, div, img, span,
} from '../../../scripts/dom-helpers.js';

export const ClusterRenderer = {
  render: (cluster) => createClusterMaker({
    centerLat: cluster.position.lat(),
    centerLon: cluster.position.lng(),
    count: cluster.count,
  }),
};

export function clearInfos() {
  document.querySelector('.property-search-results.block .mobile-info-window').replaceChildren();
}

function scrollAndGetInfoWindow() {
  const block = document.querySelector('.property-search-results.block');
  window.scrollTo({ top: '115', behavior: 'smooth' });
  const iw = block.querySelector('.search-map-wrapper .mobile-info-window');
  iw.replaceChildren(div({ class: 'loading' }, p('Loading...')));
  return iw;
}

function createInfo(property) {
  const href = property.PdpPath.includes('www.commonmoves.com') ? `/property/detail/pid-${property.ListingId}` : property.PdpPath;

  return a({ class: 'info-wrapper', rel: 'noopener', href },
    div({ class: 'image-wrapper' }, img({ src: property.smallPhotos[0]?.mediaUrl })),
    div({ class: 'info' },
      span({ class: 'price' }, property.ListPriceUS || ''),
      span({ class: 'address' }, property.StreetName || ''),
      span({ class: 'municipality' }, property.municipality || ''),
      span({ class: 'providers' }, property.providers || ''),
    ),
  );
}

export async function pinGroupClickHandler(e, cluster) {
  if (BREAKPOINTS.medium.matches) {
    return;
  }
  const infoWindow = scrollAndGetInfoWindow();
  infoWindow.classList.add('cluster');
  const listings = cluster.markers.map((m) => m.listingKey);
  const details = await getDetails(...listings);

  const links = [];
  details.forEach((property) => {
    links.push(createInfo(property));
  });
  infoWindow.replaceChildren(...links);
}

async function pinClickHandler(listingId) {
  if (BREAKPOINTS.medium.matches) {
    return;
  }
  const infoWindow = scrollAndGetInfoWindow();
  infoWindow.classList.remove('cluster');
  const property = (await getDetails(listingId))[0];
  const infoWrapper = createInfo(property);
  infoWrapper.querySelector('.info').append(
    div({ class: 'property-buttons' },
      a({ class: 'contact-us', 'aria-label': `Contact us about ${property.StreetName}` },
        span({ class: 'icon icon-envelope' }, img({
          'data-icon-name': 'envelope',
          src: '/icons/envelope.svg',
          alt: 'envelope',
        })),
        span({ class: 'icon icon-envelopedark' }, img({
          'data-icon-name': 'envelopedark',
          src: '/icons/envelopedark.svg',
          alt: 'envelope',
        })),
      ),
      a({ class: 'save', 'aria-label': `Save ${property.StreetName}` },
        span({ class: 'icon icon-heartempty' }, img({
          'data-icon-name': 'heartempty',
          src: '/icons/heartempty.svg',
          alt: 'heart',
        })),
        span({ class: 'icon icon-heartemptydark' }, img({
          'data-icon-name': 'heartemptydark',
          src: '/icons/heartemptydark.svg',
          alt: 'heart',
        })),
        span({ class: 'icon icon-heartfull' }, img({
          'data-icon-name': 'heartfull',
          src: '/icons/heartfull.svg',
          alt: 'heart',
        })),
      ),
    ),
  );

  infoWindow.replaceChildren(infoWrapper);
}

/**
 * Create a cluster marker from a search result cluster.
 * @param {Object} pin
 * @param {Number} pin.lat Latitude of the pin
 * @param {Number} pin.lon Longitude of the pin
 * @param {Number} pin.price Price of the pin listing
 * @param {Number} pin.listingKey Listing id of the pin
 * @param {Number} pin.officeCode Office code of the listing.
 */
function createPinMarker(pin) {
  const icon = {
    url: '/icons/maps/map-marker-standard.png',
    scaledSize: new google.maps.Size(50, 25),
    anchor: new google.maps.Point(25, 0),
  };

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(pin.lat, pin.lon),
    zIndex: 1,
    icon,
    label: {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      text: `$${formatPrice(pin.price)}`,
      color: 'white',
      className: 'no-class',
    },
  });
  marker.addListener('click', () => {
    pinClickHandler(pin.listingKey);
  });
  marker.listingKey = pin.listingKey;
  return marker;
}

export default async function displayPins(map, pins) {
  const markers = [];
  pins.forEach((pin) => {
    const marker = createPinMarker(pin);
    marker.setMap(map);
    markers.push(marker);
  });
  return markers;
}
