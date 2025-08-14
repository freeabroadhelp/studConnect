import React from 'react';

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div>
        <strong>StudConnect</strong>
        <p className="muted">Empowering students to study abroad with clarity & confidence.</p>
      </div>
      <nav className="footer__nav">
        <a href="#services">Services</a>
        <a href="#universities">Universities</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#testimonials">Success Stories</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="footer__legal">© {new Date().getFullYear()} StudConnect. All rights reserved.</div>
    </div>
  </footer>
);
