package org.budgetwise.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "saving_goals")
@Data
public class SavingGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // ✅ Add this annotation
    private User user;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private double targetAmount;

    @Column(nullable = false)
    private double savedAmount = 0;

    @Column(nullable = false)
    private LocalDate deadline;
}