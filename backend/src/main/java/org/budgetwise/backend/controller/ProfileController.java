package org.budgetwise.backend.controller;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.PasswordChangeRequest;
import org.budgetwise.backend.dto.ProfileDTO;
import org.budgetwise.backend.dto.UserDTO;
import org.budgetwise.backend.dto.UserUpdateRequest;
import org.budgetwise.backend.model.AuthenticationResponse;
import org.budgetwise.backend.model.Profile;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.service.JwtService;
import org.budgetwise.backend.service.ProfileService;
import org.budgetwise.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final UserService userService;
    private final JwtService jwtService; // ✅ Inject JwtService

    @PostMapping("/{userId}")
    public ResponseEntity<Profile> createProfile(
            @PathVariable int userId,
            @RequestBody Profile profileRequest) {
        return ResponseEntity.ok(profileService.createProfile(userId, profileRequest));
    }



    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable int userId) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<AuthenticationResponse> updateUser(@PathVariable int userId, @RequestBody UserUpdateRequest request) {
        User updatedUser = userService.updateUser(userId, request.getFirstName(), request.getLastName(), request.getUsername());

        // ✅ Generate a new token with the updated user details
        String newToken = jwtService.generateToken(updatedUser);

        // ✅ Return the new token in the response
        return ResponseEntity.ok(new AuthenticationResponse(newToken, updatedUser.getId(), updatedUser.getFirstName()));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ProfileDTO> updateProfile(@PathVariable int userId, @RequestBody ProfileDTO profileDTO) {
        return ResponseEntity.ok(profileService.updateProfile(userId, profileDTO));
    }

    @PostMapping("/change-password/{userId}")
    public ResponseEntity<Void> changePassword(@PathVariable int userId, @RequestBody PasswordChangeRequest request) {
        userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/username")
    public ResponseEntity<ProfileDTO> getProfileByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable int userId){
        return ResponseEntity.ok(userService.getUser(userId));
    }

}

