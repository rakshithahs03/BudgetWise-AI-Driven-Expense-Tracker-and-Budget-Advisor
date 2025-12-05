package org.budgetwise.backend.controller;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.ForumCommentDTO;
import org.budgetwise.backend.dto.ForumPostDTO;
import org.budgetwise.backend.model.ForumComment;
import org.budgetwise.backend.model.ForumPost;
import org.budgetwise.backend.service.ForumService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;

    @GetMapping("/posts")
    public ResponseEntity<List<ForumPostDTO>> getAllPosts() {
        return ResponseEntity.ok(forumService.getAllPosts());
    }

    // ✅ ADD THIS ENDPOINT
    @GetMapping("/posts/{postId}")
    public ResponseEntity<ForumPostDTO> getPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(forumService.getPostById(postId));
    }

    @PostMapping("/posts")
    public ResponseEntity<ForumPostDTO> createPost(@RequestBody ForumPost post, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(forumService.createPost(post, username));
    }

    // ✅ ADD THIS ENDPOINT
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<ForumCommentDTO> addComment(
            @PathVariable Long postId,
            @RequestBody ForumComment comment, // Spring will map the "content" field from JSON
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(forumService.addCommentToPost(postId, comment, username));
    }
}