package org.budgetwise.backend.repository.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.budgetwise.backend.model.User;

import java.time.LocalDate;

@Entity
@Table(name = "budgets")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String category; // e.g. Food, Transport, etc.

    @Column(nullable = false)
    private double limitAmount; // max budget set by user

    @Column(nullable = false)
    private double spentAmount = 0; // how much already spent

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

}

