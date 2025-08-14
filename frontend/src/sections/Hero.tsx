import React, { useEffect } from 'react';
import PastelGlobeScene from '../components/PastelGlobeScene';

export const Hero: React.FC = () => {
  useEffect(() => {
    const link = document.querySelector('.hero-cta');
    const handler = (e: Event) => {
      e.preventDefault();
      document.querySelector('#contact')?.scrollIntoView({ behavior:'smooth'});
    };
    link?.addEventListener('click', handler);
    return () => link?.removeEventListener('click', handler);
  }, []);
  return (
    <header className="hero hero--cinematic hero--globe">
      <PastelGlobeScene />
      <div className="hero__bg">
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="gridlines" />
      </div>
      <div className="container hero__content">
        <h1><span className="gradient-text">Achieve</span> Your Global Education Goals</h1>
        <p className="lead">Personalized end-to-end study abroad consulting: universities, applications, visas & scholarships.</p>
        <a href="#contact" className="btn btn-primary hero-cta">Book Your Consultation</a>
        <div className="hero__stats">
          <div>
            <strong>500+</strong>
            <span>Students Guided</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Visa Success</span>
          </div>
          <div>
            <strong>15+</strong>
            <span>Countries</span>
          </div>
        </div>
      </div>
    </header>
  );
};
