import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';


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
    transition: { delay: i * 0.08, duration: 0.5, type: "spring" }
  })
};

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

  // Animation helpers
  const sectionAnim = { initial: "hidden", animate: "visible", variants: fadeIn };

  return (
    <main style={{background: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem'}}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          marginTop: '2.5rem',
          borderRadius: '2.2rem',
          boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.13), 0 1.5px 8px 0 #c7d2fe',
          background: '#fff',
          padding: '0',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          style={{
            width: '100%',
            minHeight: 220,
            background: uni.thumbnail_r2 ? `url(${uni.thumbnail_r2}) center/cover no-repeat` : '#e0e7ff',
            borderTopLeftRadius: '2.2rem',
            borderTopRightRadius: '2.2rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start'
          }}>
          <div style={{
            background: 'rgba(255,255,255,0.55)',
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
            <div style={{
              width: 110,
              height: 110,
              borderRadius: '18px',
              background: '#fff',
              boxShadow: '0 2px 16px #e0e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginRight: '2.2rem'
            }}>
              {uni.logo_r2
                ? <img src={uni.logo_r2} alt={uni.name} style={{width: '99%', height: '99%'}} />
                : <span style={{fontSize:'2.5rem', color:'#888'}}>{uni.name[0]}</span>
              }
            </div>
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
        {/* Overview Section */}
        <motion.section {...sectionAnim} custom={0} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
          <h3 style={{marginBottom: '24px'}}>Overview</h3>
          <div style={{marginBottom:'1.2rem', fontSize:'1.05rem', color:'#334155'}}>
            {uni.description || uni.overview || uni.about || (
              <span>
                {uni.name} is a leading institution located in {uni.state}, {uni.country}. Established in {uni.established}, it offers a vibrant campus life and a wide range of programs for international students.
              </span>
            )}
          </div>
          {whyChoose.length > 0 && (
            <motion.ul initial="hidden" animate="visible" variants={{
              hidden: {}, visible: { transition: { staggerChildren: 0.08 } }
            }}>
              {whyChoose.map((reason, i) => (
                <motion.li key={i} variants={fadeIn} custom={i} style={{
                  marginBottom:'.5rem', color:'#2563eb', fontWeight:500, fontSize:'1.07rem'
                }}>
                  {reason}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.section>
        {/* Quick Facts Section */}
        <motion.section {...sectionAnim} custom={1} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
          <h3 style={{marginBottom: '24px'}}>Quick Facts</h3>
          <div style={{
            background:'#f9fafb',
            borderRadius:'12px',
            padding:'1.2rem 1.2rem .7rem 1.2rem',
            marginBottom:'2rem',
            boxShadow:'0 1px 6px #e5e7eb',
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
            gap:'1.2rem'
          }}>
            {[
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
            ]
              .filter(
                f =>
                  f.value !== undefined &&
                  f.value !== null &&
                  f.value !== '' &&
                  f.value !== '-' &&
                  f.value !== 'N/A' &&
                  f.value !== 'None'
              )
              .map((f, i) => (
                <motion.div key={i} variants={fadeIn} custom={i}><b>{f.label}:</b> {f.value}</motion.div>
              ))
            }
          </div>
        </motion.section>
        {/* Rankings Section */}
        {rankings && Object.keys(rankings).length > 0 && (
          <motion.section {...sectionAnim} custom={2} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
            <h3 style={{marginBottom: '24px'}}>Latest Rankings</h3>
            <div style={{display:'flex', gap:'1.2rem', flexWrap:'wrap', marginBottom:'1.5rem'}}>
              {Object.entries(rankings).map(([k, v], i) => (
                <motion.div key={k} variants={fadeIn} custom={i} style={{
                  background:'#e0e7ff', color:'#3730a3', borderRadius:'8px', padding:'.7rem 1.2rem', fontWeight:600, fontSize:'1.07rem'
                }}>
                  {k}: {v}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {/* Tuition Fees Section */}
        {tuition && Object.keys(tuition).length > 0 && (
          <motion.section {...sectionAnim} custom={3} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
            <h3 style={{marginBottom: '24px'}}>Tuition Fees Per Year</h3>
            <div style={{display:'flex', gap:'1.2rem', flexWrap:'wrap', marginBottom:'1.5rem'}}>
              {Object.entries(tuition).map(([k, v], i) => (
                <motion.div key={k} variants={fadeIn} custom={i} style={{
                  background:'#dcfce7', color:'#166534', borderRadius:'8px', padding:'.7rem 1.2rem', fontWeight:600, fontSize:'1.07rem'
                }}>
                  {k}: {v}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {/* Features Section */}
        {features && features.length > 0 && (
          <motion.section {...sectionAnim} custom={4} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
            <h3 style={{marginBottom: '24px'}}>Features</h3>
            <div style={{display:'flex', flexWrap:'wrap', gap:'1.2rem', marginBottom:'1.5rem'}}>
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeIn} custom={i} style={{
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  padding: '.7rem 1.2rem',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  color: '#3730a3',
                  minWidth: 180,
                  boxShadow: '0 1px 4px #e0e7eb',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span>{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {/* Campus Life Section */}
        {campusLife && (campusLife.facilities || campusLife.accommodation) && (
          <motion.section {...sectionAnim} custom={5} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
            <h3 style={{marginBottom: '24px'}}>Campus Life</h3>
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
          </motion.section>
        )}
        {/* Admission Requirements Section */}
        {admissionReq && Object.keys(admissionReq).length > 0 && (
          <motion.section {...sectionAnim} custom={6} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
            <h3 style={{marginBottom: '24px'}}>Admission Requirements</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'.7rem'}}>
              {Object.entries(admissionReq).map(([k, v], i) => (
                <motion.div key={k} variants={fadeIn} custom={i} style={{
                  background:'#fef9c3', color:'#92400e', borderRadius:'8px', padding:'.7rem 1.2rem', fontWeight:500
                }}>
                  <b>{k.charAt(0).toUpperCase() + k.slice(1)}:</b> {v}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        {/* Programs Section */}
        {programs.length > 0 && (
          <motion.section {...sectionAnim} custom={7} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
            <h3 style={{marginBottom: '24px'}}>Programs</h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.2rem',
                marginBottom: '1.5rem',
                justifyContent: 'flex-start'
              }}
            >
              {programs.map((p: any, i: number) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  custom={i}
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
                    transition: 'box-shadow .18s, border-color .18s',
                    cursor: 'pointer'
                  }}
                  tabIndex={0}
                  aria-label={p.program_name || p.name}
                  onMouseOver={e => (e.currentTarget.style.borderColor = '#2563eb')}
                  onMouseOut={e => (e.currentTarget.style.borderColor = '#e0e7eb')}
                  onFocus={e => (e.currentTarget.style.borderColor = '#2563eb')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e0e7eb')}
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
          </motion.section>
        )}
        {/* Address Section */}
        <motion.section {...sectionAnim} custom={8} style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
          <h2 className="h3 font-calibre">Where is {uni.name}?</h2>
          <div style={{marginTop: 29}}>
            <iframe
              title="Google Map"
              allowFullScreen
              frameBorder={0}
              height={304}
              width="100%"
              style={{border: 0}}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBn78RKBqMJ_Nr-mS8wEw82-AxsvtacxiA&q=${encodeURIComponent(uni.name)}`}
            />
          </div>
        </motion.section>
        {/* Section: Raw Data */}
        <motion.details style={{margin:'2.2rem 2.7rem 0 2.7rem'}} {...sectionAnim} custom={9}>
          <summary style={{cursor:'pointer', fontWeight:600, fontSize:'.97rem'}}>Show Raw Data</summary>
          <pre style={{fontSize:'.85em', background:'#f5f7fb', padding:'.7em', borderRadius:'8px', overflow:'auto', marginTop:'.7rem'}}>{JSON.stringify(uni, null, 2)}</pre>
        </motion.details>
      </motion.div>
    </main>
  );
};


