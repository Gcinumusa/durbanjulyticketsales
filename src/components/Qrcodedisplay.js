import React from 'react';
import { useLocation } from 'react-router-dom';
import './Qrcodedisplay.css';  // Make sure the path is correct

const Qrcodedisplay = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extract data from URL parameters
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const idnumber = searchParams.get('userIdNumber');
  const amount = searchParams.get('amount');
  const cart = JSON.parse(decodeURIComponent(searchParams.get('cart') || '[]'));

  return (

//     <div className="container">

// 	<div className="ticket basic">
// 		<p>Admit One</p>
// 	</div>

// 	<div className="ticket airline">
// 		<div className="top">
// 			<h1>{firstName} {lastName}</h1>
// 			<div className="big">
// 				<p className="from">DBN</p>
// 				<p className="to"><i className="fas fa-arrowQr-right"></i> July</p>
// 			</div>
// 			<div className="top--side">
// 				<i className="fas fa-plane"></i>
// 				<p>{email}</p>
// 				<p>{phone}</p>
// 			</div>
// 		</div>
// 		<div className="bottomQr">{cart.map((item, index) => (
          
//             //  - Seat No:  - Ticket ID: {item.ticket_id}
            
          
// 			<div key={index} className="column">
// 				{/*<div className="rowQr rowQr-1">
// 					<p><span>Tier</span>{item.ticketname}</p>
// 					 <p className="rowQr--right"><span>Gate</span>B3</p> 
// 				</div>*/}
// 				<div className="rowQr rowQr-2">
// 					<p><span>Seat No.</span>{item.sitting_number}</p>
// 					<p className="rowQr--centerQr"><span>Price</span>  R{parseFloat(amount).toFixed(2)}</p>
// 					<p className="rowQr--right"><span>Arrives</span>10:00 AM</p>
// 				</div>	
// 				{/* <div className="rowQr rowQr-3">
// 					<p><span>Passenger</span>Jesus Ramirez</p>
// 					<p className="rowQr--centerQr"><span>Seat</span>11E</p>
// 					<p className="rowQr--right"><span>Group</span>3</p>
// 				</div> */}
// 			</div>
      
//         ))}
// 			{/* <div className="bar--code"></div> */}
// 		</div>
// 	</div>

	

// </div>
    <div className="container">
      <h1>QR Code Display</h1>
      <h2>User Information</h2>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <p>Name: {firstName} {lastName}</p>
      <p>ID Number: {idnumber}</p>
      <p>Total Amount Paid: R{parseFloat(amount).toFixed(2)}</p>

      <h2>Items Purchased</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.ticketname} - Seat No: {item.sitting_number} - Ticket ID: {item.ticket_id}
            - Quantity: {item.quantity} - Price: R{parseFloat(item.price).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Qrcodedisplay;
