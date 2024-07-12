/**
 * Handle the Worker event. Fetches school details for the provided lat/long.
 *
 * @param {Object} event the worker event.
 * @param {string} event.data.api the URL to fetch.
 * @param {string} event.data.listingId - The ID of the listing.
 * @param {string} event.data.lat latitude
 * @param {string} event.data.long longitude
 * @param {string} event.data.zipcode the zip code
 */
onmessage = async (event) => {
  const {
    listingId, lat, long, zipcode,
  } = event.data;
  const promises = [];
  promises.push(
    fetch(`/bin/bhhs/CregMarketTrends?PropertyId=${listingId}&Latitude=${lat}&Longitude=${long}&zipCode=${zipcode}`)
      .then((resp) => (resp.ok ? resp.json() : undefined)),
  );

  Promise.all(promises).then((values) => {
    postMessage(values.filter((v) => v));
  });
};
