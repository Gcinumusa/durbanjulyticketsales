import { useCart } from './CartContext'; // Import the useCart hook

import logo from "../media/logo.png"
function Header() {
  const { getCartCount } = useCart(); // Use the getCartCount from context

  return (
    <header className="header" style={{zIndex: 200}}>
    <a href="/" className="header-logo-link">
      <img
        className="header-logo"
        src={logo}
        alt="logo"
      />
    </a>
    <span className="cart-count">{getCartCount()}</span>
    <input
      type="checkbox"
      className="header-nav-toggle-input"
      id="header-nav-toggle-input"
    />
    <svg
      className="header-nav-toggle"
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
    >
      <path d="M 0 4 L 26 4" stroke="currentColor" stroke-width="2"></path>
      <path
        d="M 0 12 L 20 12"
        stroke="currentColor"
        stroke-width="2"
      ></path>
      <path
        d="M 0 20 L 26 20"
        stroke="currentColor"
        stroke-width="2"
      ></path>
    </svg>
    <nav className="header-nav">
      <div className="header-nav-subnav header-nav-link flex">
        <span className="header-nav-subnav-header">Teirs</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
          className="carret"
        >
          <path
            fill="#484848"
            d="M7.70710678,9.29289322 C7.31658249,8.90236893 6.68341751,8.90236893 6.29289322,9.29289322 C5.90236893,9.68341751 5.90236893,10.3165825 6.29289322,10.7071068 L12.2928932,16.7071068 C12.6834175,17.0976311 13.3165825,17.0976311 13.7071068,16.7071068 L19.7071068,10.7071068 C20.0976311,10.3165825 20.0976311,9.68341751 19.7071068,9.29289322 C19.3165825,8.90236893 18.6834175,8.90236893 18.2928932,9.29289322 L13,14.5857864 L7.70710678,9.29289322 Z"
          />
        </svg>
        <nav className="header-nav-subnav-links">
          <a
            className="header-nav-link"
            href="/tickets"
            target="_blank"
          >
            Teir 1
          </a>
          <a className="header-nav-link" href="/chairs">
          Teir 2
          </a>
          <a className="header-nav-link" href="/ThirdTier">
          Teir 3
          </a>
         

          
        </nav>
      </div>
      <a className="header-nav-link" style={{backgroundColor:'blue', color: 'white', padding: '10px', borderRadius: '20px'}} href="/">
        BUY TICKETS
      </a>
      <a style={{border: ' 1px solid #000000' , padding: '10px', borderRadius: '20px', width: '80px', alignContent: 'center', textAlign: "center"}}
        className="header-nav-link"
        href="/login"
      >
        LOGIN
      </a>
    </nav>
  </header>
  );
}
export default Header;