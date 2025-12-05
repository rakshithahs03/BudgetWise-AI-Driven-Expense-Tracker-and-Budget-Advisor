package org.budgetwise.backend.service;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.ForumCommentDTO;
import org.budgetwise.backend.dto.ForumPostDTO;
import org.budgetwise.backend.model.ForumComment;
import org.budgetwise.backend.model.ForumPost;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.ForumCommentRepository;
import org.budgetwise.backend.repository.ForumPostRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final ForumPostRepository forumPostRepository;
    private final ForumCommentRepository forumCommentRepository; // ✅ Add this
    private final UserRepository userRepository;

    public List<ForumPostDTO> getAllPosts() {
        return forumPostRepository.findAll().stream()
                .map(ForumPostDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ForumPostDTO createPost(ForumPost post, String username) {
        User author = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        post.setAuthor(author);
        ForumPost savedPost = forumPostRepository.save(post);
        return ForumPostDTO.fromEntity(savedPost);
    }

    // ✅ ADD THIS METHOD
    public ForumPostDTO getPostById(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
        return ForumPostDTO.fromEntity(post);
    }

    // ✅ ADD THIS METHOD
    public ForumCommentDTO addCommentToPost(Long postId, ForumComment comment, String username) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
        User author = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        comment.setPost(post);
        comment.setAuthor(author);

        ForumComment savedComment = forumCommentRepository.save(comment);
        return ForumCommentDTO.fromEntity(savedComment);
    }
}