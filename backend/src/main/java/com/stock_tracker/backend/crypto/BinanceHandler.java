package com.stock_tracker.backend.crypto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class BinanceHandler  extends TextWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public BinanceHandler(SimpMessagingTemplate messagingTemplate, tools.jackson.databind.ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 1. Get the raw JSON from Binance
        String payload = message.getPayload();
        System.out.println("Connected to Binance!");
        Thread.sleep(10000);

        // 3. Push it to your React app via the internal STOMP broker
        messagingTemplate.convertAndSend("/topic/prices", payload);
    }

}
