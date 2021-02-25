/* eslint-disable react/prop-types */
import React from 'react';
import Router from 'next/router';
import { ApolloProvider } from '@apollo/client';
import NProgress from 'nprogress';
import withData from '../lib/withData';

import Page from '../components/Page';

import '../components/styles/nprogress.css';
import { CartStateProvider } from '../lib/cartState';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps, apollo }) => (
  <ApolloProvider client={apollo}>
    <CartStateProvider>
      <Page>
        <Component {...pageProps} />
      </Page>
    </CartStateProvider>
  </ApolloProvider>
);

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MyApp);
