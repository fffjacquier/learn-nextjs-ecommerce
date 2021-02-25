import { KeystoneContext } from '@keystone-next/types';

import { CartItemCreateInput, OrderCreateInput } from "../.keystone/schema-types";
import { User } from '../schemas/User';
import { CartItem } from '../schemas/CartItem';
import stripeConfig from '../lib/stripe';

const graphql= String.raw;
/*
interface Arguments {
  token: string
}
*/

async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // make sure user signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed to create an order!');
  }
  // query the user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `
  });
  console.log(user);

  // calculate total price
  const cartItems = user.cart.filter(cartItem => cartItem.product);
  const amount = cartItems.reduce(function(tally: number, cartItem: CartItemCreateInput) {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
  console.log(amount);

  // create the charge with stripe
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'EUR',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(error)
    throw new Error(error.message);
  });
  console.log(charge)

  // convert the cart items to order items
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.product.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    }
    return orderItem;
  })

  // create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } }
    },
    resolveFields: false,
  });

  // cleanup any old cart items
  const cartItemIds = user.cart.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  })
  return order;

}

export default checkout;
