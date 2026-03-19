// Product API service for admin
// This file handles all product-related API calls for admin panel

const mockProducts = [
  {
    id: 1,
    brand: 'Apple',
    name: 'iPhone 15 Pro Max 256GB',
    category: 'Điện thoại',
    price: '34.990.000đ',
    stock: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfygedCaxUMPCe_FPDX1gGLojITErLUfXYNhV8uGg2_vHp0XOm6BTtrilqGtb7CgRTVkWINF3zQ_WeqDKDnSEoyt3KHkkMj-lOJaQMmq-xGK6_zO85SiIFKf6LIRy3vqS3BEAGxohVpz8bvywjOPbmOXEFrLYA-_dmY7o7f01DZDQrwyUXStQ5LuwFuaD8-s14yKRtT6taGBopurwrP9VTzlpDD2lf6XTuq0sVTZNI2ONVfQAQl1E6X5SYzGm5UhdGxDZRKEFR_Q'
  },
  {
    id: 2,
    brand: 'Apple',
    name: 'MacBook Air M2 13-inch',
    category: 'Laptop',
    price: '26.490.000đ',
    stock: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLgzfNuELe_P_JYX1PeTnv4I-L4C0rnwy_BUyd9h-xeT8x3bLBcRjyprZ__pMWYgHj9BKdLkvgozzcuwyCMX3mznbFXcOX4otwxLcVXW48qskq2gSNig3EQLGqeNQ2UW8iGxaDfdWiiQ4ZYHdsCNj7W49SlAl4xfseZ-1UrzPy_aWN96BE8ahCfvdkuEBBhRhqnfoMh8HeFZHtr6xUqKHn71c3NtzqK2MZANeetS_hFuyAGeqaBtCN9R-ssqR5ZHjeJ8cZxMOcZg'
  },
  {
    id: 3,
    brand: 'Samsung',
    name: 'Samsung Galaxy Z Fold5',
    category: 'Điện thoại',
    price: '32.190.000đ',
    stock: 0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAEAjzZMwXYkpNpovnFXlZtNiskIicOjd_dXSfkX5O9LYvMAjjoFulSMY5r3evL_v9UwDFGgBY5t4ZhC9YpwNYFg41abDFzr1W4yVx4DwMcLZa4AwVAeQpMMbwTnA0YZIL8TXzRtHOZyjnMVcqb1NfEMGL2TXEgZcjwc8JMTpZ6JuDQBm0g2VZamc8Rg0II8JlWcGRMdcka24CsxkSvJaTi72JkFK_0RLfgQUxbxy5n43kd1Teh9J1ygCIPmvRUEwoCjiTTHElPQ'
  },
  {
    id: 4,
    brand: 'Apple',
    name: 'iPad Pro M2 11-inch (2022)',
    category: 'Máy tính bảng',
    price: '21.890.000đ',
    stock: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwScIQfNWjFcHUlpeS8Qp4ZpG1kvdFgCXyjaz2KifVI-DtzJzuJ8B4zw14__mbQMBJU-uhSj6TZx_UaeZ4RrAOPkBMfrgl9QreUHEtr7eBw4TmKCKbHCaaG3nWItAfo30ojmwy5yTFLacAAK2KymEgqTC2v9cL-ZGxLN5UsM5ggt_6J0Tye9uluta7cwFS0UxuM0Z82SmhHhaVZmMjJbe9ZsTuaRSqC_dinhVrMjafGDx22dGDrX5KY4DctMpav8-99i6Z-Be0ow'
  }
];

// Get all products
export const getProducts = () => {
  // In a real app, this would fetch from API
  return mockProducts;
};

// Get product by ID
export const getProductById = (id) => {
  return mockProducts.find(product => product.id === parseInt(id));
};

// Create new product
export const createProduct = (productData) => {
  const newProduct = {
    id: Date.now(),
    ...productData
  };
  mockProducts.push(newProduct);
  return newProduct;
};

// Update product
export const updateProduct = (id, productData) => {
  const index = mockProducts.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...productData };
    return mockProducts[index];
  }
  return null;
};

// Delete product
export const deleteProduct = (id) => {
  const index = mockProducts.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    mockProducts.splice(index, 1);
    return true;
  }
  return false;
};
