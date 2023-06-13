import React from 'react';

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  removeItemRow: (id) => {},
  clearCart: () => {}
});

export default CartContext;