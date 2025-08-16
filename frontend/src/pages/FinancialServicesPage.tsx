import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../apiBase';
// Add Three.js and react-three-fiber for 3D animation
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Simple 3D animated floating coins component
function FloatingCoins() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.18
    }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} />
        <Coin position={[-2, 1, 0]} speed={0.7} color="#fbbf24" />
        <Coin position={[2, -1, 0]} speed={1.1} color="#fde68a" />
        <Coin position={[0, 2, 0]} speed={0.9} color="#f59e42" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
    </div>
  );
}

function Coin({ position, speed, color }: { position: [number, number, number], speed: number, color: string }) {
  // Animate rotation
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setRotation(r => r + 0.01 * speed);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [speed]);
  return (
    <mesh position={position} rotation={[rotation, rotation, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 0.08, 32]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export const FinancialServicesPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/australia-scholarships`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch data");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API did not return JSON. Check backend route and proxy config.");
        }
        return res.json();
      })
      .then(setData)
      .catch(e => setError(e.message || "Error loading data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page container" style={{ position: 'relative', zIndex: 1 }}>
      {/* 3D Animated Coins in the background */}
      <FloatingCoins />
      <h1 style={{
        fontSize: '2.3rem',
        fontWeight: 800,
        marginBottom: '0.5rem',
        background: 'linear-gradient(90deg, #fbbf24 0%, #2563eb 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Financial Services & Education Loans
      </h1>
      <p style={{
        fontSize: '1.15rem',
        color: '#64748b',
        marginBottom: '2rem',
        fontWeight: 500
      }}>
        Explore scholarships, funding, and loan opportunities by university. Interactive, premium, and beautiful.
      </p>
      {loading && <div style={{marginTop:'2rem'}}>Loading...</div>}
      {error && <div style={{marginTop:'2rem', color:'#dc2626'}}>Error: {error}</div>}
      <div style={{
        marginTop:'2rem',
        display:'grid',
        gap:'2rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        position: 'relative',
        zIndex: 2
      }}>
        {data.map((uni, idx) => (
          <div
            key={uni.university + idx}
            className="card"
            style={{
              padding:'1.5rem',
              borderRadius:'1.5rem',
              background: 'rgba(255,255,255,0.7)',
              boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10), 0 1.5px 8px 0 #fbbf24',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #e0e7ef',
              transition: 'transform .18s, box-shadow .18s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03) rotateY(4deg)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px 0 #fbbf24, 0 2px 12px 0 #60a5fa';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = '';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px 0 rgba(37,99,235,0.10), 0 1.5px 8px 0 #fbbf24';
            }}
          >
            <h2 style={{
              margin:'0 0 .5rem',
              fontWeight: 700,
              fontSize: '1.3rem',
              color: '#1e293b'
            }}>{uni.university}</h2>
            <div style={{fontSize:'.95rem', color:'#64748b', marginBottom:'.5rem'}}>
              {uni.type} University, {uni.state}
            </div>
            {uni.scholarships && uni.scholarships.length > 0 && (
              <>
                <h3 style={{margin:'1rem 0 .5rem', fontSize:'1.1rem', color:'#2563eb'}}>University Scholarships</h3>
                <ul>
                  {uni.scholarships.map((s: any, i: number) => (
                    <li
                      key={s.scholarship_name + i}
                      style={{
                        marginBottom: '.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.6rem',
                        transition: 'color .18s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
                      onMouseLeave={e => (e.currentTarget.style.color = '')}
                    >
                      <span style={{fontSize:'1.1em'}}>💰</span>
                      <span>
                        <strong>{s.scholarship_name}</strong> — {s.value} ({s.level})<br />
                        <span style={{fontSize:'.85em', color:'#475569'}}>{s.notes}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {uni.common_programs && uni.common_programs.length > 0 && (
              <>
                <h3 style={{margin:'1rem 0 .5rem', fontSize:'1.1rem', color:'#2563eb'}}>Common National/External Scholarships</h3>
                <ul>
                  {uni.common_programs.map((s: any, i: number) => (
                    <li
                      key={s.scholarship_name + i}
                      style={{
                        marginBottom: '.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.6rem',
                        transition: 'color .18s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                      onMouseLeave={e => (e.currentTarget.style.color = '')}
                    >
                      <span style={{fontSize:'1.1em'}}>🏦</span>
                      <span>
                        <strong>{s.scholarship_name}</strong> — {s.value} ({s.level})<br />
                        <span style={{fontSize:'.85em', color:'#475569'}}>{s.notes}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};


