import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { money } from '../filter/money';
import useSweetAlert from "../hooks/useSweetAlert";

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const Cart = () => {
  const [carts, setCarts] = useState({
    carts: [],
    total: 0,
    final_total: 0
  });

  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState('');
  const { confirm, alert } = useSweetAlert();

  useEffect(() => {
    getCarts();
  }, []);

  const getCarts = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/${apiPath}/cart`);
      setCarts(res.data.data);
    } catch (error) {
      alert('取得購物車失敗', 'error', `${error.response.data.message}`);
    }
  }

  const removeAllCart = async () => {
    try {
      const confirmed = await confirm('確定要清空購物車嗎？');
      if (!confirmed) return;

      setLoading(true);
      const res = await axios.delete(`${apiBase}/api/${apiPath}/carts`);
      getCarts();
      alert('刪除商品成功');
    } catch (error) {
      alert('刪除商品失敗', 'error', `${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  }

  const removeCart = async (id) => {
    try {
      const confirmed = await confirm('確定要刪除商品嗎？');
      if (!confirmed) return;

      setLoadingItem(id);
      const res = await axios.delete(`${apiBase}/api/${apiPath}/cart/${id}`);
      getCarts();
      alert('刪除商品成功');
    } catch (error) {
      alert('刪除商品失敗', 'error', `${error.response.data.message}`);
    } finally {
      setLoadingItem('');
    }
  }

  const updateCart = async (cart, qty) => {
    const { id, product_id } = cart;

    if (qty === 0) {
      alert('購物車數量最少為1', 'error');
      return;
    }

    try {
      const data = {
        product_id,
        qty
      };

      const res = await axios.put(`${apiBase}/api/${apiPath}/cart/${id}`, {data});
      getCarts();
      alert('更新數量成功');
    } catch (error) {
      alert('更新數量失敗', 'error', `${error.response.data.message}`);
    }
  }

  return (<>
    <div className="container">
      <h2 className="mb-4">購物車</h2>
      {
        carts.carts.length > 0 ? (<>
          <div className="text-end mb-4">
            <button type="button" className="btn btn-primary" onClick={removeAllCart} disabled={loading}>
              {loading ? <>刪除中 <span className="spinner-border spinner-border-sm" aria-hidden="true"></span></> : '清空購物車'}
            </button>
          </div>
          <div className="table-responsive mb-5">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">商品</th>
                  <th scope="col">單價</th>
                  <th scope="col">數量</th>
                  <th scope="col">小計</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  carts.carts.map((cart) => (
                    <tr key={ cart.id }>
                      <th>
                        <img src={ cart.product.imageUrl } style={{ maxWidth: '180px' }} alt="主圖" />
                        <p className="fs-6 mb-0">{ cart.product.title }</p>
                      </th>
                      <td>${ money(cart.product.price) }</td>
                      <td className="text-nowrap">
                        <div className="input-group input-group-sm">
                          <button type="button" className="btn btn-outline-secondary" onClick={() => {
                            updateCart(cart, cart.qty - 1);
                          }} disabled={cart.qty===1}>
                            <i className="bi bi-dash"></i>
                          </button>
                          <div className="border-top border-bottom border-secondary text-secondary px-2">
                            { cart.qty }
                          </div>
                          <button type="button" className="btn btn-outline-secondary" onClick={() => {
                            updateCart(cart, cart.qty + 1);
                          }}>
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td>${ money(cart.total) }</td>
                      <td className="text-end">
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => {
                          removeCart(cart.id); 
                        }} disabled={loadingItem === cart.id}>
                          {loadingItem === cart.id ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : <i className="bi bi-trash"></i>}
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={3}>總計</th>
                  <td colSpan={2}>${ money(carts.final_total) }</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="d-flex justify-content-center">
            <Link className="btn btn-outline-secondary me-3" to="/products">
              <i className="bi bi-caret-left"></i> 繼續購物
            </Link>
            <Link className="btn btn-primary hover-primary" to="/checkout">
              我要結帳 <i className="bi bi-caret-right"></i>
            </Link>
          </div>
        </>) : (
          <p className="fs-5 text-center">
            您的購物車目前是空的，快去<Link className="link-coral" to="/products">選購商品</Link>吧！
          </p>
        )
      }
    </div>
  </>);
}

export default Cart;