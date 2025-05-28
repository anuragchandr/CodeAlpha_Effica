import React from 'react'
import './contact.css';
// src/components/Contact.jsx
function Contact() {
  return (
    <section className="contact">
      <h1>Contact Us</h1>
      <p>
        Got questions about Effica? Reach out to our team, inspired by creator <strong>Anurag Chandra</strong>,
        to learn more or provide feedback.
      </p>
      <form className="contact-form">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="Your Name" required />
        
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Your Email" required />
        
        <label htmlFor="message">Message</label>
        <textarea id="message" placeholder="Your Message" rows="5" required></textarea>
        
        <button type="submit" className="submit-button">Send Message</button>
      </form>
      <div className="contact-info">
        <p>Email: <a href="mailto:support@effica.com">support@effica.com</a></p>
        <p>Follow us on social media for updates!</p>
        <div className="social-links">
          <a href="#" className="social-link">Twitter</a>
          <a href="#" className="social-link">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}

export default Contact;