const urlParams = new URLSearchParams(window.location.search);
export const DOMAIN = urlParams.get('env') === 'stage' ? 'ignite-staging.bhhs.com' : 'www.bhhs.com';
const API_URL = `https://${DOMAIN}/bin/bhhs`;

const keys = [
  'BedroomsTotal',
  'BathroomsTotal',
  'ListPriceUS',
  'StreetName',
  'City',
  'StateOrProvince',
  'PostalCode',
  'Latitude',
  'Longitude',
  'LotSizeAcres',
  'LotSizeSquareFeet',
  'LivingArea',
  'LivingAreaUnits',
  'Media',
  'SmallMedia',
  'PropId',
  'OpenHouses',
  'CourtesyOf',
];

function pick(obj, ...args) {
  return args.reduce((res, key) => ({ ...res, [key]: obj[key] }), { });
}

function getPropIdFromPath() {
  const url = window.location.pathname;
  const idx = url.indexOf('pid-') + 'pid-'.length;
  return url.substring(idx);
}

async function getPropertyByPropId(propId) {
  const endpoint = `${API_URL}/CregPropertySearchServlet?SearchType=ListingId&ListingId=${propId}&ListingStatus=1,2,3&ApplicationType=FOR_SALE,FOR_RENT,RECENTLY_SOLD`;
  const resp = await fetch(endpoint);
  if (resp.ok) {
    const data = await resp.json();
    /* eslint-disable-next-line no-underscore-dangle */
    return data;
  }
  /* eslint-disable-next-line no-console */
  console.log('Unable to retrieve property information.');
  return undefined;
}

async function getSocioEconomicData(latitude, longitude) {
  const endpoint = `${API_URL}/pdp/socioEconomicDataServlet?latitude=${latitude}&longitude=${longitude}`;
  const resp = await fetch(endpoint);
  if (resp.ok) {
    const data = await resp.json();
    /* eslint-disable-next-line no-underscore-dangle */
    return data;
  }
  /* eslint-disable-next-line no-console */
  console.log('Unable to retrieve socioeconomic data.');
  return undefined;
}

export default async function decorate(block) {
  let property = {};
  let socioEconomicData = {};
  const propId = getPropIdFromPath();
  const propertyData = await getPropertyByPropId(propId);
  if (propertyData) {
    property = pick(propertyData, ...keys);
    const latitude = urlParams.get('latitude') || property.Latitude;
    const longitude = urlParams.get('longitude') || property.Longitude;
    if (latitude && longitude) {
      const socioEconData = await getSocioEconomicData(latitude, longitude);
      if (socioEconData) {
        socioEconomicData = socioEconData;
      }
    }
  }
  window.property = property;
  window.socioEconomicData = socioEconomicData;
  block.remove();
}
