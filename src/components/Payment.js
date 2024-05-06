import React from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

const Payment = () => {
  const { state } = useLocation();
  const { user, cart } = state;
  const feePerItem = 75;
  const entityId = "8ac7a4c98f2be0d7018f2de91eaa02a6"; // Ensure this is correct for your Peach Payments setup

  const Randbuy = "AAAAAAAAAAABGAAAAAA";
  const generateSignature = (data) => {
    const { amount, currency, paymentType, nonce, merchantTransactionId, shopperResultUrl } = data;
    const message = `amount${amount}authentication.entityId${entityId}currency${currency}defaultPaymentMethodCARDmerchantTransactionId${merchantTransactionId}nonce${nonce}paymentType${paymentType}shopperResultUrl${shopperResultUrl}`;
    console.log("Signing message: ", message); // Debugging output
    return CryptoJS.HmacSHA256(message, "b38d427874494e83afa9c8c63a8a3442").toString(CryptoJS.enc.Hex);
  };

  const totalCost = cart.reduce((total, item) => total + (parseFloat(item.price) + feePerItem) * (parseInt(item.quantity, 10) || 1), 0);

  const dataForSignature = {
    amount: totalCost.toFixed(2),
    currency: 'ZAR',
    paymentType: 'DB',
    nonce: Randbuy, // Ensure nonce is unique for each transaction
    merchantTransactionId: Randbuy,
    shopperResultUrl: `https://julyoceanlounges.com/success?email=${encodeURIComponent(user.email)}&cart=${encodeURIComponent(JSON.stringify(cart))}`
  };

  const signature = generateSignature(dataForSignature);
  console.log('Signanture', signature)
  return (
    <div className="center-content">
     
      <form name="Checkout" action="https://testsecure.peachpayments.com/checkout" method="POST" accept-charset="utf-8">
        <input type="hidden" name="amount" value={totalCost.toFixed(2)} />
        <input type="hidden" name="authentication.entityId" value={entityId} />
        <input type="hidden" name="currency" value="ZAR" />
        <input type="hidden" name="merchantTransactionId" value={user.email} />
        <input type="hidden" name="nonce" value={user.email} />
        <input type="hidden" name="paymentType" value="DB" />
        <input type="hidden" name="shopperResultUrl" value={dataForSignature.shopperResultUrl} />
        <input type="hidden" name="signature" value={signature} />
        <input type="submit" value="Continue to Payment Method" />
      </form>
    </div>
  );
};

export default Payment;
