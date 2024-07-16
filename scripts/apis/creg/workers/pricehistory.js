/**
 * Handle the Worker event. Fetches price history for a provided listing id.
 *
 * @param {Object} event the worker event.
 * @param {string} event.data.api the URL to fetch.
 * @param {string} event.data.id listing id.
 */
onmessage = async (event) => {
  const { listingId } = event.data;

  try {
    const response = await fetch(`/v1/pricehistory/${listingId}`);
    const data = response.ok ? await response.json() : undefined;

    postMessage(data);
  } catch (error) {
    postMessage({});
  }
};
