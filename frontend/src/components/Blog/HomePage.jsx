import React from 'react';
import foodImage from '../../assets/foodImage.jpg';  // Correct path to your image
import { useNavigate } from 'react-router-dom';

const WellnessKitchen = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.pageContainer}>
      {/* Title */}
      <h1 style={styles.title}>WELLNESS KITCHEN</h1>

      {/* Description Box */}
      <div style={styles.descriptionBox}>
        <p style={styles.description}>
          Our food delivery system allows customers to order meals online, customize orders, and track deliveries in real-time. It includes features like <strong>secure payments</strong>, <strong>personalized recommendations</strong>, and <strong>account management</strong>. Administrators oversee <strong>menu management</strong>, <strong>order logistics</strong>, and <strong>generate operational reports</strong>.
        </p>
      </div>

      {/* Content Section (Announcement and Button) */}
      <div style={styles.contentSection}>
        {/* Announcement Box */}
        <div style={styles.announcementBox}>
          <h2>Announcement</h2>
          <p>Try our new Fried Rice seasoning! Buy one, get one free.</p>
        </div>

        {/* View Blogs Button */}
        <button onClick={handleButtonClick} className="btn btn-primary" style={styles.button}>
          View Blogs
        </button>
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  pageContainer: {
    backgroundImage: `url(${foodImage})`,  // Background image
    backgroundSize: 'cover',  // Ensures the image covers the entire screen
    backgroundPosition: 'center',  // Centers the background image
    backgroundRepeat: 'no-repeat',  // Prevents background from repeating
    height: '100vh',  // Full viewport height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',  // White text color for contrast
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '48px',
    marginBottom: '20px',
  },
  descriptionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Semi-transparent white background
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    textAlign: 'justify',  // Justify text
  },
  description: {
    fontSize: '18px',
    fontWeight: 'bold',  // Bold text
    color: '#333',  // Darker text for visibility
  },
  contentSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',  // Space between announcement box and button
    flexDirection: 'row',
    marginTop: '30px',
  },
  announcementBox: {
    backgroundColor: '#ffc107',  // Yellow background
    padding: '30px',
    borderRadius: '8px',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '300px',
    height: '300px',  // Square shape
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Adds a shadow for better contrast
  },
  button: {
    fontSize: '18px',
    padding: '10px 20px',
    height: '50px',
    alignSelf: 'center',
  },
};

export default WellnessKitchen;
