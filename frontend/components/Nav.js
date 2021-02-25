import Link from 'next/link';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useCart } from '../lib/cartState';
import { useUser } from './User';
import CartCount from './CartCount';

const Nav = () => {
  const user = useUser();
  const { openCart } = useCart()

  return (
    <NavStyles>
      <Link href="/products">Products</Link>
      {
        user && (
          <>
            <Link href="/sell">Sell</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/account">Account</Link>
            <SignOut></SignOut>
            <button type="button" onClick={openCart}>
              Cart
              <CartCount count={user.cart.reduce(
                (tally, cartItem) => tally + (cartItem.product ? cartItem.quantity : 0),
                0
              )} />
            </button>
          </>
        )
      }
      {!user && (
        <Link href="/signin">Sign In</Link>
      )}
    </NavStyles>
  )
};

export default Nav;
