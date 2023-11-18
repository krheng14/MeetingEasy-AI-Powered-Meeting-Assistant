import React from 'react';
import { useFileUpload } from 'use-file-upload';
import { Input, HStack, VStack, Box, Button, Text, Spinner } from '@chakra-ui/react';


const SideBar = ({ handleFileUpload, isRecording, handleRecordingClick, audioFileName, audioUrl, isTranscribing, handleTranscription}) => {

  const [file, selectFile] = useFileUpload();
  const onSelectFile = () => {
    selectFile({ accept: 'all' }, (file) => {
      handleFileUpload(file.file, 'select');
    });
  };

  return (
    <VStack h='100%' w='25%'>
      
      {/* Selecting an audio file to do transcription directly */}
      <Box w="100%" h='12%' textAlign="center" bg='gray.100'>
        <Box ml={4} mt={4} textAlign='center' fontWeight="bold">Select audio file for direct transcription </Box>
        <Button 
        m={4}
        colorScheme='yellow'
        variant='solid'
        _hover={{ borderColor: 'yellow.300', bg: 'yellow.300' }}
        onClick={onSelectFile}
        isDisabled={isRecording}
      >
          Select File
        </Button>
      </Box>

      
      <Box w="100%" h='12%' textAlign="center" bg='gray.300' >
        {/* Recording of meeting */}
        <Box ml={4} mt={4} mb={2} textAlign='center' fontWeight="bold"> Direct Recording & Upload 
        </Box>
        <Button 
          m={2}
          variant={isRecording ? 'outline' : 'solid'}
          colorScheme='blue'
          {...(!isRecording ? { _hover: { borderColor: 'blue.600', bg: 'blue.600' }}:{_hover:{bg: 'blue.100'}})}
          onClick={handleRecordingClick}
          isDisabled={isTranscribing}
        >
        <HStack spacing={2}>
            {isRecording && <Spinner size="sm" />}
            <Text>
                {isRecording ? "Stop Recording" : "Start Recording"}
            </Text>
        </HStack>
        </Button>
      </Box>

      {/* Transcription */}
      <Box w="100%" h='76%' textAlign="center" bg='gray.400' >
        <Box ml={4} mt={4} mb={2} textAlign='center' fontWeight="bold"> Start Transcription of Audio File
        </Box>
        <Button 
          mt={2}
          mb={2}
          variant={isTranscribing ? 'outline' : 'solid'}
          colorScheme="teal" 
          {...(!isTranscribing ? { _hover: { borderColor: 'teal.600', bg: 'teal.600' }}:{_hover:{bg: 'teal.100'}})}
          onClick={() => handleTranscription(audioFileName)}
          isDisabled={!audioFileName || isTranscribing || isRecording}
        >
          <HStack spacing={2}>
            {isTranscribing && <Spinner size="sm" />}
            <Text>
                {isTranscribing ? "Transcribing In Progress" : "Start Transcribing"}
            </Text>
          </HStack>
        </Button>
        <VStack 
          mt={2} 
          w="100%"
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
        >
          {audioUrl && <audio style={{ mt: '20px' }} src={audioUrl} controls />}
          {audioFileName && (
            <Text mt={2} w='100%'>File: {audioFileName.split('/').pop()}</Text>)
          }
        </VStack>
      </Box>

    </VStack>
  );
};

export default SideBar;
