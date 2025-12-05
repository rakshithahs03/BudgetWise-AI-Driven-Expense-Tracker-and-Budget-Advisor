package org.budgetwise.backend.repository.model;

import jakarta.persistence.*;
import lombok.Data;
import org.budgetwise.backend.model.User;

@Data
@Entity
@Table(name="profile")
public class Profile {

    @Id
    @Column(name = "user_id")
    private int userId;

    private Double income;
    private Double savings;
    private Double targetExpenses;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

}
