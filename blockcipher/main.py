from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from blockcipher.router import ecb

app = FastAPI(
    title="API Tugas Besar 3 IF4020",
    description="API Tugas Besar 3 IF4020",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(ecb.router)

@app.get("/")
def read_root(request: Request):
    return {"message": "Tugas Besar 3 IF4020"}