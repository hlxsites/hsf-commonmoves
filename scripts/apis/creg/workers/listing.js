
/**
 * Handle the Worker event. Fetches details for each provided listing id.
 *
 * @param {Object} event the worker event.
 * @param {string} event.data.api the URL to fetch.
 * @param {string[]} event.data.listings list of listing ids
 */
onmessage = async (event) => {
  const { api, listings } = event.data;
  const promises = [];
  promises

}
CregPropertySearchServlet?SearchType=ListingId&ListingId=${propId}&ListingStatus=1,2,3&ApplicationType=FOR_SALE,FOR_RENT,RECENTLY_SOLD`;
