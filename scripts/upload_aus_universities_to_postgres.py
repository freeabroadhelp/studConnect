import json
import psycopg2
from psycopg2.extras import execute_values
import os

# Load JSON data
with open('/Users/partimajain/studConnect/backend/data/Australian_Universities.json', encoding='utf-8') as f:
    universities = json.load(f)

# Database connection config from environment variables
PG_CONN = {
    'host': os.environ.get('PGHOST', 'localhost'),
    'port': int(os.environ.get('PGPORT', 5432)),
    'dbname': os.environ.get('PGDATABASE', 'your_db_name'),
    'user': os.environ.get('PGUSER', 'your_db_user'),
    'password': os.environ.get('PGPASSWORD', 'your_db_password')
}

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS all_universities (
    id SERIAL PRIMARY KEY,
    name TEXT,
    state TEXT,
    location TEXT,
    type TEXT,
    networks TEXT,
    established INTEGER,
    latest_rankings JSONB,
    official_website TEXT,
    official_email TEXT,
    popular_for_international_students TEXT[],
    levels_offered TEXT[],
    intakes TEXT[],
    mode_of_study TEXT[],
    scholarships_highlight TEXT[],
    tuition_fees_per_year JSONB,
    living_costs_annual_AUD NUMERIC,
    application_fee_range_AUD TEXT,
    international_student_support TEXT[],
    campus_life JSONB,
    admission_requirements JSONB,
    why_choose TEXT[]
);
"""

def to_pg_array(val):
    return val if isinstance(val, list) else []

# Prepare data for insertion
rows = []
for uni in universities:
    rows.append((
        uni.get('name'),
        uni.get('state'),
        uni.get('location'),
        uni.get('type'),
        uni.get('networks'),
        uni.get('established'),
        json.dumps(uni.get('latest_rankings')) if uni.get('latest_rankings') else None,
        uni.get('official_website'),
        uni.get('official_email'),
        to_pg_array(uni.get('popular_for_international_students')),
        to_pg_array(uni.get('levels_offered')),
        to_pg_array(uni.get('intakes')),
        to_pg_array(uni.get('mode_of_study')),
        to_pg_array(uni.get('scholarships_highlight')),
        json.dumps(uni.get('tuition_fees_per_year')) if uni.get('tuition_fees_per_year') else None,
        uni.get('living_costs_annual_AUD'),
        uni.get('application_fee_range_AUD'),
        to_pg_array(uni.get('international_student_support')),
        json.dumps(uni.get('campus_life')) if uni.get('campus_life') else None,
        json.dumps(uni.get('admission_requirements')) if uni.get('admission_requirements') else None,
        to_pg_array(uni.get('why_choose'))
    ))

INSERT_SQL = """
INSERT INTO all_universities (
    name, state, location, type, networks, established, latest_rankings, official_website, official_email,
    popular_for_international_students, levels_offered, intakes, mode_of_study, scholarships_highlight,
    tuition_fees_per_year, living_costs_annual_AUD, application_fee_range_AUD, international_student_support,
    campus_life, admission_requirements, why_choose
) VALUES %s
ON CONFLICT (name) DO NOTHING;
"""

conn = psycopg2.connect(**PG_CONN)
cur = conn.cursor()
cur.execute(CREATE_TABLE_SQL)
execute_values(
    cur, INSERT_SQL, rows,
    template="""(
        %s, %s, %s, %s, %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s,
        %s, %s, %s, %s,
        %s, %s, %s
    )"""
)
conn.commit()
cur.close()
conn.close()
