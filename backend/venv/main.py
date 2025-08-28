from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

# --- Configuración de la Base de Datos ---
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://skill_user:tu_contraseña_postgres@localhost/skill_exchange_db"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Definición del Modelo de Base de Datos (Tabla de Usuarios) ---
class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    skills_offered = Column(Text)  # Guardaremos como texto separado por comas por ahora
    skills_sought = Column(Text)   # Guardaremos como texto separado por comas por ahora

# --- Crear las tablas en la base de datos ---
Base.metadata.create_all(bind=engine)

# --- Modelos Pydantic para la API ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    skills_offered: list[str]
    skills_sought: list[str]

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    skills_offered: str  # Se devuelve como string
    skills_sought: str   # Se devuelve como string

    class Config:
        orm_mode = True  # Permite que Pydantic lea directamente de un modelo ORM

app = FastAPI()

# --- Configuración CORS ---
origins = [
    "http://localhost",
    "http://localhost:3000",  # Puerto donde corre tu aplicación React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependencia para obtener la sesión de la base de datos ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Endpoints de la API ---
@app.get("/")
async def read_root():
    return {"message": "¡Hola desde FastAPI!"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"¡Hola, {name}!"}

@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = DBUser(
        name=user.name,
        email=user.email,
        skills_offered=", ".join(user.skills_offered),
        skills_sought=", ".join(user.skills_sought)
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear usuario: {e}")

@app.get("/users/", response_model=list[UserResponse])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(DBUser).offset(skip).limit(limit).all()
    return users