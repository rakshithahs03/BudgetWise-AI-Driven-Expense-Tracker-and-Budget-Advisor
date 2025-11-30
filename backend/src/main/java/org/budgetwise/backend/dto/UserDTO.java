package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserDTO {
    private String userName;
    private String firstName;
    private String LastName;
}
