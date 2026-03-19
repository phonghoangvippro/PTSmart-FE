// Order API service
// This file handles all order-related operations

// Mock orders data
let orders = [
  {
    id: 1,
    orderId: '#PTS-882910',
    status: 'processing',
    orderDate: '2023-10-18',
    deliveryDate: null,
    shipper: null,
    total: 32990000,
    items: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq5eFmRkwUunCEK6RSI1wRoxinTEoX9Ut7pRVD8ml4oycVA9k4K5qFNNtlTeSEt1QMA882D3aEj75UYiH15O4AW4iBQukcU1IVQLPTKDgsdPnu43cWR7izWQ2siayMvcz7wkZTJCO670YC9uYCcB00nHpbal0aI0LM0ZtOZSAgWhZb1FcTOL9SWfclV2wHY464VtCS2sg8fzZHsDtYnuSn28z03lsoLIw8h9_hFA6jgIF1PCB2pfjcOU7AXRlRibUarBFyrdGj8Q',
        gift: 'Tặng kèm Ốp lưng MagSafe'
      }
    ]
  },
  {
    id: 2,
    orderId: '#PTS-881255',
    status: 'completed',
    orderDate: '2023-10-12',
    deliveryDate: '2023-10-14',
    shipper: 'Shopee Express',
    total: 45490000,
    items: [
      {
        id: 2,
        name: 'MacBook Pro M2 14" - Silver 16GB/512GB',
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVf8919u2abZ0yKAJihos-yxTT7nLY3Zq6U1I2L6r5jTpQgcpgeu0JW_2Er0Mb-OIk7psKPXrv-EgrT12uWADqd_fwLm4x0_Z503rpefjgJQx4_mJ666WB5Gwob5nCR2JU1gMzZOPxBKMEPklAF22sRdvfy1O6AYd3LOTCoTlvlUGpQRRY5yXeJBsXPiICwps9ucRVZ8RYt8S8AIPnVromWdhi9UZNOFm4FVumosOrEfZoG1rAMWnDyAlU1reS8LGADtGhwEuhoQ'
      },
      {
        id: 3,
        name: 'Ốp lưng MacBook',
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr4m1yonlcy-1vmfCGeaWADVgWdHFumVwtyEYrOc0x-rCjGePOpbcFb0f6YhoUxMUKaGbiEajFztFg6pu1GeK8jI-deOjpdX4gsuzy9y-YBgGt_YhSAaFRGnaleiXWXxakOW078XZIaOy3JdcN4W9zL0aI7l-I0I0K9nQ8GQ25P7mGXLMMir0BpP49U5rsvbnp4PhwaFYcR86KJCrbzGHXiPw8NDVQXHFp-Uoui4Pv7o8bDapbUqTAbigILO_7RJPbjN7CoPhI_g'
      },
      {
        id: 4,
        name: 'Chuột không dây',
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr4m1yonlcy-1vmfCGeaWADVgWdHFumVwtyEYrOc0x-rCjGePOpbcFb0f6YhoUxMUKaGbiEajFztFg6pu1GeK8jI-deOjpdX4gsuzy9y-YBgGt_YhSAaFRGnaleiXWXxakOW078XZIaOy3JdcN4W9zL0aI7l-I0I0K9nQ8GQ25P7mGXLMMir0BpP49U5rsvbnp4PhwaFYcR86KJCrbzGHXiPw8NDVQXHFp-Uoui4Pv7o8bDapbUqTAbigILO_7RJPbjN7CoPhI_g'
      }
    ]
  },
  {
    id: 3,
    orderId: '#PTS-879941',
    status: 'cancelled',
    orderDate: '2023-10-05',
    deliveryDate: null,
    shipper: null,
    total: 8490000,
    cancelReason: 'Thay đổi ý định mua hàng',
    items: [
      {
        id: 5,
        name: 'Tai nghe Sony WH-1000XM5',
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKd4BFSHv6PtAkCa3EwLYhbJNIFdmM_ZuBvyEn5N4rip4OsROcOWrcwNjl8U6vL0uFM0XEecME0xz8Y6b35KzWbQrtHa_Hfz5i6YzTjtdvE8ylGwYgKJk2MEk88gGZy8g9aW4KdNP2iE_Ib1dtQZqb7n206lFG8WMaF-mySGoITaXkV1vHwnCSiJEbhls8pIk86-EefrHwACJBjui5a4TzbDlFJ31TmUSxUm2_XDqsQbpleAfBPxoeNsQ5YXj15OZWhM2XRNXS0A'
      }
    ]
  }
];

// Get all orders
export const getOrders = () => {
  // In a real app, this would fetch from API
  return orders;
};

// Get order by ID
export const getOrderById = (id) => {
  return orders.find(order => order.id === id);
};

// Create new order
export const createOrder = (orderData) => {
  const newOrder = {
    id: Date.now(),
    orderId: `#PTS-${Math.floor(Math.random() * 1000000)}`,
    status: 'processing',
    orderDate: new Date().toISOString().split('T')[0],
    ...orderData
  };
  orders.unshift(newOrder); // Add to beginning
  return newOrder;
};
