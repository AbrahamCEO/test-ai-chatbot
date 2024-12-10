import React, { useState, useEffect, useRef } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Container,
  Input,
  Button,
  Text,
  useToast
} from '@chakra-ui/react';
import io from 'socket.io-client';
import ChatMessage from './components/ChatMessage';

// Initialize socket connection
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Socket connection handlers
    const onConnect = () => {
      setIsConnected(true);
      toast({
        title: 'Connected',
        description: 'Successfully connected to the server',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      toast({
        title: 'Disconnected',
        description: 'Lost connection to the server',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    };

    const onBotResponse = (response) => {
      setMessages(prev => [...prev, response]);
    };

    const onError = (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    };

    // Socket event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('bot response', onBotResponse);
    socket.on('error', onError);

    // Cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('bot response', onBotResponse);
      socket.off('error', onError);
    };
  }, [toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { type: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      socket.emit('chat message', input);
      setInput('');
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.md" h="100vh" py={4}>
        <VStack h="full" spacing={4}>
          <Box
            flex={1}
            w="full"
            overflowY="auto"
            borderRadius="md"
            borderWidth={1}
            p={4}
            bg="gray.50"
          >
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </Box>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box display="flex" gap={2}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={!isConnected}
                bg="white"
              />
              <Button 
                type="submit" 
                colorScheme="blue" 
                isDisabled={!isConnected || !input.trim()}
              >
                Send
              </Button>
            </Box>
          </form>
          
          <Text fontSize="sm" color={isConnected ? "green.500" : "red.500"}>
            {isConnected ? "Connected to server" : "Disconnected from server"}
          </Text>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}