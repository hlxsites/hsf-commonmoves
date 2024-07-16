/**
 * Handle the Worker event. Fetches school details for the provided lat/long.
 *
 * @param {Object} event the worker event.
 * @param {string} event.data.api the URL to fetch.
 * @param {string} event.data.lat latitude
 * @param {string} event.data.long longitude
 */
onmessage = async (event) => {
  const { lat, long } = event.data;
  const promises = [];
  promises.push(
    fetch(`/bin/bhhs/pdp/cregSchoolServlet?latitude=${lat}&longitude=${long}`)
      .then((resp) => (resp.ok ? resp.json() : undefined)),
  );

  Promise.all(promises).then((values) => {
    postMessage(values.filter((v) => v));
  });
};
