package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.budgetwise.backend.model.User;

@Data
@AllArgsConstructor
public class AuthorDTO {
    private String username;

    public static AuthorDTO fromUser(User user) {
        return new AuthorDTO(user.getUsername());
    }
}