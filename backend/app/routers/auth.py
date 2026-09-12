from fastapi import APIRouter, Depends
from app.dependencies import get_current_admin_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
def read_me(admin = Depends(get_current_admin_user)):
    return {"id": admin["sub"], "email": admin["email"]}