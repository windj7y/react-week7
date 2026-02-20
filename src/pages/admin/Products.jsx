import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import { useNavigate } from "react-router";
import { money } from '../../filter/money';
import useMsg from '../../hooks/useMsg';

import Pagination from '../../components/Pagination';
import ProductModal from '../../components/ProductModal';

const apiBase = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;
const basePath = import.meta.env.BASE_URL.slice(0, -1) || '/';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({
    id: '',
    title: '',
    category: '',
    origin_price: '',
    price: '',
    unit: '',
    description: '',
    content: '',
    is_enabled: '',
    imageUrl: '',
    imagesUrl: []
  });

  const [type, setType] = useState('');
  const [pagination, setPagination] = useState({});

  const productModalRef = useRef(null);
  const navigate = useNavigate();
  const showMsg = useMsg();

  useEffect(() => {
    productModalRef.current = new Modal(productModalRef.current, {
      keyboard: false,
    });
    
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      axios.defaults.headers.common.Authorization = token;
      checkLogin();
    } else {
      navigate('/login');
    }
  }, []);

  const openModal = (product, type) => {
    setTempProduct({
      id: product.id || '',
      title: product.title || '',
      category: product.category || '',
      origin_price: product.origin_price || '',
      price: product.price || '',
      unit: product.unit || '',
      description: product.description || '',
      content: product.content || '',
      is_enabled: product.is_enabled || '',
      imageUrl: product.imageUrl || '',
      imagesUrl: product.imagesUrl || []
    });
    setType(type);
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  }

  const checkLogin = async () => {
    try {
      await axios.post(`${apiBase}/api/user/check`);
      getProducts();
    } catch (error) {
      showMsg(error.response.data);
      document.cookie = `hexToken=; Max-Age=0; path=${basePath};`;
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(`${apiBase}/api/${apiPath}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      showMsg(error.response.data);
    }
  }

  return (<>
    <div className="container">
      <h2 className="fs-3 mb-4">產品管理</h2>
      <div className="text-end mb-4">
        <button className="btn btn-primary hover-primary" onClick={() => {
          openModal({}, 'add');
        }}>建立新的產品</button>
      </div>
      <table className="table text-center">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="120">操作</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product) => (
            <tr key={ product.id }>
              <td>{ product.category }</td>
              <td>{ product.title }</td>
              <td>{ money(product.origin_price) }</td>
              <td>{ money(product.price) }</td>
              <td>
                { product.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span> }
              </td>
              <td>
                <div className="btn-group">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
                    openModal(product, 'edit');
                  }}>
                    編輯
                  </button>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => {
                    openModal(product, 'remove');
                  }}>
                    刪除
                  </button>
                </div>
              </td>
            </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">尚無產品資料</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination pagination={pagination} getData={getProducts} path="/admin/products" />
    </div>
    <ProductModal productModalRef={productModalRef} tempProduct={tempProduct} setTempProduct={setTempProduct} type={type} getProducts={getProducts} closeModal={closeModal} />
  </>);
}

export default Products;