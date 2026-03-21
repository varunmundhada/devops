import React, { useState, useEffect } from 'react';
import '../styles/Carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://ornatesolar.com/wp-content/uploads/2023/10/Solar-Subsidy.webp',
      alt: 'Solar Subsidy'
    },
    {
      image: 'https://www.cabkgoyal.com/wp-content/uploads/2024/02/Rythu-Bandhu.webp',
      alt: 'Rythu Bandhu Scheme'
    },
    {
      image: 'https://biharbhumilandrecord.com/wp-content/uploads/2024/10/PM-Kaushal-Vikas-Yojana.webp',
      alt: 'PM Kaushal Vikas Yojana'
    },
    {
      image: 'https://currentaffairs.adda247.com/wp-content/uploads/multisite/sites/5/2023/06/01144239/01-2023-06-01T144235.620.png',
      alt: 'Government Scheme'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel">
      <div 
        className="slides" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <img 
              src={slide.image} 
              alt={slide.alt} 
              className="slide-image"
            />
          </div>
        ))}
      </div>
      <div className="indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
