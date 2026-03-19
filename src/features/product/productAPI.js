// Product API service
// This file handles all product-related API calls

const mockProducts = [
  {
    id: 1,
    brand: 'Apple',
    name: 'iPhone 15 Pro Max 256GB - Titanium Blue',
    rating: 4.9,
    reviews: 42,
    price: '29.490.000₫',
    oldPrice: '34.990.000₫',
    discount: 'Giảm 15%',
    badge: 'Giảm 15%',
    badgeColor: 'accent-pink',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq7S7u_02EMNOMfAGXZBs6Wr_LeCmHyaBC6yEfhOhAtd-yVqSLAm9j7VE_EIslTdVm6W4j0pETM6e39gUAOjLFtGgMtM1kGdGnWdJ9e9yo3iGcGItqcKB0KblUjeMWZ2tTHiWXQwWt-E4kSvZtQTvVsQN3rQ9IGrRlizH7473L7Bv4b4SgwJARMF1khqBO0W8AAXlPeFT0z1H4N_aByu1sMCuxa9ZZS8lPnxj856XAIyxwaj-CpPp6ocQ8UJYUuzXfw5CGurTfdg'
  },
  {
    id: 2,
    brand: 'Samsung',
    name: 'Samsung Galaxy S24 Ultra 12GB/512GB',
    rating: 4.8,
    reviews: 85,
    price: '27.990.000₫',
    oldPrice: '31.990.000₫',
    discount: null,
    badge: 'Bán chạy',
    badgeColor: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEWRNsXl0MpCTMtTRT1BYo-GVAeTJo9rCrg0eLUQrYRoAWZCqBo2kFwtpMfgFfPcCYJ7wV0xnmTe56cjkSo-Rmy8n2mErK-HnXuAVsKmcafZJiVAzRheterwA5Z_JBARxyNEXk4N1Xsgq31vBsOVs8stthjJpP8Cvy_U7MkMy3ZRlEt74EPt_pOezMA8QZx8CMpgfvZb2_HJaL15a5VpOepd1x9rd-OIeqj5jXBxN-WOht4_JfG2USvsagxkggc5hCPGcgY_qbuw'
  },
  {
    id: 3,
    brand: 'Xiaomi',
    name: 'Xiaomi 14 12GB/256GB - Leica Camera',
    rating: 4.7,
    reviews: 15,
    price: '18.490.000₫',
    oldPrice: '22.990.000₫',
    discount: 'Giảm 20%',
    badge: 'Giảm 20%',
    badgeColor: 'accent-pink',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWeotxDHJoUzIZaa18PBARPCDSqui-aRzkCHCRY3vjc65vTZ-Atf3dzdHSi0_wCbvrRSP09AbNNXE84EBN5_kLnsx5azgXo2TtfMBMSk7ugHIGd13Sbh8aqBkzNANNuc4YcVvpChx9mRQo1SDwxCmFhoSRUZlDYzO1-umSxIUCekErzYhYdfw3cIqI58R0XJLY7rwDFrawJ1dfmVE-dg0VJp-G1-dxUBFohuLSRhh3xc8PrOxMaXVtOjTbs09MkHhu03j32eurMA'
  },
  {
    id: 4,
    brand: 'Apple',
    name: 'iPhone 13 128GB - Chính hãng VN/A',
    rating: 4.9,
    reviews: 1200,
    price: '13.590.000₫',
    oldPrice: '15.990.000₫',
    discount: null,
    badge: null,
    badgeColor: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYald9jLQR8GhYMNFK0520oVh0KGb7SlUvKXyfATg9fuAE2YNNlhIFA3ttElzaRJWsMmrgMfUzrg8YunQea4Ye24gkzHbPa04IUr-UmtibXl_pHkVdultQ79ZLbLJCboNd8iyt9NsxC43ZW9m7Q797RM1EJhj3kJ9c8KIBPMsK5fAh7JE-QgK9GhfQCppHJJmzEEspKt_LeLf1i38KJHRAonAswIl5CrteAPG6Y_SbCn1GsTgEI5ghSJ4b_s3Zs2hOXsbB_7a1zw'
  },
  {
    id: 5,
    brand: 'Samsung',
    name: 'Samsung Galaxy A54 5G 8GB/128GB',
    rating: 4.5,
    reviews: 56,
    price: '8.290.000₫',
    oldPrice: '9.990.000₫',
    discount: null,
    badge: 'Trả góp 0%',
    badgeColor: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPPn_q4etAWK8Z8CZe3Z5-aFhjTZfd07XJrg84MhyiFy2CS0pH2BAXrij8XY5_KMOi19ILBhPiYNGJJucloEFtRSljNwIlHLq8UIdVBOjqyhQfDYZ3rLc79MVnnn7iwgWLJNFRiAiZ5jYsTgFqDj9r6gWUsO25uMGwJ-i_i9G7Vci72G2Nvmwru1kvO90O0L3FFrXhPiBwJkfuvIISxwwtpKnOkjQ5mng2SDTG1gjgW6sVrKpOosmz-DpTOx5bSW7vzqTuH5CJRg'
  },
  {
    id: 6,
    brand: 'OPPO',
    name: 'OPPO Reno11 F 5G (8GB/256GB)',
    rating: 4.6,
    reviews: 28,
    price: '7.990.000₫',
    oldPrice: '8.990.000₫',
    discount: 'Deal Sốc',
    badge: 'Deal Sốc',
    badgeColor: 'accent-pink',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9HrEoLENyPXGOGnDPfFZ-X2wtDxml1Zq6yvlpeXgOjnQwy6iACMSBFWRn9blggz35NTzdx7am1NETB7S5W6LohEeTW8vEHT2tNy-cfNvGikDNDsbKLK1T6-yhSqZG0MG76XjRJTbB7AHc-outteuWBN5UR05ISN5vAOnxYl-1QAVfb94wQ1Z3ZjKaBDvwrR4DRhVBoQlhp5ALwbB5LYAlcQwQ-YvqVBbX9MnZRyTfnHbrcJ20HVR2FuSCEeKABCnONiDUd916GQ'
  }
];

// Get all products
export const getProducts = () => {
  // In a real app, this would be an API call
  return mockProducts;
};

// Get product by ID
export const getProductById = (id) => {
  return mockProducts.find(product => product.id === id);
};

// Get products by category
export const getProductsByCategory = (category) => {
  return mockProducts.filter(product => product.category === category);
};

// Search products
export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery)
  );
};
