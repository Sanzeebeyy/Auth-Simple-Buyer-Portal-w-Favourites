from pydantic import BaseModel, EmailStr

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    class Config:
        orm_mode = True

class ShowUser(BaseModel):
    name: str
    email: EmailStr
    class Config:
        orm_mode = True

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    class Config:
        orm_mode = True

class ShowFavorite(BaseModel):
    user_id: int
    property_id: int

    class Config:
        orm_mode = True

class TokenData(BaseModel):
    email: EmailStr
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    class Config:
        orm_mode = True