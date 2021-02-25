import styled from 'styled-components'
import gql from 'graphql-tag';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { check } from 'prettier';
import { useRouter } from 'next/dist/client/router';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import nProgress from 'nprogress';

import SickButton from "./styles/SickButton";
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutForm = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState()
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { closeCart } = useCart();
  const [checkout, { error: graphqlError }] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  async function handleSubmit(e) {
    // stop form from submitting and start loader
    e.preventDefault();
    setLoading(true)

    // start page transition
    nProgress.start();

    // create payment method via stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })
    console.log(paymentMethod);

    // handle any errors from stripe
    if (error) {
      setError(error);
      nProgress.done();
      return;
    }

    // send token to keystone
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      }
    })
    console.log('order done', order)

    // change page to view the order
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id }
    })

    // close the cart
    closeCart();

    // turn loader off
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphqlError && <p style={{ fontSize: 12 }}>{graphqlError.message}</p>}
      <CardElement />
      <SickButton>Check out now</SickButton>
    </CheckoutFormStyles>
  );
};

function Checkout() {
  return <Elements stripe={stripeLib}>
    <CheckoutForm />
  </Elements>
}

export default Checkout;
