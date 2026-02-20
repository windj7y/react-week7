import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { money } from '../filter/money';
import useSweetAlert from "../hooks/useSweetAlert";

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;

const Product = () => {
  const [product, setProduct] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { alert } = useSweetAlert();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/${apiPath}/product/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        alert('取得產品失敗', 'error', `${error.response.data.message}`);
      }
    }

    getProduct();
  }, []);

  const addCart = async () => {
    try {
      setLoading(true);

      const data = {
        product_id: product.id,
        qty: 1
      };

      const res = await axios.post(`${apiBase}/api/${apiPath}/cart`, {data});
      alert(res.data.message);
    } catch (error) {
      alert('加入購物車失敗', 'error', `${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (<>
    <div className="container">
      <span className="badge bg-secondary mb-2">{ product.category }</span>
      <h2 className="mb-4">{ product.title }</h2>
      <div className="row gx-lg-5 align-items-center">
        <div className="col-lg-7 mb-4 mb-lg-0">
          <img src={product.imageUrl} className="rounded-5" alt="主圖" />
        </div>
        <div className="col-lg-5">
          <p className="fs-5 text-secondary">-- { product.description } --</p>
          <p className="fs-4">{ product.content }</p>
          <div className="text-end mb-3">
            <span className="text-danger fs-4 me-2">${ money(product.price) }</span>
            <del className="fs-5">${ money(product.origin_price) }</del>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <button type="button" className="btn btn-outline-coral hover-primary rounded-pill fs-5 w-100 py-md-3"><i className="bi bi-heart"></i> 加入收藏</button>
            </div>
            <div className="col-md-6">
              <button type="button" className="btn btn-primary hover-primary rounded-pill fs-5 w-100 py-md-3" onClick={addCart} disabled={loading}>
                {loading ? <>加入中 <span className="spinner-border spinner-border-sm" aria-hidden="true"></span></> : '加入購物車'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default Product;