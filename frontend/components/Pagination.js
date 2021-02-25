import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';

import PaginationStyles from "../components/styles/PaginationStyles";
import ErrorMessage from '../components/ErrorMessage';
import { perPage } from '../config';

export const ITEMS_COUNT_QUERY = gql`
  query ITEMS_COUNT_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

const Pagination = ({ page }) => {
  const { data, error, loading } = useQuery(ITEMS_COUNT_QUERY);
  if (loading) return 'Loading...';
  if (error) return <ErrorMessage error={error} />;
  const { count } = data._allProductsMeta;
  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>TlT - page {page} of {pageCount}</title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}>← Prev</a>
      </Link>
      <p>Page {page} of {pageCount}</p>
      <p>{count} Items total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next →</a>
      </Link>
    </PaginationStyles>
  );
};

export default Pagination;
