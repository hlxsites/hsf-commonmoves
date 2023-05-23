/**
 * Sort types for Agent Searches.
 */
export default class Sort {
  constructor(id, label) {
    this.id = id;
    this.label = label;
  }
}

Sort.LAST_NAME_ASC = new Sort(1, 'sort_last_name_asc');
Sort.LAST_NAME_DESC = new Sort(2, 'sort_last_name_desc');
// An id === 3 exists, but no idea what it is or means.
Sort.CITY_ASC = new Sort(4, 'sort_city_asc');
Sort.CITY_DESC = new Sort(5, 'sort_city_desc');
Sort.STATE_ASC = new Sort(6, 'sort_state_asc');
Sort.STATE_ASC = new Sort(7, 'sort_state_desc');

/**
 * Find the sort given the type.
 *
 * @param {number} id the id of the sort
 * @return {Sort|undefined} the found sort
 */
export function sortFor(id) {
  const [found] = Object.getOwnPropertyNames(Sort)
    .filter((t) => Sort[t]?.id === id)
    .map((t) => Sort[t]);

  return found;
}
