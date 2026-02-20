import AdminLayout from "../layout/AdminLayout";
import Layout from "../layout/Layout";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Product from "../pages/Product";
import Products from "../pages/Products";
import AdminProducts from '../pages/admin/Products';
import AdminOrders from "../pages/admin/Orders";

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'products',
        element: <Products />
      },
      {
        path: 'product/:id',
        element: <Product />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'products',
        element: <AdminProducts />
      },
      {
        path: 'orders',
        element: <AdminOrders />
      },
    ]

  }
]

export default routes