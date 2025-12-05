package org.budgetwise.backend.repository.model;

public record AuthenticationResponse(String token, int userId,String firstname) { }
