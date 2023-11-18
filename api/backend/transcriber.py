import os 
import threading
from fastapi import APIRouter, File, UploadFile
from fastapi import Form
from pathlib import Path
import pydantic
from pydantic import BaseModel
from dotenv import load_dotenv

# LLM Model
from openai import OpenAI
import whisper
import subprocess

# Sound Transcript Libraries
import sounddevice as sd
from IPython.display import Audio
from scipy.io.wavfile import write
import numpy as np



router = APIRouter()

# Load environment variables from .env file
load_dotenv('/Users/kimrui/aiap-projects/MeetingEasy/MeetingEasy/api/.env')
# Get API key from environment variable
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()
model = whisper.load_model("medium")

# ---------------- Helper function for file name creation ---------------
def get_unique_filename(filepath):
    """ Get a unique filename"""

    dirname, filename = os.path.split(filepath)
    filename_no_ext, ext = os.path.splitext(filename)
    counter = 1

    while os.path.exists(filepath):
        filepath = os.path.join(dirname, f"{filename_no_ext}_{counter}{ext}")
        counter += 1

    return filepath


audio_file_path = '/Users/kimrui/aiap-projects/MeetingEasy/MeetingEasy/api/audio_files/'
# ================ APIs for uploading file to backend ===========
@router.post("/api/upload") #Need cloud storage
async def upload_file(file: UploadFile = File(...), purpose: str = Form(...)):
    print(file.filename)
    # Write uploaded user audio file to location
    if purpose == 'select':
        file_location = os.path.join(audio_file_path, file.filename)
    else: #for purpose == 'record'
        file_location = get_unique_filename(os.path.join(audio_file_path, file.filename))

    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    # # File conversion to mp3
    # mp3_filename = get_unique_filename(file_location.replace('.webm', '.mp3'), overwrite=True)
    # subprocess.run(['ffmpeg', '-i', file_location, mp3_filename])

    # Convert file system path to file url path
    file_url = file_location.replace(audio_file_path, "http://localhost:8000/static/")

    return {"info": f"file '{file.filename}' saved at '{file_location}'", "audio_file_name": file_location, "file_url": file_url}


# ================ APIs for transcription ==================
class TranscriptionRequest(pydantic.BaseModel):
    """ 
    Defining data type of response from frontend for transcription
    """
    audio_name: str
@router.post("/api/transcriber")
def transcriber(response: TranscriptionRequest):
    audio_file_name = response.audio_name
    print(audio_file_name)
    audio_file = open(audio_file_name, "rb")

    #transcription creation ------------------
    transcript1 = client.audio.transcriptions.create(
        model="whisper-1", 
        file=audio_file, 
        response_format="text"
    )

    # detect the spoken language ------------- (Heavy)
    # load audio and pad/trim it to fit 30 seconds
    audio = whisper.load_audio(audio_file_name)
    audio = whisper.pad_or_trim(audio)
    # make log-Mel spectrogram and move to the same device as the model
    mel = whisper.log_mel_spectrogram(audio).to(model.device)
    # using whisper v3 model to detect language
    _, probs = model.detect_language(mel)
    detected_language = max(probs, key=probs.get)
    print('Detected language:', detected_language)

    #translation creation --------------------
    if detected_language != 'en':
        transcript2 = client.audio.translations.create(
            model="whisper-1", 
            file=audio_file, 
            response_format="text"
        )
    else:
        transcript2 = 'English language detected. Translation skipped.'

    return {"message": "Transcription stopped", "transcript1": transcript1, "transcript2": transcript2}