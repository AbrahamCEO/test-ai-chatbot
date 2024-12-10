import React from 'react';
import { Box, Text } from '@chakra-ui/react';

function ChatMessage({ message }) {
  const isBot = message.type === 'bot';
  
  // Ensure message content is always a string
  const content = typeof message.content === 'string' 
    ? message.content 
    : JSON.stringify(message.content, null, 2);

  return (
    <Box
      mb={4}
      display="flex"
      justifyContent={isBot ? 'flex-start' : 'flex-end'}
    >
      <Box
        maxW="80%"
        bg={isBot ? 'gray.100' : 'blue.500'}
        color={isBot ? 'black' : 'white'}
        p={3}
        borderRadius="lg"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
      >
        <Text>{content}</Text>
      </Box>
    </Box>
  );
}

export default ChatMessage;