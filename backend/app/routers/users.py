from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, database, models, hashing
from ..oauth2 import get_current_user

get_db = database.get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model= schemas.ShowUser)
def show_me(db:Session = Depends(get_db),
            current_user: schemas.User = Depends(get_current_user)):
    
    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    return user

@router.post("/register")
def register_user(request: schemas.UserRegister,
                  db:Session = Depends(get_db)):
    
    hashed_password = hashing.hash_password(request.password)
    new_user = models.User(name=request.name, email=request.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
