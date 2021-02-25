import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from "../.keystone/schema-types";
import { Session } from '../types';
import { CartItem } from '../schemas/CartItem';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // query current user
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be loggged in to do this')
  }
  // query the current user cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: {
      user: { id: sesh.itemId },
      product: { id: productId }
    },
    resolveFields: 'id,quantity'
  })

  const [existingCartItem] = allCartItems
  // check if item is already in the cart
  if (existingCartItem) {
    // if it is, increment qty by one
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false,
    })
  }
  // else create new cartitem
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } }
    },
    resolveFields: false,
  })
}

export default addToCart;
