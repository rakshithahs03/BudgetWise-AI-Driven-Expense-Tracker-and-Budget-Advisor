package org.budgetwise.backend.repository;

import org.budgetwise.backend.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Integer> {

    Optional<Profile> findByUserId(int user_id);

}
