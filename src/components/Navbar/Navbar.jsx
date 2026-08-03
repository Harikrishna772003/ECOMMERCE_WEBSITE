import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>ShopEase</h2>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search Products..."
        />
      </div>

      <div className="menu">
        <a href="#">Home</a>
        <a href="#">Products</a>
        <a href="#">Login</a>
        <a href="#">Cart 🛒</a>
      </div>
    </nav>
  );
}

export default Navbar;