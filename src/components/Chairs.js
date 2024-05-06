import React, { useEffect, useState } from "react";
import "./TableWithChairs.css";
import { useNavigate } from "react-router-dom";
import popupimage from "../media/Teir2popup.png";

const Ticket = ({
  ticket,
  onAddToCart,
  onRemoveFromCart,
  isInCart,
  showDetails,
  onClick,
}) => {
  const formattedPrice = Number(ticket.price).toFixed(2);
  const dotClassName = ticket.is_sold ? "blue-dot sold disabled" : "blue-dot";

  return (
    <div
      className="ticket"
      onClick={() => !ticket.is_sold && onClick(ticket.ticket_id)}
    >
      <div className={dotClassName} />
      {showDetails && (
        <div className="ticket-details">
          <h3>{ticket.sitting_number}</h3>
          <hr style={{ margin: "-3px", width: "90%", marginLeft: "0px" }} />
          <p>Teir: Two</p>
          <span className="item-name">
Row:  {ticket.sitting_number.charAt(0)}    {/* Using charAt() method to get the first character */}
 
</span>
<span className="item-name">
Table:  {ticket.sitting_number.charAt(1)}    {/* Using charAt() method to get the first character */}
 
</span>
          {/* <p>{ticket.description}</p> */}
          <p>Price: R{isNaN(formattedPrice) ? "N/A" : formattedPrice}</p>
          {/* <p>Available: {ticket.amountoftickets}</p> */}

          {/* <p>Sitting Number: {ticket.sitting_number}</p> */}
          <p>Date : Sat, 6 July 2024</p>
          {!isInCart(ticket) ? (
            <button
              className="remove-button"
              style={{ backgroundColor: "green" }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(ticket);
              }}
            >
              Add to Cart
            </button>
          ) : (
            <button
              className="remove-button"
              style={{ backgroundColor: "#000000" }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromCart(ticket);
              }}
            >
              Remove from Cart
            </button>
          )}
        </div>
      )}
    </div>
  );
};
const ImageModal = ({ isOpen, close, imgSrc }) => {
  
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={close}>
      <div className="modal-content">
        <span className="close">&times;</span>
        <img src={imgSrc} alt="Modal" />
      </div>
    </div>
  );
};
const TableWithChairs = () => {
  const [tickets, setTickets] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const navigate = useNavigate();
  
  async function fetchWithRetry(url, options = {}, retries = 3, backoff = 300) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying... attempts left: ${retries}`);
        await new Promise((r) => setTimeout(r, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      } else {
        throw error;
      }
    }
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const handleOpenModal = (imgSrc) => {
    setImageSrc(imgSrc);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetchWithRetry("https://ticket.julyoceanlounges.com/api/tickets")
      .then((data) => {
        console.log("Fetched data:", data);
        setTickets(data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
        setError(error.toString());
      });
  }, []);

  ///////////Cart///////////////
  const addToCart = (ticket) => {
    if (!cart.some((item) => item.ticket_id === ticket.ticket_id)) {
      setCart([...cart, ticket]);
    }
  };
  const removeFromCart = (ticket) => {
    setCart(cart.filter((item) => item.ticket_id !== ticket.ticket_id));
  };
  const isInCart = (ticket) => {
    return cart.some((item) => item.ticket_id === ticket.ticket_id);
  };
  ///////////Cart///////////////
  const handleNavigateToRegister = () => {
    navigate("/CheckEmail", { state: { cart } }); // Navigate to register page and pass cart data
  };

  const handleTicketClick = (ticketId) => {
    setExpandedTicketId((prev) => (prev === ticketId ? null : ticketId));
  };
  const renderChairs = (start, end) =>
    tickets
      .slice(start, end)
      .map((ticket, index) => (
        <Ticket
          key={index}
          ticket={ticket}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          isInCart={isInCart}
          showDetails={expandedTicketId === ticket.ticket_id}
          onClick={handleTicketClick}
        />
      ));

  if (error) {
    return <div>Error: {error}</div>;
  }
  const Cart = ({ cartItems, onRemoveFromCart }) => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + Number(item.price),
      0
    );

    return (
      <div className="cart">
        <hr
          style={{
            width: "20%", // Makes the line span the full width of its container
            height: "5px", // Increases the thickness of the line
            backgroundColor: "#000", // Specifies the color of the line (default is gray)
            border: "none", // Removes any border that might be applied by default
            margin: "4px 120px",
            alignContent: "center",
            borderRadius: "10px", // Adds vertical spacing around the line
          }}
        />

        {cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.ticket_id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="item-name">
                      {item.sitting_number}
                      <span>({item.type})</span>
                    </span>

                    <span className="item-price">
                      Price: R
                      {isNaN(Number(item.price))
                        ? "N/A"
                        : Number(item.price).toFixed(2)}
                    </span>
                    {/* <span className="item-sitting">
                      Sitting No: {item.sitting_number}
                    </span> */}
                  </div>
                  <div className="cart-item-actions">
                    <button
                      onClick={() => onRemoveFromCart(item)}
                      className="remove-icon"
                      style={{ backgroundColor: "#000000" }}
                    >
                      <i className="fas fa-trash-alt"></i>{" "}
                      {/* This line adds the delete icon */}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <strong>Total: R{totalPrice.toFixed(2)}</strong>
              <button
                className="cart-next"
                style={{ backgroundColor: "#000000" }}
                onClick={handleNavigateToRegister}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    );
  };
  return (
    <>
      <div className="background">
       
          <div className="bars-container">
            <div className="bar">
              <span className="bar-number">BAR 03</span>
              <div className="bar-line"></div>
            </div>
            <div className="bar">
              <span className="bar-number">BAR 02</span>
              <div className="bar-line"></div>
            </div>
          </div>

          <div className="groupA1" id="amagroup3">
            <div className="amadot">
              {renderChairs(0, 1)}
              {/* <div
                style={{
                  position: "absolute",
                  top: "285%",
                  left: 4,
                  width: "330%",
                  borderTop: "1px solid black",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "355%",
                  left: 4,
                  width: "330%",
                  borderTop: "1px solid black",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "290%",
                  left: 4,
                  height: "300%",
                  borderLeft: "1px solid black",
                }}
              ></div> */}
            </div>

            <div className="amadot">
              {renderChairs(1, 2)}
              {/* <div
                style={{
                  position: "absolute",
                  top: "285%",
                  left: 0,
                  width: "330%",
                  borderTop: "1px solid black",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "355%",
                  left: 0,
                  width: "330%",
                  borderTop: "1px solid black",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "290%",
                  left: 16,
                  height: "300%",
                  borderLeft: "1px solid black",
                }}
              ></div> */}
            </div>
            <div className="amadot">{renderChairs(2, 3)}</div>
            <div className="amadot">{renderChairs(3, 4)}</div>
            <div className="amadot">{renderChairs(4, 5)}</div>
            <div className="amadot">{renderChairs(5, 6)}</div>
            <div className="amadot">{renderChairs(6, 7)}</div>
            <div className="amadot">{renderChairs(7, 8)}</div>
            <div className="amatable">
              <span>A1</span>
            </div>
          </div>

          <div class="groupA2" id="amagroup3">
            <div className="amadot">{renderChairs(8, 9)}</div>

            <div className="amadot">{renderChairs(9, 10)}</div>
            <div className="amadot">{renderChairs(10, 11)}</div>
            <div className="amadot">{renderChairs(11, 12)}</div>
            <div className="amadot">{renderChairs(12, 13)}</div>
            <div className="amadot">{renderChairs(13, 14)}</div>
            <div className="amadot">{renderChairs(14, 15)}</div>
            <div className="amadot">{renderChairs(15, 16)}</div>
            <div className="amatable">
              <span>B1</span>
            </div>
          </div>
          <div class="groupA3" id="amagroup3">
            <div className="amadot">{renderChairs(16, 17)}</div>
            <div className="amadot">{renderChairs(17, 18)}</div>
            <div className="amadot">{renderChairs(18, 19)}</div>
            <div className="amadot">{renderChairs(19, 20)}</div>
            <div className="amadot">{renderChairs(20, 21)}</div>
            <div className="amadot">{renderChairs(21, 22)}</div>
            <div className="amadot">{renderChairs(22, 23)}</div>
            <div className="amadot">{renderChairs(23, 24)}</div>
            <div className="amatable">
              <span>C1</span>
            </div>
          </div>
          <div class="groupA4" id="amagroup3">
            {/* This is Tier 1 <div className="amadot">{renderChairs(24, 25)}</div> */}
            <div className="amadot">{renderChairs(25, 26)}</div>
            <div className="amadot">{renderChairs(26, 27)}</div>
            <div className="amadot">{renderChairs(27, 28)}</div>
            <div className="amadot">{renderChairs(28, 29)}</div>
            <div className="amadot">{renderChairs(29, 30)}</div>
            <div className="amadot">{renderChairs(30, 31)}</div>
            <div className="amadot">{renderChairs(31, 32)}</div>
            <div className="amadot">{renderChairs(32, 33)}</div>
            <div className="amatable">
              <span>D1</span>
            </div>
          </div>

          

          <div class="groupA5" id="amagroup3">
            <div className="amadot">{renderChairs(41, 42)}</div>
            <div className="amadot">{renderChairs(42, 43)}</div>
            <div className="amadot">{renderChairs(43, 44)}</div>
            <div className="amadot">{renderChairs(44, 45)}</div>
            <div className="amadot">{renderChairs(45, 46)}</div>
            <div className="amadot">{renderChairs(46, 47)}</div>
            <div className="amadot">{renderChairs(47, 48)}</div>
            <div className="amadot">{renderChairs(48, 49)}</div>
            <div className="amatable">
              <span>B2</span>
            </div>
          </div>
          <div class="groupA6" id="amagroup3">
            <div className="amadot">{renderChairs(49, 50)}</div>
            <div className="amadot">{renderChairs(50, 51)}</div>
            <div className="amadot">{renderChairs(51, 52)}</div>
            <div className="amadot">{renderChairs(52, 53)}</div>
            <div className="amadot">{renderChairs(53, 54)}</div>
            <div className="amadot">{renderChairs(54, 55)}</div>
            <div className="amadot">{renderChairs(55, 56)}</div>
            <div className="amadot">{renderChairs(56, 57)}</div>

            <div className="amatable">
              <span>C2</span>
            </div>
          </div>
          <div class="groupA7" id="amagroup3">
            <div className="amadot">{renderChairs(57, 58)}</div>
            <div className="amadot">{renderChairs(58, 59)}</div>
            <div className="amadot">{renderChairs(59, 60)}</div>
            <div className="amadot">{renderChairs(60, 61)}</div>
            <div className="amadot">{renderChairs(61, 62)}</div>
            <div className="amadot">{renderChairs(62, 63)}</div>
            <div className="amadot">{renderChairs(63, 64)}</div>
            <div className="amadot">{renderChairs(64, 65)}</div>
            <div className="amatable">
              <span>D2</span>
            </div>
          </div>
          <div class="groupA8" id="amagroup3">
            <div className="amadot">{renderChairs(73, 74)}</div>
            <div className="amadot">{renderChairs(74, 75)}</div>
            <div className="amadot">{renderChairs(75, 76)}</div>
            <div className="amadot">{renderChairs(76, 77)}</div>
            <div className="amadot">{renderChairs(77, 78)}</div>
            <div className="amadot">{renderChairs(78, 79)}</div>
            <div className="amadot">{renderChairs(79, 80)}</div>
            <div className="amadot">{renderChairs(80, 81)}</div>

            <div className="amatable">
              <span>B3</span>
            </div>
          </div>
          <div class="groupA9" id="amagroup3">
            <div className="amadot">{renderChairs(81, 82)}</div>
            <div className="amadot">{renderChairs(82, 83)}</div>
            <div className="amadot">{renderChairs(83, 84)}</div>
            <div className="amadot">{renderChairs(84, 85)}</div>
            <div className="amadot">{renderChairs(85, 86)}</div>
            <div className="amadot">{renderChairs(86, 87)}</div>
            <div className="amadot">{renderChairs(87, 88)}</div>
            <div className="amadot">{renderChairs(88, 89)}</div>

            <div className="amatable">
              <span>C3</span>
            </div>
          </div>
          <div class="groupA10" id="amagroup3">
            <div className="amadot">{renderChairs(89, 90)}</div>
            <div className="amadot">{renderChairs(90, 91)}</div>
            <div className="amadot">{renderChairs(91, 92)}</div>
            <div className="amadot">{renderChairs(92, 93)}</div>
            <div className="amadot">{renderChairs(93, 94)}</div>
            <div className="amadot">{renderChairs(94, 95)}</div>
            <div className="amadot">{renderChairs(95, 96)}</div>
            <div className="amadot">{renderChairs(96, 97)}</div>

            <div className="amatable">
              <span>D3</span>
            </div>
          </div>
          <div class="groupA11" id="amagroup3">
            <div className="amadot">{renderChairs(105, 106)}</div>
            <div className="amadot">{renderChairs(106, 107)}</div>
            <div className="amadot">{renderChairs(107, 108)}</div>
            <div className="amadot">{renderChairs(108, 109)}</div>
            <div className="amadot">{renderChairs(109, 110)}</div>
            <div className="amadot">{renderChairs(110, 111)}</div>
            <div className="amadot">{renderChairs(111, 112)}</div>
            <div className="amadot">{renderChairs(112, 113)}</div>

            <div className="amatable">
              <span>B4</span>
            </div>
          </div>
          <div class="groupA12" id="amagroup3">
            <div className="amadot">{renderChairs(113, 114)}</div>
            <div className="amadot">{renderChairs(114, 115)}</div>
            <div className="amadot">{renderChairs(115, 116)}</div>
            <div className="amadot">{renderChairs(116, 117)}</div>
            <div className="amadot">{renderChairs(117, 118)}</div>
            <div className="amadot">{renderChairs(118, 119)}</div>
            <div className="amadot">{renderChairs(119, 120)}</div>
            <div className="amadot">{renderChairs(120, 121)}</div>

            <div className="amatable">
              <span>C4</span>
            </div>
          </div>
          <div class="groupA13" id="amagroup3">
            <div className="amadot">{renderChairs(121, 122)}</div>
            <div className="amadot">{renderChairs(122, 123)}</div>
            <div className="amadot">{renderChairs(123, 124)}</div>
            <div className="amadot">{renderChairs(124, 125)}</div>
            <div className="amadot">{renderChairs(125, 126)}</div>
            <div className="amadot">{renderChairs(126, 127)}</div>
            <div className="amadot">{renderChairs(127, 128)}</div>
            <div className="amadot">{renderChairs(128, 129)}</div>

            <div className="amatable">
              <span>D4</span>
            </div>
          </div>
          <div class="groupA14" id="amagroup3">
            <div className="amadot">{renderChairs(137, 138)}</div>
            <div className="amadot">{renderChairs(138, 139)}</div>
            <div className="amadot">{renderChairs(139, 140)}</div>
            <div className="amadot">{renderChairs(140, 141)}</div>
            <div className="amadot">{renderChairs(141, 142)}</div>
            <div className="amadot">{renderChairs(142, 143)}</div>
            <div className="amadot">{renderChairs(143, 144)}</div>
            <div className="amadot">{renderChairs(144, 145)}</div>

            <div className="amatable">
              <span>B5</span>
            </div>
          </div>
          <div class="groupA15" id="amagroup3">
            <div className="amadot">{renderChairs(145, 146)}</div>
            <div className="amadot">{renderChairs(146, 147)}</div>
            <div className="amadot">{renderChairs(147, 148)}</div>
            <div className="amadot">{renderChairs(148, 149)}</div>
            <div className="amadot">{renderChairs(149, 150)}</div>
            <div className="amadot">{renderChairs(150, 151)}</div>
            <div className="amadot">{renderChairs(151, 152)}</div>
            <div className="amadot">{renderChairs(152, 153)}</div>

            <div className="amatable">
              <span>C5</span>
            </div>
          </div>
          <div class="groupA16" id="amagroup3">
            <div className="amadot">{renderChairs(153, 154)}</div>
            <div className="amadot">{renderChairs(154, 155)}</div>
            <div className="amadot">{renderChairs(155, 156)}</div>
            <div className="amadot">{renderChairs(156, 157)}</div>
            <div className="amadot">{renderChairs(157, 158)}</div>
            <div className="amadot">{renderChairs(158, 159)}</div>
            <div className="amadot">{renderChairs(159, 160)}</div>
            <div className="amadot">{renderChairs(160, 161)}</div>

            <div className="amatable">
              <span>D5</span>
            </div>
          </div>
          <div class="groupA17" id="amagroup3">
            <div className="amadot">{renderChairs(169, 170)}</div>
            <div className="amadot">{renderChairs(170, 171)}</div>
            <div className="amadot">{renderChairs(171, 172)}</div>
            <div className="amadot">{renderChairs(172, 173)}</div>
            <div className="amadot">{renderChairs(173, 174)}</div>
            <div className="amadot">{renderChairs(174, 175)}</div>
            <div className="amadot">{renderChairs(175, 176)}</div>
            <div className="amadot">{renderChairs(176, 177)}</div>

            <div className="amatable">
              <span>B6</span>
            </div>
          </div>
          <div class="groupA18" id="amagroup3">
            <div className="amadot">{renderChairs(177, 178)}</div>
            <div className="amadot">{renderChairs(178, 179)}</div>
            <div className="amadot">{renderChairs(179, 180)}</div>
            <div className="amadot">{renderChairs(180, 181)}</div>
            <div className="amadot">{renderChairs(181, 182)}</div>
            <div className="amadot">{renderChairs(182, 183)}</div>
            <div className="amadot">{renderChairs(183, 184)}</div>
            <div className="amadot">{renderChairs(184, 185)}</div>

            <div className="amatable">
              <span>C6</span>
            </div>
          </div>
          <div class="groupA19" id="amagroup3">
            <div className="amadot">{renderChairs(185, 186)}</div>
            <div className="amadot">{renderChairs(186, 187)}</div>
            <div className="amadot">{renderChairs(187, 188)}</div>
            <div className="amadot">{renderChairs(188, 189)}</div>
            <div className="amadot">{renderChairs(189, 190)}</div>
            <div className="amadot">{renderChairs(190, 191)}</div>
            <div className="amadot">{renderChairs(191, 192)}</div>
            <div className="amadot">{renderChairs(192, 193)}</div>

            <div className="amatable">
              <span>D6</span>
            </div>
          </div>
          <div class="groupA20" id="amagroup3">
            <div className="amadot">{renderChairs(201, 202)}</div>
            <div className="amadot">{renderChairs(202, 203)}</div>
            <div className="amadot">{renderChairs(203, 204)}</div>
            <div className="amadot">{renderChairs(204, 205)}</div>
            <div className="amadot">{renderChairs(205, 206)}</div>
            <div className="amadot">{renderChairs(206, 207)}</div>
            <div className="amadot">{renderChairs(207, 208)}</div>
            <div className="amadot">{renderChairs(208, 209)}</div>

            <div className="amatable">
              <span>B7</span>
            </div>
          </div>
          <div class="groupA21" id="amagroup3">
            <div className="amadot">{renderChairs(209, 210)}</div>
            <div className="amadot">{renderChairs(210, 211)}</div>
            <div className="amadot">{renderChairs(211, 212)}</div>
            <div className="amadot">{renderChairs(212, 213)}</div>
            <div className="amadot">{renderChairs(213, 214)}</div>
            <div className="amadot">{renderChairs(214, 215)}</div>
            <div className="amadot">{renderChairs(215, 216)}</div>
            <div className="amadot">{renderChairs(216, 217)}</div>

            <div className="amatable">
              <span>C7</span>
            </div>
          </div>
          <div class="groupA22" id="amagroup3">
            <div className="amadot">{renderChairs(217, 218)}</div>
            <div className="amadot">{renderChairs(218, 219)}</div>
            <div className="amadot">{renderChairs(219, 220)}</div>
            <div className="amadot">{renderChairs(220, 221)}</div>
            <div className="amadot">{renderChairs(221, 222)}</div>
            <div className="amadot">{renderChairs(222, 223)}</div>
            <div className="amadot">{renderChairs(223, 224)}</div>
            <div className="amadot">{renderChairs(224, 225)}</div>

            <div className="amatable">
              <span>D7</span>
            </div>
          </div>
          <div class="groupA23" id="amagroup3">
            <div className="amadot">{renderChairs(233, 234)}</div>
            <div className="amadot">{renderChairs(234, 235)}</div>
            <div className="amadot">{renderChairs(235, 236)}</div>
            <div className="amadot">{renderChairs(236, 237)}</div>
            <div className="amadot">{renderChairs(237, 238)}</div>
            <div className="amadot">{renderChairs(238, 239)}</div>
            <div className="amadot">{renderChairs(239, 240)}</div>
            <div className="amadot">{renderChairs(240, 241)}</div>

            <div className="amatable">
              <span>B8</span>
            </div>
          </div>
          <div class="groupA24" id="amagroup3">
            <div className="amadot">{renderChairs(241, 242)}</div>
            <div className="amadot">{renderChairs(242, 243)}</div>
            <div className="amadot">{renderChairs(243, 244)}</div>
            <div className="amadot">{renderChairs(244, 245)}</div>
            <div className="amadot">{renderChairs(245, 246)}</div>
            <div className="amadot">{renderChairs(246, 247)}</div>
            <div className="amadot">{renderChairs(247, 248)}</div>
            <div className="amadot">{renderChairs(248, 249)}</div>

            <div className="amatable">
              <span>C8</span>
            </div>
          </div>
          <div class="groupA25" id="amagroup3">
            <div className="amadot">{renderChairs(249, 250)}</div>
            <div className="amadot">{renderChairs(250, 251)}</div>
            <div className="amadot">{renderChairs(251, 252)}</div>
            <div className="amadot">{renderChairs(252, 253)}</div>
            <div className="amadot">{renderChairs(253, 254)}</div>
            <div className="amadot">{renderChairs(254, 255)}</div>
            <div className="amadot">{renderChairs(255, 256)}</div>
            <div className="amadot">{renderChairs(256, 257)}</div>

            <div className="amatable">
              <span>D8</span>
            </div>
          </div>
          <div class="groupA26" id="amagroup3">
            <div className="amadot">{renderChairs(265, 266)}</div>
            <div className="amadot">{renderChairs(266, 267)}</div>
            <div className="amadot">{renderChairs(267, 268)}</div>
            <div className="amadot">{renderChairs(268, 269)}</div>
            <div className="amadot">{renderChairs(269, 270)}</div>
            <div className="amadot">{renderChairs(270, 271)}</div>
            <div className="amadot">{renderChairs(271, 272)}</div>
            <div className="amadot">{renderChairs(272, 273)}</div>

            <div className="amatable">
              <span>B9</span>
            </div>
          </div>
          <div class="groupA27" id="amagroup3">
            <div className="amadot">{renderChairs(273, 274)}</div>
            <div className="amadot">{renderChairs(274, 275)}</div>
            <div className="amadot">{renderChairs(275, 276)}</div>
            <div className="amadot">{renderChairs(276, 277)}</div>
            <div className="amadot">{renderChairs(277, 278)}</div>
            <div className="amadot">{renderChairs(278, 279)}</div>
            <div className="amadot">{renderChairs(279, 280)}</div>
            <div className="amadot">{renderChairs(280, 281)}</div>

            <div className="amatable">
              <span>C9</span>
            </div>
          </div>
          <div class="groupA28" id="amagroup3">
            <div className="amadot">{renderChairs(281, 282)}</div>
            <div className="amadot">{renderChairs(282, 283)}</div>
            <div className="amadot">{renderChairs(283, 284)}</div>
            <div className="amadot">{renderChairs(284, 285)}</div>
            <div className="amadot">{renderChairs(285, 286)}</div>
            <div className="amadot">{renderChairs(286, 287)}</div>
            <div className="amadot">{renderChairs(287, 288)}</div>
            <div className="amadot">{renderChairs(288, 289)}</div>

            <div className="amatable">
              <span>D9</span>
            </div>
          </div>
          <div class="groupA29" id="amagroup3">
            <div className="amadot">{renderChairs(289, 290)}</div>
            <div className="amadot">{renderChairs(290, 291)}</div>
            <div className="amadot">{renderChairs(291, 292)}</div>
            <div className="amadot">{renderChairs(292, 293)}</div>
            <div className="amadot">{renderChairs(293, 294)}</div>
            <div className="amadot">{renderChairs(294, 295)}</div>
            <div className="amadot">{renderChairs(295, 296)}</div>
            <div className="amadot">{renderChairs(296, 297)}</div>

            <div className="amatable">
              <span>B10</span>
            </div>
          </div>
          <div class="groupA30" id="amagroup3">
            <div className="amadot">{renderChairs(297, 298)}</div>
            <div className="amadot">{renderChairs(298, 299)}</div>
            <div className="amadot">{renderChairs(299, 300)}</div>
            <div className="amadot">{renderChairs(300, 301)}</div>
            <div className="amadot">{renderChairs(301, 302)}</div>
            <div className="amadot">{renderChairs(302, 303)}</div>
            <div className="amadot">{renderChairs(303, 304)}</div>
            <div className="amadot">{renderChairs(304, 305)}</div>

            <div className="amatable">
              <span>C10</span>
            </div>
          </div>
          <div class="groupA31" id="amagroup3">
            <div className="amadot">{renderChairs(305, 306)}</div>
            <div className="amadot">{renderChairs(306, 307)}</div>
            <div className="amadot">{renderChairs(307, 308)}</div>
            <div className="amadot">{renderChairs(308, 309)}</div>
            <div className="amadot">{renderChairs(309, 310)}</div>
            <div className="amadot">{renderChairs(310, 311)}</div>
            <div className="amadot">{renderChairs(311, 312)}</div>
            <div className="amadot">{renderChairs(312, 313)}</div>

            <div className="amatable">
              <span>D10</span>
            </div>
          </div>
          <div class="groupA32" id="amagroup3">
            <div className="amadot">{renderChairs(313, 314)}</div>
            <div className="amadot">{renderChairs(314, 315)}</div>
            <div className="amadot">{renderChairs(315, 316)}</div>
            <div className="amadot">{renderChairs(316, 317)}</div>
            <div className="amadot">{renderChairs(317, 318)}</div>
            <div className="amadot">{renderChairs(318, 319)}</div>
            <div className="amadot">{renderChairs(319, 320)}</div>
            <div className="amadot">{renderChairs(320, 321)}</div>

            <div className="amatable">
              <span>B11</span>
            </div>
          </div>
          <div class="groupA33" id="amagroup3">
            <div className="amadot">{renderChairs(321, 322)}</div>
            <div className="amadot">{renderChairs(322, 323)}</div>
            <div className="amadot">{renderChairs(323, 324)}</div>
            <div className="amadot">{renderChairs(324, 325)}</div>
            <div className="amadot">{renderChairs(325, 326)}</div>
            <div className="amadot">{renderChairs(326, 327)}</div>
            <div className="amadot">{renderChairs(327, 328)}</div>
            <div className="amadot">{renderChairs(328, 329)}</div>

            <div className="amatable">
              <span>C11</span>
            </div>
          </div>
          <div class="groupA34" id="amagroup3">
            <div className="amadot">{renderChairs(329, 330)}</div>
            <div className="amadot">{renderChairs(330, 331)}</div>
            <div className="amadot">{renderChairs(331, 332)}</div>
            <div className="amadot">{renderChairs(332, 333)}</div>
            <div className="amadot">{renderChairs(333, 334)}</div>
            <div className="amadot">{renderChairs(334, 335)}</div>
            <div className="amadot">{renderChairs(335, 336)}</div>
            <div className="amadot">{renderChairs(336, 337)}</div>

            <div className="amatable">
              <span>D11</span>
            </div>
          </div>
          <div class="groupA35" id="amagroup3">
            <div className="amadot">{renderChairs(337, 338)}</div>
            <div className="amadot">{renderChairs(338, 339)}</div>
            <div className="amadot">{renderChairs(339, 340)}</div>
            <div className="amadot">{renderChairs(340, 341)}</div>
            <div className="amadot">{renderChairs(341, 342)}</div>
            <div className="amadot">{renderChairs(342, 343)}</div>
            <div className="amadot">{renderChairs(343, 344)}</div>
            <div className="amadot">{renderChairs(344, 345)}</div>

            <div className="amatable">
              <span>B12</span>
            </div>
          </div>
          <div class="groupA36" id="amagroup3">
            <div className="amadot">{renderChairs(345, 346)}</div>
            <div className="amadot">{renderChairs(346, 347)}</div>
            <div className="amadot">{renderChairs(347, 348)}</div>
            <div className="amadot">{renderChairs(348, 349)}</div>
            <div className="amadot">{renderChairs(349, 350)}</div>
            <div className="amadot">{renderChairs(350, 351)}</div>
            <div className="amadot">{renderChairs(351, 352)}</div>
            <div className="amadot">{renderChairs(352, 353)}</div>

            <div className="amatable">
              <span>C12</span>
            </div>
          </div>
          <div class="groupA37" id="amagroup3">
            <div className="amadot">{renderChairs(353, 354)}</div>
            <div className="amadot">{renderChairs(354, 355)}</div>
            <div className="amadot">{renderChairs(355, 356)}</div>
            <div className="amadot">{renderChairs(356, 357)}</div>
            <div className="amadot">{renderChairs(357, 358)}</div>
            <div className="amadot">{renderChairs(358, 359)}</div>
            <div className="amadot">{renderChairs(359, 360)}</div>
            <div className="amadot">{renderChairs(360, 361)}</div>

            <div className="amatable">
              <span>D12</span>
            </div>
          </div>
          <div class="groupA38" id="amagroup3">
            <div className="amadot">{renderChairs(361, 362)}</div>
            <div className="amadot">{renderChairs(362, 363)}</div>
            <div className="amadot">{renderChairs(363, 364)}</div>
            <div className="amadot">{renderChairs(364, 365)}</div>
            <div className="amadot">{renderChairs(365, 366)}</div>
            <div className="amadot">{renderChairs(366, 367)}</div>
            <div className="amadot">{renderChairs(367, 368)}</div>
            <div className="amadot">{renderChairs(368, 369)}</div>

            <div className="amatable">
              <span>B13</span>
            </div>
          </div>
          <div class="groupA39" id="amagroup3">
            <div className="amadot">{renderChairs(369, 370)}</div>
            <div className="amadot">{renderChairs(370, 371)}</div>
            <div className="amadot">{renderChairs(371, 372)}</div>
            <div className="amadot">{renderChairs(372, 373)}</div>
            <div className="amadot">{renderChairs(373, 374)}</div>
            <div className="amadot">{renderChairs(374, 375)}</div>
            <div className="amadot">{renderChairs(375, 376)}</div>
            <div className="amadot">{renderChairs(376, 377)}</div>

            <div className="amatable">
              <span>C13</span>
            </div>
          </div>
          <div class="groupA40" id="amagroup3">
            <div className="amadot">{renderChairs(377, 378)}</div>
            <div className="amadot">{renderChairs(378, 379)}</div>
            <div className="amadot">{renderChairs(379, 380)}</div>
            <div className="amadot">{renderChairs(380, 381)}</div>
            <div className="amadot">{renderChairs(381, 382)}</div>
            <div className="amadot">{renderChairs(382, 383)}</div>
            <div className="amadot">{renderChairs(383, 384)}</div>
            <div className="amadot">{renderChairs(384, 385)}</div>

            <div className="amatable">
              <span>D13</span>
            </div>
          </div>
          <div class="groupA41" id="amagroup3">
            <div className="amadot">{renderChairs(385, 386)}</div>
            <div className="amadot">{renderChairs(386, 387)}</div>
            <div className="amadot">{renderChairs(387, 388)}</div>
            <div className="amadot">{renderChairs(388, 389)}</div>
            <div className="amadot">{renderChairs(389, 390)}</div>
            <div className="amadot">{renderChairs(390, 391)}</div>
            <div className="amadot">{renderChairs(391, 392)}</div>
            <div className="amadot">{renderChairs(392, 393)}</div>

            <div className="amatable">
              <span>B14</span>
            </div>
          </div>
          <div class="groupA42" id="amagroup3">
            <div className="amadot">{renderChairs(393, 394)}</div>
            <div className="amadot">{renderChairs(394, 395)}</div>
            <div className="amadot">{renderChairs(395, 396)}</div>
            <div className="amadot">{renderChairs(396, 397)}</div>
            <div className="amadot">{renderChairs(397, 398)}</div>
            <div className="amadot">{renderChairs(398, 399)}</div>
            <div className="amadot">{renderChairs(399, 400)}</div>
            <div className="amadot">{renderChairs(400, 401)}</div>

            <div className="amatable">
              <span>C14</span>
            </div>
          </div>
          <div class="groupA43" id="amagroup3">
            <div className="amadot">{renderChairs(401, 402)}</div>
            <div className="amadot">{renderChairs(402, 403)}</div>
            <div className="amadot">{renderChairs(403, 404)}</div>
            <div className="amadot">{renderChairs(404, 405)}</div>
            <div className="amadot">{renderChairs(405, 406)}</div>
            <div className="amadot">{renderChairs(406, 407)}</div>
            <div className="amadot">{renderChairs(407, 408)}</div>
            <div className="amadot">{renderChairs(408, 409)}</div>

            <div className="amatable">
              <span>D14</span>
            </div>
          </div>
          <div class="groupA44" id="amagroup3">
            <div className="amadot">{renderChairs(409, 410)}</div>
            <div className="amadot">{renderChairs(410, 411)}</div>
            <div className="amadot">{renderChairs(411, 412)}</div>
            <div className="amadot">{renderChairs(412, 413)}</div>
            <div className="amadot">{renderChairs(413, 414)}</div>
            <div className="amadot">{renderChairs(414, 415)}</div>
            <div className="amadot">{renderChairs(415, 416)}</div>
            <div className="amadot">{renderChairs(416, 417)}</div>

            <div className="amatable">
              <span>B15</span>
            </div>
          </div>
          <div class="groupA45" id="amagroup3">
            <div className="amadot">{renderChairs(417, 418)}</div>
            <div className="amadot">{renderChairs(418, 419)}</div>
            <div className="amadot">{renderChairs(419, 420)}</div>
            <div className="amadot">{renderChairs(420, 421)}</div>
            <div className="amadot">{renderChairs(421, 422)}</div>
            <div className="amadot">{renderChairs(422, 423)}</div>
            <div className="amadot">{renderChairs(423, 424)}</div>
            <div className="amadot">{renderChairs(424, 425)}</div>

            <div className="amatable">
              <span>C15</span>
            </div>
          </div>
          <div class="groupA46" id="amagroup3">
            <div className="amadot">{renderChairs(425, 426)}</div>
            <div className="amadot">{renderChairs(426, 427)}</div>
            <div className="amadot">{renderChairs(427, 428)}</div>
            <div className="amadot">{renderChairs(428, 429)}</div>
            <div className="amadot">{renderChairs(429, 430)}</div>
            <div className="amadot">{renderChairs(430, 431)}</div>
            <div className="amadot">{renderChairs(431, 432)}</div>
            <div className="amadot">{renderChairs(432, 433)}</div>

            <div className="amatable">
              <span>D15</span>
            </div>
          </div>
          <div class="groupA47" id="amagroup3">
            <div className="amadot">{renderChairs(433, 434)}</div>
            <div className="amadot">{renderChairs(434, 435)}</div>
            <div className="amadot">{renderChairs(435, 436)}</div>
            <div className="amadot">{renderChairs(436, 437)}</div>
            <div className="amadot">{renderChairs(437, 438)}</div>
            <div className="amadot">{renderChairs(438, 439)}</div>
            <div className="amadot">{renderChairs(439, 440)}</div>
            <div className="amadot">{renderChairs(440, 441)}</div>

            <div className="amatable">
              <span>B16</span>
            </div>
          </div>
          <div class="groupA48" id="amagroup3">
            <div className="amadot">{renderChairs(441, 442)}</div>
            <div className="amadot">{renderChairs(442, 443)}</div>
            <div className="amadot">{renderChairs(443, 444)}</div>
            <div className="amadot">{renderChairs(444, 445)}</div>
            <div className="amadot">{renderChairs(445, 446)}</div>
            <div className="amadot">{renderChairs(446, 447)}</div>
            <div className="amadot">{renderChairs(447, 448)}</div>
            <div className="amadot">{renderChairs(448, 449)}</div>

            <div className="amatable">
              <span>C16</span>
            </div>
          </div>
          <div class="groupA49" id="amagroup3">
            <div className="amadot">{renderChairs(449, 450)}</div>
            <div className="amadot">{renderChairs(450, 451)}</div>
            <div className="amadot">{renderChairs(451, 452)}</div>
            <div className="amadot">{renderChairs(452, 453)}</div>
            <div className="amadot">{renderChairs(453, 454)}</div>
            <div className="amadot">{renderChairs(454, 455)}</div>
            <div className="amadot">{renderChairs(455, 456)}</div>
            <div className="amadot">{renderChairs(456, 457)}</div>

            <div className="amatable">
              <span>C17</span>
            </div>
          </div>
          <div class="groupA50" id="amagroup3">
            <div className="amadot">{renderChairs(33, 34)}</div>
            <div className="amadot">{renderChairs(34, 35)}</div>
            <div className="amadot">{renderChairs(35, 36)}</div>
            <div className="amadot">{renderChairs(36, 37)}</div>
            <div className="amadot">{renderChairs(37, 38)}</div>
            <div className="amadot">{renderChairs(38, 39)}</div>
            <div className="amadot">{renderChairs(39, 40)}</div>
            <div className="amadot">{renderChairs(40, 41)}</div>

            <div className="amatable">
              <span>A2</span>
            </div>
          </div>
          <div class="groupA51" id="amagroup3">
            <div className="amadot">{renderChairs(65, 66)}</div>
            <div className="amadot">{renderChairs(66, 67)}</div>
            <div className="amadot">{renderChairs(67, 68)}</div>
            <div className="amadot">{renderChairs(68, 69)}</div>
            <div className="amadot">{renderChairs(69, 70)}</div>
            <div className="amadot">{renderChairs(70, 71)}</div>
            <div className="amadot">{renderChairs(71, 72)}</div>
            <div className="amadot">{renderChairs(72, 73)}</div>
            <div className="amatable">
              <span>A3</span>
            </div>
          </div>
          <div className="groupA52" id="amagroup3">
            <div className="amadot">{renderChairs(97, 98)}</div>
            <div className="amadot">{renderChairs(98, 99)}</div>
            <div className="amadot">{renderChairs(99, 100)}</div>
            <div className="amadot">{renderChairs(100, 101)}</div>
            <div className="amadot">{renderChairs(101, 102)}</div>
            <div className="amadot">{renderChairs(102, 103)}</div>
            <div className="amadot">{renderChairs(103, 104)}</div>
            <div className="amadot">{renderChairs(104, 105)}</div>

            <div className="amatable">
              <p>A4</p>
            </div>
          </div>
          <div class="groupA53" id="amagroup3">
            <div className="amadot">{renderChairs(129, 130)}</div>
            <div className="amadot">{renderChairs(130, 131)}</div>
            <div className="amadot">{renderChairs(131, 132)}</div>
            <div className="amadot">{renderChairs(132, 133)}</div>
            <div className="amadot">{renderChairs(133, 134)}</div>
            <div className="amadot">{renderChairs(134, 135)}</div>
            <div className="amadot">{renderChairs(135, 136)}</div>
            <div className="amadot">{renderChairs(136, 137)}</div>

            <div className="amatable">
              <span>A5</span>
            </div>
          </div>
          <div class="groupA54" id="amagroup3">
            <div className="amadot">{renderChairs(161, 162)}</div>
            <div className="amadot">{renderChairs(162, 163)}</div>
            <div className="amadot">{renderChairs(163, 164)}</div>
            <div className="amadot">{renderChairs(164, 165)}</div>
            <div className="amadot">{renderChairs(165, 166)}</div>
            <div className="amadot">{renderChairs(166, 167)}</div>
            <div className="amadot">{renderChairs(167, 168)}</div>
            <div className="amadot">{renderChairs(168, 169)}</div>

            <div className="amatable">
              <span>A6</span>
            </div>
          </div>
          <div className="groupA55" id="amagroup3">
            <div className="amadot">{renderChairs(193, 194)}</div>
            <div className="amadot">{renderChairs(194, 195)}</div>
            <div className="amadot">{renderChairs(195, 196)}</div>
            <div className="amadot">{renderChairs(196, 197)}</div>
            <div className="amadot">{renderChairs(197, 198)}</div>
            <div className="amadot">{renderChairs(198, 199)}</div>
            <div className="amadot">{renderChairs(199, 200)}</div>
            <div className="amadot">{renderChairs(200, 201)}</div>

            <div className="amatable">
              <p>A7</p>
            </div>
          </div>
          <div class="groupA56" id="amagroup3">
            <div className="amadot">{renderChairs(225, 226)}</div>
            <div className="amadot">{renderChairs(226, 227)}</div>
            <div className="amadot">{renderChairs(227, 228)}</div>
            <div className="amadot">{renderChairs(228, 229)}</div>
            <div className="amadot">{renderChairs(229, 230)}</div>
            <div className="amadot">{renderChairs(230, 231)}</div>
            <div className="amadot">{renderChairs(231, 232)}</div>
            <div className="amadot">{renderChairs(232, 233)}</div>

            <div className="amatable">
              <span>A8</span>
            </div>
          </div>
          <div className="groupA57" id="amagroup3">
            <div className="amadot">{renderChairs(257, 258)}</div>
            <div className="amadot">{renderChairs(258, 259)}</div>
            <div className="amadot">{renderChairs(259, 260)}</div>
            <div className="amadot">{renderChairs(260, 261)}</div>
            <div className="amadot">{renderChairs(261, 262)}</div>
            <div className="amadot">{renderChairs(262, 263)}</div>
            <div className="amadot">{renderChairs(263, 264)}</div>
            <div className="amadot">{renderChairs(264, 265)}</div>

            <div className="amatable">
              <p>A9</p>
            </div>
          </div>
          
          <Cart cartItems={cart} onRemoveFromCart={removeFromCart} />
       
      </div><button className="floorplan" onClick={() => handleOpenModal({popupimage})}>View Floor plan</button>
        <ImageModal isOpen={modalOpen} close={handleCloseModal} imgSrc={popupimage} />
 
    </>
  );
};

export default TableWithChairs;
