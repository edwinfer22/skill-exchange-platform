from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

 # Define el modelo de datos para el usuario que se va a crear
class UserCreate(BaseModel):
     name: str
     email: str
     skills_offered: list[str]
     skills_sought: list[str]

app = FastAPI()

 # Configuración CORS para permitir solicitudes desde tu frontend de React
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

@app.get("/")
async def read_root():
     return {"message": "¡Hola desde FastAPI!"}

@app.get("/hello/{name}")
async def say_hello(name: str):
     return {"message": f"¡Hola, {name}!"}

# Nuevo endpoint para crear usuarios
@app.post("/users/")
async def create_user(user: UserCreate):
     # Aquí es donde normalmente guardarías el usuario en una base de datos
     print(f"Usuario recibido: {user.name}, {user.email}")
     print(f"Habilidades ofrecidas: {user.skills_offered}")
     print(f"Habilidades buscadas: {user.skills_sought}")
     return {"message": "Usuario creado con éxito", "user_data": user.dict()}