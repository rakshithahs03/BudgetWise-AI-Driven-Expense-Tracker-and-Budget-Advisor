package org.budgetwise.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
class AIConfiguration {

    private final OllamaChatModel ollamaChatModel;

    @Bean
    public ChatClient chatClient() {
        return ChatClient.create(ollamaChatModel);
    }
}
