"use client";

import { useContextElement } from "@/context/Context";

export default function WishlistLength() {
  const { wishList } = useContextElement();

  // Render only if there are items in the wishlist
  if (!wishList || wishList.length === 0) {
    return null;
  }

  return (
    <span 
      className="wishlist-length-badge"
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
      {wishList.length}
    </span>
  );
}