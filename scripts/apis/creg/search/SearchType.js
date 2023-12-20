const defaultParameterBuilder = (v) => `SearchParameter=${encodeURIComponent(v)}`;

export default class SearchType {
  constructor(type, parameterBuilder) {
    this.type = type;
    this.paramBuilder = parameterBuilder;
  }
}

SearchType.Address = new SearchType('Address', defaultParameterBuilder);
SearchType.City = new SearchType('City', defaultParameterBuilder);
SearchType.Community = new SearchType('Community', mapParameterBuilder);
SearchType.Empty = new SearchType('Empty', () => '');
SearchType.Neighborhood = new SearchType('Neighborhood', defaultParameterBuilder);
SearchType.School = new SearchType('School', defaultParameterBuilder);
SearchType.SchoolDistrict = new SearchType('School District', defaultParameterBuilder);
SearchType.ZipCode = new SearchType('ZipCode', defaultParameterBuilder);
SearchType.listingId = new SearchType('listingId', defaultParameterBuilder);

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
