import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { money } from '../filter/money';
import useSweetAlert from "../hooks/useSweetAlert";

import Pagination from '../components/Pagination';

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loadingItem, setLoadingItem] = useState('');
  const { alert } = useSweetAlert();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(`${apiBase}/api/${apiPath}/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      alert('取得產品失敗', 'error', `${error.response.data.message}`);
    }
  }

  const addCart = async (id) => {
    try {
      setLoadingItem(id);

      const data = {
        product_id: id,
        qty: 1
      };

      const res = await axios.post(`${apiBase}/api/${apiPath}/cart`, {data});
      alert(res.data.message);
    } catch (error) {
      alert('加入購物車失敗', 'error', `${error.response.data.message}`);
    } finally {
      setLoadingItem('');
    }
  }

  return (<>
    <div className="container">
      <h2 className="mb-4">商品</h2>
      <ul className="row gy-4 list-unstyled">
        {
          products && products.length > 0 ? (
            products.map((product) => (
              <li className="col-md-6 col-lg-3" key={ product.id }>
                <div className="card">
                  <img src={ product.imageUrl } className="card-img-top" alt="主圖" />
                  <div className="card-body">
                    <h3 className="fs-5 fw-bold card-title">{ product.title }</h3>
                    <p className="card-text mb-2">{ product.description }</p>
                    <div className="mb-2">
                      <span className="text-danger me-2">${ money(product.price) }</span>
                      <del className="">${ money(product.origin_price) }</del>
                    </div>
                  </div>
                  <div className="card-footer bg-white">
                     <Link className="btn btn-outline-secondary w-100 mb-2" to={`/product/${product.id}`}>了解更多</Link>
                     <button type="button" className="btn btn-primary hover-primary w-100" onClick={() => {
                      addCart(product.id);
                     }} disabled={loadingItem === product.id}>
                      {loadingItem === product.id ? <>加入中 <span className="spinner-border spinner-border-sm" aria-hidden="true"></span></> : '加入購物車'}
                     </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>尚無商品資料</li>
          )
        }
      </ul>
      <Pagination pagination={pagination} getData={getProducts} path="/products" />
    </div>
  </>);
}

export default Products;