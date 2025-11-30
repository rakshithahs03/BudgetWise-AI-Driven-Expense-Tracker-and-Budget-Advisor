package org.budgetwise.backend.model;

public record AuthenticationResponse(String token, int userId,String firstname) { }
