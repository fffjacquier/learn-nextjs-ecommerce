import { ITEMS_COUNT_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we take care of everything
    read(existing = [], { args, cache }) {
      // args here are first and skip values
      const { skip, first } = args;

      // how many items on the page from the cache
      const data = cache.readQuery({ query: ITEMS_COUNT_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existing.slice(skip, skip + first).filter((item) => item);
      //
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      // if no item in the cache return false to use a network request
      if (items.length !== first) {
        return false;
      }
      // return items from cache
      if (items.length) {
        return items;
      }

      return false;
    },
    merge(existingCache, incoming, { args }) {
      const { skip, first } = args;
      // this runs when apollo client comes back from a network request with a product
      const merged = existingCache ? existingCache.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    }
  }
}
