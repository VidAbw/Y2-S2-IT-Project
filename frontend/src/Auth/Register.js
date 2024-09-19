import React, { useState } from "react";
import Layout from "../components/Layout/Layouts";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/AuthStyles.css"

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/register", {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
      });

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login"); 
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Registering Unsuccessful");
    }
  };

  return (
    <Layout title='Register'>
      <div className="register">
        <form className='registerForm' onSubmit={handleSubmit}>
        <h1 className="registerheading">Registration</h1>
          <div className="mb-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-control"
              id="exampleInputFname"
              placeholder="First Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-control"
              id="exampleInputLname"
              placeholder="Last Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="exampleInputLocation"
              placeholder="Location / Address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Email address"
              required
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="mobileNumber"
              aria-describedby="mobileHelp"
              placeholder="Mobile Number"
              required
            />
            <div id="mobileHelp" className="form-text">
              We'll never share your mobile number with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
