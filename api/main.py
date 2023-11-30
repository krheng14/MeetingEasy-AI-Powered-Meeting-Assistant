
import fastapi
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import backend
from backend import transcriber


# ========== START - SETTING UP FASTAPI APP ========== #
APP = fastapi.FastAPI(
    title=backend.config.SETTINGS.API_NAME,  # just for the title of localhost:8000/docs
    # lifespan=lifespan,
)

ORIGINS = ["*"]

APP.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,  # allow frontend to get responses from backend even when no crediential is provided so long the CORS headers are returned by backend permitting the origin of the request.
    allow_methods=["*"],  # HTTP methods (like GET, POST, DELETE, etc.) are all allowed.
    allow_headers=[
        "*"
    ],  # allows any headers to make request. e.g http://localhost:3000/chat chat is the header.
)

APP.mount("/static", StaticFiles(directory="/Users/kimrui/aiap-projects/MeetingEasy/MeetingEasy/api/audio_files/"), name="static")

APP.include_router(transcriber.router)