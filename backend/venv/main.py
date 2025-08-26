from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "¡Hola desde FastAPI!"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"¡Hola, {name}!"}