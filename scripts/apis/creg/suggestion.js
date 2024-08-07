/*
  Suggestion API
 */

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
    let name = type.searchType.replaceAll(/\s+/g, '').toLowerCase();
    if (name === 'zip') name = 'zipcode'; // ZipCode != Zip - and broke somewhere along the way.
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
 * @return {Promise<Object[]>|undefined}
 *    Any available suggestions, or undefined if the search was aborted.
 */
export async function get(keyword, country = undefined) {
  suggestionFetchController?.abort();
  suggestionFetchController = new AbortController();

  const { signal } = suggestionFetchController;

  let endpoint = `/bin/bhhs/cregSearchSuggesterServlet?Keyword=${keyword}&_=${Date.now()}`;
  if (country) {
    endpoint += `&Country=${country}`;
  }

  return fetch(endpoint, { signal })
    .then((resp) => {
      if (resp.ok) {
        return resp.json().then(mapSuggestions);
      }
      // eslint-disable-next-line no-console
      console.log('Unable to fetch suggestions.');
      return [];
    }).catch((err) => {
      if (err.name === 'AbortError') {
        return undefined;
      }
      throw err;
    });
}

export function abort() {
  suggestionFetchController?.abort();
}
