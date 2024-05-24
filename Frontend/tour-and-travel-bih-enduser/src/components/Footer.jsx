import React from 'react';
import '../styles/Footer.css';

// social media icons
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>About Us</h3>
          <ul>
            <li><a href="#">Our story</a></li>
            <li><a href="#">Team</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Tour Packages</h3>
          <ul>
            <li><a href="#">All Inclusive</a></li>
            <li><a href="#">Adventure</a></li>
            <li><a href="#">Hiking</a></li>
            <li><a href="#">Family</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Destinations</h3>
          <ul>
            <li><a href="#">Sarajevo</a></li>
            <li><a href="#">Mostar</a></li>
            <li><a href="#">Banja Luka </a></li>
            <li><a href="#">Plitvicka jezera</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><FacebookOutlinedIcon /></a>
          <a href="#" aria-label="Instagram"><InstagramIcon /></a>
          <a href="#" aria-label="GitHub"><GitHubIcon /></a>
          <a href="#" aria-label="Youtube"><YouTubeIcon /></a>
        </div>
        <div className="footer-logo">
          <img src="logo.png" alt="Company Logo" />
        </div>
      </div>
      <div className="footer-credits">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
