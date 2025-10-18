from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from src.api.v1.endpoint import router

# Initialize FastAPI app
app = FastAPI(
    title="My Projects API",
    description="A FastAPI-based API for managing projects",
    version="1.0.0"
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
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
