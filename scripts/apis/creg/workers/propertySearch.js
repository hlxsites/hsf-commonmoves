/**
 * Handle the Worker event.
 *
 * @param {Object} event the worker event.
 * @param {string} event.data.url the URL to fetch.
 *
 */
onmessage = async (event) => {
  try {
    const resp = await fetch(event.data.url);
    if (resp.ok) {
      postMessage(await resp.json());
    } else {
      postMessage({});
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to fetch properties from API.', error);
    postMessage({});
  }
};
