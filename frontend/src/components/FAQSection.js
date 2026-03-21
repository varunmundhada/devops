import React, { useState } from 'react';
import '../styles/FAQSection.css';

const FAQSection = () => {
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
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button 
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="toggle-icon">{activeIndex === index ? '−' : '+'}</span>
            </button>
            <div 
              className={`faq-answer ${activeIndex === index ? 'show' : ''}`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
