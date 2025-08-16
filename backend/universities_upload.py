import os
import csv
import requests
import boto3
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import json
from db import Base, engine, get_db
from sqlalchemy import text


load_dotenv()

Base.metadata.create_all(bind=engine)

DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    raise RuntimeError("DATABASE_URL is not set. Please check your environment variables.")

R2_BUCKET = os.environ.get("R2_BUCKET")
R2_ACCESS_KEY = os.environ.get("R2_ACCESS_KEY")
R2_SECRET_KEY = os.environ.get("R2_SECRET_KEY")
R2_ENDPOINT = os.environ.get("R2_ENDPOINT")
R2_PUBLIC_URL = os.environ.get("R2_PUBLIC_URL")
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend/data/universities_v4.csv")

session = boto3.session.Session()
r2 = session.client(
    service_name="s3",
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    endpoint_url=R2_ENDPOINT,
)

def upload_to_r2(url, key):
    try:
        r2.head_object(Bucket=R2_BUCKET, Key=key)
        return f"{R2_PUBLIC_URL}/{key}"
    except r2.exceptions.ClientError as e:
        if int(e.response['Error']['Code']) != 404:
            raise
    resp = requests.get(url)
    if resp.status_code != 200:
        raise Exception(f"Failed to fetch image: {url}")
    r2.put_object(
        Bucket=R2_BUCKET,
        Key=key,
        Body=resp.content,
        ContentType=resp.headers.get("content-type", "application/octet-stream"),
        ACL="public-read"
    )
    return f"{R2_PUBLIC_URL}/{key}"

def ensure_universities_table():
    with engine.connect() as conn:
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS public.universities (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            url TEXT,
            country TEXT,
            province TEXT,
            thumbnail TEXT,
            average_tuition TEXT,
            average_tuition_currency TEXT,
            logo TEXT,
            type TEXT,
            number_of_students TEXT,
            international_students TEXT,
            university_type TEXT,
            number_of_academician TEXT,
            erasmus TEXT,
            scholarship_ratio TEXT,
            urap_standings TEXT,
            placement_rate TEXT,
            technology_office TEXT,
            student_academician TEXT,
            entrepreneurship_index_score TEXT,
            library_area TEXT,
            ar_ge_expense TEXT,
            programs TEXT,
            features TEXT,
            address TEXT,
            thumbnail_r2 TEXT,
            logo_r2 TEXT,
            UNIQUE(name, country)
        );
        """))
        conn.commit()
        
def upsert_university(db: Session, row, thumbnail_r2, logo_r2):
    def safe(row, key):
        return row.get(key) or row.get(key.replace("_", " ").title()) or None

    db.execute(
    text("""
    INSERT INTO universities (
        name, url, country, province, thumbnail, thumbnail_r2,
        logo, logo_r2, average_tuition, average_tuition_currency, type,
        number_of_students, international_students, university_type,
        number_of_academician, erasmus, scholarship_ratio, urap_standings,
        placement_rate, technology_office, student_academician,
        entrepreneurship_index_score, library_area, ar_ge_expense,
        programs, features, address
    ) VALUES (
        :name, :url, :country, :province, :thumbnail, :thumbnail_r2,
        :logo, :logo_r2, :average_tuition, :average_tuition_currency, :type,
        :number_of_students, :international_students, :university_type,
        :number_of_academician, :erasmus, :scholarship_ratio, :urap_standings,
        :placement_rate, :technology_office, :student_academician,
        :entrepreneurship_index_score, :library_area, :ar_ge_expense,
        :programs, :features, :address
    )
    ON CONFLICT (name, country)
    DO UPDATE SET
        url=EXCLUDED.url,
        province=EXCLUDED.province,
        thumbnail=EXCLUDED.thumbnail,
        thumbnail_r2=EXCLUDED.thumbnail_r2,
        logo=EXCLUDED.logo,
        logo_r2=EXCLUDED.logo_r2,
        average_tuition=EXCLUDED.average_tuition,
        average_tuition_currency=EXCLUDED.average_tuition_currency,
        type=EXCLUDED.type,
        number_of_students=EXCLUDED.number_of_students,
        international_students=EXCLUDED.international_students,
        university_type=EXCLUDED.university_type,
        number_of_academician=EXCLUDED.number_of_academician,
        erasmus=EXCLUDED.erasmus,
        scholarship_ratio=EXCLUDED.scholarship_ratio,
        urap_standings=EXCLUDED.urap_standings,
        placement_rate=EXCLUDED.placement_rate,
        technology_office=EXCLUDED.technology_office,
        student_academician=EXCLUDED.student_academician,
        entrepreneurship_index_score=EXCLUDED.entrepreneurship_index_score,
        library_area=EXCLUDED.library_area,
        ar_ge_expense=EXCLUDED.ar_ge_expense,
        programs=EXCLUDED.programs,
        features=EXCLUDED.features,
        address=EXCLUDED.address
    """),
    {
        "name": safe(row, "name"),
        "url": safe(row, "url"),
        "country": safe(row, "country"),
        "province": safe(row, "province"),
        "thumbnail": safe(row, "thumbnail"),
        "thumbnail_r2": thumbnail_r2,
        "logo": safe(row, "logo"),
        "logo_r2": logo_r2,
        "average_tuition": safe(row, "average_tuition"),
        "average_tuition_currency": safe(row, "average_tuition_currency"),
        "type": safe(row, "type"),
        "number_of_students": safe(row, "number_of_students"),
        "international_students": safe(row, "international_students"),
        "university_type": safe(row, "university_type"),
        "number_of_academician": safe(row, "number_of_academician"),
        "erasmus": safe(row, "erasmus"),
        "scholarship_ratio": safe(row, "scholarship_ratio"),
        "urap_standings": safe(row, "urap_standings"),
        "placement_rate": safe(row, "placement_rate"),
        "technology_office": safe(row, "technology_office"),
        "student_academician": safe(row, "student_academician"),
        "entrepreneurship_index_score": safe(row, "entrepreneurship_index_score"),
        "library_area": safe(row, "library_area"),
        "ar_ge_expense": safe(row, "ar_ge_expense"),
        "programs": json.dumps(safe(row, "programs"), ensure_ascii=False),
        "features": json.dumps(safe(row, "features"), ensure_ascii=False),
        "address": safe(row, "address")
    }
)


def upload_universities():
    print("Connecting to database...")
    with get_db() as db:
        print("Ensuring universities table exists...")
        ensure_universities_table()
        with open(CSV_PATH, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for i, row in enumerate(reader, 1):
                if not row.get("name") or row["name"].strip().lower() == "name":
                    continue
                thumbnail_r2 = None
                logo_r2 = None
                if row.get("thumbnail"):
                    ext = row["thumbnail"].split(".")[-1].split("?")[0]
                    key = f"thumbnails/{row['name'].replace(' ','_')}.{ext}"
                    try:
                        thumbnail_r2 = upload_to_r2(row["thumbnail"], key)
                    except Exception as e:
                        print(f"Thumbnail upload failed for {row['name']}: {e}")
                if row.get("logo"):
                    ext = row["logo"].split(".")[-1].split("?")[0]
                    key = f"logos/{row['name'].replace(' ','_')}.{ext}"
                    try:
                        logo_r2 = upload_to_r2(row["logo"], key)
                    except Exception as e:
                        print(f"Logo upload failed for {row['name']}: {e}")

                try:
                    upsert_university(db, row, thumbnail_r2, logo_r2)
                except Exception as e:
                    print(f"Upsert failed for {row['name']}: {e}")
                if i % 10 == 0:
                    db.commit()
                print("Upserted:", row["name"])
        db.commit()
        print("Committed changes to DB.")
    print("Done.")

