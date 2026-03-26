from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, database, models
from ..oauth2 import get_current_user
from typing import List

router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"]
)

get_db = database.get_db

@router.post("/favorite/{property_id}")
def add_favorite(property_id:int,
                db:Session = Depends(get_db),
                current_user: schemas.User = Depends(get_current_user)):

    user = db.query(models.User).filter(models.User.email == current_user.email).first()

    new_favorite = models.Favorite(user_id = user.id, property_id= property_id)
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

@router.delete("/remove_favorite/{property_id}")
def remove_favorite(property_id:int,
                    db:Session = Depends(get_db),
                    current_user: schemas.User = Depends(get_current_user)):

    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    favorite = db.query(models.Favorite).filter(models.Favorite.user_id == user.id, models.Favorite.property_id == property_id).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(favorite)
    db.commit()
    return {"message": "Favorite removed successfully"}

@router.get("/show_favorite", response_model=List[schemas.ShowFavorite])
def get_favorites(db:Session = Depends(get_db),
                  current_user: schemas.User = Depends(get_current_user)):

    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    return user.favorites

