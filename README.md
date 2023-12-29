# MeetingEasy-AI-Powered-Meeting-Assistant

AI-powered web app for efficient meeting management, featuring advanced audio transcription, speaker diarization, and insightful analysis of discussions to highlight key points and actionable items using Whisper models and LLMs.

## Features

- **Audio Transcription**: Converts spoken words in meetings into accurate text using Whisper models.
- **Insightful Analysis** (In Progress): Analyzes the transcribed text to extract key points and actionable items using GPT-4.
- **Speaker Diarization** (In Progress): Identifies individual speakers in the meeting to attribute text correctly (coming soon).
- **Interactive UI** (In Progress): Easy-to-use interface for managing and reviewing meetings.

## Technology Stack

- **Frontend**: Developed with Vite and React.
- **Backend**: Python with FastAPI.
- **AI Models**: OpenAI's Whisper model for transcription and translation; GPT-4 for generating insights from transcribed text.

## Getting Started

### Prerequisites

- Node.js and npm (for the frontend)
- Python 3.x (for the backend)
- Access to OpenAI's Whisper and GPT-4 models

### Installation

**Clone the Repository**:

```bash
git clone https://github.com/[your-github-username]/MeetingEasy-AI-Powered-Meeting-Assistant.git
```

**Frontend Setup**:

- Navigate to the frontend directory:

```bash
cd MeetingEasy-AI-Powered-Meeting-Assistant/app
```

- Install dependencies:

```bash
npm install
```

- Start the development server:

```bash
npm run dev
```

**Backend Setup**:

- Navigate to the backend directory:

```bash
cd MeetingEasy-AI-Powered-Meeting-Assistant/api
```

- Install Python dependencies:

```bash
pip install -r requirements.txt
```

- Start the FastAPI server:

```bash
uvicorn main:APP --reload
```

### Configuration

Set up your .env files in both the frontend and backend directories with the necessary API keys and endpoints.

### Usage

- **Record or Upload Audio**: Start a meeting and record the conversation, or upload an existing audio file.
- **Transcription**: Convert the recorded or uploaded audio into text.
- **Analysis**: Submit the transcript to the LLM (GPT-4) to extract insights and action items.
- **Review**: Check the extracted information and use it for meeting summaries or follow-up actions.
