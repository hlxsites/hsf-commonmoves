import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import Search from '../../../../../scripts/apis/creg/search/Search.js';
import NeighborhoodSearch from '../../../../../scripts/apis/creg/search/types/NeighborhoodSearch.js';

describe('NeighborhoodSearch', () => {
  describe('create from block config', () => {
    it('should have defaults', async () => {
      const search = await Search.fromBlockConfig({
        'search type': 'Neighborhood',
      });
      assert(search instanceof NeighborhoodSearch, 'Created correct type.');
    });
    it('should populate Neighborhood specific values', async () => {
      const search = await Search.fromBlockConfig({
        'search type': 'neighborhood',
        neighborhood: '123 Elm Street, Nowhere, NO 12345',
      });
      assert(search instanceof NeighborhoodSearch, 'Created correct type.');
      assert.equal(search.neighborhood, '123 Elm Street, Nowhere, NO 12345', 'Neighborhood set');
    });
  });

  describe('to/from URL Search Parameters', () => {
    it('should have defaults', async () => {
      const search = new NeighborhoodSearch();
      const queryStr = search.asURLSearchParameters().toString();

      assert.match(queryStr, /type=Neighborhood/, 'Query string includes search type parameter.');
      const created = await Search.fromQueryString(queryStr);
      assert.deepStrictEqual(created, search, 'Object was parsed from query string correctly.');
    });
    it('should read neighborhood specific parameters', async () => {
      const search = new NeighborhoodSearch();
      search.neighborhood = '123 Elm Street, Nowhere, NO 12345';

      const queryStr = search.asURLSearchParameters().toString();
      assert.match(queryStr, /type=Neighborhood/, 'Query string includes search type parameter.');
      assert.match(queryStr, /neighborhood=123\+Elm\+Street%2C\+Nowhere%2C\+NO\+12345/, 'Query string includes neighborhood.');
      const created = await Search.fromQueryString(queryStr);
      assert.deepStrictEqual(created, search, 'Object was parsed from query string correctly.');
    });
  });

  describe('to/from JSON', () => {
    it('should have defaults', async () => {
      const search = new NeighborhoodSearch();
      const created = await Search.fromJSON(JSON.parse(JSON.stringify(search)));
      assert.deepStrictEqual(created, search, 'To/From JSON correct.');
    });
    it('should read neighborhood specific parameters', async () => {
      const search = new NeighborhoodSearch();
      search.neighborhood = '123 Elm Street, Nowhere, NO 12345';
      const created = await Search.fromJSON(JSON.parse(JSON.stringify(search)));
      assert.deepStrictEqual(created, search, 'To/From JSON correct.');
    });
  });

  describe('to CREG URL Search Parameters', () => {
    it('should have neighborhood search parameters', () => {
      const search = new NeighborhoodSearch();
      search.neighborhood = '123 Elm Street, Nowhere, NO 12345';

      const queryStr = search.asCregURLSearchParameters().toString();
      assert.match(queryStr, /SearchType=Neighborhood/, 'Query string includes search type.');
      assert.match(queryStr, /SearchParameter=123\+Elm\+Street%2C\+Nowhere%2C\+NO\+12345/, 'Query string includes Search parameter structure.');
    });
  });
});
