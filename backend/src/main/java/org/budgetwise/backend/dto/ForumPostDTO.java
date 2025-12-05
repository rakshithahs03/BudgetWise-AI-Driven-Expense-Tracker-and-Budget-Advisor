package org.budgetwise.backend.dto;

import lombok.Data;
import org.budgetwise.backend.model.ForumPost;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ForumPostDTO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private AuthorDTO author;
    private List<ForumCommentDTO> comments;

    public static ForumPostDTO fromEntity(ForumPost post) {
        ForumPostDTO dto = new ForumPostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setAuthor(AuthorDTO.fromUser(post.getAuthor()));

        // Ensure comments are not null before mapping
        List<ForumCommentDTO> commentDTOs = post.getComments() == null ? Collections.emptyList() :
                post.getComments().stream()
                        .map(ForumCommentDTO::fromEntity)
                        .collect(Collectors.toList());
        dto.setComments(commentDTOs);

        return dto;
    }
}