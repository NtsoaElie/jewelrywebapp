import os
from fastapi import HTTPException
from dotenv import load_dotenv
from supabase import create_client, Client

#load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    raise ValueError("Supabase credentials missing from env vars")

#initialize reusable global client instance
supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

#define dependency provider for endpoints
def get_supabase():
    try:
        yield supabase_client
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")



