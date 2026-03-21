//Home.js
import React from 'react';
import Carousel from '../components/Carousel';
import CategorySection from '../components/CategorySection';
import AboutSection from '../components/AboutSection';
import FAQSection from '../components/FAQSection';
import '../styles/CarouselSection.css';

const Home = () => {
  return (
    <>
      <section className="carousel-section">
        <Carousel />
      </section>
      <CategorySection />
      <AboutSection />
      <FAQSection />
    </>
  );
};

export default Home;
