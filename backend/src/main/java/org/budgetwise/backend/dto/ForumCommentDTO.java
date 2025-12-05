package org.budgetwise.backend.dto;

import lombok.Data;
import org.budgetwise.backend.model.ForumComment;

import java.time.LocalDateTime;

@Data
public class ForumCommentDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private AuthorDTO author;

    public static ForumCommentDTO fromEntity(ForumComment comment) {
        ForumCommentDTO dto = new ForumCommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setAuthor(AuthorDTO.fromUser(comment.getAuthor()));
        return dto;
    }
}