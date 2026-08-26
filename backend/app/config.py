import os
from dotenv import load_dotenv

#load variables from .env file in the environment

load_dotenv()

db_url = os.getenv("SUPABASE_URL")
api_key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
secret_key = os.getenv("SUPABASE_SECRET_KEY")
jwks_url = os.getenv("SUPABASE_JWKS_URL")

