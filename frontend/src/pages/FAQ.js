import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'What does SchemeConnect do?',
      answer: 'It helps users find government and private schemes they are eligible for.'
    },
    {
      question: 'How do I check my eligibility?',
      answer: 'Answer a few simple questions, and the site shows matching schemes.'
    },
    {
      question: 'Can I apply here directly?',
      answer: 'Yes, for some schemes. Others redirect to the official site.'
    },
    {
      question: 'Is this a government site?',
      answer: 'Not yet — it\'s an awareness platform built by students.'
    },
    {
      question: 'What extra features are included?',
      answer: 'Voice chatbot, state-wise filters, reminders, and PDF downloads.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <Container>
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about SchemeConnect</p>
        </div>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{activeIndex === index ? '−' : '+'}</span>
              </div>
              <div 
                className={`faq-answer ${activeIndex === index ? 'show' : ''}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FAQ;
