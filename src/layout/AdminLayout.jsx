import axios from "axios";
import { Outlet, NavLink, useNavigate } from "react-router";
import useMsg from "../hooks/useMsg";

const apiBase = import.meta.env.VITE_API_BASE;
const basePath = import.meta.env.BASE_URL.slice(0, -1) || '/';

const AdminLayout = () => {
  const navigate = useNavigate();
  const showMsg = useMsg();

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${apiBase}/logout`);
      showMsg(res.data);
    } catch (error) {
      showMsg(error.response.data);
    } finally {
      document.cookie = `hexToken=; Max-Age=0; path=${basePath};`;
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  return (<>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <NavLink className="navbar-brand" to="/admin/products">sushi</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/products">產品管理</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/orders">訂單管理</NavLink>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link" onClick={handleLogout}>登出</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main className="py-5">
      <Outlet />
    </main>
  </>);
}

export default AdminLayout;