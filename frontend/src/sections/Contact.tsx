import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Realistic 3D Airplane with proper proportions and materials
function RealisticAirplane() {
  const meshRef = React.useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = (clock.getElapsedTime() % 12) / 12;
      meshRef.current.position.x = -12 + t * 24;
      meshRef.current.position.y = Math.sin(t * Math.PI * 2) * 0.8 + 2;
      meshRef.current.position.z = Math.cos(t * Math.PI * 2) * 1.5;
      meshRef.current.rotation.z = Math.sin(t * Math.PI * 2) * 0.08;
      meshRef.current.rotation.y = Math.PI / 2 + Math.sin(t * Math.PI * 4) * 0.1;
    }
  });

  return (
    <group ref={meshRef} scale={[0.8, 0.8, 0.8]}>
      {/* Main Fuselage - elongated and tapered */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.35, 6, 32]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          metalness={0.7} 
          roughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Nose Section - more pointed and realistic */}
      <mesh position={[0, 0, 3.2]}>
        <coneGeometry args={[0.25, 0.8, 32]} />
        <meshStandardMaterial 
          color="#e2e8f0" 
          metalness={0.8} 
          roughness={0.15}
        />
      </mesh>
      
      {/* Cockpit Windows - larger and more realistic */}
      <mesh position={[0, 0.15, 2.8]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.18, 24, 16, 0, Math.PI, 0, Math.PI * 0.6]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.1} 
          roughness={0.05} 
          transparent 
          opacity={0.3}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Main Wings - swept back design */}
      <group position={[0, -0.05, 0.5]}>
        {/* Left wing */}
        <mesh position={[-1.8, 0, -0.3]} rotation={[0, 0.3, 0.05]}>
          <boxGeometry args={[2.2, 0.12, 0.6]} />
          <meshStandardMaterial 
            color="#f1f5f9" 
            metalness={0.6} 
            roughness={0.25}
          />
        </mesh>
        {/* Right wing */}
        <mesh position={[1.8, 0, -0.3]} rotation={[0, -0.3, -0.05]}>
          <boxGeometry args={[2.2, 0.12, 0.6]} />
          <meshStandardMaterial 
            color="#f1f5f9" 
            metalness={0.6} 
            roughness={0.25}
          />
        </mesh>
      </group>
      
      {/* Wing Engines - realistic turbofan design */}
      <mesh position={[-1.2, -0.4, 0.3]}>
        <cylinderGeometry args={[0.18, 0.22, 0.8, 32]} />
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      <mesh position={[1.2, -0.4, 0.3]}>
        <cylinderGeometry args={[0.18, 0.22, 0.8, 32]} />
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Engine Intakes */}
      <mesh position={[-1.2, -0.4, 0.7]}>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 32]} />
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.3} 
          roughness={0.8}
        />
      </mesh>
      <mesh position={[1.2, -0.4, 0.7]}>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 32]} />
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.3} 
          roughness={0.8}
        />
      </mesh>
      
      {/* Vertical Tail (Rudder) */}
      <mesh position={[0, 0.6, -2.8]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.8, 0.15, 4]} />
        <meshStandardMaterial 
          color="#e2e8f0" 
          metalness={0.6} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Horizontal Stabilizers */}
      <mesh position={[0, 0.1, -2.6]}>
        <boxGeometry args={[1.4, 0.08, 0.35]} />
        <meshStandardMaterial 
          color="#e2e8f0" 
          metalness={0.6} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Passenger Windows - realistic spacing and size */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[0, 0.2, 2.2 - i * 0.4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshStandardMaterial 
            color="#1e293b" 
            metalness={0.1} 
            roughness={0.05} 
            transparent 
            opacity={0.4}
          />
        </mesh>
      ))}
      
      {/* Wing Navigation Lights */}
      <mesh position={[-3.8, -0.05, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#ef4444"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[3.8, -0.05, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color="#22c55e" 
          emissive="#22c55e"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Airline Stripe */}
      <mesh position={[0, 0.1, 1]}>
        <cylinderGeometry args={[0.255, 0.355, 4, 32, 1, true, 0, Math.PI * 0.6]} />
        <meshStandardMaterial 
          color="#2563eb" 
          metalness={0.7} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Landing Gear */}
      <mesh position={[0, -0.45, 1.5]}>
        <boxGeometry args={[0.08, 0.3, 0.05]} />
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.8} 
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.8, -0.5, 0.3]}>
        <boxGeometry args={[0.06, 0.25, 0.04]} />
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.8} 
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.8, -0.5, 0.3]}>
        <boxGeometry args={[0.06, 0.25, 0.04]} />
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.8} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Wing Flaps */}
      <mesh position={[-1.2, -0.08, 0.8]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.8, 0.06, 0.15]} />
        <meshStandardMaterial 
          color="#cbd5e1" 
          metalness={0.5} 
          roughness={0.4}
        />
      </mesh>
      <mesh position={[1.2, -0.08, 0.8]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.8, 0.06, 0.15]} />
        <meshStandardMaterial 
          color="#cbd5e1" 
          metalness={0.5} 
          roughness={0.4}
        />
      </mesh>
      
      {/* Subtle Contrails */}
      <mesh position={[0, 0.05, -4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.08, 2.5, 16, 1, true]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          transparent 
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

function FloatingAirplane() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.15
    }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <RealisticAirplane />
      </Canvas>
    </div>
  );
}

// Mock functions for the form functionality
function useReveal() {
  return React.useRef();
}

async function submitConsultationToExcel(data: Record<string, any>) {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});
  const [phone, setPhone] = useState("");

  function validateEmail(email: string){
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function validatePhone(phone: string, dial: string){
    const digits = phone.replace(/\D/g,'');
    if(dial === '+91') {
      return /^[6-9]\d{9}$/.test(digits);
    }
    return digits.length >= 7;
  }

  const handleSubmit = async (formData: Record<string, string>) => {
    const phoneVal = formData.phone?.trim() || '';
    const emailVal = formData.email?.trim() || '';
    const dialVal = formData.dial_code || '';

    const nextErrors: { phone?: string; email?: string } = {};
    if(!validatePhone(phoneVal, dialVal)) {
      nextErrors.phone = dialVal === '+91' ? 'Enter a valid 10-digit Indian mobile starting 6-9' : 'Enter a valid phone number';
    }
    if(!validateEmail(emailVal)) {
      nextErrors.email = 'Enter a valid email address';
    }
    setErrors(nextErrors);
    if(Object.keys(nextErrors).length) return;

    setStatus('submitting');
    try {
      await submitConsultationToExcel(formData);
      setStatus('submitted');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '4rem 2rem'
    }}>
      <FloatingAirplane />
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 2 
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '3rem'
        }}>
          Book Your Consultation
        </h2>
        
        <div 
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '3rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                First Name <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input 
                required 
                name="first_name" 
                placeholder="John"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Last Name <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input 
                required 
                name="last_name" 
                placeholder="Doe"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Phone Number <span style={{color: '#ef4444'}}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  name="dial_code" 
                  defaultValue="+91"
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    minWidth: '80px'
                  }}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+65">+65</option>
                </select>
                <input
                  required
                  name="phone"
                  placeholder="99999 99999"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={phone}
                  onChange={(e)=>{
                    let digits = e.target.value.replace(/\D/g,'');
                    if(digits.length === 1 && digits === '0') return; 
                    if(digits.length > 10) digits = digits.slice(0,10);
                    setPhone(digits);
                    setErrors(prev => ({...prev, phone: undefined}));
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: `2px solid ${errors.phone ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>
              {errors.phone && (
                <span style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block'}}>
                  {errors.phone}
                </span>
              )}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Email <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input 
                required 
                name="email" 
                type="email" 
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: `2px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
              />
              {errors.email && (
                <span style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block'}}>
                  {errors.email}
                </span>
              )}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Nationality <span style={{color: '#ef4444'}}>*</span>
              </label>
              <select 
                required 
                name="nationality" 
                defaultValue="India"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
            </div>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <button
              type="button"
              disabled={status !== 'idle'}
              onClick={async () => {
                const form = document.querySelector('div[style*="background: #ffffff"]');
                if (!form) return;
                const inputs = form.querySelectorAll('input, select');
                const formData: Record<string, string> = {};
                inputs.forEach((input: any) => {
                  if (input.name) formData[input.name] = input.value;
                });
                await handleSubmit(formData);
              }}
              style={{
                background: status !== 'idle' ? '#9ca3af' : '#2563eb',
                color: '#ffffff',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: status !== 'idle' ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {status === 'submitting' ? 'Submitting...' : status === 'submitted' ? 'Submitted!' : 'Submit'}
            </button>
          </div>
          
          {status === 'submitted' && (
            <div style={{textAlign:'center', marginTop:'1rem', color: '#059669', fontWeight: '600'}}>
              Thanks! We will contact you soon.
            </div>
          )}
        </div>
        
        {/* Newsletter Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{marginBottom:'0.7rem', fontWeight:'600', fontSize:'1.25rem', color:'#2563eb'}}>
            Stay Updated
          </h3>
          <p style={{margin:'0 0 1.5rem 0', color:'#64748b', fontSize:'0.97rem'}}>
            Subscribe to get the latest updates, tips, and university news.
          </p>
          <div style={{display:'flex', gap:'0.5rem', maxWidth: '400px', margin: '0 auto'}}>
            <input
              type="email"
              placeholder="Email for updates"
              style={{
                flex:1,
                padding:'0.75rem 1rem',
                borderRadius:'8px',
                border:'2px solid #e5e7eb',
                fontSize:'0.98rem'
              }}
            />
            <button
              style={{
                background:'#2563eb',
                color:'#fff',
                borderRadius:'8px',
                padding:'0.75rem 1.2rem',
                fontWeight:'600',
                fontSize:'0.98rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}