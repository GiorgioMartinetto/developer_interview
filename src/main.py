from contextlib import asynccontextmanager
from src.log.logger import setup_logger
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from src.api.v1.users_endpoint import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logger()
    logger.success("🚀 Avvio dell'applicazione...")
    yield


# Initialize FastAPI app
app = FastAPI(
    title="My Projects API",
    description="A FastAPI-based API for managing projects",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to My Projects API"}


def main():
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    main()
