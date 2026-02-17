package com.stock_tracker.backend.crypto;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import tools.jackson.databind.ObjectMapper;

@Service
public class BinanceService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public BinanceService(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void connect() {
        WebSocketClient client = new StandardWebSocketClient();

        // Pass the messagingTemplate and objectMapper to your handler
        BinanceHandler handler = new BinanceHandler(messagingTemplate, objectMapper);

        // The URL for a single coin (e.g., BTC/USDT)
        String url = "wss://stream.binance.com:9443/ws/btcusdt@ticker";

        client.execute(handler, url);
    }

}
