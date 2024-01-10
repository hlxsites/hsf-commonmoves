const defaultParameterBuilder = (v) => `SearchParameter=${encodeURIComponent(v)}`;

export default class SearchType {
  constructor(type, parameterBuilder) {
    this.type = type;
    this.paramBuilder = parameterBuilder;
  }
}

SearchType.Community = new SearchType('Community', mapParameterBuilder);
/**
 * Returns the SearchType for the specified string.
 *
 * @param {string} type
 * @returns {SearchType} the matching type.
 */
export function searchTypeFor(type) {
  const [found] = Object.getOwnPropertyNames(SearchType)
    .filter((t) => t.toLowerCase() === type.toLowerCase())
    .map((t) => SearchType[t]);
  return found;
}
