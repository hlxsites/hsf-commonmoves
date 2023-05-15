const propertyAPI = 'https://www.bhhs.com/bin/bhhs/CregPropertySearchServlet?ucsid=false&SearchType=Radius&ApplicationType=FOR_SALE&Sort=PRICE_ASCENDING&PageSize=9&MinPrice=412450&MaxPrice=1237350&Latitude=41.96909713745117&Longitude=-71.22725677490234&Distance=2&CoverageZipcode=&teamNearBy=&teamCode=';

export async function getPropertyListing(propID) {
  const resp = await fetch(propertyAPI);
  if (resp.ok) {
    const data = await resp.json();
    const listing = data.properties.find((item) => item.PropId == propID);
    return listing;
  } 
  return null;
}