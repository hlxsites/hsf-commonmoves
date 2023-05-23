const urlParams = new URLSearchParams(window.location.search);
const DOMAIN = urlParams.get('env') === 'stage' ? 'ignite-staging.bhhs.com' : 'www.bhhs.com';
const API_URL = `https://${DOMAIN}/bin/bhhs`;

let suggestionFetchController;

/**
 * Types of Agent suggestions
 */
export class SuggestionType {
  static #TYPES = [];

  constructor(type, param, label) {
    this.type = type;
    this.param = param;
    this.label = label;
    SuggestionType.#TYPES.push(type);
  }

  /**
   * A list of all the types by their type keyword.
   *
   * @return {string[]}
   */
  static get types() {
    return [...SuggestionType.#TYPES];
  }
}

SuggestionType.NAME = new SuggestionType('name', 'full_name', 'Name');
SuggestionType.CITY = new SuggestionType('city', 'city', 'City');
SuggestionType.STATE = new SuggestionType('state', 'state', 'State');
SuggestionType.POSTAL_CODE = new SuggestionType('zipcode', 'postal_code', 'Postal');
SuggestionType.COUNTRY = new SuggestionType('country', 'country', 'Country');
SuggestionType.LANGUAGE = new SuggestionType('language', 'language', 'Country');
SuggestionType.DESIGNATION = new SuggestionType('designation', 'designation', 'Designation');

export function typeFor(type) {
  const [found] = Object.getOwnPropertyNames(SuggestionType)
    .filter((t) => SuggestionType[t]?.type === type)
    .map((t) => SuggestionType[t]);

  return found;
}

/**
 * Retrieves Suggestions from the suggestions API, but filters out results that aren't valid.
 *
 * @param {String} office the id of office for the site performing the search.
 * @param {String} keyword the partial for suggestion search
 *
 * @return {Promise<Object>|undefined} Promise with results or undefined if fetch was aborted.
 */
export async function getSuggestions(office, keyword) {
  suggestionFetchController?.abort();
  suggestionFetchController = new AbortController();
  const { signal } = suggestionFetchController;

  const endpoint = `${API_URL}/suggesterServlet?search_type=agent&keyword=${keyword}&office_id=${office}&_=${Date.now()}`;
  return fetch(endpoint, { signal })
    .then((resp) => {
      if (resp.ok) {
        return resp.json().then((data) => {
          Object.keys(data).forEach((k) => {
            if (!SuggestionType.types.includes(k)) {
              delete data[k];
            }
          });
          return data;
        });
      }
      // eslint-disable-next-line no-console
      console.log('Unable to fetch suggestions');
      return [];
    }).catch((err) => {
      if (err.name === 'AbortError') {
        // User abort, do nothing;
        return undefined;
      }
      throw err;
    });
}

export function abortSuggestions() {
  suggestionFetchController?.abort();
}
