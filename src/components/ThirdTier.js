import React, { useEffect, useState } from "react";
import "./ThirdTier.css";
import { useNavigate } from "react-router-dom";
import background from "../media/background.png";

const Ticket = ({
  ticket,
  onAddToCart,
  onRemoveFromCart,
  isInCart,
  showDetails,
  onClick,
}) => {
  const formattedPrice = Number(ticket.price).toFixed(2);
  const dotClassName = ticket.is_sold ? "orange-dot sold disabled" : "orange-dot";

  return (
    <div
      className="ticket"
      onClick={() => !ticket.is_sold && onClick(ticket.ticket_id)}
    >
      <div className={dotClassName} />
      {showDetails && (
        <div className="ticket-details">
        <h3>{ticket.sitting_number}</h3> 
        <p>Teir: {ticket.type}</p>
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
        <p>
        Date : Sat, 6 July 2024
        </p>
        {!isInCart(ticket) ? (
          <button   className="remove-button" style={{backgroundColor: '#000000'}}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(ticket);
            }}
          >
            Add to Cart
          </button>
        ) : (
          <button   className="remove-button" style={{backgroundColor: '#000000'}}
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

const ThirdTier = () => {
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
      <hr style={{
  width: '20%',      // Makes the line span the full width of its container
  height: '5px',      // Increases the thickness of the line
  backgroundColor: '#000',  // Specifies the color of the line (default is gray)
  border: 'none',     // Removes any border that might be applied by default
  margin: '4px 120px', 
  alignContent: 'center',
  borderRadius: '10px'   // Adds vertical spacing around the line
}}/>

        {cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.ticket_id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="item-name">{item.sitting_number}    <span >({item.type})</span></span>
                
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
  className="remove-icon" style={{backgroundColor: '#000000'}}
>
  <i className="fas fa-trash-alt"></i> {/* This line adds the delete icon */}
</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <strong>Total: R{totalPrice.toFixed(2)}</strong>
              <button
                className="cart-next"  style={{backgroundColor: '#000000'}}
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
      <div className="background3rd">
        <div className="linefortables">
         

          <div className="group3rdA1" id="amagroup1">
          <div className="amadot">{renderChairs(457, 458)}</div>
<div className="amadot">{renderChairs(458, 459)}</div>
<div className="amadot">{renderChairs(459, 460)}</div>
<div className="amadot">{renderChairs(460, 461)}</div>
<div className="amadot">{renderChairs(461, 462)}</div>
<div className="amadot">{renderChairs(462, 463)}</div>
<div className="amadot">{renderChairs(463, 464)}</div>
<div className="amadot">{renderChairs(464, 465)}</div>


            <div className="amatable3rd">
              <span>A1</span>
            </div>
          </div>
          <div class="group3rdB1" id="amagroup2">
          <div className="amadot">{renderChairs(465, 466)}</div>
<div className="amadot">{renderChairs(466, 467)}</div>
<div className="amadot">{renderChairs(467, 468)}</div>
<div className="amadot">{renderChairs(468, 469)}</div>
<div className="amadot">{renderChairs(469, 470)}</div>
<div className="amadot">{renderChairs(470, 471)}</div>
<div className="amadot">{renderChairs(471, 472)}</div>
<div className="amadot">{renderChairs(472, 473)}</div>

            <div className="amatable3rd">
              <span>B1</span>
            </div>
          </div>
          <div class="group3rdC1" id="amagroup3">
          <div className="amadot">{renderChairs(473, 474)}</div>
<div className="amadot">{renderChairs(474, 475)}</div>
<div className="amadot">{renderChairs(475, 476)}</div>
<div className="amadot">{renderChairs(476, 477)}</div>
<div className="amadot">{renderChairs(477, 478)}</div>
<div className="amadot">{renderChairs(478, 479)}</div>
<div className="amadot">{renderChairs(479, 480)}</div>
<div className="amadot">{renderChairs(480, 481)}</div>

            <div className="amatable3rd">
              <span>C1</span>
            </div>
          </div>
          <div class="group3rdD1" id="amagroup3">
          <div className="amadot">{renderChairs(481, 482)}</div>
<div className="amadot">{renderChairs(482, 483)}</div>
<div className="amadot">{renderChairs(483, 484)}</div>
<div className="amadot">{renderChairs(484, 485)}</div>
<div className="amadot">{renderChairs(485, 486)}</div>
<div className="amadot">{renderChairs(486, 487)}</div>
<div className="amadot">{renderChairs(487, 488)}</div>
<div className="amadot">{renderChairs(488, 489)}</div>

            <div className="amatable3rd">
              <span>D1</span>
            </div>
          </div>

          <div class="group3rdA2" id="amagroup3">
          <div className="amadot">{renderChairs(489, 490)}</div>
<div className="amadot">{renderChairs(490, 491)}</div>
<div className="amadot">{renderChairs(491, 492)}</div>
<div className="amadot">{renderChairs(492, 493)}</div>
<div className="amadot">{renderChairs(493, 494)}</div>
<div className="amadot">{renderChairs(494, 495)}</div>
<div className="amadot">{renderChairs(495, 496)}</div>
<div className="amadot">{renderChairs(496, 497)}</div>

            <div className="amatable3rd">
              <span>A2</span>
            </div>
          </div>
          <div class="group3rdB2" id="amagroup3">
          <div className="amadot">{renderChairs(497, 498)}</div>
<div className="amadot">{renderChairs(498, 499)}</div>
<div className="amadot">{renderChairs(499, 500)}</div>
<div className="amadot">{renderChairs(500, 501)}</div>
<div className="amadot">{renderChairs(501, 502)}</div>
<div className="amadot">{renderChairs(502, 503)}</div>
<div className="amadot">{renderChairs(503, 504)}</div>
<div className="amadot">{renderChairs(504, 505)}</div>

            <div className="amatable3rd">
              <span>B2</span>
            </div>
          </div>
          <div class="group3rdC2" id="amagroup3">
          <div className="amadot">{renderChairs(505, 506)}</div>
<div className="amadot">{renderChairs(506, 507)}</div>
<div className="amadot">{renderChairs(507, 508)}</div>
<div className="amadot">{renderChairs(508, 509)}</div>
<div className="amadot">{renderChairs(509, 510)}</div>
<div className="amadot">{renderChairs(510, 511)}</div>
<div className="amadot">{renderChairs(511, 512)}</div>
<div className="amadot">{renderChairs(512, 513)}</div>


            <div className="amatable3rd">
              <span>C2</span>
            </div>
          </div>
          <div class="group3rdD2" id="amagroup3">
          <div className="amadot">{renderChairs(513, 514)}</div>
<div className="amadot">{renderChairs(514, 515)}</div>
<div className="amadot">{renderChairs(515, 516)}</div>
<div className="amadot">{renderChairs(516, 517)}</div>
<div className="amadot">{renderChairs(517, 518)}</div>
<div className="amadot">{renderChairs(518, 519)}</div>
<div className="amadot">{renderChairs(519, 520)}</div>
<div className="amadot">{renderChairs(520, 521)}</div>

            <div className="amatable3rd">
              <span>D2</span>
            </div>
          </div>

          <div class="group3rdA3" id="amagroup3">
          <div className="amadot">{renderChairs(521, 522)}</div>
<div className="amadot">{renderChairs(522, 523)}</div>
<div className="amadot">{renderChairs(523, 524)}</div>
<div className="amadot">{renderChairs(524, 525)}</div>
<div className="amadot">{renderChairs(525, 526)}</div>
<div className="amadot">{renderChairs(526, 527)}</div>
<div className="amadot">{renderChairs(527, 528)}</div>
<div className="amadot">{renderChairs(528, 529)}</div>


            <div className="amatable3rd">
              <span>A3</span>
            </div>
          </div>
          <div class="group3rdB3" id="amagroup3">
          <div className="amadot">{renderChairs(529, 530)}</div>
<div className="amadot">{renderChairs(530, 531)}</div>
<div className="amadot">{renderChairs(531, 532)}</div>
<div className="amadot">{renderChairs(532, 533)}</div>
<div className="amadot">{renderChairs(533, 534)}</div>
<div className="amadot">{renderChairs(534, 535)}</div>
<div className="amadot">{renderChairs(535, 536)}</div>
<div className="amadot">{renderChairs(536, 537)}</div>


            <div className="amatable3rd">
              <span>B3</span>
            </div>
          </div>
          <div class="group3rdC3" id="amagroup3">
          <div className="amadot">{renderChairs(537, 538)}</div>
<div className="amadot">{renderChairs(538, 539)}</div>
<div className="amadot">{renderChairs(539, 540)}</div>
<div className="amadot">{renderChairs(540, 541)}</div>
<div className="amadot">{renderChairs(541, 542)}</div>
<div className="amadot">{renderChairs(542, 543)}</div>
<div className="amadot">{renderChairs(543, 544)}</div>
<div className="amadot">{renderChairs(544, 545)}</div>


            <div className="amatable3rd">
              <span>C3</span>
            </div>
          </div>
          <div class="group3rdD3" id="amagroup3">
          <div className="amadot">{renderChairs(545, 546)}</div>
<div className="amadot">{renderChairs(546, 547)}</div>
<div className="amadot">{renderChairs(547, 548)}</div>
<div className="amadot">{renderChairs(548, 549)}</div>
<div className="amadot">{renderChairs(549, 550)}</div>
<div className="amadot">{renderChairs(550, 551)}</div>
<div className="amadot">{renderChairs(551, 552)}</div>
<div className="amadot">{renderChairs(552, 553)}</div>


            <div className="amatable3rd">
              <span>D3</span>
            </div>
          </div>

          <div class="group3rdA4" id="amagroup3">
          <div className="amadot">{renderChairs(553, 554)}</div>
<div className="amadot">{renderChairs(554, 555)}</div>
<div className="amadot">{renderChairs(555, 556)}</div>
<div className="amadot">{renderChairs(556, 557)}</div>
<div className="amadot">{renderChairs(557, 558)}</div>
<div className="amadot">{renderChairs(558, 559)}</div>
<div className="amadot">{renderChairs(559, 560)}</div>
<div className="amadot">{renderChairs(560, 561)}</div>


            <div className="amatable3rd">
              <span>A4</span>
            </div>
          </div>
          <div class="group3rdB4" id="amagroup3">
          <div className="amadot">{renderChairs(561, 562)}</div>
<div className="amadot">{renderChairs(562, 563)}</div>
<div className="amadot">{renderChairs(563, 564)}</div>
<div className="amadot">{renderChairs(564, 565)}</div>
<div className="amadot">{renderChairs(565, 566)}</div>
<div className="amadot">{renderChairs(566, 567)}</div>
<div className="amadot">{renderChairs(567, 568)}</div>
<div className="amadot">{renderChairs(568, 569)}</div>


            <div className="amatable3rd">
              <span>B4</span>
            </div>
          </div>
          <div class="group3rdC4" id="amagroup3">
          <div className="amadot">{renderChairs(569, 570)}</div>
<div className="amadot">{renderChairs(570, 571)}</div>
<div className="amadot">{renderChairs(571, 572)}</div>
<div className="amadot">{renderChairs(572, 573)}</div>
<div className="amadot">{renderChairs(573, 574)}</div>
<div className="amadot">{renderChairs(574, 575)}</div>
<div className="amadot">{renderChairs(575, 576)}</div>
<div className="amadot">{renderChairs(576, 577)}</div>


            <div className="amatable3rd">
              <span>C4</span>
            </div>
          </div>
          <div class="group3rdD4" id="amagroup3">
          <div className="amadot">{renderChairs(577, 578)}</div>
<div className="amadot">{renderChairs(578, 579)}</div>
<div className="amadot">{renderChairs(579, 580)}</div>
<div className="amadot">{renderChairs(580, 581)}</div>
<div className="amadot">{renderChairs(581, 582)}</div>
<div className="amadot">{renderChairs(582, 583)}</div>
<div className="amadot">{renderChairs(583, 584)}</div>
<div className="amadot">{renderChairs(584, 585)}</div>


            <div className="amatable3rd">
              <span>D4</span>
            </div>
          </div>

          <div class="group3rdA5" id="amagroup3">
          <div className="amadot">{renderChairs(585, 586)}</div>
<div className="amadot">{renderChairs(586, 587)}</div>
<div className="amadot">{renderChairs(587, 588)}</div>
<div className="amadot">{renderChairs(588, 589)}</div>
<div className="amadot">{renderChairs(589, 590)}</div>
<div className="amadot">{renderChairs(590, 591)}</div>
<div className="amadot">{renderChairs(591, 592)}</div>
<div className="amadot">{renderChairs(592, 593)}</div>


            <div className="amatable3rd">
              <span>A5</span>
            </div>
          </div>
          <div class="group3rdB5" id="amagroup3">
          <div className="amadot">{renderChairs(593, 594)}</div>
<div className="amadot">{renderChairs(594, 595)}</div>
<div className="amadot">{renderChairs(595, 596)}</div>
<div className="amadot">{renderChairs(596, 597)}</div>
<div className="amadot">{renderChairs(597, 598)}</div>
<div className="amadot">{renderChairs(598, 599)}</div>
<div className="amadot">{renderChairs(599, 600)}</div>
<div className="amadot">{renderChairs(600, 601)}</div>


            <div className="amatable3rd">
              <span>B5</span>
            </div>
          </div>
          <div class="group3rdC5" id="amagroup3">
          <div className="amadot">{renderChairs(601, 602)}</div>
<div className="amadot">{renderChairs(602, 603)}</div>
<div className="amadot">{renderChairs(603, 604)}</div>
<div className="amadot">{renderChairs(604, 605)}</div>
<div className="amadot">{renderChairs(605, 606)}</div>
<div className="amadot">{renderChairs(606, 607)}</div>
<div className="amadot">{renderChairs(607, 608)}</div>
<div className="amadot">{renderChairs(608, 609)}</div>


            <div className="amatable3rd">
              <span>C5</span>
            </div>
          </div>
          <div class="group3rdD5" id="amagroup3">
          <div className="amadot">{renderChairs(609, 610)}</div>
<div className="amadot">{renderChairs(610, 611)}</div>
<div className="amadot">{renderChairs(611, 612)}</div>
<div className="amadot">{renderChairs(612, 613)}</div>
<div className="amadot">{renderChairs(613, 614)}</div>
<div className="amadot">{renderChairs(614, 615)}</div>
<div className="amadot">{renderChairs(615, 616)}</div>
<div className="amadot">{renderChairs(616, 617)}</div>


            <div className="amatable3rd">
              <span>D5</span>
            </div>
          </div>

          <div class="group3rdA6" id="amagroup3">
          <div className="amadot">{renderChairs(617, 618)}</div>
<div className="amadot">{renderChairs(618, 619)}</div>
<div className="amadot">{renderChairs(619, 620)}</div>
<div className="amadot">{renderChairs(620, 621)}</div>
<div className="amadot">{renderChairs(621, 622)}</div>
<div className="amadot">{renderChairs(622, 623)}</div>
<div className="amadot">{renderChairs(623, 624)}</div>
<div className="amadot">{renderChairs(624, 625)}</div>


            <div className="amatable3rd">
              <span>A6</span>
            </div>
          </div>
          <div class="group3rdB6" id="amagroup3">
          <div className="amadot">{renderChairs(625, 626)}</div>
<div className="amadot">{renderChairs(626, 627)}</div>
<div className="amadot">{renderChairs(627, 628)}</div>
<div className="amadot">{renderChairs(628, 629)}</div>
<div className="amadot">{renderChairs(629, 630)}</div>
<div className="amadot">{renderChairs(630, 631)}</div>
<div className="amadot">{renderChairs(631, 632)}</div>
<div className="amadot">{renderChairs(632, 633)}</div>


            <div className="amatable3rd">
              <span>B6</span>
            </div>
          </div>
          <div class="group3rdC6" id="amagroup3">
          <div className="amadot">{renderChairs(633, 634)}</div>
<div className="amadot">{renderChairs(634, 635)}</div>
<div className="amadot">{renderChairs(635, 636)}</div>
<div className="amadot">{renderChairs(636, 637)}</div>
<div className="amadot">{renderChairs(637, 638)}</div>
<div className="amadot">{renderChairs(638, 639)}</div>
<div className="amadot">{renderChairs(639, 640)}</div>
<div className="amadot">{renderChairs(640, 641)}</div>


            <div className="amatable3rd">
              <span>C6</span>
            </div>
          </div>

          <div class="group3rdA7" id="amagroup3">
          <div className="amadot">{renderChairs(641, 642)}</div>
<div className="amadot">{renderChairs(642, 643)}</div>
<div className="amadot">{renderChairs(643, 644)}</div>
<div className="amadot">{renderChairs(644, 645)}</div>
<div className="amadot">{renderChairs(645, 646)}</div>
<div className="amadot">{renderChairs(646, 647)}</div>
<div className="amadot">{renderChairs(647, 648)}</div>
<div className="amadot">{renderChairs(648, 649)}</div>


            <div className="amatable3rd">
              <span>A7</span>
            </div>
          </div>
          <div class="group3rdB7" id="amagroup3">
          <div className="amadot">{renderChairs(649, 650)}</div>
<div className="amadot">{renderChairs(650, 651)}</div>
<div className="amadot">{renderChairs(651, 652)}</div>
<div className="amadot">{renderChairs(652, 653)}</div>
<div className="amadot">{renderChairs(653, 654)}</div>
<div className="amadot">{renderChairs(654, 655)}</div>
<div className="amadot">{renderChairs(655, 656)}</div>
<div className="amadot">{renderChairs(656, 657)}</div>


            <div className="amatable3rd">
              <span>B7</span>
            </div>
          </div>
          <div class="group3rdC7" id="amagroup3">
          <div className="amadot">{renderChairs(657, 658)}</div>
<div className="amadot">{renderChairs(658, 659)}</div>
<div className="amadot">{renderChairs(659, 660)}</div>
<div className="amadot">{renderChairs(660, 661)}</div>
<div className="amadot">{renderChairs(661, 662)}</div>
<div className="amadot">{renderChairs(662, 663)}</div>
<div className="amadot">{renderChairs(663, 664)}</div>
<div className="amadot">{renderChairs(664, 665)}</div>


            <div className="amatable3rd">
              <span>C7</span>
            </div>
          </div>

          <div class="group3rdA8" id="amagroup3">
          <div className="amadot">{renderChairs(665, 666)}</div>
<div className="amadot">{renderChairs(666, 667)}</div>
<div className="amadot">{renderChairs(667, 668)}</div>
<div className="amadot">{renderChairs(668, 669)}</div>
<div className="amadot">{renderChairs(669, 670)}</div>
<div className="amadot">{renderChairs(670, 671)}</div>
<div className="amadot">{renderChairs(671, 672)}</div>
<div className="amadot">{renderChairs(672, 673)}</div>


            <div className="amatable3rd">
              <span>A8</span>
            </div>
          </div>
          <div class="group3rdB8" id="amagroup3">
          <div className="amadot">{renderChairs(673, 674)}</div>
<div className="amadot">{renderChairs(674, 675)}</div>
<div className="amadot">{renderChairs(675, 676)}</div>
<div className="amadot">{renderChairs(676, 677)}</div>
<div className="amadot">{renderChairs(677, 678)}</div>
<div className="amadot">{renderChairs(678, 679)}</div>
<div className="amadot">{renderChairs(679, 680)}</div>
<div className="amadot">{renderChairs(680, 681)}</div>


            <div className="amatable3rd">
              <span>B8</span>
            </div>
          </div>
          <div class="group3rdC8" id="amagroup3">
          <div className="amadot">{renderChairs(681, 682)}</div>
<div className="amadot">{renderChairs(682, 683)}</div>
<div className="amadot">{renderChairs(683, 684)}</div>
<div className="amadot">{renderChairs(684, 685)}</div>
<div className="amadot">{renderChairs(685, 686)}</div>
<div className="amadot">{renderChairs(686, 687)}</div>
<div className="amadot">{renderChairs(687, 688)}</div>
<div className="amadot">{renderChairs(688, 689)}</div>


            <div className="amatable3rd">
              <span>C8</span>
            </div>
          </div> 

          <div class="group3rdA9" id="amagroup3">
          <div className="amadot">{renderChairs(689, 690)}</div>
<div className="amadot">{renderChairs(690, 691)}</div>
<div className="amadot">{renderChairs(691, 692)}</div>
<div className="amadot">{renderChairs(692, 693)}</div>
<div className="amadot">{renderChairs(693, 694)}</div>
<div className="amadot">{renderChairs(694, 695)}</div>
<div className="amadot">{renderChairs(695, 696)}</div>
<div className="amadot">{renderChairs(696, 697)}</div>


            <div className="amatable3rd">
              <span>A9</span>
            </div>
          </div>
          <div class="group3rdB9" id="amagroup3">
          <div className="amadot">{renderChairs(697, 698)}</div>
<div className="amadot">{renderChairs(698, 699)}</div>
<div className="amadot">{renderChairs(699, 700)}</div>
<div className="amadot">{renderChairs(700, 701)}</div>
<div className="amadot">{renderChairs(701, 702)}</div>
<div className="amadot">{renderChairs(702, 703)}</div>
<div className="amadot">{renderChairs(703, 704)}</div>
<div className="amadot">{renderChairs(704, 705)}</div>


            <div className="amatable3rd">
              <span>B9</span>
            </div>
          </div>
          <div class="group3rdC9" id="amagroup3">
          <div className="amadot">{renderChairs(705, 706)}</div>
<div className="amadot">{renderChairs(706, 707)}</div>
<div className="amadot">{renderChairs(707, 708)}</div>
<div className="amadot">{renderChairs(708, 709)}</div>
<div className="amadot">{renderChairs(709, 710)}</div>
<div className="amadot">{renderChairs(710, 711)}</div>
<div className="amadot">{renderChairs(711, 712)}</div>
<div className="amadot">{renderChairs(712, 713)}</div>


            <div className="amatable3rd">
              <span>C9</span>
            </div>
          </div> 

         <div class="group3rdA10" id="amagroup3">
         <div className="amadot">{renderChairs(713, 714)}</div>
<div className="amadot">{renderChairs(714, 715)}</div>
<div className="amadot">{renderChairs(715, 716)}</div>
<div className="amadot">{renderChairs(716, 717)}</div>
<div className="amadot">{renderChairs(717, 718)}</div>
<div className="amadot">{renderChairs(718, 719)}</div>
<div className="amadot">{renderChairs(719, 720)}</div>
<div className="amadot">{renderChairs(720, 721)}</div>


            <div className="amatable3rd">
              <span>A10</span>
            </div>
          </div>
          <div class="group3rdB10" id="amagroup3">
          <div className="amadot">{renderChairs(721, 722)}</div>
<div className="amadot">{renderChairs(722, 723)}</div>
<div className="amadot">{renderChairs(723, 724)}</div>
<div className="amadot">{renderChairs(724, 725)}</div>
<div className="amadot">{renderChairs(725, 726)}</div>
<div className="amadot">{renderChairs(726, 727)}</div>
<div className="amadot">{renderChairs(727, 728)}</div>
<div className="amadot">{renderChairs(728, 729)}</div>


            <div className="amatable3rd">
              <span>B10</span>
            </div>
          </div>
          <div class="group3rdC10" id="amagroup3">
          <div className="amadot">{renderChairs(729, 730)}</div>
<div className="amadot">{renderChairs(730, 731)}</div>
<div className="amadot">{renderChairs(731, 732)}</div>
<div className="amadot">{renderChairs(732, 733)}</div>
<div className="amadot">{renderChairs(733, 734)}</div>
<div className="amadot">{renderChairs(734, 735)}</div>
<div className="amadot">{renderChairs(735, 736)}</div>
<div className="amadot">{renderChairs(736, 737)}</div>


            <div className="amatable3rd">
              <span>C10</span>
            </div>
          </div> 

          <div class="group3rdA11" id="amagroup3">
          <div className="amadot">{renderChairs(737, 738)}</div>
<div className="amadot">{renderChairs(738, 739)}</div>
<div className="amadot">{renderChairs(739, 740)}</div>
<div className="amadot">{renderChairs(740, 741)}</div>
<div className="amadot">{renderChairs(741, 742)}</div>
<div className="amadot">{renderChairs(742, 743)}</div>
<div className="amadot">{renderChairs(743, 744)}</div>
<div className="amadot">{renderChairs(744, 745)}</div>


            <div className="amatable3rd">
              <span>A11</span>
            </div>
          </div>
          <div class="group3rdB11" id="amagroup3">
          <div className="amadot">{renderChairs(745, 746)}</div>
<div className="amadot">{renderChairs(746, 747)}</div>
<div className="amadot">{renderChairs(747, 748)}</div>
<div className="amadot">{renderChairs(748, 749)}</div>
<div className="amadot">{renderChairs(749, 750)}</div>
<div className="amadot">{renderChairs(750, 751)}</div>
<div className="amadot">{renderChairs(751, 752)}</div>
<div className="amadot">{renderChairs(752, 753)}</div>


            <div className="amatable3rd">
              <span>B11</span>
            </div>
          </div>
          <div class="group3rdC11" id="amagroup3">
          <div className="amadot">{renderChairs(753, 754)}</div>
<div className="amadot">{renderChairs(754, 755)}</div>
<div className="amadot">{renderChairs(755, 756)}</div>
<div className="amadot">{renderChairs(756, 757)}</div>
<div className="amadot">{renderChairs(757, 758)}</div>
<div className="amadot">{renderChairs(758, 759)}</div>
<div className="amadot">{renderChairs(759, 760)}</div>
<div className="amadot">{renderChairs(760, 761)}</div>


            <div className="amatable3rd">
              <span>C11</span>
            </div>
          </div> 
          <div class="group3rdD11" id="amagroup3">
          <div className="amadot">{renderChairs(761, 762)}</div>
<div className="amadot">{renderChairs(762, 763)}</div>
<div className="amadot">{renderChairs(763, 764)}</div>
<div className="amadot">{renderChairs(764, 765)}</div>
<div className="amadot">{renderChairs(765, 766)}</div>
<div className="amadot">{renderChairs(766, 767)}</div>
<div className="amadot">{renderChairs(767, 768)}</div>
<div className="amadot">{renderChairs(768, 769)}</div>


            <div className="amatable3rd">
              <span>D11</span>
            </div>
          </div> 

          <div class="group3rdA12" id="amagroup3">
          <div className="amadot">{renderChairs(769, 770)}</div>
<div className="amadot">{renderChairs(770, 771)}</div>
<div className="amadot">{renderChairs(771, 772)}</div>
<div className="amadot">{renderChairs(772, 773)}</div>
<div className="amadot">{renderChairs(773, 774)}</div>
<div className="amadot">{renderChairs(774, 775)}</div>
<div className="amadot">{renderChairs(775, 776)}</div>
<div className="amadot">{renderChairs(776, 777)}</div>


            <div className="amatable3rd">
              <span>A12</span>
            </div>
          </div>
          <div class="group3rdB12" id="amagroup3">
          <div className="amadot">{renderChairs(777, 778)}</div>
<div className="amadot">{renderChairs(778, 779)}</div>
<div className="amadot">{renderChairs(779, 780)}</div>
<div className="amadot">{renderChairs(780, 781)}</div>
<div className="amadot">{renderChairs(781, 782)}</div>
<div className="amadot">{renderChairs(782, 783)}</div>
<div className="amadot">{renderChairs(783, 784)}</div>
<div className="amadot">{renderChairs(784, 785)}</div>

            <div className="amatable3rd">
              <span>B12</span>
            </div>
          </div>
          <div class="group3rdC12" id="amagroup3">
          <div className="amadot">{renderChairs(785, 786)}</div>
<div className="amadot">{renderChairs(786, 787)}</div>
<div className="amadot">{renderChairs(787, 788)}</div>
<div className="amadot">{renderChairs(788, 789)}</div>
<div className="amadot">{renderChairs(789, 790)}</div>
<div className="amadot">{renderChairs(790, 791)}</div>
<div className="amadot">{renderChairs(791, 792)}</div>
<div className="amadot">{renderChairs(792, 793)}</div>


            <div className="amatable3rd">
              <span>C12</span>
            </div>
          </div> 
          <div class="group3rdD12" id="amagroup3">
          <div className="amadot">{renderChairs(793, 794)}</div>
<div className="amadot">{renderChairs(794, 795)}</div>
<div className="amadot">{renderChairs(795, 796)}</div>
<div className="amadot">{renderChairs(796, 797)}</div>
<div className="amadot">{renderChairs(797, 798)}</div>
<div className="amadot">{renderChairs(798, 799)}</div>
<div className="amadot">{renderChairs(799, 800)}</div>
<div className="amadot">{renderChairs(800, 801)}</div>


            <div className="amatable3rd">
              <span>D12</span>
            </div>
          </div> 

          <div class="group3rdA13" id="amagroup3">
          <div className="amadot">{renderChairs(801, 802)}</div>
<div className="amadot">{renderChairs(802, 803)}</div>
<div className="amadot">{renderChairs(803, 804)}</div>
<div className="amadot">{renderChairs(804, 805)}</div>
<div className="amadot">{renderChairs(805, 806)}</div>
<div className="amadot">{renderChairs(806, 807)}</div>
<div className="amadot">{renderChairs(807, 808)}</div>
<div className="amadot">{renderChairs(808, 809)}</div>


            <div className="amatable3rd">
              <span>A13</span>
            </div>
          </div>
          <div class="group3rdB13" id="amagroup3">
          <div className="amadot">{renderChairs(809, 810)}</div>
<div className="amadot">{renderChairs(810, 811)}</div>
<div className="amadot">{renderChairs(811, 812)}</div>
<div className="amadot">{renderChairs(812, 813)}</div>
<div className="amadot">{renderChairs(813, 814)}</div>
<div className="amadot">{renderChairs(814, 815)}</div>
<div className="amadot">{renderChairs(815, 816)}</div>
<div className="amadot">{renderChairs(816, 817)}</div>


            <div className="amatable3rd">
              <span>B13</span>
            </div>
          </div>
          <div class="group3rdC13" id="amagroup3">
          <div className="amadot">{renderChairs(817, 818)}</div>
<div className="amadot">{renderChairs(818, 819)}</div>
<div className="amadot">{renderChairs(819, 820)}</div>
<div className="amadot">{renderChairs(820, 821)}</div>
<div className="amadot">{renderChairs(821, 822)}</div>
<div className="amadot">{renderChairs(822, 823)}</div>
<div className="amadot">{renderChairs(823, 824)}</div>
<div className="amadot">{renderChairs(824, 825)}</div>


            <div className="amatable3rd">
              <span>C13</span>
            </div>
          </div> 
          <div class="group3rdD13" id="amagroup3">
          <div className="amadot">{renderChairs(825, 826)}</div>
<div className="amadot">{renderChairs(826, 827)}</div>
<div className="amadot">{renderChairs(827, 828)}</div>
<div className="amadot">{renderChairs(828, 829)}</div>
<div className="amadot">{renderChairs(829, 830)}</div>
<div className="amadot">{renderChairs(830, 831)}</div>
<div className="amadot">{renderChairs(831, 832)}</div>
<div className="amadot">{renderChairs(832, 833)}</div>


            <div className="amatable3rd">
              <span>D13</span>
            </div>
          </div> 

          <div class="group3rdA14" id="amagroup3">
          <div className="amadot">{renderChairs(833, 834)}</div>
<div className="amadot">{renderChairs(834, 835)}</div>
<div className="amadot">{renderChairs(835, 836)}</div>
<div className="amadot">{renderChairs(836, 837)}</div>
<div className="amadot">{renderChairs(837, 838)}</div>
<div className="amadot">{renderChairs(838, 839)}</div>
<div className="amadot">{renderChairs(839, 840)}</div>
<div className="amadot">{renderChairs(840, 841)}</div>


            <div className="amatable3rd">
              <span>A14</span>
            </div>
          </div>
          <div class="group3rdB14" id="amagroup3">
          <div className="amadot">{renderChairs(841, 842)}</div>
<div className="amadot">{renderChairs(842, 843)}</div>
<div className="amadot">{renderChairs(843, 844)}</div>
<div className="amadot">{renderChairs(844, 845)}</div>
<div className="amadot">{renderChairs(845, 846)}</div>
<div className="amadot">{renderChairs(846, 847)}</div>
<div className="amadot">{renderChairs(847, 848)}</div>
<div className="amadot">{renderChairs(848, 849)}</div>


            <div className="amatable3rd">
              <span>B14</span>
            </div>
          </div>
          <div class="group3rdC14" id="amagroup3">
          <div className="amadot">{renderChairs(849, 850)}</div>
<div className="amadot">{renderChairs(850, 851)}</div>
<div className="amadot">{renderChairs(851, 852)}</div>
<div className="amadot">{renderChairs(852, 853)}</div>
<div className="amadot">{renderChairs(853, 854)}</div>
<div className="amadot">{renderChairs(854, 855)}</div>
<div className="amadot">{renderChairs(855, 856)}</div>
<div className="amadot">{renderChairs(856, 857)}</div>


            <div className="amatable3rd">
              <span>C14</span>
            </div>
          </div> 
          <div class="group3rdD14" id="amagroup3">
          <div className="amadot">{renderChairs(857, 858)}</div>
<div className="amadot">{renderChairs(858, 859)}</div>
<div className="amadot">{renderChairs(859, 860)}</div>
<div className="amadot">{renderChairs(860, 861)}</div>
<div className="amadot">{renderChairs(861, 862)}</div>
<div className="amadot">{renderChairs(862, 863)}</div>
<div className="amadot">{renderChairs(863, 864)}</div>
<div className="amadot">{renderChairs(864, 865)}</div>


            <div className="amatable3rd">
              <span>D14</span>
            </div>
          </div>

          <div class="group3rdA15" id="amagroup3">
          <div className="amadot">{renderChairs(865, 866)}</div>
<div className="amadot">{renderChairs(866, 867)}</div>
<div className="amadot">{renderChairs(867, 868)}</div>
<div className="amadot">{renderChairs(868, 869)}</div>
<div className="amadot">{renderChairs(869, 870)}</div>
<div className="amadot">{renderChairs(870, 871)}</div>
<div className="amadot">{renderChairs(871, 872)}</div>
<div className="amadot">{renderChairs(872, 873)}</div>


            <div className="amatable3rd">
              <span>A15</span>
            </div>
          </div>
          <div class="group3rdB15" id="amagroup3">
          <div className="amadot">{renderChairs(873, 874)}</div>
<div className="amadot">{renderChairs(874, 875)}</div>
<div className="amadot">{renderChairs(875, 876)}</div>
<div className="amadot">{renderChairs(876, 877)}</div>
<div className="amadot">{renderChairs(877, 878)}</div>
<div className="amadot">{renderChairs(878, 879)}</div>
<div className="amadot">{renderChairs(879, 880)}</div>
<div className="amadot">{renderChairs(880, 881)}</div>


            <div className="amatable3rd">
              <span>B15</span>
            </div>
          </div>
          <div class="group3rdC15" id="amagroup3">
          <div className="amadot">{renderChairs(881, 882)}</div>
<div className="amadot">{renderChairs(882, 883)}</div>
<div className="amadot">{renderChairs(883, 884)}</div>
<div className="amadot">{renderChairs(884, 885)}</div>
<div className="amadot">{renderChairs(885, 886)}</div>
<div className="amadot">{renderChairs(886, 887)}</div>
<div className="amadot">{renderChairs(887, 888)}</div>
<div className="amadot">{renderChairs(888, 889)}</div>


            <div className="amatable3rd">
              <span>C15</span>
            </div>
          </div> 
          <div class="group3rdD15" id="amagroup3">
          <div className="amadot">{renderChairs(889, 890)}</div>
<div className="amadot">{renderChairs(890, 891)}</div>
<div className="amadot">{renderChairs(891, 892)}</div>
<div className="amadot">{renderChairs(892, 893)}</div>
<div className="amadot">{renderChairs(893, 894)}</div>
<div className="amadot">{renderChairs(894, 895)}</div>
<div className="amadot">{renderChairs(895, 896)}</div>
<div className="amadot">{renderChairs(896, 897)}</div>


            <div className="amatable3rd">
              <span>D15</span>
            </div>
          </div> 

          <div class="group3rdA16" id="amagroup3">
          <div className="amadot">{renderChairs(897, 898)}</div>
<div className="amadot">{renderChairs(898, 899)}</div>
<div className="amadot">{renderChairs(899, 900)}</div>
<div className="amadot">{renderChairs(900, 901)}</div>
<div className="amadot">{renderChairs(901, 902)}</div>
<div className="amadot">{renderChairs(902, 903)}</div>
<div className="amadot">{renderChairs(903, 904)}</div>
<div className="amadot">{renderChairs(904, 905)}</div>


            <div className="amatable3rd">
              <span>A16</span>
            </div>
          </div>
          <div class="group3rdB16" id="amagroup3">
          <div className="amadot">{renderChairs(905, 906)}</div>
<div className="amadot">{renderChairs(906, 907)}</div>
<div className="amadot">{renderChairs(907, 908)}</div>
<div className="amadot">{renderChairs(908, 909)}</div>
<div className="amadot">{renderChairs(909, 910)}</div>
<div className="amadot">{renderChairs(910, 911)}</div>
<div className="amadot">{renderChairs(911, 912)}</div>
<div className="amadot">{renderChairs(912, 913)}</div>


            <div className="amatable3rd">
              <span>B16</span>
            </div>
          </div>
          <div class="group3rdC16" id="amagroup3">
          <div className="amadot">{renderChairs(913, 914)}</div>
<div className="amadot">{renderChairs(914, 915)}</div>
<div className="amadot">{renderChairs(915, 916)}</div>
<div className="amadot">{renderChairs(916, 917)}</div>
<div className="amadot">{renderChairs(917, 918)}</div>
<div className="amadot">{renderChairs(918, 919)}</div>
<div className="amadot">{renderChairs(919, 920)}</div>
<div className="amadot">{renderChairs(920, 921)}</div>


            <div className="amatable3rd">
              <span>C16</span>
            </div>
          </div> 
          <div class="group3rdD16" id="amagroup3">
          <div className="amadot">{renderChairs(921, 922)}</div>
<div className="amadot">{renderChairs(922, 923)}</div>
<div className="amadot">{renderChairs(923, 924)}</div>
<div className="amadot">{renderChairs(924, 925)}</div>
<div className="amadot">{renderChairs(925, 926)}</div>
<div className="amadot">{renderChairs(926, 927)}</div>
<div className="amadot">{renderChairs(927, 928)}</div>
<div className="amadot">{renderChairs(928, 929)}</div>


            <div className="amatable3rd">
              <span>D16</span>
            </div>
          </div>  

          <div class="group3rdA17" id="amagroup3">
          <div className="amadot">{renderChairs(929, 930)}</div>
<div className="amadot">{renderChairs(930, 931)}</div>
<div className="amadot">{renderChairs(931, 932)}</div>
<div className="amadot">{renderChairs(932, 933)}</div>
<div className="amadot">{renderChairs(933, 934)}</div>
<div className="amadot">{renderChairs(934, 935)}</div>
<div className="amadot">{renderChairs(935, 936)}</div>
<div className="amadot">{renderChairs(936, 937)}</div>


            <div className="amatable3rd">
              <span>A17</span>
            </div>
          </div>  
          <Cart cartItems={cart} onRemoveFromCart={removeFromCart} />
        </div>
      </div>
    </>
  );
};

export default ThirdTier;
