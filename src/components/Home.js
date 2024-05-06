import React from "react";
import bannerImage from "../media/HomeBanner.jpg";
import event1 from "../media/Tier1.jpg";
import event2 from "../media/Tier2.jpg";
import event3 from "../media/Tier3.jpeg";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let navigate = useNavigate();

  const navigateToChairs = () => {
    navigate("/chairs");
  };

  const navigateToThirdTier = () => {
    navigate("/ThirdTier");
  };

  const navigateToTickets = () => {
    navigate("/tickets");
  };

  const scrollToFeaturedEvents = () => {
    const section = document.getElementById("featured-events-container");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      <div
        className="welcome-banner"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="banner-content">
          <h1>Experience Online Events.</h1>
          <p>
            Tune into online events, webinars, lessons and more. From your
            living room.
          </p>
          <button
            style={{backgroundColor: '#000000', color: 'white', padding: '20px', fontSize: '30px', borderRadius: '10px'}}
            onClick={scrollToFeaturedEvents}
          >
            Buy Tickets Now
          </button>
          <div className="search-container"></div>
        </div>
      </div>

      <section id="featured-events-container">
        <div className="events-list" style={{marginTop: '-140px'}}>
          <div className="event" onClick={navigateToTickets}>
            <img className="event-image" src={event1} alt="Teir 1" />
            <h3 className="event-title">Teir 1</h3>
            <p className="event-info">Opulent cocktail seating Tickets</p>
            <p className="event-date-time">R4 000</p>
          </div>
          <div className="event" onClick={navigateToChairs}>
            <img className="event-image" src={event2} alt="Teir 2" />
            <h3 className="event-title">Teir 2</h3>
            <p className="event-info">Exclusive Deluxe Lounge Tickets.</p>
            <p className="event-date-time">R8 000</p>
          </div>
          <div className="event" onClick={navigateToThirdTier}>
            <img className="event-image" src={event3} alt="SAJFP Solidarity Seder" />
            <h3 className="event-title">Tier 3</h3>
            <p className="event-info">Premium Lounge Experience Tickets</p>
            <p className="event-date-time">R10 000</p>
          </div>
        </div>
      </section>

      <div className="payment-systems-wrap">
        <img className="payment-systems" src="https://images.quicket.co.za/payment_logos.png" alt="payment systems" />
      </div>
    </div>
  );
};

export default Home;
