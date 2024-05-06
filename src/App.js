import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import './style.css';
import logo from "./media/logo.png"

import Tickets from './components/Tickets.js';
import Home from './components/Home.js';
import Event from './components/Event.js';
import Verify from './components/Verify.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Qrcodedisplay from './components/Qrcodedisplay.js';
import Payment from './components/Payment.js';
import Dashboard from './components/Dashboard.js';
import CheckEmail from './components/CheckEmail.js';
import Success from './components/Success.js';
import AdminScanQR from './components/AdminScanQR.js';

import Admindashboard from './components/Admindashboard.js';
import Addticket from './components/Addticket.js';
import Ticketdisplay from './components/Ticketdisplay.js';
import Ticketedit from './components/Ticketedit.js';
import Chairs from './components/Chairs.js';
import ThirdTeir from './components/ThirdTier.js';

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import AllPosts from './components/allPosts.js';
import Navbar from './components/navbar.js';
function App() {
  return (
    <Router>
      <div>
      <header className="header" style={{zIndex: 200}}>
        <a href="/" className="header-logo-link">
          <img
            className="header-logo"
            src={logo}
            alt="logo"
          />
        </a>
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
     

        <Routes>
          {/* frontend Pages */}   
           <Route path="/tickets" element={<Tickets />} />
           <Route path="/" element={<Home />} />
           <Route path="/Chairs" element={<Chairs />} />
           <Route path="/ThirdTier" element={<ThirdTeir />} />
           <Route path="/Verify" element={<Verify />} />
          <Route path="/Navbar" element={<Navbar />} />
          <Route path="/AllPosts" element={<AllPosts />} />
       
          <Route path="/qrcodedisplay" element={<Qrcodedisplay />} />
          <Route path="/AdminScanQR" element={<AdminScanQR />} />
          <Route path="/Event" element={<Event />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/CheckEmail" element={<CheckEmail />} />
          <Route path="/success" element={<Success />} />      
          {/* backend Pages */}
          <Route path="/admindashboard" element={<Admindashboard />} />
          <Route path="/Addticket" element={<Addticket />} />
          <Route path="/ticketdisplay" element={<Ticketdisplay />} /> 
           <Route path="/ticketedit" element={<Ticketedit />} />
          {/* <Route path="/Team" element={<Team />} /> */}
       
        </Routes>
        <footer className="footer">
        <div className="footer-links-panel" style={{maxHeight: '250px'}}>
          <section className="footer-links-section">
            <span className="footer-nav-header">July Ocean Lounge</span>
            <nav className="footer-nav">
              <a className="footer-nav-link" href="/">
                Home
              </a>
              <a
                className="footer-nav-link"
                href="#"
              >
                Privacy policy
              </a>
              <a
                className="footer-nav-link"
                href="#"
                target="_blank"
              >
                Terms
              </a>
         
            
              
            </nav>
          </section>
          <section className="footer-links-section">
            <span className="footer-nav-header">SELLING TICKETS</span>
            <nav className="footer-nav">
              <a className="footer-nav-link" href="/tickets">
                Teir 1
              </a>
              <a className="footer-nav-link" href="/chairs">
              Teir 2
              </a>
              <a className="footer-nav-link" href="/ThirdTier">
              Teir 3
              </a>
             
            </nav>
          </section>

         
        </div>
        <div className="footer-contacts-panel">
          <img
            className="footer-logo"
            src={logo}
            alt="small logo"
          />
          <div className="footer-contacts">
           
            
            <span className="ui-text ui-text-small">
              © Copyright 2024 July Ocean Lounge
            </span>
          </div>
          {/* <div className="footer-social-links">
            <a
              className="footer-social-link facebook"
              target="_blank"
              href="https://www.facebook.com/203195039742896"
            >
              <i className="fab fa-facebook-square"></i>
            </a>
            <a
              className="footer-social-link twitter"
              target="_blank"
              href="https://twitter.com/QuicketSA"
            >
              <i className="fab fa-twitter-square"></i>
            </a>
            <a
              className="footer-social-link linkedin"
              target="_blank"
              href="http://www.linkedin.com/company/2350818"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              className="footer-social-link linkedin"
              target="_blank"
              href="https://www.instagram.com/quicket"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div> */}
        </div>
      </footer>
      </div>
    </Router>

  
  );
}



export default App;
