import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import Search from '../../../../scripts/apis/creg/search/Search.js';
import ListingType from '../../../../scripts/apis/creg/search/types/ListingType.js';
import OpenHouses from '../../../../scripts/apis/creg/search/types/OpenHouses.js';
import PropertyType from '../../../../scripts/apis/creg/search/types/PropertyType.js';

describe('Search', () => {
  it('should have defaults', () => {
    const search = new Search();
    assert.equal(search.page, '1', 'Default page parameter.');
    assert.equal(search.pageSize, '32', 'Default page size parameter.');
    assert.equal(search.isNew, false, 'Default new listing parameter.');
    assert.deepStrictEqual(search.listingTypes, [ListingType.FOR_SALE], 'Default listing type parameter.');
    assert.deepStrictEqual(search.propertyTypes, [PropertyType.CONDO_TOWNHOUSE, PropertyType.SINGLE_FAMILY], 'Default property type parameter.');
  });

  it('should populate listing types correctly', () => {
    const search = new Search();
    search.listingTypes = [{ type: 'PENDING' }, 'FOR_RENT', { type: 'UNKNOWN' }, { type: 'RECENTLY_SOLD' }];
    assert.deepStrictEqual(search.listingTypes, [ListingType.PENDING, ListingType.FOR_RENT, ListingType.RECENTLY_SOLD], 'Set the listing types correctly.');

    search.listingTypes = [{ type: 'UNKNOWN' }];
    assert.deepStrictEqual(search.listingTypes, [], 'Does not set unknown type.');

    search.addListingType({ type: 'UNKNOWN' });
    assert.deepStrictEqual(search.listingTypes, [], 'Does not add unknown type');

    search.addListingType({ type: 'PENDING' });
    search.addListingType(ListingType.RECENTLY_SOLD);
    search.addListingType('FOR_SALE');
    assert.deepStrictEqual(search.listingTypes, [ListingType.PENDING, ListingType.RECENTLY_SOLD, ListingType.FOR_SALE], 'Set the listing types correctly.');
  });

  it('should populate property types correctly', async () => {
    const search = new Search();
    search.propertyTypes = [{ name: 'SINGLE_FAMILY' }, 'COMMERCIAL', { name: 'UNKNOWN' }, { name: 'LAND' }];
    assert.deepStrictEqual(search.propertyTypes, [PropertyType.SINGLE_FAMILY, PropertyType.COMMERCIAL, PropertyType.LAND], 'Set the property types correctly.');

    search.propertyTypes = [{ name: 'UNKNOWN' }];
    assert.deepStrictEqual(search.propertyTypes, [], 'Does not set unknown type.');

    search.addPropertyType('UNKNOWN');
    assert.deepStrictEqual(search.propertyTypes, [], 'Does not add unknown type');

    search.addPropertyType({ id: 6 });
    search.addPropertyType(PropertyType.COMMERCIAL);
    search.addPropertyType('LAND');
    assert.deepStrictEqual(search.propertyTypes, [PropertyType.FARM, PropertyType.COMMERCIAL, PropertyType.LAND], 'Set the property types correctly.');
  });

  describe('create from block config', () => {
    it('should create with defaults', async () => {
      const search = await Search.fromBlockConfig({});
      assert.deepStrictEqual(search, new Search(), 'Created default instance.');
    });

    it('support configurations', async () => {
      const search = await Search.fromBlockConfig({
        'Min price': '2000',
        'max price': '2000000',
        new: true,
        'Open houses': 'true',
        'page size': '12',
        'listing type': 'pending \n\t\n for rent',
        'pRoPerTy TYPES': '\n\n   farm\n\n   condo',
        'sort by': 'DATE',
        'sort direction': 'ascending',
      });

      assert.equal(search.minPrice, '2000', 'Min price set');
      assert.equal(search.maxPrice, '2000000', 'Max price set');
      assert(search.isNew, 'New property flag set.');
      assert.equal(search.openHouses, OpenHouses.ANYTIME, 'Open houses set.');
      assert.equal(search.page, '1', 'Page set.');
      assert.equal(search.pageSize, '12', 'Page size set.');
      assert.deepStrictEqual(search.listingTypes, [ListingType.FOR_RENT, ListingType.PENDING], 'Listing types set.');
      assert.deepStrictEqual(search.propertyTypes, [PropertyType.CONDO_TOWNHOUSE, PropertyType.FARM], 'Property types set.');
      assert.equal(search.sortBy, 'DATE', 'Sort type set.');
      assert.equal(search.sortDirection, 'ASC', 'Sort direction set.');
    });
  });

  describe('to/from URL Search Parameters', () => {
    it('should have defaults', async () => {
      const search = new Search();
      const queryStr = search.asURLSearchParameters().toString();

      assert.match(queryStr, /page=1/, 'Query string includes page parameter.');
      assert.match(queryStr, /pageSize=32/, 'Query string includes page size parameter.');
      assert.match(queryStr, /listingTypes=FOR_SALE/, 'Query string includes listing types parameter.');
      assert.match(queryStr, /propertyTypes=CONDO_TOWNHOUSE&propertyTypes=SINGLE_FAMILY/, 'Query string includes property type parameter.');
      assert.match(queryStr, /sortBy=PRICE/, 'Query string includes sort property parameter.');
      assert.match(queryStr, /sortDirection=DESC/, 'Query string includes sort direction parameter.');

      const created = await Search.fromQueryString(queryStr);
      assert.deepStrictEqual(created, search, 'Object was parsed from query string correctly.');
    });

    it('should support all parameters', async () => {
      const search = new Search();
      search.input = 'foo';
      search.minPrice = '10000';
      search.maxPrice = '1000008';
      search.isNew = true;
      search.openHouses = 'ONLY_WEEKEND';
      search.page = '2';
      search.pageSize = '8';
      search.listingTypes = [ListingType.FOR_SALE, ListingType.RECENTLY_SOLD];
      search.propertyTypes = [PropertyType.MULTI_FAMILY, PropertyType.LAND];
      search.sortBy = 'DISTANCE';
      search.sortDirection = 'ASC';

      const queryStr = search.asURLSearchParameters().toString();
      assert.match(queryStr, /input=foo/, 'Query string includes search input parameter.');
      assert.match(queryStr, /minPrice=10000/, 'Query string includes min price.');
      assert.match(queryStr, /maxPrice=1000008/, 'Query string includes max price.');
      assert.match(queryStr, /isNew=true/, 'Query string includes new listing flag');
      assert.match(queryStr, /page=2/, 'Query string includes updated page parameter.');
      assert.match(queryStr, /pageSize=8/, 'Query string includes updated page size parameter.');
      assert.match(queryStr, /openHouses=ONLY_WEEKEND/, 'Query string includes search open house parameter.');
      assert.match(queryStr, /propertyTypes=MULTI_FAMILY&propertyTypes=LAND/, 'Query string includes Property Types');
      assert.match(queryStr, /listingTypes=FOR_SALE&listingTypes=RECENTLY_SOLD/, 'Query string includes Application Types');
      assert.match(queryStr, /sortBy=DISTANCE/, 'Query string includes sort type');
      assert.match(queryStr, /sortDirection=ASC/, 'Query string includes sort direction.');

      const created = await Search.fromQueryString(queryStr);
      assert.deepStrictEqual(created, search, 'Object was parsed from query string correctly.');
    });
  });

  describe('to/from JSON', () => {
    it('should have defaults', async () => {
      const search = new Search();
      const created = await Search.fromJSON(JSON.parse(JSON.stringify(search)));
      assert.deepStrictEqual(created, search, 'To/From JSON correct.');
    });

    it('should support all parameters', async () => {
      const search = new Search();
      search.input = 'foo';
      search.minPrice = '10000';
      search.maxPrice = '1000000';
      search.isNew = true;
      search.openHouses = 'ONLY_WEEKEND';
      search.page = '2';
      search.pageSize = '8';
      search.listingTypes = [ListingType.FOR_SALE, ListingType.RECENTLY_SOLD];
      search.propertyTypes = [PropertyType.MULTI_FAMILY, PropertyType.LAND];
      search.sortBy = 'DISTANCE';
      search.sortDirection = 'ASC';
      const created = await Search.fromJSON(JSON.parse(JSON.stringify(search)));
      assert.deepStrictEqual(created, search, 'To/From JSON correct.');
    });
  });

  describe('to CREG URL Search Parameters', () => {
    it('should have defaults', () => {
      const search = new Search();
      const queryStr = search.asCregURLSearchParameters().toString();

      assert.match(queryStr, /Page=1/, 'Query string includes updated page parameter.');
      assert.match(queryStr, /PageSize=32/, 'Query string includes updated page size parameter.');
      assert.match(queryStr, /ApplicationType=FOR_SALE/, 'Query string includes Application type parameter.');
      assert.match(queryStr, /PropertyType=1%2C2/, 'Query string includes property type parameter.');
      assert.match(queryStr, /Sort=PRICE_DESCENDING/, 'Query string includes sort parameter.');
    });

    it('should support all parameters', () => {
      const search = new Search();
      search.input = 'foo';
      search.minPrice = '10000';
      search.maxPrice = '1000000';
      search.isNew = true;
      search.openHouses = 'ONLY_WEEKEND';
      search.page = '2';
      search.pageSize = '8';
      search.listingTypes = [ListingType.FOR_SALE, ListingType.RECENTLY_SOLD];
      search.propertyTypes = [PropertyType.MULTI_FAMILY, PropertyType.LAND];
      search.sortBy = 'DISTANCE';
      search.sortDirection = 'ASC';

      const queryStr = search.asCregURLSearchParameters().toString();
      assert.match(queryStr, /SearchInput=foo/, 'Query string includes search input parameter.');
      assert.match(queryStr, /MinPrice=10000/, 'Query string includes min price.');
      assert.match(queryStr, /MaxPrice=1000000/, 'Query string includes max price.');
      assert.match(queryStr, /NewListing=true/, 'Query string includes new listing flag');
      assert.match(queryStr, /Page=2/, 'Query string includes updated page parameter.');
      assert.match(queryStr, /PageSize=8/, 'Query string includes updated page size parameter.');
      assert.match(queryStr, /OpenHouses=7/, 'Query string includes search open house parameter.');
      assert.match(queryStr, /PropertyType=4%2C5/, 'Query string includes Property Types');
      assert.match(queryStr, /ApplicationType=FOR_SALE%2CRECENTLY_SOLD/, 'Query string includes Application Types');
      assert.match(queryStr, /Sort=DISTANCE_ASCENDING/, 'Query string includes sort type');
    });
  });
});
