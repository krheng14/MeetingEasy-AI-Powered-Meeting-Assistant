import React, { useState, useEffect } from 'react';
import { Box, Text, Button, VStack, HStack, Spinner } from "@chakra-ui/react";
import SideBar from './Components/SideBar';

const Home = () => {


  const [audioFileName, setAudioFileName] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript1, setTranscript1] = useState('');
  const [transcript2, setTranscript2] = useState('');

  // --------------- Select audio file ---------------------
  const handleFileUpload = async (audioData, purpose) => {
    const formData = new FormData();

    // Check if the audioData is a File (from file upload)
    if (audioData instanceof File) {
        // Direct file upload
        formData.append("file", audioData);
    } else if (audioData instanceof Blob) {
        // Convert the Blob from recording to a File
        const fileFromBlob = new File([audioData], "output.webm", { type: 'audio/webm' });
        formData.append("file", fileFromBlob);
    } else {
        console.error("Unsupported data type for upload");
        return;
    }

    // Add the audio source type (select or record) to the form data
    formData.append("purpose", purpose);

    try {
        const response = await fetch("http://localhost:8000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("Upload Success", data.info);
        console.log("audio_file_name", data.audio_file_name);
        console.log("file_url", data.file_url);

        setAudioFileName(data.audio_file_name);
        setAudioUrl(data.file_url);

      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

  // --------------- API to call for Recording -------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
  
      let chunks = []; // Temporary array to hold chunks
  
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
  
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        if (audioBlob.size > 0) {
          handleFileUpload(audioBlob, 'record'); // Upload the audioBlob to the server
        } else {
          console.error("Recorded audio is empty");
        }
      };
  
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing audio device:', error);
    }
  };
  
  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const handleRecordingClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // --------------- API to call for Transcribing -------------
  const handleTranscription = async (audioFileName) => {
    setIsTranscribing(true);
    
    const transcript_response = await fetch('http://localhost:8000/api/transcriber', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio_name: audioFileName }),
    });
    const transcript_data = await transcript_response.json();
    console.log('message', transcript_data.message, 'transcript1', transcript_data.transcript1, 'transcript2', transcript_data.transcript2);  
    setTranscript1(transcript_data.transcript1);
    setTranscript2(transcript_data.transcript2);

    setIsTranscribing(false);
  }


  return (
    <HStack w='100vw' h='100vh'>

        <SideBar 
            handleFileUpload={handleFileUpload}
            isRecording={isRecording}
            handleRecordingClick={handleRecordingClick}
            audioFileName={audioFileName}
            audioUrl={audioUrl}
            isTranscribing={isTranscribing}
            handleTranscription={handleTranscription}
        />
        
        <VStack w='75%' h='100%' m={2} overflowY='scroll'>
            {audioUrl && 
                <>
                    <Text w='100%' m={5} pb='15px'>
                        <Box as="span" fontWeight="bold">Original Transcript: </Box>  {transcript1}
                    </Text>
                    <Text w='100%' m={5}>
                        <Box as="span" fontWeight="bold">Translation: </Box> 
                        {transcript2}
                    </Text>
                </>
            }
        </VStack>
    </HStack>
  );
};

export default Home;
