from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, Depends
from app.config import jwks_url

bearer_scheme = HTTPBearer()
assert jwks_url is not None, "SUPABASE_JWKS_URL is not set"
jwks_client = PyJWKClient(jwks_url)

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = creds.credentials

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="expired signature error")

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="invalid token error")

    except jwt.PyJWKClientError:
        raise HTTPException(status_code=401, detail="PyJWK client error")

    return payload

def get_current_admin_user(user = Depends(get_current_user)):
    #the user is the payload dict returned by get_current_user()

    #1. pull role out - payload["app_metadata"]["role"], defensively
    role = user.get("app_metadata", {}).get("role")
    #2. if the role is not admin raise 403, unauthorized
    if role != "admin":
        raise HTTPException(status_code=403, detail="this user is not allowed")
    return user

    
