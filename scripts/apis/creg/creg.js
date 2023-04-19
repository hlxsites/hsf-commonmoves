/* Wrapper for all Creg API endpoints */

const CREG_API_URL = 'https://www.bhhs.com/bin/bhhs';

let suggestionFetchController;

const mapSuggestions = (json) => {
  const results = [];
  const { searchTypes, suggestions } = json;

  if (!suggestions) {
    return results;
  }

  const keys = Object.keys(suggestions);
  keys.forEach((k) => {
    if (!suggestions[k.toLowerCase()]) {
      suggestions[k.toLowerCase()] = suggestions[k];
    }
  });
  searchTypes.forEach((type) => {
    const name = type.searchType.replaceAll(/\s+/g, '').toLowerCase();
    if (suggestions[name] && suggestions[name].length) {
      results.push({
        ...type,
        results: suggestions[name],
      });
    }
  });

  return results;
};

/**
 * Get suggestions for users based on their input and optional country.
 *
 * @param {String} keyword the partial for suggestion search
 * @param {String} [country=undefined] optional country for narrowing search
 *
 * @return {Promise<Object[]>}
 */
export async function getSuggestions(keyword, country = undefined) {
  if (suggestionFetchController) {
    suggestionFetchController.abort();
  }
  suggestionFetchController = new AbortController();
  const { signal } = suggestionFetchController;

  let endpoint = `${CREG_API_URL}/cregSearchSuggesterServlet?Keyword=${keyword}&_=${Date.now()}`;
  if (country) {
    endpoint += `&Country=${country}`;
  }

  return fetch(endpoint, { signal })
    .then((resp) => {
      suggestionFetchController = undefined;
      if (resp.ok) {
        return resp.json().then(mapSuggestions);
      }
      // eslint-disable-next-line no-console
      console.log('Unable to fetch suggestions.');
      return [];
    }).catch((err) => {
      if (err.name === 'AbortError') {
        return [];
      }
      throw err;
    });
}

export function abortSuggestions() {
  if (suggestionFetchController) {
    suggestionFetchController.abort();
  }
}
