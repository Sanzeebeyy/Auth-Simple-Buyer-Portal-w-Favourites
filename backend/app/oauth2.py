from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from .token import verify_access_token
from .schemas import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(oauth2token:str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code = 401,
        detail="Could not validate credentials"
    )
    return verify_access_token(oauth2token, credentials_exception)