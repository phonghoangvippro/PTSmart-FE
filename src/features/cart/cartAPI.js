// Cart API service
// This file handles all cart-related operations

// Mock cart items - In a real app, this would be stored in localStorage or a backend
let cartItems = [
  {
    id: 1,
    productId: 2,
    name: 'Samsung Galaxy S23 Ultra',
    variant: 'Phantom Black | 256GB',
    price: 26990000,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjrfB_528lsVAxym3-Y1OJz3bR8DX2bg5qAEnZq3BcDopvZ2sZ3F1-aksV62_HFgvOAx0eM8WxVjKQiXnUqC9aaGimL2HUSe-LlqrWEnRlNCmjBbKzvbTBlO31en5M6HTt--7nPWWgNU_Zo-PMEQWlZdde48NB5uLaCwoQrgb_CQ1l_u-5Mhp79Y4WlbeUlp4tan_bwCkSvnoOs072bLEbcnAlsxDOAkyMtqI2wfuJLea1-AQ8ByrL7paGxqV2hDUjkvzWBKyUbw'
  },
  {
    id: 2,
    productId: 4,
    name: 'Apple Watch Series 8',
    variant: 'Midnight Aluminium Case | 45mm',
    price: 8990000,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv0wntowhx3706aRpNG7wLt3Ro1R8B3R0GMttgYJ_MsQHUFhoLLlsiX_7_9hzElm-nwEdniV1jvqo9TXpjPR162cqP49u77LFR-JOe6Cx-jf5TG-ZwwA7yN3O2IQ8k441vY8RIm2cmpbzqHXAhRtavOmUcg7fLdfxg2G_QT7o-sZYlnadc05tmIlDWIAc3JvqhX6glj_0YnC7CeUqMsc_uftC6q0D6YKhle3XbfrSsmYYBJz0oaqD61rTI9GOUXoUTiy6N8tPYLQ'
  }
];

// Get all cart items
export const getCartItems = () => {
  // In a real app, this would fetch from localStorage or API
  return cartItems;
};

// Add item to cart
export const addToCart = (product, variant = '', quantity = 1) => {
  const existingItem = cartItems.find(
    item => item.productId === product.id && item.variant === variant
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const newItem = {
      id: Date.now(), // Simple ID generation
      productId: product.id,
      name: product.name,
      variant: variant || 'Mặc định',
      price: parseInt(product.price.replace(/[^\d]/g, '')) || 0,
      quantity: quantity,
      image: product.image
    };
    cartItems.push(newItem);
  }

  // In a real app, save to localStorage or API
  return cartItems;
};

// Update cart item quantity
export const updateCartItemQuantity = (itemId, quantity) => {
  const item = cartItems.find(item => item.id === itemId);
  if (item) {
    item.quantity = quantity;
  }
  // In a real app, save to localStorage or API
  return cartItems;
};

// Remove item from cart
export const removeCartItem = (itemId) => {
  cartItems = cartItems.filter(item => item.id !== itemId);
  // In a real app, save to localStorage or API
  return cartItems;
};

// Clear all cart items
export const clearCart = () => {
  cartItems = [];
  // In a real app, save to localStorage or API
  return cartItems;
};

// Get cart total count
export const getCartCount = () => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};
