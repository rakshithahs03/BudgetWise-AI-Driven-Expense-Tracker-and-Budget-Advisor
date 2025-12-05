package org.budgetwise.backend.controller;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.ChatRequestDTO;
import org.budgetwise.backend.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    @PostMapping("/ask")
    public String ask(@RequestBody String prompt){
        return aiService.ask(prompt);
    }

    @GetMapping("/suggest/{userId}")
    public ResponseEntity<List<String>> getSuggestions(@PathVariable int userId){
        return ResponseEntity.ok(aiService.generateSuggestions(userId));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody ChatRequestDTO request) {
        String response = aiService.ask(request.getPrompt());
        return ResponseEntity.ok(Map.of("response", response));
    }

    @PostMapping("/chat/{userId}")
    public ResponseEntity<Map<String, String>> chat(
            @PathVariable int userId,
            @RequestBody ChatRequestDTO request
    ) {
        String response = aiService.getChatResponse(userId, request.getPrompt());
        return ResponseEntity.ok(Map.of("response", response));
    }

}
