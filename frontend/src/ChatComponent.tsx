import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import SockJS from "sockjs-client";
import { Client, type IMessage } from "@stomp/stompjs";

interface ChatMessage {
    sender: string;
    content: string;
}

const ChatComponent: React.FC = () => {
  // State for the message list and current input
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  
  // Use a ref to persist the STOMP client without triggering re-renders
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // 1. Initialize Connection
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/chat'),
      reconnectDelay: 5000, // Auto-reconnect if server goes down
      onConnect: () => {
        console.log('Connected');
        
        // 2. Subscribe to Topic
        client.subscribe('/topic/messages', (message: IMessage) => {
          const receivedMsg: ChatMessage = JSON.parse(message.body);
          // Append new message to the list
          setMessages((prev) => [...prev, receivedMsg]);
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    // 3. Cleanup on unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClientRef.current && stompClientRef.current.connected && inputValue.trim()) {
      const chatMessage: ChatMessage = {
        sender: "User", // You can replace this with actual auth logic later
        content: inputValue,
      };

      // 4. Send Message
      stompClientRef.current.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(chatMessage),
      });

      setInputValue(""); // Clear input after sending
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chat Room</h2>
      
      {/* Messages List */}
      <ul id="messages" style={{ border: '1px solid #ccc', height: '200px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </li>
        ))}
      </ul>

      {/* Input Field */}
      <input 
        type="text" 
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;