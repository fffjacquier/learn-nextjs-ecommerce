import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";

import formatMoney from '../lib/formatMoney'
import ErrorMessage from "../components/ErrorMessage";
import OrderStyles from "../components/styles/OrderStyles";
import OrderItemStyles from "../components/styles/OrderItemStyles";

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrdersUlStyles = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInOrder (order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0)
}

const OrdersPage = () => {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;

  const { allOrders } = data;
  return <div>
    <h2>You have {allOrders.length} order{allOrders.length <= 1 ? '' : 's'}</h2>
    <OrdersUlStyles>
      {allOrders.map(order => (
        <OrderItemStyles key={order.id}>
          <Link href={`/order/${order.id}`}>
            <>
              <div className="order-meta">
                <p>{countItemsInOrder(order)} items</p>
                <p>{order.items.length} Product{order.items.length <= 1 ? '' : 's'}</p>
                <p>{formatMoney(order.total)}</p>
              </div>
              <div className="images">
                {order.items.map(item => <img key={item.id} src={item.photo?.image?.publicUrlTransformed} alt={item.name} />)}
              </div>
            </>
          </Link>

        </OrderItemStyles>
      ))}
    </OrdersUlStyles>
  </div>
};

export default OrdersPage;
