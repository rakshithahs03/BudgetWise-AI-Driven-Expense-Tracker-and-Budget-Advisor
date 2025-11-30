package org.budgetwise.backend.controller;


import org.budgetwise.backend.model.AuthenticationResponse;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.UserRepository;
import org.budgetwise.backend.service.AuthService;
import org.budgetwise.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserService userService, UserRepository userRepository) {
        this.authService = authService;
        this.userService = userService;
        this.userRepository = userRepository;
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User request) {
        try {
            AuthenticationResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody User request){
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping("/home")
    public ResponseEntity<String> home(){
        return ResponseEntity.ok("Welcome to Home page");
    }

    @GetMapping("/{userId}/username")
    public ResponseEntity<String> getUsername(@PathVariable int userId){
        return ResponseEntity.ok(authService.getUsername(userId));
    }
}
