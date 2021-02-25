import { useState } from "react";
import { useContext, createContext } from "react";

const LocalCartContext = createContext();

function CartStateProvider({ children }) {

  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false)
  }

  function openCart() {
    setCartOpen(true)
  }

  return (
    <LocalCartContext.Provider value={{
      cartOpen,
      setCartOpen,
      openCart,
      closeCart,
      toggleCart
    }}>
    {children}
    </LocalCartContext.Provider>
  )
}

function useCart() {
  const all = useContext(LocalCartContext);
  return all;
}

export { CartStateProvider, useCart };
