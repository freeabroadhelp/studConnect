import React, { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

// 3D Animation using @react-three/fiber and drei
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';

// Custom 3D Globe Component (simple animated sphere with world map texture)
const Globe: React.FC = () => (
  <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
    <mesh>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial
        color="#2D4EF5"
        roughness={0.5}
        metalness={0.2}
        // Optionally, add a world map texture here for more realism
      />
    </mesh>
    <ambientLight intensity={0.7} />
    <directionalLight position={[5, 5, 5]} intensity={0.7} />
  </Float>
);

const CountUp: React.FC<{ value: number; duration?: number; suffix?: string; label: string }> = ({ value, duration = 1400, suffix = '', label }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting && !started.current){
          started.current = true;
          const start = performance.now();
          const animate = (t: number) => {
            const prog = Math.min(1, (t - start) / duration);
            setDisplay(Math.round(value * prog));
            if(prog < 1) requestAnimationFrame(animate); else setDisplay(value);
          };
          requestAnimationFrame(animate);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);
  return (
    <div ref={ref} className="about-counter" aria-label={label} title={label}>
      <strong>{display.toLocaleString()}{display === value ? suffix : ''}</strong>
      <span>{label}</span>
    </div>
  );
};

export const AboutPage: React.FC = () => {
  const aboutRef = useReveal();

  return (
    <main
      className="page container about"
      ref={aboutRef as any}
      style={{
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
        background: '#F9FAFB',
        color: '#111827',
        minHeight: '100vh',
        padding: 0,
        margin: 0,
        width: '100vw', // Add this line to ensure full viewport width
        boxSizing: 'border-box', // Prevent overflow
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          width: '100%',
          minHeight: 420,
          background: 'linear-gradient(120deg, #2D4EF5 0%, #7D5FFF 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: '0 0 2.5rem 2.5rem',
          boxShadow: '0 8px 32px 0 rgba(31,41,55,0.10), 0 1.5px 8px 0 #c7d2fe',
        }}
      >
        {/* 3D Globe Animation */}
        <div
          style={{
            width: 340,
            height: 340,
            position: 'absolute',
            right: 60,
            top: 40,
            zIndex: 2,
            display: 'none',
          }}
          className="about-hero-3d"
        >
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Globe />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
          </Canvas>
        </div>
        {/* Hero Content */}
        <div
          style={{
            maxWidth: 700,
            margin: '0 auto',
            padding: '3.5rem 1.5rem 2.5rem 1.5rem',
            textAlign: 'center',
            zIndex: 3,
          }}
        >
          <h1
            style={{
              fontFamily: 'Poppins, Inter, Arial, sans-serif',
              fontWeight: 800,
              fontSize: '2.8rem',
              color: '#fff',
              letterSpacing: '-1.5px',
              marginBottom: '1.2rem',
              textShadow: '0 2px 16px #2D4EF5, 0 1px 2px #7D5FFF',
            }}
          >
            Study Abroad. Made Simple.
          </h1>
          <p
            style={{
              fontFamily: 'Inter, Roboto, Arial, sans-serif',
              fontSize: '1.25rem',
              color: '#F9FAFB',
              marginBottom: '2.2rem',
              fontWeight: 500,
              textShadow: '0 1px 8px #2D4EF5',
            }}
          >
            We call Ourselves the <span style={{ color: '#28C76F', fontWeight: 700 }}>Amazon for Studying Abroad</span>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <a
              href="/programs"
              style={{
                background: '#2D4EF5',
                color: '#fff',
                fontFamily: 'Poppins, Inter, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: '12px',
                padding: '1rem 2.5rem',
                border: 'none',
                boxShadow: '0 2px 8px #2D4EF5',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              Explore Programs
            </a>
            <a
              href="/counsellors"
              style={{
                background: '#fff',
                color: '#2D4EF5',
                fontFamily: 'Poppins, Inter, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: '12px',
                padding: '1rem 2.5rem',
                border: '2px solid #fff',
                boxShadow: '0 2px 8px #7D5FFF',
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              Meet Mentors
            </a>
          </div>
        </div>
        {/* Subtle World Map Illustration (SVG, behind content) */}
        <svg
          width="900"
          height="340"
          viewBox="0 0 900 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.13,
            zIndex: 1,
          }}
        >
          <ellipse cx="450" cy="170" rx="440" ry="150" fill="#fff" />
        </svg>
      </section>

      {/* Main Content Section */}
      <section
        className="about-section about-section--intro"
        style={{
          background: '#fff',
          borderRadius: '2.2rem',
          margin: '2.5rem auto',
          boxShadow: '0 2px 12px 0 #e5e7eb',
          padding: '2.2rem 2.2rem 1.5rem 2.2rem',
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',              // Add flex
          flexDirection: 'column',      // Stack children vertically
          alignItems: 'center',         // Center children horizontally
        }}
      >
        <p style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', color: '#111827', fontSize: '1.15rem', marginBottom: '1.2rem' }}>
          We didn’t build <b>XXX</b> because we wanted to be another consultancy. We built it because we got tired of watching students get lost in a system full of half-truths, hidden costs, and overhyped promises.
        </p>
        <p style={{ color: '#6B7280', fontSize: '1.08rem' }}>
          We’ve sat in the university offices. We’ve worked as official representatives for many International Universities. We’ve seen firsthand how students are pushed into courses they don’t need, charged for services they never asked for, and left clueless once they land abroad.
        </p>
        <p style={{ color: '#6B7280', fontSize: '1.08rem' }}>
          So, we decided to flip the script.<br />
          <b>XXX</b> is not a consultancy—it’s a marketplace. Think of us as the Amazon for studying abroad.
        </p>
        <ul style={{ margin: '1.5rem 0', color: '#111827', fontSize: '1.08rem', lineHeight: 1.7 }}>
          <li> Explore universities across 8+ countries, like you’re shopping for your dream course.</li>
          <li> Book real students and alumni as mentors—people who’ve lived the journey, not just sold it.</li>
          <li> Secure verified housing before you even board the flight.</li>
          <li> Compare loans, find scholarships, and manage your finances smartly.</li>
        </ul>
        <p style={{ color: '#6B7280', fontSize: '1.08rem' }}>
          No packages. No pressure. No sales pitch. Just choice, clarity, and control.<br />
          We built this for the students who value honesty over hype, who want to learn from people who’ve actually been there, done that, and who want studying abroad to feel as easy as adding items to a cart.
        </p>
        <p style={{ color: '#FF6B35', fontWeight: 600, fontFamily: 'Poppins, Inter, Arial, sans-serif', fontSize: '1.13rem', marginTop: '1.5rem' }}>
           We’re not here to “sell” you a dream.<br />
          We’re here to help you live it.
        </p>
        <h3 style={{ color: '#2D4EF5', fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 700, marginTop: '2.2rem' }}>Short Bio</h3>
        <p style={{ color: '#7D5FFF', fontStyle: 'italic', fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500 }}>
          “We’re XXX— the Amazon for Studying Abroad. Tired of overpriced packages, fake promises, and confusing agents? We give you real students, verified housing, scholarships, and guidance that actually works. Pick what you need. Skip the hype. Own your journey.”
        </p>
      </section>
    </main>
  );
};
