import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="social-icons row">
        <a href="#">
          <i className="fab fa-facebook" />
          
        </a>
        <a href="#">
          <i className="fab fa-instagram" />
          
        </a>
        <a href="#">
          <i className="fab fa-youtube" />
          
        </a>
        <a href="#">
          <i className="fab fa-twitter " />
          
        </a>
      </div>

      <div className="row">
        <ul>
          <li><a href="/contact">Contact us</a></li>
          <li><a href="/policy">Privacy Policy</a></li>
          <li><a href="/about">about</a></li>
        </ul>
      </div>

      <div className="row">
        WellnessKitchen © 2024 - All rights reserved || Designed By: Dutheesh
      </div>
    </div>
  );
};

export default Footer;
