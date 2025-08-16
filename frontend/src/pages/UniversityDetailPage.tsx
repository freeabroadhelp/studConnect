import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';


function AnimatedBackdrop() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 0, pointerEvents: 'none', opacity: 0.13
    }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} />
        <mesh rotation={[0.3, 0.7, 0]}>
          <sphereGeometry args={[7, 64, 48]} />
          <meshStandardMaterial color="#2563eb" roughness={0.25} metalness={0.7} transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[0.2, 0.2, 0]}>
          <torusKnotGeometry args={[9, 0.22, 180, 16]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.15} metalness={0.8} transparent opacity={0.18} />
        </mesh>
        <Stars radius={30} depth={60} count={1800} factor={2} fade />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} />
      </Canvas>
    </div>
  );
}

// --- Utility ---
function parseJSONField(field: string | null | undefined) {
  if (!field) return [];
  try {
    const cleaned = typeof field === 'string' && field.startsWith('"') && field.endsWith('"')
      ? JSON.parse(field)
      : field;
    return typeof cleaned === 'string' ? JSON.parse(cleaned) : cleaned;
  } catch {
    return [];
  }
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, type: "spring" }
  })
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: "spring" } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 20 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, type: "spring" }
  })
};

// --- Main Page ---
export const UniversityDetailPage: React.FC = () => {
  const api = useApi();
  const { id } = useParams<{ id: string }>();
  const [uni, setUni] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    api.get(`/api/universities/${id}`)
      .then(setUni)
      .catch(e => setError(e.message || 'Failed to load university'))
      .finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div style={{padding:'2rem'}}>Loading...</div>;
  if (error) return <div style={{padding:'2rem', color:'#dc2626'}}>Error: {error}</div>;
  if (!uni) return <div style={{padding:'2rem'}}>Not found.</div>;

  // Parse fields
  const features: string[] = parseJSONField(uni.features);
  const whyChoose: string[] = uni.why_choose || [];
  const scholarships: string[] = uni.scholarships_highlight || [];
  const intSupport: string[] = uni.international_student_support || [];
  const levelsOffered: string[] = uni.levels_offered || [];
  const intakes: string[] = uni.intakes || [];
  const modeOfStudy: string[] = uni.mode_of_study || [];
  const popPrograms: string[] = uni.popular_for_international_students || [];
  const campusLife = uni.campus_life || {};
  const admissionReq = uni.admission_requirements || {};
  const tuition = uni.tuition_fees_per_year || {};
  const rankings = uni.latest_rankings || {};
  const programs = parseJSONField(uni.programs);

  // --- Section: Overview ---
  const overviewSection = (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      style={{
        padding:'2.2rem 2.7rem 0 2.7rem',
        marginBottom:'1.7rem'
      }}
    >
      <h2 style={{
        marginBottom:'1.2rem',
        fontWeight:800,
        fontSize:'2rem',
        color: 'var(--uni-title, #1e293b)',
        letterSpacing:'-1px'
      }}>Overview</h2>
      <div style={{
        fontSize:'1.13rem',
        color: 'var(--uni-desc, #334155)',
        lineHeight:1.8,
        background: 'linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%)',
        borderRadius: '14px',
        padding: '1.3rem 1.5rem',
        boxShadow: '0 1px 8px #e0e7eb',
        marginBottom:'1.2rem',
        ...(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? {
              background: 'linear-gradient(90deg, #1e293b 0%, #0a1624 100%)',
              color: '#e0e7ef',
              boxShadow: '0 1px 8px #1e293b'
            }
          : {})
      }}>
        {uni.description || uni.overview || uni.about ? (
          <span>{uni.description || uni.overview || uni.about}</span>
        ) : (
          <span>
            <b>{uni.name}</b> is a prestigious university in <b>{uni.state}, {uni.country}</b>, established in <b>{uni.established}</b>. 
            It is renowned for its academic excellence, vibrant campus life, and strong support for international students.
          </span>
        )}
      </div>
      <div style={{display:'flex', flexWrap:'wrap', gap:'1.5rem', alignItems:'stretch'}}>
        <div style={{flex:'1 1 220px', minWidth:220}}>
          <span style={{fontWeight:600, color:'#2563eb'}}>Why international students love {uni.name}:</span>
          <ul style={{margin:'.5rem 0 0 1.2rem', padding:0, color:'#2563eb', fontWeight:500}}>
            {whyChoose.length > 0 ? whyChoose.map((reason, i) => (
              <li key={i} style={{marginBottom:'.3rem'}}>{reason}</li>
            )) : (
              <li>Welcoming campus and global community</li>
            )}
          </ul>
        </div>
        <div style={{
          flex:'1 1 220px',
          background:'#f1f5f9',
          borderRadius:'10px',
          padding:'1rem 1.2rem',
          minWidth:220,
          boxShadow:'0 1px 6px #e0e7eb'
        }}>
          <span style={{fontWeight:600, color:'#166534'}}>Popular for:</span>
          <ul style={{margin:'.5rem 0 0 1.2rem', padding:0, color:'#166534', fontWeight:500}}>
            {popPrograms.length > 0 ? popPrograms.map((p, i) => (
              <li key={i}>{p}</li>
            )) : (
              <li>Diverse academic programs</li>
            )}
          </ul>
        </div>
      </div>
    </motion.section>
  );

  // --- Section: Banner ---
  const bannerSection = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.7 }}
      style={{
        width: '100%',
        minHeight: 220,
        background: uni.thumbnail_r2
          ? `url(${uni.thumbnail_r2}) center/cover no-repeat`
          : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'linear-gradient(90deg,#1e293b,#0a1624)'
              : 'linear-gradient(90deg,#e0e7ff,#f1f5f9)'),
        borderTopLeftRadius: '2.2rem',
        borderTopRightRadius: '2.2rem',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        boxShadow: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? '0 2px 24px #1e293b'
          : '0 2px 24px #c7d2fe'
      }}>
      <div style={{
        background: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'linear-gradient(180deg,rgba(17,24,39,0.7) 60%,rgba(17,24,39,0.98) 100%)'
          : 'linear-gradient(180deg,rgba(255,255,255,0.7) 60%,rgba(255,255,255,0.98) 100%)',
        borderTopLeftRadius: '2.2rem',
        borderTopRightRadius: '2.2rem',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0, left: 0
      }} />
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '2.2rem 2.7rem 1.2rem 2.7rem',
          width: '100%'
        }}>
        <motion.div
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
          style={{
            width: 110,
            height: 110,
            borderRadius: '18px',
            background: '#fff',
            boxShadow: '0 2px 16px #e0e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginRight: '2.2rem',
            border: '3px solid #2563eb'
          }}>
          {uni.logo_r2
            ? <img src={uni.logo_r2} alt={uni.name} style={{width: '99%', height: '99%', objectFit:'contain'}} />
            : <span style={{fontSize:'2.5rem', color:'#888'}}>{uni.name[0]}</span>
          }
        </motion.div>
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: '2.5rem',
            marginBottom: '.2rem',
            letterSpacing: '-1px',
            color: '#1e293b'
          }}>{uni.name}</div>
          <div style={{fontSize: '1.1rem', color: '#334155', fontWeight: 600, marginBottom: '.2rem'}}>
            {uni.country}{uni.state ? ` / ${uni.state}` : ''}
          </div>
          <div style={{marginTop:'.5rem'}}>
            <a href={uni.official_website} target="_blank" rel="noopener noreferrer" style={{color:'#2563eb', fontWeight:600, textDecoration:'underline'}}>Official Website</a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // --- Info Card ---
  function InfoCard({ label, value, icon, color }: { label: string, value: React.ReactNode, icon?: React.ReactNode, color?: string }) {
    return (
      <motion.div
        variants={cardVariants}
        style={{
          background: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#1e293b' : '#fff',
          borderRadius: 14,
          boxShadow: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? '0 1px 8px #0a1624'
            : '0 1px 8px #e0e7eb',
          padding: '1.1rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '.9rem',
          fontSize: '1.05rem',
          fontWeight: 500,
          color: color || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e0e7ef' : '#334155'),
          minWidth: 180
        }}
      >
        {icon && <span style={{fontSize:'1.3rem', color: color || '#2563eb'}}>{icon}</span>}
        <span style={{fontWeight:700, color:'#2563eb'}}>{label}:</span>
        <span style={{fontWeight:600}}>{value}</span>
      </motion.div>
    );
  }

  // --- Collapsible Section ---
  function CollapsibleSection({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div style={{
        marginBottom:'1.7rem',
        borderRadius:14,
        background: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#111827' : '#f8fafc',
        boxShadow: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? '0 1px 8px #0a1624'
          : '0 1px 8px #e0e7eb'
      }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width:'100%',
            background:'none',
            border:'none',
            textAlign:'left',
            padding:'1.1rem 1.5rem',
            fontWeight:700,
            fontSize:'1.13rem',
            color:'#2563eb',
            borderRadius:'14px',
            cursor:'pointer',
            display:'flex',
            alignItems:'center',
            gap:'.7rem'
          }}
          aria-expanded={open}
        >
          <span style={{
            display:'inline-block',
            transition:'transform .3s',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)'
          }}>▶</span>
          {title}
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, type: "tween" }}
              style={{overflow:'hidden'}}
            >
              <div style={{padding:'0 1.5rem 1.2rem 2.2rem'}}>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- Section: Quick Facts ---
  const quickFacts = [
    { label: 'Type', value: uni.type },
    { label: 'State', value: uni.state },
    { label: 'Location', value: uni.location },
    { label: 'Established', value: uni.established },
    { label: 'Networks', value: uni.networks },
    { label: 'Official Email', value: uni.official_email },
    { label: 'Levels Offered', value: levelsOffered.join(', ') },
    { label: 'Intakes', value: intakes.join(', ') },
    { label: 'Mode of Study', value: modeOfStudy.join(', ') },
    { label: 'Popular Programs', value: popPrograms.join(', ') },
    { label: 'Scholarships', value: scholarships.join(', ') },
    { label: 'International Student Support', value: intSupport.join(', ') },
    { label: 'Living Costs (Annual AUD)', value: uni.living_costs_annual_aud },
    { label: 'Application Fee Range (AUD)', value: uni.application_fee_range_aud },
  ].filter(
    f =>
      f.value !== undefined &&
      f.value !== null &&
      f.value !== '' &&
      f.value !== '-' &&
      f.value !== 'N/A' &&
      f.value !== 'None'
  );

  // --- Section: Programs (interactive cards) ---
  const programsSection = programs.length > 0 && (
    <CollapsibleSection title="Programs Offered" defaultOpen>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.2rem',
        marginBottom: '1.5rem',
        justifyContent: 'flex-start'
      }}>
        {programs.map((p: any, i: number) => (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px #2563eb33' }}
            style={{
              background: '#f1f5f9',
              borderRadius: '14px',
              boxShadow: '0 1px 8px #e5e7eb',
              padding: '1.2rem 1.4rem',
              minWidth: 240,
              maxWidth: 340,
              flex: '1 1 260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '.7rem',
              border: '1px solid #e0e7eb',
              cursor: 'pointer',
              transition: 'box-shadow .18s, border-color .18s'
            }}
            tabIndex={0}
            aria-label={p.program_name || p.name}
          >
            <div style={{fontWeight: 700, fontSize: '1.13rem', color: '#1e293b', marginBottom: '.2rem'}}>
              {p.program_name || p.name}
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '.7rem', fontSize: '.97rem'}}>
              <span style={{
                background: '#e0e7ff',
                color: '#3730a3',
                borderRadius: '7px',
                padding: '.18rem .7rem',
                fontWeight: 500
              }}>
                {p.language || '-'}
              </span>
              <span style={{
                background: '#fef9c3',
                color: '#92400e',
                borderRadius: '7px',
                padding: '.18rem .7rem',
                fontWeight: 500
              }}>
                {p.year ? `${p.year} years` : '-'}
              </span>
              {p.discipline && (
                <span style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  borderRadius: '7px',
                  padding: '.18rem .7rem',
                  fontWeight: 500
                }}>
                  {p.discipline}
                </span>
              )}
              {(p.tuition || p.annual_fee) && (
                <span style={{
                  background: '#dcfce7',
                  color: '#166534',
                  borderRadius: '7px',
                  padding: '.18rem .7rem',
                  fontWeight: 500
                }}>
                  {p.tuition
                    ? <>${p.tuition} {p.currency || ''}</>
                    : <>${p.annual_fee} {p.currency || ''}</>
                  }
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </CollapsibleSection>
  );

  // --- Section: Tuition Fees ---
  const tuitionSection = tuition && Object.keys(tuition).length > 0 && (
    <CollapsibleSection title="Tuition Fees Per Year" defaultOpen>
      <div style={{display:'flex', gap:'1.2rem', flexWrap:'wrap', marginBottom:'1.5rem'}}>
        {Object.entries(tuition).map(([k, v], i) => (
          <motion.div key={k} variants={cardVariants} initial="hidden" animate="visible" custom={i} style={{
            background:'#dcfce7', color:'#166534', borderRadius:'8px', padding:'.7rem 1.2rem', fontWeight:600, fontSize:'1.07rem', minWidth:160
          }}>
            {k}: {v}
          </motion.div>
        ))}
      </div>
    </CollapsibleSection>
  );

  // --- Section: Rankings ---
  const rankingsSection = rankings && Object.keys(rankings).length > 0 && (
    <CollapsibleSection title="Latest Rankings">
      <div style={{display:'flex', gap:'1.2rem', flexWrap:'wrap', marginBottom:'1.5rem'}}>
        {Object.entries(rankings).map(([k, v], i) => (
          <motion.div key={k} variants={cardVariants} initial="hidden" animate="visible" custom={i} style={{
            background:'#e0e7ff', color:'#3730a3', borderRadius:'8px', padding:'.7rem 1.2rem', fontWeight:600, fontSize:'1.07rem', minWidth:120
          }}>
            {k}: {v}
          </motion.div>
        ))}
      </div>
    </CollapsibleSection>
  );

  // --- Section: Features ---
  const featuresSection = features && features.length > 0 && (
    <CollapsibleSection title="Campus Features">
      <div style={{display:'flex', flexWrap:'wrap', gap:'1.2rem', marginBottom:'1.5rem'}}>
        {features.map((f, i) => (
          <motion.div key={i} variants={cardVariants} initial="hidden" animate="visible" custom={i} style={{
            background: '#f1f5f9',
            borderRadius: '8px',
            padding: '.7rem 1.2rem',
            fontSize: '1.05rem',
            fontWeight: 500,
            color: '#3730a3',
            minWidth: 140,
            boxShadow: '0 1px 4px #e0e7eb',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span>{f}</span>
          </motion.div>
        ))}
      </div>
    </CollapsibleSection>
  );

  // --- Section: Campus Life ---
  const campusLifeSection = campusLife && (campusLife.facilities || campusLife.accommodation) && (
    <CollapsibleSection title="Campus Life">
      {campusLife.facilities && (
        <div style={{marginBottom:'.7rem'}}>
          <b>Facilities:</b> {Array.isArray(campusLife.facilities) ? campusLife.facilities.join(', ') : campusLife.facilities}
        </div>
      )}
      {campusLife.accommodation && (
        <div>
          <b>Accommodation:</b> {campusLife.accommodation}
        </div>
      )}
    </CollapsibleSection>
  );

  // --- Section: Admission Requirements ---
  const admissionSection = admissionReq && Object.keys(admissionReq).length > 0 && (
    <CollapsibleSection title="Entry Requirements">
      <div style={{display:'flex', flexDirection:'column', gap:'.7rem'}}>
        {Object.entries(admissionReq).map(([k, v], i) => (
          <motion.div key={k} variants={cardVariants} initial="hidden" animate="visible" custom={i} style={{
            background:'#fef9c3', color:'#92400e', borderRadius:'8px', padding:'.7rem 1.2rem', fontWeight:500
          }}>
            <b>{k.charAt(0).toUpperCase() + k.slice(1)}:</b> {v}
          </motion.div>
        ))}
      </div>
    </CollapsibleSection>
  );

  // --- Section: Quick Facts (cards) ---
  const quickFactsSection = (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      style={{padding:'2.2rem 2.7rem 0 2.7rem'}}
    >
      <h2 style={{marginBottom:'1.2rem', fontWeight:800, fontSize:'1.3rem', color:'#1e293b', letterSpacing:'-1px'}}>Quick Facts</h2>
      <div style={{
        display:'flex',
        flexWrap:'wrap',
        gap:'1.2rem',
        marginBottom:'2rem'
      }}>
        {quickFacts.map((fact, i) => (
          <InfoCard key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </div>
    </motion.section>
  );

  // --- Section: Location ---
  const locationSection = (
    <CollapsibleSection title={`Where is ${uni.name}?`} defaultOpen={false}>
      <div style={{marginTop: 12}}>
        <iframe
          title="Google Map"
          allowFullScreen
          frameBorder={0}
          height={304}
          width="100%"
          style={{border: 0, borderRadius:12}}
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBn78RKBqMJ_Nr-mS8wEw82-AxsvtacxiA&q=${encodeURIComponent(uni.name)}`}
        />
      </div>
    </CollapsibleSection>
  );

  // --- Render ---
  return (
    <main style={{
      background: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'linear-gradient(120deg, #0a1624 60%, #1e293b 100%)'
        : 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)',
      minHeight: '100vh',
      paddingBottom: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackdrop />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          marginTop: '2.5rem',
          borderRadius: '2.2rem',
          boxShadow: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? '0 8px 32px 0 #0a1624, 0 1.5px 8px 0 #1e293b'
            : '0 8px 32px 0 rgba(31, 41, 55, 0.13), 0 1.5px 8px 0 #c7d2fe',
          background: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'rgba(17,24,39,0.98)'
            : 'rgba(255,255,255,0.98)',
          padding: '0',
          position: 'relative',
          overflow: 'visible',
          zIndex: 2
        }}
      >
        {bannerSection}
        {overviewSection}
        {quickFactsSection}
        {rankingsSection}
        {tuitionSection}
        {featuresSection}
        {campusLifeSection}
        {admissionSection}
        {programsSection}
        {locationSection}
      </motion.div>
    </main>
  );
};
      