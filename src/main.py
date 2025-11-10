from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from src.api.v1.cetegory_endpoints import category_router
from src.api.v1.product_endpoint import product_router
from src.llm.llm_factory import setup_llm
from src.log.logger import setup_logger
from src.models.response_models import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logger()
    setup_llm()
    logger.success("🚀 Avvio dell'applicazione...")
    yield


# Initialize FastAPI app
app = FastAPI(
    title="SGR Products APP",
    description="Application to manage products",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=product_router)
app.include_router(router=category_router)

@app.get("/health_check/",
         status_code=status.HTTP_200_OK,
         response_model=HealthResponse)
def health_check():
    return HealthResponse(
        message="The server is up and running"
    )


def main():
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    main()
