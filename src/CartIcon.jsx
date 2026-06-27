import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const CartIcon = () => {
  const { items } = useCart();

  return (
    <Link to="/cart" className="cart-icon-link" aria-label="View cart">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 7V6C6 3.79086 7.79086 2 10 2H14C16.2091 2 18 3.79086 18 6V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4.5 7H19.5L20.5 21H3.5L4.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {items.length > 0 && <span className="cart-badge">{items.length}</span>}
    </Link>
  );
};

export default CartIcon;
