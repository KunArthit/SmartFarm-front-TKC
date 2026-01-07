"use client";

import { useContextElement } from "@/context/Context";

export default function CartLength() {
  const { cartProducts } = useContextElement();
  
  // Render only if there are items in the cart
  if (!cartProducts || cartProducts.length === 0) {
    return null;
  }

  return (
    <span 
      className="cart-length-badge" 
      style={{
        position: 'absolute',
        top: '-5px',
        right: '-8px',
        backgroundColor: 'red', // Or theme's primary color
        color: 'white',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
      }}
    >
      {cartProducts.length}
    </span>
  );
}