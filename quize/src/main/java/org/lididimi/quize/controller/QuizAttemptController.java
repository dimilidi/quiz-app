package org.lididimi.quize.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.lididimi.quize.model.dto.quizAttempt.QuizAttemptDTO;
import org.lididimi.quize.model.dto.quizAttempt.QuizAttemptViewDTO;
import org.lididimi.quize.service.QuizAttemptService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/quiz-attempts")
@RequiredArgsConstructor
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    @PostMapping("/add")
    public ResponseEntity<?> addQuizAttempt(@Valid @RequestBody QuizAttemptDTO quizAttemptDTO) {
        QuizAttemptDTO createdQuizAttempt = quizAttemptService.add(quizAttemptDTO);
        return ResponseEntity.status(CREATED).body(createdQuizAttempt);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizAttemptById(@PathVariable Long id) {
        Optional<QuizAttemptDTO> quizAttemptDTO = quizAttemptService.getById(id);
        if (quizAttemptDTO.isPresent()) {
            return ResponseEntity.ok(quizAttemptDTO.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getQuizAttemptsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<QuizAttemptViewDTO> quizAttemptsPage = quizAttemptService.getByUser(userId, page, size);
        return ResponseEntity.ok(quizAttemptsPage);
    }

    @GetMapping("/best/user/{userId}")
    public ResponseEntity<Page<QuizAttemptViewDTO>> getBestQuizAttempts(
            @RequestParam Long userId,
            @RequestParam int page,
            @RequestParam int size) {

        Page<QuizAttemptViewDTO> bestAttempts = quizAttemptService.getBestQuizAttempts(userId, page, size);
        return ResponseEntity.ok(bestAttempts);
    }

}