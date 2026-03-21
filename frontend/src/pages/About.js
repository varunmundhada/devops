import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => {
  return (
    <section className="about">
      <Container>
        <div className="section-title">
          <h2>About SchemeConnect</h2>
          <p>Empowering citizens with easy access to government and private schemes</p>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              SchemeConnect is dedicated to bridging the gap between citizens and the various government 
              and private schemes available to them. We believe that everyone should have easy access to 
              the benefits and opportunities these schemes provide.
            </p>
            <p>
              Our platform simplifies the process of discovering, understanding, and applying for schemes 
              that match your specific needs and eligibility criteria. Whether you're a student, farmer, 
              entrepreneur, or senior citizen, we're here to help you find the support you deserve.
            </p>
            <h3>Why Choose SchemeConnect?</h3>
            <ul>
              <li>Comprehensive database of schemes from multiple sources</li>
              <li>Easy-to-use interface with advanced search and filtering</li>
              <li>Personalized recommendations based on your profile</li>
              <li>Regular updates on new and updated schemes</li>
              <li>Guidance through the application process</li>
            </ul>
          </div>
          <div className="about-img">
            <img 
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80" 
              alt="About SchemeConnect" 
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;
