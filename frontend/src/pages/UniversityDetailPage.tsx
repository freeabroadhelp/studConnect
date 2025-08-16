import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useParams, Link } from 'react-router-dom';


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

  const features: string[] = parseJSONField(uni.features);

  // Robustly parse programs field (Python-style or JSON or array)
  let parsedPrograms: any[] = [];
  try {
    if (typeof uni.programs === "string") {
      let cleanStr = uni.programs
        .replace(/^"+|"+$/g, "")
        .replace(/'/g, '"')
        .replace(/\bNone\b/g, 'null');
      parsedPrograms = JSON.parse(cleanStr);
    } else if (Array.isArray(uni.programs)) {
      parsedPrograms = uni.programs;
    }
  } catch {
    parsedPrograms = [];
  }


  return (
    <main style={{background: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem'}}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        marginTop: '2.5rem',
        borderRadius: '2.2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.13), 0 1.5px 8px 0 #c7d2fe',
        background: '#fff',
        padding: '0',
        position: 'relative',
        overflow: 'visible'
      }}>
        {/* Banner */}
        <div style={{
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
          <div style={{
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
                {uni.country}{uni.province ? ` / ${uni.province}` : ''}
              </div>
            </div>
          </div>
        </div>
        {/* Overview Section */}
        <section id="section-overview" style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
          <h3 style={{marginBottom: '24px'}}>Overview</h3>
          <div style={{marginBottom:'1.2rem', fontSize:'1.05rem', color:'#334155'}}>
            {uni.description || uni.overview || uni.about || (
              <span>
                {uni.name} was an association of universities and higher education institutions for institutions of higher education and research in the city of {uni.province} , {uni.country}.
              </span>
            )}
          </div>
        </section>
        {/* Quick Facts Section */}
        <section id="section-quickfacts" style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
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
              { label: 'Type', value: uni.university_type || uni.type },
              { label: 'Students', value: uni.number_of_students },
              { label: 'International Students', value: uni.international_students },
              { label: 'Number of Academician', value: uni.number_of_academician },
              { label: 'Scholarship Ratio', value: uni.scholarship_ratio },
              { label: 'Placement Rate', value: uni.placement_rate },
              { label: 'Technology Office', value: uni.technology_office },
              { label: 'Erasmus', value: uni.erasmus },
              { label: 'Student/Academician', value: uni.student_academician },
              { label: 'Entrepreneurship Index Score', value: uni.entrepreneurship_index_score },
              { label: 'Library Area', value: uni.library_area },
              { label: 'AR-GE Expense', value: uni.ar_ge_expense },
              { label: 'Average Tuition', value: uni.average_tuition ? `${uni.average_tuition} ${uni.average_tuition_currency || ''}` : null },
              { label: 'URAP Standings', value: uni.urap_standings },
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
                <div key={i}><b>{f.label}:</b> {f.value}</div>
              ))
            }
          </div>
        </section>
        {/* Features Section */}
        {features && features.length > 0 && (
          <section id="section-features" style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
            <h3 style={{marginBottom: '24px'}}>Features</h3>
            <div style={{display:'flex', flexWrap:'wrap', gap:'1.2rem', marginBottom:'1.5rem'}}>
              {features.map((f, i) => (
                <div key={i} style={{
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
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Programs Section */}
        {parsedPrograms.length > 0 && (
          <section id="section-programs" style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
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
              {parsedPrograms.map((p: any, i: number) => (
                <div
                  key={i}
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
                </div>
              ))}
            </div>
          </section>
        )}


        {/* Address Section */}
        <section id="section-address" style={{padding:'2.2rem 2.7rem 0 2.7rem'}}>
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
        </section>
        {/* Section: Raw Data */}
        <details style={{margin:'2.2rem 2.7rem 0 2.7rem'}}>
          <summary style={{cursor:'pointer', fontWeight:600, fontSize:'.97rem'}}>Show Raw Data</summary>
          <pre style={{fontSize:'.85em', background:'#f5f7fb', padding:'.7em', borderRadius:'8px', overflow:'auto', marginTop:'.7rem'}}>{JSON.stringify(uni, null, 2)}</pre>
        </details>
      </div>
    </main>
  );
};
        

