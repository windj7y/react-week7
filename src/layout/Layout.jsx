import { Outlet, NavLink } from "react-router";

const Layout = () => {
  return (<>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <NavLink className="navbar-brand" to="/">sushi</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">首頁</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">商品</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">購物車</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main className="py-5">
      <Outlet />
    </main>

    <footer className="bg-secondary py-3 mt-auto">
      <p className="text-white text-center mb-0">Copyright © sushi All rights reserved.</p>
    </footer>
  </>);
}

export default Layout;