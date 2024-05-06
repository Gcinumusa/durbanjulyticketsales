import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import registerlogo from "../media/431514568_822632296558536_4783759022695435687_n.jpg"

import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = location.state || {};
  const initialIdNumber = location.state?.idNumber || "";  // Get ID number from state

  const [formData, setFormData] = useState({
    username: "",
    lastname: "",
    idnumber: initialIdNumber,  // Initialize with the ID number from state or empty
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  
  const [showModal, setShowModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.log("Password mismatch");
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      return;
    }
    
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    console.log("Generated code:", randomCode);
    setVerificationCode(randomCode.toString());
    try {
      const response = await axios.get(`https://ticket.julyoceanlounges.com/api/check-email`, {
          params: {  userIdNumber: formData.idnumber }
      });
      const data = response.data;
      if (data.exists) {
          alert("ID number already registered with ");
          return;
      }
  } catch (error) {
      console.error("Error during pre-registration validation:", error);
      alert("Error checking credentials.");
      return;
  }
    try {
      await axios.post("https://ticket.julyoceanlounges.com/register", {
        ...formData,
        verificationCode: randomCode,
      });
      navigate("/verify", {
        state: {
          email: formData.email,
          code: randomCode,
          cart,
          user: {
            username: formData.username,
            lastname: formData.lastname,
            idnumber: formData.idnumber,
            phone: formData.phone,
            email: formData.email,
          },
        },
      }); // Pass necessary data for verification
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Modal should be visible:", showModal);
  }, [showModal]);

  const verifyCode = async () => {
    console.log(
      `Verifying code ${inputCode} against expected ${verificationCode}`
    );
    if (inputCode === verificationCode) {
      try {
        const response = await axios.post(
          "https://ticket.julyoceanlounges.com/verify-code",
          {
            email: formData.email,
            code: inputCode,
          }
        );
        console.log("Verification successful:", response.data);

        navigate("/payment", {
          state: { user: formData, cart: Object.values(cart) },
        });
      } catch (error) {
        console.error("Verification failed:", error.response.data);
         }
    } else {
      alert("Incorrect verification code. Please try again.");
    }
  };
 
  return (
    <div className="register-container">
        <div className="register-form">
      <h1 style={{alignContent: 'center', textAlign: "center"}}>Sign Up</h1>
      <p style={{alignContent: 'center', textAlign: "center"}}>Fill out the form below to complete your purchase.</p>
      {/* {cart && cart.length > 0 && (
        <div>
          {cart.map((item) => (
            <div key={item.ticket_id}>
              <p>
                {item.sitting_number} - Quantity: {item.quantity} - id ={" "}
                {item.ticket_id}
              </p>
              <p>Price: R{Number(item.price).toFixed(2)}</p>
            </div>
          ))}
          <p>
            <strong>Total Price: R{totalPrice.toFixed(2)}</strong>
          </p>
        </div>
      )} */}

      <form onSubmit={handleSubmit}>
      <div className="form-group">
      {/* <label htmlFor="email">First name</label> */}
        <input
          type="text"
          name="username"
          placeholder="First name"
          value={formData.username}
          onChange={handleChange}
          required
          className="register-input"
        />
          {/* <label htmlFor="email">Last name</label> */}
        <input
          type="text"
          name="lastname"
          placeholder="Last name"
          value={formData.lastname}
          onChange={handleChange}
          required
          className="register-input"
        />
        </div>
        <div className="form-group">
        {/* <label htmlFor="email">ID Number</label> */}
        <input
          type="text"
          name="idnumber"
          placeholder="ID Number"  minLength={13} maxLength={13}
          value={formData.idnumber}
          onChange={handleChange}
          required
        />
           {/* <label htmlFor="email">Cell</label> */}
        <input
          type="text"
          name="phone"
          placeholder="Cell" minLength={10} maxLength={10}
          value={formData.phone}
          onChange={handleChange}
          required
        />
        </div>
        {Object.values(errors).map((error, i) => (
        <p key={i} className="error">{error}</p>
      ))}
         <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
           <label htmlFor="email">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
              <label htmlFor="email">Confirm password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
    <div className="register-image">
    <img src={registerlogo} alt="Descriptive Alt Text" />
  </div>
    </div>
  );
};
export default Register;
