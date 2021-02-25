import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Head from "next/head";
import styled from "styled-components";

import ErrorMessage from './ErrorMessage';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: start;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`;


const SingleProduct = ({ id }) => {

  const {data, error, loading} = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id
    }
  });
  // console.log( {data, error, loading});

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  const { Product } = data;

  return <ProductStyles>
    <Head>
      <title>TlT | {Product.name}</title>
    </Head>
    <img src={Product.photo.image.publicUrlTransformed} alt={Product.photo.altText} />
    <div className="details">
      <h2>{Product.name}</h2>
      <p>{Product.description}</p>
    </div>
  </ProductStyles>
};

export default SingleProduct;
