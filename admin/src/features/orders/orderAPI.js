// Order API service for admin
// This file handles all order-related operations for admin panel

let orders = [
  {
    id: 1,
    orderId: '#ORD-7702',
    customerName: 'Nguyễn Văn A',
    phone: '0908xxxxxx',
    email: 'nguyenvana@email.com',
    address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    status: 'pending',
    orderDate: '2023-10-12',
    orderTime: '14:30 PM',
    total: 25990000,
    paymentMethod: 'Thanh toán khi nhận hàng',
    items: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB',
        quantity: 1,
        price: 25990000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfygedCaxUMPCe_FPDX1gGLojITErLUfXYNhV8uGg2_vHp0XOm6BTtrilqGtb7CgRTVkWINF3zQ_WeqDKDnSEoyt3KHkkMj-lOJaQMmq-xGK6_zO85SiIFKf6LIRy3vqS3BEAGxohVpz8bvywjOPbmOXEFrLYA-_dmY7o7f01DZDQrwyUXStQ5LuwFuaD8-s14yKRtT6taGBopurwrP9VTzlpDD2lf6XTuq0sVTZNI2ONVfQAQl1E6X5SYzGm5UhdGxDZRKEFR_Q'
      }
    ]
  },
  {
    id: 2,
    orderId: '#ORD-7703',
    customerName: 'Trần Thị B',
    phone: '0912xxxxxx',
    email: 'tranthib@email.com',
    address: '456 Đường DEF, Phường UVW, Quận 2, TP.HCM',
    status: 'confirmed',
    orderDate: '2023-10-12',
    orderTime: '10:15 AM',
    total: 1500000,
    paymentMethod: 'Chuyển khoản',
    items: [
      {
        id: 2,
        name: 'Ốp lưng iPhone 15 Pro Max',
        quantity: 2,
        price: 750000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr4m1yonlcy-1vmfCGeaWADVgWdHFumVwtyEYrOc0x-rCjGePOpbcFb0f6YhoUxMUKaGbiEajFztFg6pu1GeK8jI-deOjpdX4gsuzy9y-YBgGt_YhSAaFRGnaleiXWXxakOW078XZIaOy3JdcN4W9zL0aI7l-I0I0K9nQ8GQ25P7mGXLMMir0BpP49U5rsvbnp4PhwaFYcR86KJCrbzGHXiPw8NDVQXHFp-Uoui4Pv7o8bDapbUqTAbigILO_7RJPbjN7CoPhI_g'
      }
    ]
  },
  {
    id: 3,
    orderId: '#ORD-7704',
    customerName: 'Lê Văn C',
    phone: '0988xxxxxx',
    email: 'levanc@email.com',
    address: '789 Đường GHI, Phường RST, Quận 3, TP.HCM',
    status: 'shipping',
    orderDate: '2023-10-11',
    orderTime: '16:45 PM',
    total: 15200000,
    paymentMethod: 'Thẻ tín dụng',
    shipper: 'Shopee Express',
    trackingNumber: 'SP123456789',
    items: [
      {
        id: 3,
        name: 'MacBook Air M2 13-inch',
        quantity: 1,
        price: 15200000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLgzfNuELe_P_JYX1PeTnv4I-L4C0rnwy_BUyd9h-xeT8x3bLBcRjyprZ__pMWYgHj9BKdLkvgozzcuwyCMX3mznbFXcOX4otwxLcVXW48qskq2gSNig3EQLGqeNQ2UW8iGxaDfdWiiQ4ZYHdsCNj7W49SlAl4xfseZ-1UrzPy_aWN96BE8ahCfvdkuEBBhRhqnfoMh8HeFZHtr6xUqKHn71c3NtzqK2MZANeetS_hFuyAGeqaBtCN9R-ssqR5ZHjeJ8cZxMOcZg'
      }
    ]
  },
  {
    id: 4,
    orderId: '#ORD-7705',
    customerName: 'Phạm Minh D',
    phone: '0903xxxxxx',
    email: 'phamminhd@email.com',
    address: '321 Đường JKL, Phường MNO, Quận 4, TP.HCM',
    status: 'completed',
    orderDate: '2023-10-11',
    orderTime: '09:30 AM',
    deliveryDate: '2023-10-13',
    total: 450000,
    paymentMethod: 'Ví điện tử',
    shipper: 'Giao hàng nhanh',
    trackingNumber: 'GHN987654321',
    items: [
      {
        id: 4,
        name: 'Tai nghe AirPods Pro 2',
        quantity: 1,
        price: 450000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKd4BFSHv6PtAkCa3EwLYhbJNIFdmM_ZuBvyEn5N4rip4OsROcOWrcwNjl8U6vL0uFM0XEecME0xz8Y6b35KzWbQrtHa_Hfz5i6YzTjtdvE8ylGwYgKJk2MEk88gGZy8g9aW4KdNP2iE_Ib1dtQZqb7n206lFG8WMaF-mySGoITaXkV1vHwnCSiJEbhls8pIk86-EefrHwACJBjui5a4TzbDlFJ31TmUSxUm2_XDqsQbpleAfBPxoeNsQ5YXj15OZWhM2XRNXS0A'
      }
    ]
  },
  {
    id: 5,
    orderId: '#ORD-7706',
    customerName: 'Hoàng Anh E',
    phone: '0333xxxxxx',
    email: 'hoangane@email.com',
    address: '654 Đường PQR, Phường STU, Quận 5, TP.HCM',
    status: 'cancelled',
    orderDate: '2023-10-10',
    orderTime: '11:00 AM',
    total: 32000000,
    paymentMethod: 'Chuyển khoản',
    cancelReason: 'Khách hàng yêu cầu hủy',
    items: [
      {
        id: 5,
        name: 'Samsung Galaxy Z Fold5',
        quantity: 1,
        price: 32000000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAEAjzZMwXYkpNpovnFXlZtNiskIicOjd_dXSfkX5O9LYvMAjjoFulSMY5r3evL_v9UwDFGgBY5t4ZhC9YpwNYFg41abDFzr1W4yVx4DwMcLZa4AwVAeQpMMbwTnA0YZIL8TXzRtHOZyjnMVcqb1NfEMGL2TXEgZcjwc8JMTpZ6JuDQBm0g2VZamc8Rg0II8JlWcGRMdcka24CsxkSvJaTi72JkFK_0RLfgQUxbxy5n43kd1Teh9J1ygCIPmvRUEwoCjiTTHElPQ'
      }
    ]
  }
];

// Get all orders
export const getOrders = () => {
  return orders;
};

// Get order by ID
export const getOrderById = (id) => {
  return orders.find(order => order.id === id);
};

// Update order status
export const updateOrderStatus = (id, status) => {
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
};
