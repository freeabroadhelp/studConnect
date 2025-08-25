import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// EdviseConsultants-inspired color palette
const PRIMARY = "#1b2e4b";
const SECONDARY = "#f9b233";
const BG = "#f7f8fa";
const CARD_BG = "#fff";
const TEXT = "#22223b";
const SUBTEXT = "#6c757d";
const BORDER = "#e5e7eb";

const BASE_URL = "https://studconnect-backend.onrender.com";

export const UniversityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No university ID provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/universities/${id}`)
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.detail || "University not found");
          }).catch(() => {
            throw new Error("University not found");
          });
        }
        return res.json();
      })
      .then(data => {
        setUniversity(data);
        setRawResponse(JSON.stringify(data, null, 2));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: "2rem", color: PRIMARY, background: BG }}>Loading...</div>;
  if (error) return <div style={{ padding: "2rem", color: "#dc2626", background: BG }}>{error}</div>;
  if (!university) return <div style={{ padding: "2rem", background: BG }}>University not found.</div>;

  const attrs = university.attributes || {};
  const included = university.included || [];

  // Find accommodation info
  const accommodation = included.find((item: any) => item.type === "school_accommodation_information");
  // Find all school photos
  const photos = included.filter((item: any) => item.type === "school_photo");

  // About/Description field (prefer about, fallback to description)
  const aboutHtml = attrs.about || attrs.description || "";

  // Program categories
  const programCategories = attrs.program_categories || [];

  // Program levels
  const programLevels = attrs.program_levels || [];

  // Key facts
  const keyFacts: { label: string, value: React.ReactNode }[] = [
    attrs.founded_in && { label: "Founded", value: attrs.founded_in },
    attrs.institution_type && { label: "Institution Type", value: attrs.institution_type },
    attrs.designated_learning_institution_no && { label: "Provider ID", value: attrs.designated_learning_institution_no },
    attrs.pgwp_participating !== undefined && { label: "Post-Study Work Visa", value: attrs.pgwp_participating ? "Eligible" : "Not eligible" },
    attrs.coop_participating !== undefined && { label: "Co-op/Internship", value: attrs.coop_participating ? "Available" : "Not available" },
    attrs.can_work_and_study !== undefined && { label: "Work & Study", value: attrs.can_work_and_study ? "Allowed" : "Not allowed" },
    attrs.avg_tuition && { label: "Avg. Tuition", value: `${attrs.currency ? attrs.currency + " " : ""}${attrs.avg_tuition}` },
    attrs.cost_of_living && { label: "Cost of Living", value: `${attrs.currency ? attrs.currency + " " : ""}${attrs.cost_of_living}` },
    attrs.address && { label: "Address", value: attrs.address },
    attrs.postal_code && { label: "Postal Code", value: attrs.postal_code },
  ].filter(Boolean) as { label: string, value: React.ReactNode }[];

  return (
    <main style={{
      maxWidth: 900,
      margin: "2.5rem auto",
      background: CARD_BG,
      borderRadius: 18,
      boxShadow: "0 8px 32px 0 rgba(27,46,75,0.10), 0 1.5px 8px 0 #f9b233",
      padding: "2.5rem 2.5rem 2rem 2.5rem",
      border: `1.5px solid ${BORDER}`,
      fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
      color: TEXT,
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
        {(attrs.logo?.url_thumbnail || attrs.logoThumbnailUrl) && (
          <div style={{
            width: 90, height: 90, borderRadius: 16, background: BG,
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${BORDER}`
          }}>
            <img
              src={attrs.logo?.url_thumbnail || attrs.logoThumbnailUrl}
              alt={attrs.name}
              style={{ width: 70, height: 70, objectFit: 'contain' }}
            />
          </div>
        )}
        <div>
          <h1 style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            margin: 0,
            color: PRIMARY,
            letterSpacing: '-1px'
          }}>{attrs.name || "University Details"}</h1>
          <div style={{ fontSize: "1.15rem", color: SECONDARY, fontWeight: 600, marginTop: ".3rem" }}>
            {[attrs.city, attrs.state, attrs.country].filter(Boolean).join(', ')}
          </div>
        </div>
      </div>

      {/* School Photos Gallery */}
      {photos.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontWeight: 600, color: PRIMARY, marginBottom: ".7rem" }}>Gallery</div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {photos.map((photo: any) => (
              <img
                key={photo.id}
                src={photo.attributes.url}
                alt="School"
                style={{
                  width: 150,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: `1px solid ${BORDER}`,
                  background: BG
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Key Facts */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontWeight: 600, color: PRIMARY, marginBottom: ".7rem" }}>Key Facts</div>
        <dl style={{ fontSize: "1.13rem", lineHeight: "1.7", color: TEXT, margin: 0 }}>
          {keyFacts.map(fact => (
            <div key={fact.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".6rem" }}>
              <dt style={{ fontWeight: 600, color: PRIMARY }}>{fact.label}:</dt>
              <dd style={{ margin: 0 }}>{fact.value}</dd>
            </div>
          ))}
          {attrs.website && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".6rem" }}>
              <dt style={{ fontWeight: 600, color: PRIMARY }}>Website:</dt>
              <dd style={{ margin: 0 }}>
                <a href={attrs.website} target="_blank" rel="noopener noreferrer" style={{
                  color: SECONDARY,
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: "2px"
                }}>{attrs.website}</a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* About/Description */}
      {aboutHtml && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontWeight: 600, color: PRIMARY, marginBottom: ".7rem" }}>About</div>
          <div
            style={{ color: SUBTEXT, fontSize: "1.08rem" }}
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />
        </div>
      )}

      {/* Program Categories */}
      {programCategories.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontWeight: 600, color: PRIMARY, marginBottom: ".7rem" }}>Program Categories</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".7rem" }}>
            {programCategories.map((cat: any) => (
              <span key={cat.name} style={{
                background: BG,
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: ".4rem 1rem",
                fontSize: ".98rem",
                fontWeight: 500
              }}>
                {cat.name} {cat.count ? `(${cat.count})` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Program Levels */}
      {programLevels.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontWeight: 600, color: PRIMARY, marginBottom: ".7rem" }}>Program Levels</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".7rem" }}>
            {programLevels.map((level: string) => (
              <span key={level} style={{
                background: BG,
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: ".4rem 1rem",
                fontSize: ".98rem",
                fontWeight: 500
              }}>
                {level.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Accommodation Info */}
      {accommodation && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontWeight: 600, color: PRIMARY, marginBottom: ".7rem" }}>Accommodation</div>
          <div
            style={{ color: SUBTEXT, fontSize: "1.08rem" }}
            dangerouslySetInnerHTML={{ __html: accommodation.attributes.description }}
          />
        </div>
      )}

      {/* Raw API Response for debugging */}
      <details style={{ marginTop: "2rem", background: "#f3f4f6", borderRadius: 8, padding: "1rem", fontSize: "0.98rem", color: "#334155" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Raw API Response</summary>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {rawResponse}
        </pre>
      </details>
    </main>
  );
};

export default UniversityDetailPage;
