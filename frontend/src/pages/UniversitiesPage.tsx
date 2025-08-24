import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { Modal } from '../components/Modal';
import programsData from './programs.json';
import countriesData from './countries.json';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 200;

interface ProgramItem {
  id: string;
  type: string;
  attributes: any;
  school_id: string;
}

export const UniversitiesPage: React.FC = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [openIntakes, setOpenIntakes] = useState<any | null>(null); // <-- Add this line at the top-level of the component

  // Filters
  const [minTuition, setMinTuition] = useState('');
  const [maxTuition, setMaxTuition] = useState('');
  const [programName, setProgramName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [country, setCountry] = useState('');

  // For filter dropdowns
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [allUniversities, setAllUniversities] = useState<string[]>([]);
  const [allProgramNames, setAllProgramNames] = useState<string[]>([]);

  // Fetch filter options (countries, universities, program names)
  useEffect(() => {
    fetch(`${BASE_URL}/api/programs/filter?page=1&page_size=200`)
      .then(res => res.json())
      .then(res => {
        const items = res.items || [];
        const countrySet = new Set<string>();
        const universitySet = new Set<string>();
        const programSet = new Set<string>();
        items.forEach((p: any) => {
          if (p.attributes?.school?.country) countrySet.add(p.attributes.school.country);
          if (p.attributes?.school?.name) universitySet.add(p.attributes.school.name);
          if (p.attributes?.name) programSet.add(p.attributes.name);
        });
        setAllCountries(Array.from(countrySet).sort());
        setAllUniversities(Array.from(universitySet).sort());
        setAllProgramNames(Array.from(programSet).sort());
      });
  }, []);

  // Fetch programs with filters (use new API endpoint)
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params: Record<string, string | number> = {
      page,
      page_size: MAX_PAGE_SIZE,
    };
    if (minTuition) params.min_fees = minTuition;
    if (maxTuition) params.max_fees = maxTuition;
    if (programName) params.program_name = programName;
    if (universityName) params.school_name = universityName;
    if (country) params.country = country;

    fetch(`${BASE_URL}/api/programs/filter?${new URLSearchParams(params as any).toString()}`)
      .then(res => res.json())
      .then(res => {
        setPrograms(res.items || []);
        setTotal(res.total || 0);
      })
      .catch(e => setError(e.message || 'Failed loading programs'))
      .finally(() => setLoading(false));
  }, [minTuition, maxTuition, programName, universityName, country, page]);

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem', position: 'relative', zIndex: 1 }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        marginTop: '2.5rem',
        borderRadius: '2.2rem',
        background: '#fff',
        boxShadow: '0 8px 32px 0 rgba(31,41,55,0.10), 0 1.5px 8px 0 #c7d2fe',
        padding: '2.2rem 2.2rem 1.5rem 2.2rem',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.2rem',
          gap: '1.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-1px',
              color: 'var(--uni-title, #1e293b)',
              transition: 'color 0.3s'
            }}>Programs</h1>
            <div style={{
              fontSize: '1.05rem',
              color: 'var(--uni-desc, #64748b)',
              marginTop: '.3rem',
              transition: 'color 0.3s'
            }}>Find and compare programs worldwide.</div>
          </div>
          <div style={{ display: 'flex', gap: '.9rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={country} onChange={e => setCountry(e.target.value)}
              style={{
                padding: '.55rem 1.1rem',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontWeight: 500,
                minWidth: 140,
                background: '#f8fafc'
              }}>
              <option value="">All Countries</option>
              {allCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={universityName} onChange={e => setUniversityName(e.target.value)}
              style={{
                padding: '.55rem 1.1rem',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontWeight: 500,
                minWidth: 180,
                background: '#f8fafc'
              }}>
              <option value="">All Universities</option>
              {allUniversities.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <select value={programName} onChange={e => setProgramName(e.target.value)}
              style={{
                padding: '.55rem 1.1rem',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontWeight: 500,
                minWidth: 180,
                background: '#f8fafc'
              }}>
              <option value="">All Programs</option>
              {allProgramNames.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Tuition"
              value={minTuition}
              onChange={e => setMinTuition(e.target.value)}
              style={{
                padding: '.55rem .9rem',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontWeight: 500,
                minWidth: 100,
                background: '#f8fafc'
              }}
            />
            <input
              type="number"
              placeholder="Max Tuition"
              value={maxTuition}
              onChange={e => setMaxTuition(e.target.value)}
              style={{
                padding: '.55rem .9rem',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontWeight: 500,
                minWidth: 100,
                background: '#f8fafc'
              }}
            />
          </div>
        </div>
        {/* Program Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.7rem'
        }}>
          {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b' }}>Loading programs...</div>}
          {error && <div style={{ gridColumn: '1/-1', color: '#dc2626', textAlign: 'center' }}>Error: {error}</div>}
          {!loading && !error && programs.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b' }}>No programs found.</div>
          )}
          {!loading && !error && programs.map((p) => {
            const attrs = p.attributes || {};
            const school = attrs.school || {};
            const logoUrl = school.logoThumbnailUrl || '/placeholder.png';
            const universityName = school.name || '';
            const location = [school.province || school.state, school.countryCode || school.country].filter(Boolean).join(', ');
            const campusCity = school.city || '';
            const tuitionFee = attrs.tuition ? `$${attrs.tuition}${attrs.currency ? ' ' + attrs.currency : ''}` : 'N/A';
            const applicationFee = attrs.applicationFee !== undefined ? (attrs.applicationFee ? `$${attrs.applicationFee}` : 'Free') : (attrs.application_fee ? `$${attrs.application_fee}` : 'Free');
            const duration = attrs.maxLength && attrs.minLength
              ? attrs.maxLength === attrs.minLength
                ? `${attrs.maxLength} months`
                : `${attrs.minLength} - ${attrs.maxLength} months`
              : attrs.duration || 'N/A';
            const programName = attrs.name || '';
            const programLevel = attrs.programLevel || attrs.level || '';
            const intakes = attrs.programIntakes || [];

            return (
              <article
                key={p.id}
                className="program-card"
                style={{
                  background: '#fff',
                  borderRadius: '18px',
                  boxShadow: '0 2px 12px 0 #e5e7eb',
                  border: '1px solid #e0e7ef',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '520px',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <img
                    src={logoUrl}
                    alt={universityName}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', marginRight: '12px' }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{universityName}</h3>
                    <p style={{ margin: 0, fontSize: '.85rem', color: '#2563eb' }}>{location}</p>
                  </div>
                </div>

                {/* Program Title */}
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb', marginBottom: '.5rem' }}>
                  {programName}
                </h2>
                <p style={{ fontSize: '.9rem', color: '#6b7280', marginBottom: '1rem' }}>{programLevel}</p>

                {/* Details */}
                <dl style={{ fontSize: '.9rem', lineHeight: '1.6' }}>
                  <div><strong>Location:</strong> {location}</div>
                  <div><strong>Campus city:</strong> {campusCity}</div>
                  <div><strong>Tuition (1st year):</strong> {tuitionFee}</div>
                  <div><strong>Application fee:</strong> {applicationFee}</div>
                  <div><strong>Duration:</strong> {duration}</div>
                </dl>

                {/* Success Prediction */}
                {intakes.length > 0 && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: '#f9fafb',
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: '.5rem' }}>Success prediction</p>
                    <button
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '.5rem 1.2rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '.5rem'
                      }}
                      onClick={() => setOpenIntakes({ program: p, intakes })}
                    >
                      View Details
                    </button>
                  </div>
                )}

                {/* Spacer to push button to bottom */}
                <div style={{ flexGrow: 1 }} />

                {/* Details button */}
                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                  <button
                    onClick={() => navigate(`/programDetailPage/${p.id}`)}
                    style={{
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '8px',
                      padding: '.6rem 1.4rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Details
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        {/* Modal for Success Prediction Details */}
        {openIntakes && (
          <div
            role="dialog"
            aria-modal="true"
            className="css-19pzjof"
            tabIndex={-1}
            style={{
              pointerEvents: 'auto',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.25)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setOpenIntakes(null)}
          >
            <div
              className="css-14yws4s"
              style={{
                background: '#fff',
                borderRadius: '18px',
                maxWidth: 600,
                width: '95%',
                boxShadow: '0 8px 32px 0 rgba(31,41,55,0.18)',
                padding: '2rem 2rem 1.5rem 2rem',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="css-j24ftc" style={{ margin: 0 }}>
                  <div className="css-1xh2rw1">
                    <div className="css-anbbrp">Success prediction</div>
                  </div>
                </h2>
                <button
                  aria-label="Close"
                  className="css-g3rqj6"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem'
                  }}
                  onClick={() => setOpenIntakes(null)}
                >
                  ×
                </button>
              </div>
              <div className="css-yyeya1" style={{ margin: '1rem 0 1.5rem 0' }}>
                <p className="css-9fpggw" style={{ color: '#64748b', fontSize: '.98rem' }}>
                  Success prediction by intake, estimated based on ApplyBoard's historical data. We make no representations, warranties, or guarantees as to the information's accuracy.
                </p>
                <div className="css-1xnao7g" style={{ borderTop: '1px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem' }}>
                  {openIntakes.intakes.map((intake: any, idx: number) => (
                    <div key={intake.id || intake.startDate} style={{ marginBottom: '1.2rem', borderBottom: idx !== openIntakes.intakes.length - 1 ? '1px solid #e5e7eb' : 'none', paddingBottom: '.7rem' }}>
                      <button
                        type="button"
                        aria-expanded="true"
                        className="css-1puea8s"
                        style={{
                          background: 'none',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left',
                          padding: 0,
                          marginBottom: '.4rem',
                          fontWeight: 600,
                          fontSize: '1.08rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.2rem'
                        }}
                        tabIndex={0}
                      >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                          <div className="css-1qj0wac">{intake.startDate ? new Date(intake.startDate).toLocaleString('default', { month: 'short', year: 'numeric' }) : ''}</div>
                          <div className="css-1qj0wac">
                            <span className="css-kj0uls" style={{
                              color:
                                intake.overallScore?.value === 'High'
                                  ? 'green'
                                  : intake.overallScore?.value === 'Average'
                                  ? 'orange'
                                  : intake.overallScore?.value === 'Very High'
                                  ? '#2563eb'
                                  : 'red',
                              fontWeight: 700
                            }}>
                              {intake.overallScore?.value}
                            </span>
                          </div>
                        </div>
                        <span className="css-1f6hovf" style={{ marginLeft: 'auto' }}>▼</span>
                      </button>
                      <div className="css-1x4m94a" style={{ marginLeft: '1.2rem', marginTop: '.5rem' }}>
                        {intake.scoreDetails && intake.scoreDetails.map((detail: any) => (
                          <div key={detail.scoreTypeLabel} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem' }}>
                            <div className="css-on9coi" style={{ color: '#64748b' }}>{detail.scoreTypeLabel}</div>
                            <div className="css-on9coi">
                              <span className="css-kj0uls" style={{
                                color:
                                  detail.value === 'High' || detail.value === 'Very High'
                                    ? '#2563eb'
                                    : detail.value === 'Average'
                                    ? 'orange'
                                    : detail.value === 'Low'
                                    ? 'red'
                                    : '#64748b',
                                fontWeight: 600
                              }}>
                                {detail.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '.92rem', marginTop: '.3rem' }}>
                        Submission Deadline: {intake.submissionDeadline ? new Date(intake.submissionDeadline).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="css-h85bax" style={{ marginTop: '1.5rem' }}>
                  <ul aria-labelledby="unordered-list" className="css-trnyj" style={{ color: '#64748b', fontSize: '.95rem', paddingLeft: '1.2rem' }}>
                    <li className="css-9fpggw">Conversion is the historical ratio of accepted applications to submitted applications.</li>
                    <li className="css-9fpggw">Turn Around Time is the expected time to receive a letter of acceptance after submitting an application.</li>
                    <li className="css-9fpggw">Seat Availability is the predicted likelihood of a seat being available for the program intake.</li>
                  </ul>
                </div>
                <div className="css-14tan51" style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                  <button
                    aria-disabled="false"
                    rel="noopener"
                    type="button"
                    className="css-22x0p3"
                    style={{
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '8px',
                      padding: '.7rem 1.5rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setOpenIntakes(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};