import React from 'react';
import '../styles/AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>About SchemeConnect</h2>
        <p>
          SchemeConnect is a comprehensive platform designed to bridge the gap between government schemes and the citizens who need them. 
          Our mission is to make information about various government and private schemes easily accessible to everyone, ensuring that 
          no one misses out on benefits they're entitled to.
        </p>
        <p>
          Whether you're a student looking for scholarships, a farmer in need of agricultural support, or a small business owner 
          seeking financial assistance, SchemeConnect helps you find the right schemes tailored to your needs.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
